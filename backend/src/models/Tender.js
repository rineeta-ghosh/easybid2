import mongoose from 'mongoose'

const TenderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { 
    type: String, 
    enum: ['Road Infrastructure', 'Electricity & Power', 'Education', 'Crops & Farming', 'Pharmaceuticals', 'Healthcare', 'Construction', 'IT & Technology', 'Transportation', 'Water & Sanitation', 'Other'], 
    required: true 
  },
  customCategory: { type: String }, // Used when category is 'Other'
  budget: Number,
  fileUrl: String,
  status: { type: String, enum: ['Open','Closed','Evaluated'], default: 'Open' },
  approvalStatus: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  rejectionReason: String,
  deadline: Date,
  qrCode: String, // QR code filename
  qrData: String, // QR code data as JSON string
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Tender', TenderSchema)
