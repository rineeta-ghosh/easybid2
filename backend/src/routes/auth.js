import express from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { sendTestEmail } from '../services/emailService.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register',
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['Buyer', 'Supplier']),
  async (req, res) => {
    console.log('=== REGISTER REQUEST ===')
    console.log('Body:', req.body)
    console.log('Headers:', req.headers)
    
    const errors = validationResult(req)
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array())
        const arr = errors.array()
        const msg = arr.map(e => (e.param ? `${e.param}: ${e.msg}` : e.msg)).join('; ')
        return res.status(400).json({ message: msg, errors: arr })
      }

    const { name, email, password, role } = req.body
    try {
      const existing = await User.findOne({ email })
      if (existing) return res.status(400).json({ message: 'Email already in use' })

      const hash = await bcrypt.hash(password, 10)
      const user = await User.create({ name, email, password: hash, role })

      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'easybid-secret', { expiresIn: '7d' })
      // set httpOnly cookie with SameSite=None for cross-origin
      res.cookie('token', token, { 
        httpOnly: true, 
        sameSite: 'none', 
        secure: true, 
        maxAge: 7 * 24 * 3600 * 1000 
      })
      res.json({ message: 'Registered', user: { id: user._id, name: user.name, email: user.email, role: user.role }, token })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// POST /api/auth/login
router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const arr = errors.array()
        const msg = arr.map(e => (e.param ? `${e.param}: ${e.msg}` : e.msg)).join('; ')
        return res.status(400).json({ message: msg, errors: arr })
      }

    const { email, password } = req.body
    try {
      const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ message: 'Incorrect email or password' })

      const ok = await bcrypt.compare(password, user.password)
      if (!ok) return res.status(400).json({ message: 'Incorrect email or password' })

      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'easybid-secret', { expiresIn: '7d' })
      res.cookie('token', token, { 
        httpOnly: true, 
        sameSite: 'none', 
        secure: true, 
        maxAge: 7 * 24 * 3600 * 1000 
      })
      res.json({ message: 'Authenticated', user: { id: user._id, name: user.name, email: user.email, role: user.role }, token })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Server error' })
    }
  }
)

// GET /api/auth/profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1])
    if (!token) return res.status(401).json({ message: 'Not authenticated' })
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'easybid-secret')
    const user = await User.findById(payload.id).select('-password')
    res.json({ user })
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
})

// GET /api/auth/email-preferences - get user email preferences
router.get('/email-preferences', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('emailPreferences')
    const defaultPreferences = {
      tenderApproval: true,
      newBids: true,
      newTenders: true,
      systemUpdates: true,
      weeklyDigest: false
    }
    const preferences = user?.emailPreferences || defaultPreferences
    res.json({ preferences })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/auth/email-preferences - update user email preferences
router.put('/email-preferences', authMiddleware, async (req, res) => {
  try {
    const { preferences } = req.body
    if (!preferences) return res.status(400).json({ message: 'Preferences required' })

    await User.findByIdAndUpdate(req.user.id, { emailPreferences: preferences })
    res.json({ message: 'Email preferences updated', preferences })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/test-email - send test email
router.post('/test-email', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user?.email) return res.status(400).json({ message: 'User email not found' })

    const success = await sendTestEmail(user.email)
    if (success) {
      res.json({ message: 'Test email sent successfully' })
    } else {
      res.status(500).json({ message: 'Failed to send test email' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
