import mongoose from 'mongoose'

const EvaluationSchema = new mongoose.Schema({
  tenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, default: 0 },
  remarks: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Evaluation', EvaluationSchema)
