import express from 'express'
import Evaluation from '../models/Evaluation.js'
import Tender from '../models/Tender.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { requireRole } from '../middleware/requireRole.js'

const router = express.Router()

// GET /api/evaluations/:tenderId - fetch evaluations for a tender
router.get('/:tenderId', authMiddleware, async (req, res) => {
  try {
    const { tenderId } = req.params
    const evals = await Evaluation.find({ tenderId }).populate('supplierId', 'name email').lean()
    return res.json({ evaluations: evals })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/evaluations - save or update an evaluation (Buyer only)
router.post('/', authMiddleware, requireRole('Buyer'), async (req, res) => {
  try {
    const { tenderId, supplierId, score, remarks } = req.body
    if (!tenderId || !supplierId) return res.status(400).json({ message: 'tenderId and supplierId required' })

    const buyerId = req.user.id
    const doc = await Evaluation.findOneAndUpdate(
      { tenderId, supplierId },
      { buyerId, tenderId, supplierId, score: Number(score || 0), remarks },
      { upsert: true, new: true }
    )
    return res.json({ success: true, evaluation: doc })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/evaluations/publish/:tenderId - mark tender as Evaluated (Buyer only)
router.post('/publish/:tenderId', authMiddleware, requireRole('Buyer'), async (req, res) => {
  try {
    const { tenderId } = req.params
    await Tender.findByIdAndUpdate(tenderId, { status: 'Evaluated' })
    return res.json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router
