import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'
import dashboardRoutes from './routes/dashboard.js'
import tendersRoutes from './routes/tenders.js'
import bidsRoutes from './routes/bids.js'
import evaluationsRoutes from './routes/evaluations.js'
import notificationsRoutes from './routes/notifications.js'
import qrRoutes from './routes/qr.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())

// CORS Configuration
// In development: Allow all origins
// In production: Use CLIENT_ORIGIN environment variable
const allowedOrigins = process.env.CLIENT_ORIGIN 
  ? process.env.CLIENT_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:5174']

console.log('Allowed origins:', allowedOrigins)
console.log('NODE_ENV:', process.env.NODE_ENV)

app.use(cors({
  origin: (origin, cb) => {
    console.log('CORS request from origin:', origin)
    
    // Allow requests with no origin (e.g., curl, mobile apps, server-to-server)
    if (!origin) return cb(null, true)
    
    // In production, check against allowed origins
    if (process.env.NODE_ENV === 'production') {
      // Allow both old and new Netlify URLs
      const netlifyPattern = /https:\/\/.*\.netlify\.app$/
      if (allowedOrigins.includes(origin) || netlifyPattern.test(origin)) {
        console.log('CORS: Origin allowed')
        return cb(null, true)
      } else {
        console.log('CORS: Origin blocked:', origin)
        return cb(new Error('Not allowed by CORS'))
      }
    }
    
    // In development, allow any origin
    console.log('CORS: Development mode, allowing origin')
    return cb(null, origin)
  },
  credentials: true,
}))

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/tenders', tendersRoutes)
app.use('/api/bids', bidsRoutes)
app.use('/api/evaluations', evaluationsRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/qr', qrRoutes)
// Serve uploaded files
app.use('/uploads', express.static('uploads'))
app.use('/pdfs', express.static('pdfs'))
// Serve QR codes
app.use('/qr-codes', express.static('public/qr-codes'))

app.get('/', (req, res) => res.json({ ok: true, message: 'EasyBid backend running' }))

// Environment check endpoint (for debugging)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGO_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      clientOrigin: process.env.CLIENT_ORIGIN,
      frontendUrl: process.env.FRONTEND_URL,
      port: PORT
    }
  })
})

async function start() {
  try {
    const mongo = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/easybid'
    await mongoose.connect(mongo)
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
  } catch (err) {
    console.error('Failed to start', err)
  }
}

start()
