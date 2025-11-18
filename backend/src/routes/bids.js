import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import Bid from '../models/Bid.js'
import Tender from '../models/Tender.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { requireRole } from '../middleware/requireRole.js'
import { sendNewBidEmail } from '../services/emailService.js'

const router = express.Router()
const uploadsDir = path.resolve('./uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})
const upload = multer({ storage })

// POST /api/bids - supplier submits a bid with optional file
router.post('/', authMiddleware, requireRole('Supplier'), upload.single('file'), async (req, res) => {
  try {
    const { tenderId, amount, description } = req.body
    if (!tenderId || !amount) return res.status(400).json({ message: 'tenderId and amount required' })

    const tender = await Tender.findById(tenderId).populate('buyerId', 'name email emailPreferences')
    if (!tender) return res.status(404).json({ message: 'Tender not found' })
    if (tender.status !== 'Open') return res.status(400).json({ message: 'Tender is not open for bidding' })
    if (tender.approvalStatus !== 'Approved') return res.status(400).json({ message: 'Tender is not approved for bidding' })

    const fileUrl = req.file ? `/uploads/${path.basename(req.file.path)}` : undefined
    const bid = await Bid.create({ 
      tender: tender._id, 
      supplier: req.user.id, 
      amount: Number(amount), 
      comments: description, 
      bidFile: fileUrl
    })

    // Populate the bid with supplier info for email
    const populatedBid = await Bid.findById(bid._id).populate('supplier', 'name email')

    // Send new bid notification to buyer
    if (tender.buyerId?.email) {
      await sendNewBidEmail(populatedBid, tender, tender.buyerId)
    }

    return res.json({ success: true, bid: populatedBid })
  } catch (err) {
    console.error('Bid submission error:', err)
    return res.status(500).json({ message: err.message || 'Server error' })
  }
})

// GET /api/bids/:tenderId - fetch bids for a tender (buyer or admin)
router.get('/:tenderId', authMiddleware, async (req, res) => {
  try {
    const { tenderId } = req.params
    const bids = await Bid.find({ tender: tenderId }).populate('supplier', 'name email').lean()
    return res.json({ bids })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router
