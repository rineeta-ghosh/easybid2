import express from 'express'
import Notification from '../models/Notification.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// Get notifications for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread_only = false } = req.query
    const query = { userId: req.user.id }
    
    if (unread_only === 'true') {
      query.read = false
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('metadata.tenderId', 'title')
      .populate('metadata.relatedUserId', 'name email')

    const total = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false })

    res.json({
      success: true,
      notifications,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: notifications.length,
        totalItems: total
      },
      unreadCount
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' })
  }
})

// Mark notification as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { read: true },
      { new: true }
    )

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' })
    }

    res.json({ success: true, notification })
  } catch (error) {
    console.error('Mark notification read error:', error)
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' })
  }
})

// Mark all notifications as read
router.put('/mark-all-read', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    )

    res.json({ success: true, message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Mark all read error:', error)
    res.status(500).json({ success: false, message: 'Failed to mark all notifications as read' })
  }
})

// Delete notification
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    })

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' })
    }

    res.json({ success: true, message: 'Notification deleted' })
  } catch (error) {
    console.error('Delete notification error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete notification' })
  }
})

// Get unread count (for badge)
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      read: false
    })
    
    res.json({ success: true, count })
  } catch (error) {
    console.error('Get unread count error:', error)
    res.status(500).json({ success: false, message: 'Failed to get unread count' })
  }
})

// Create notification (admin/system use)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, title, message, type, priority, actionUrl, metadata } = req.body

    const notification = await Notification.createNotification({
      userId,
      title,
      message,
      type,
      priority,
      actionUrl,
      metadata
    })

    res.status(201).json({ success: true, notification })
  } catch (error) {
    console.error('Create notification error:', error)
    res.status(500).json({ success: false, message: 'Failed to create notification' })
  }
})

export default router