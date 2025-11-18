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
    
    if (!tenderId || !amount) {
      return res.status(400).json({ message: 'tenderId and amount required' })
    }

    const bidAmount = parseFloat(amount)
    if (isNaN(bidAmount) || bidAmount <= 0) {
      return res.status(400).json({ message: 'Invalid bid amount' })
    }

    const tender = await Tender.findById(tenderId).populate('buyerId', 'name email emailPreferences')
    if (!tender) return res.status(404).json({ message: 'Tender not found' })
    if (tender.status !== 'Open') return res.status(400).json({ message: 'Tender is not open for bidding' })
    if (tender.approvalStatus !== 'Approved') return res.status(400).json({ message: 'Tender is not approved for bidding' })

    // Prevent supplier from bidding on their own tender (if buyerId matches supplierId)
    if (tender.buyerId._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot bid on your own tender' })
    }

    // Check deadline
    if (new Date() > new Date(tender.deadline)) {
      tender.status = 'Closed'
      await tender.save()
      return res.status(400).json({ message: 'Tender deadline has passed' })
    }

    // Get highest bid for this tender
    const highestBid = await Bid.findOne({ tender: tenderId })
      .sort({ amount: -1 })
      .lean()

    // Validate bid amount is competitive (for reverse auction - lower is better)
    // If tender.budget exists, bids should be lower than budget
    if (tender.budget && bidAmount > tender.budget) {
      return res.status(400).json({ 
        message: `Bid amount ($${bidAmount.toFixed(2)}) should not exceed tender budget ($${tender.budget.toFixed(2)})` 
      })
    }

    // Check for duplicate bid from same supplier
    const existingBid = await Bid.findOne({ 
      tender: tenderId, 
      supplier: req.user.id 
    }).lean()

    if (existingBid) {
      // Update existing bid instead of creating new one
      const updatedBid = await Bid.findByIdAndUpdate(
        existingBid._id,
        {
          amount: bidAmount,
          comments: description,
          bidFile: req.file ? `/uploads/${path.basename(req.file.path)}` : existingBid.bidFile,
          submittedAt: new Date()
        },
        { new: true }
      ).populate('supplier', 'name email')

      return res.json({ 
        success: true, 
        bid: updatedBid,
        message: 'Bid updated successfully'
      })
    }

    // Create new bid
    const fileUrl = req.file ? `/uploads/${path.basename(req.file.path)}` : undefined
    const bid = await Bid.create({ 
      tender: tender._id, 
      supplier: req.user.id, 
      amount: bidAmount, 
      comments: description, 
      bidFile: fileUrl,
      isHighestBid: !highestBid || bidAmount < highestBid.amount // Lower is better in reverse auction
    })

    // Update previous highest bid flag if necessary
    if (highestBid && bidAmount < highestBid.amount) {
      await Bid.findByIdAndUpdate(highestBid._id, { isHighestBid: false })
    }

    // Populate the bid with supplier info for email
    const populatedBid = await Bid.findById(bid._id).populate('supplier', 'name email')

    // Send new bid notification to buyer
    if (tender.buyerId?.email) {
      await sendNewBidEmail(populatedBid, tender, tender.buyerId)
    }

    return res.json({ 
      success: true, 
      bid: populatedBid,
      message: 'Bid submitted successfully',
      isLowestBid: bid.isHighestBid
    })
  } catch (err) {
    console.error('Bid submission error:', err)
    return res.status(500).json({ message: err.message || 'Server error' })
  }
})

// GET /api/bids/:tenderId - fetch bids for a tender (buyer or admin)
router.get('/:tenderId', authMiddleware, async (req, res) => {
  try {
    const { tenderId } = req.params
    const bids = await Bid.find({ tender: tenderId })
      .populate('supplier', 'name email')
      .sort({ amount: 1, submittedAt: -1 }) // Sort by amount ascending (lower is better), then by time
      .lean()
    
    // Add rank and statistics
    const formattedBids = bids.map((bid, index) => ({
      ...bid,
      rank: index + 1,
      isLowest: index === 0,
      supplierName: bid.supplier?.name,
      supplierEmail: bid.supplier?.email
    }))

    // Calculate statistics
    const stats = {
      totalBids: bids.length,
      lowestBid: bids[0]?.amount || 0,
      highestBid: bids[bids.length - 1]?.amount || 0,
      averageBid: bids.length > 0 ? bids.reduce((sum, b) => sum + b.amount, 0) / bids.length : 0,
      uniqueSuppliers: new Set(bids.map(b => b.supplier?._id?.toString())).size
    }

    return res.json({ 
      bids: formattedBids,
      stats,
      count: formattedBids.length 
    })
  } catch (err) {
    console.error('Get bids error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/bids/my/all - get supplier's own bids
router.get('/my/all', authMiddleware, requireRole('Supplier'), async (req, res) => {
  try {
    const bids = await Bid.find({ supplier: req.user.id })
      .populate('tender', 'title status deadline budget category')
      .sort({ submittedAt: -1 })
      .lean()

    // Enrich with tender and bid statistics
    const enrichedBids = await Promise.all(bids.map(async (bid) => {
      if (!bid.tender) return bid

      // Get total bids and rank for this tender
      const tenderBids = await Bid.find({ tender: bid.tender._id })
        .sort({ amount: 1 })
        .lean()

      const myRank = tenderBids.findIndex(b => b._id.toString() === bid._id.toString()) + 1
      const lowestBid = tenderBids[0]?.amount
      const isLeading = myRank === 1

      return {
        ...bid,
        tenderTitle: bid.tender.title,
        tenderStatus: bid.tender.status,
        tenderDeadline: bid.tender.deadline,
        tenderBudget: bid.tender.budget,
        totalBids: tenderBids.length,
        myRank,
        lowestBid,
        isLeading,
        competitiveness: lowestBid ? ((bid.amount / lowestBid - 1) * 100).toFixed(1) : 0
      }
    }))

    return res.json({ 
      bids: enrichedBids,
      count: enrichedBids.length 
    })
  } catch (err) {
    console.error('Get supplier bids error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router
