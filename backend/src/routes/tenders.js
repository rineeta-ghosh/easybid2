import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import Tender from '../models/Tender.js'
import User from '../models/User.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { requireRole } from '../middleware/requireRole.js'
import { sendTenderApprovedEmail, sendTenderRejectedEmail, sendNewTenderEmail } from '../services/emailService.js'
import { generateTenderPDF, generateBidSummaryPDF } from '../services/pdfService.js'
import Bid from '../models/Bid.js'

const router = express.Router()

// Ensure uploads directory exists
const uploadsDir = path.resolve('./uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${suffix}-${file.originalname}`)
  }
})

const upload = multer({ storage })

// POST /api/tenders - create tender (Buyer only)
router.post('/', authMiddleware, requireRole('Buyer'), upload.single('file'), async (req, res) => {
  try {
    const { title, description, category, customCategory, budget, deadline } = req.body
    if (!title || !deadline || !category) return res.status(400).json({ message: 'title, category and deadline required' })
    if (category === 'Other' && !customCategory) return res.status(400).json({ message: 'custom category description required when Other is selected' })
    
    const dl = new Date(deadline)
    if (isNaN(dl.getTime()) || dl <= new Date()) return res.status(400).json({ message: 'deadline must be a future date' })

    const fileUrl = req.file ? `/uploads/${path.basename(req.file.path)}` : undefined
    const tender = await Tender.create({
      title,
      description,
      category,
      customCategory: category === 'Other' ? customCategory : undefined,
      budget: budget ? Number(budget) : undefined,
      deadline: dl,
      fileUrl,
      createdBy: req.user.id,
      buyerId: req.user.id,
      status: 'Open',
      approvalStatus: 'Pending' // Tenders now require admin approval
    })
    return res.json({ success: true, tender })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/tenders - list tenders with search/filter/pagination
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '10')))
    const skip = (page - 1) * limit
    const q = {}
    if (req.query.search) q.title = new RegExp(req.query.search, 'i')
    if (req.query.category) q.category = req.query.category
    if (req.query.deadline) {
      const d = new Date(req.query.deadline)
      if (!isNaN(d.getTime())) q.deadline = { $lte: d }
    }
    if (req.query.status) q.status = req.query.status
    if (req.query.approvalStatus) q.approvalStatus = req.query.approvalStatus

    const total = await Tender.countDocuments(q)
    const tenders = await Tender.find(q).sort({ deadline: 1 }).skip(skip).limit(limit).populate('createdBy', 'name email').populate('approvedBy', 'name email').lean()
    return res.json({ total, page, limit, tenders })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/tenders/pending - get pending tenders for admin approval
router.get('/pending', authMiddleware, requireRole('Admin'), async (req, res) => {
  try {
    const tenders = await Tender.find({ approvalStatus: 'Pending' })
      .populate('createdBy', 'name email')
      .populate('buyerId', 'name email')
      .sort({ createdAt: -1 })
      .lean()
    return res.json({ tenders })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/tenders/:id/approve - approve tender (Admin only)
router.put('/:id/approve', authMiddleware, requireRole('Admin'), async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id).populate('buyerId', 'name email emailPreferences')
    if (!tender) return res.status(404).json({ message: 'Tender not found' })
    
    if (tender.approvalStatus !== 'Pending') {
      return res.status(400).json({ message: 'Tender is not pending approval' })
    }

    tender.approvalStatus = 'Approved'
    tender.approvedBy = req.user.id
    tender.approvedAt = new Date()
    await tender.save()

    // Send approval email to buyer
    if (tender.buyerId?.email) {
      await sendTenderApprovedEmail(tender, tender.buyerId)
    }

    // Send new tender notifications to all suppliers
    try {
      const suppliers = await User.find({ role: 'Supplier' }).select('name email emailPreferences').lean()
      await sendNewTenderEmail(tender, suppliers)
    } catch (emailErr) {
      console.error('Failed to send new tender emails:', emailErr)
    }

    return res.json({ success: true, message: 'Tender approved successfully', tender })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/tenders/:id/reject - reject tender (Admin only)
router.put('/:id/reject', authMiddleware, requireRole('Admin'), async (req, res) => {
  try {
    const { reason } = req.body
    if (!reason) return res.status(400).json({ message: 'Rejection reason required' })

    const tender = await Tender.findById(req.params.id).populate('buyerId', 'name email emailPreferences')
    if (!tender) return res.status(404).json({ message: 'Tender not found' })
    
    if (tender.approvalStatus !== 'Pending') {
      return res.status(400).json({ message: 'Tender is not pending approval' })
    }

    tender.approvalStatus = 'Rejected'
    tender.approvedBy = req.user.id
    tender.approvedAt = new Date()
    tender.rejectionReason = reason
    await tender.save()

    // Send rejection email to buyer
    if (tender.buyerId?.email) {
      await sendTenderRejectedEmail(tender, tender.buyerId, reason)
    }

    return res.json({ success: true, message: 'Tender rejected', tender })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/tenders/:id/pdf - generate and download tender PDF
router.get('/:id/pdf', authMiddleware, async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id)
      .populate('buyerId', 'name email')
      .populate('createdBy', 'name email')
      .lean()
    
    if (!tender) return res.status(404).json({ message: 'Tender not found' })
    
    // Check permissions - buyer, admin, or suppliers can view approved tenders
    const isOwner = tender.buyerId?._id?.toString() === req.user.id || tender.createdBy?._id?.toString() === req.user.id
    const isAdmin = req.user.role === 'Admin'
    const isSupplierViewingApproved = req.user.role === 'Supplier' && tender.approvalStatus === 'Approved'
    
    if (!isOwner && !isAdmin && !isSupplierViewingApproved) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // Get bids if user is owner or admin
    let bids = []
    if (isOwner || isAdmin) {
      bids = await Bid.find({ tender: tender._id })
        .populate('supplier', 'name email')
        .lean()
    }

    const pdfResult = await generateTenderPDF(tender, bids)
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${pdfResult.filename}"`)
    
    // Stream the PDF file
    const filepath = pdfResult.filepath
    const stat = fs.statSync(filepath)
    res.setHeader('Content-Length', stat.size)
    
    const readStream = fs.createReadStream(filepath)
    readStream.pipe(res)
    
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to generate PDF' })
  }
})

// GET /api/tenders/:id/bid-summary-pdf - generate bid summary PDF (buyers and admins only)
router.get('/:id/bid-summary-pdf', authMiddleware, async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id)
      .populate('buyerId', 'name email')
      .populate('createdBy', 'name email')
      .lean()
    
    if (!tender) return res.status(404).json({ message: 'Tender not found' })
    
    // Check permissions - only buyer and admin can access bid summaries
    const isOwner = tender.buyerId?._id?.toString() === req.user.id || tender.createdBy?._id?.toString() === req.user.id
    const isAdmin = req.user.role === 'Admin'
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const bids = await Bid.find({ tender: tender._id })
      .populate('supplier', 'name email')
      .lean()

    const pdfResult = await generateBidSummaryPDF(tender, bids)
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${pdfResult.filename}"`)
    
    // Stream the PDF file
    const filepath = pdfResult.filepath
    const stat = fs.statSync(filepath)
    res.setHeader('Content-Length', stat.size)
    
    const readStream = fs.createReadStream(filepath)
    readStream.pipe(res)
    
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to generate bid summary PDF' })
  }
})

export default router
