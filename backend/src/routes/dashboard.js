import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { requireRole } from '../middleware/requireRole.js'
import Tender from '../models/Tender.js'
import Bid from '../models/Bid.js'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Utility: parse pagination params
function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '10')))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

// GET /api/dashboard/buyer
// Returns tenders created by the buyer and summary stats
router.get('/buyer', authMiddleware, requireRole('Buyer'), async (req, res) => {
  try {
    const { skip, limit } = parsePagination(req)
    const q = req.query.q ? { title: new RegExp(req.query.q, 'i') } : {}
    const filter = { createdBy: req.user.id, ...q }
    const tenders = await Tender.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
    const total = await Tender.countDocuments({ createdBy: req.user.id })

    // aggregate bids for the tenders created by this buyer and include tender titles for chart labels
    const tenderIds = tenders.map(t => t._id)
    let bids = []
    if (tenderIds.length) {
      bids = await Bid.aggregate([
        { $match: { tender: { $in: tenderIds } } },
        { $group: { _id: '$tender', count: { $sum: 1 } } },
        { $lookup: { from: 'tenders', localField: '_id', foreignField: '_id', as: 'tender' } },
        { $unwind: { path: '$tender', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1, count: 1, title: '$tender.title' } }
      ])
    }

    return res.json({ tenders, total, bids })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/dashboard/supplier
// Returns tenders open for bidding and supplier's submitted bids
router.get('/supplier', authMiddleware, requireRole('Supplier'), async (req, res) => {
  try {
    const { skip, limit } = parsePagination(req)
    const q = req.query.q ? { title: new RegExp(req.query.q, 'i') } : {}
    const openTenders = await Tender.find({ status: 'Open', ...q }).sort({ deadline: 1 }).skip(skip).limit(limit).lean()
    const submitted = await Bid.find({ supplier: req.user.id }).populate('tender').sort({ submittedAt: -1 }).skip(skip).limit(limit).lean()
    return res.json({ openTenders, submitted })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/dashboard/admin
// Returns summary stats for admin
router.get('/admin', authMiddleware, requireRole('Admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalTenders = await Tender.countDocuments()
    const totalBids = await Bid.countDocuments()
    // recent activity
    const recentTenders = await Tender.find().sort({ createdAt: -1 }).limit(10).lean()
    const recentBids = await Bid.find().sort({ submittedAt: -1 }).limit(10).populate('tender').lean()
    return res.json({ totalUsers, totalTenders, totalBids, recentTenders, recentBids })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// Dev: seed endpoint (admin only) to create sample tenders & bids
router.post('/seed', authMiddleware, requireRole('Admin'), async (req, res) => {
  try {
    // Dev seed: create sample users, tenders and bids for dashboard visualization
    const out = { users: 0, tenders: 0, bids: 0 }

    // Create buyer if none
    let buyer = await User.findOne({ email: 'buyer1@example.test' })
    if (!buyer) {
      buyer = await User.create({ name: 'Sample Buyer', email: 'buyer1@example.test', password: await bcrypt.hash('password123', 10), role: 'Buyer' })
      out.users++
    }

    // Create a few suppliers
    const supplierEmails = ['supplier1@example.test', 'supplier2@example.test', 'supplier3@example.test']
    const suppliers = []
    for (const em of supplierEmails) {
      let s = await User.findOne({ email: em })
      if (!s) {
        s = await User.create({ name: em.split('@')[0], email: em, password: await bcrypt.hash('password123', 10), role: 'Supplier' })
        out.users++
      }
      suppliers.push(s)
    }

    // Create sample tenders (idempotent by title)
    const sampleTenders = []
    for (let i = 1; i <= 8; i++) {
      sampleTenders.push({ title: `Sample Tender ${i}`, description: `A short description for tender ${i}.`, createdBy: buyer._id, category: ['IT','Construction','Services','Goods'][i % 4], status: i % 4 === 0 ? 'Closed' : 'Open', deadline: new Date(Date.now() + i * 86400000) })
    }

    const created = []
    for (const t of sampleTenders) {
      const exists = await Tender.findOne({ title: t.title })
      if (!exists) {
        const c = await Tender.create(t)
        created.push(c)
        out.tenders++
      }
    }

    // Create sample bids for each created tender from suppliers (only if none exist for that tender)
    for (const t of created) {
      const existingBids = await Bid.find({ tender: t._id }).limit(1)
      if (existingBids.length) continue
      for (let i = 0; i < suppliers.length; i++) {
        const supplier = suppliers[i]
        const amount = Math.round((1000 + Math.random() * 5000) / 50) * 50
        const status = ['Submitted', 'Under Review', 'Accepted', 'Rejected'][Math.floor(Math.random() * 4)]
        const bid = await Bid.create({ tender: t._id, supplier: supplier._id, amount, status, submittedAt: new Date(), evaluationScore: Math.round(Math.random() * 100), comments: `Auto-generated bid by ${supplier.email}` })
        out.bids++
      }
    }

    return res.json({ message: 'Seeded (dev)', created: out })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Seed failed' })
  }
})

// POST /api/dashboard/create-admin
// Create an initial admin if none exist. If an admin exists, creation via this endpoint is disabled to avoid misuse.
router.post('/create-admin', async (req, res) => {
  try {
    const existing = await User.findOne({ role: 'Admin' })
    if (existing) return res.status(403).json({ message: 'Admin user already exists. Use an existing admin to create more.' })

    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password required' })

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hash, role: 'Admin' })
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'easybid-secret', { expiresIn: '7d' })
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
    return res.json({ message: 'Admin created', user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router
