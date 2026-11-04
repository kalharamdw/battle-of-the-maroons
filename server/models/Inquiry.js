import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  phone: {
    type: String,
    default: "",
    trim: true
  },
  topic: {
    type: String,
    default: "general"
  },
  category: {
    type: String,
    default: "general"
  },
  subject: {
    type: String,
    default: ""
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ["NEW", "READ", "RESOLVED"],
    default: "NEW",
    index: true
  },
  adminNotes: {
    type: String,
    default: ""
  },
  ipAddress: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
