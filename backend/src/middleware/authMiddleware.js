import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export function authMiddleware(req, res, next) {
  // Look for token in httpOnly cookie or Authorization header
  const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1])
  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const secret = process.env.JWT_SECRET || 'easybid-secret'
    const payload = jwt.verify(token, secret)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
