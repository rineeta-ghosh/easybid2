import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['tender_created', 'bid_submitted', 'bid_evaluated', 'tender_closed', 'system', 'reminder'],
    default: 'system'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String,
    default: null
  },
  metadata: {
    tenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender' },
    bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' },
    relatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }
}, {
  timestamps: true
})

// Index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 })
notificationSchema.index({ userId: 1, read: 1 })

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  try {
    const notification = new this(data)
    await notification.save()
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

export default mongoose.model('Notification', notificationSchema)