import mongoose from 'mongoose'

const BidSchema = new mongoose.Schema({
  tender: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Submitted','Under Review','Accepted','Rejected'], default: 'Submitted' },
  submittedAt: { type: Date, default: Date.now },
  evaluationScore: Number,
  comments: String,
  bidFile: String,
  isHighestBid: { type: Boolean, default: false }
}, {
  timestamps: true
})

// Indexes for performance
BidSchema.index({ tender: 1 })
BidSchema.index({ supplier: 1 })
BidSchema.index({ amount: -1 })
BidSchema.index({ submittedAt: -1 })
BidSchema.index({ tender: 1, amount: -1 })

export default mongoose.model('Bid', BidSchema)
