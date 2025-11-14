import mongoose from 'mongoose'

const BidSchema = new mongoose.Schema({
  tender: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: Number,
  status: { type: String, enum: ['Submitted','Under Review','Accepted','Rejected'], default: 'Submitted' },
  submittedAt: { type: Date, default: Date.now },
  evaluationScore: Number,
  comments: String,
  bidFile: String
})

export default mongoose.model('Bid', BidSchema)
