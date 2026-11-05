import mongoose from 'mongoose';

const TicketOrderSchema = new mongoose.Schema({
  orderRef: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  buyerName: {
    type: String,
    required: true,
    trim: true
  },
  buyerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  buyerPhone: {
    type: String,
    default: "",
    trim: true
  },
  schoolAffiliation: {
    type: String,
    default: "neutral"
  },
  matchFormat: {
    type: String,
    default: "3day"
  },
  categoryId: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  categoryCode: {
    type: String,
    required: true
  },
  categoryName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  unitPrice: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "LKR"
  },
  status: {
    type: String,
    enum: ["PENDING", "VERIFIED", "FAILED", "CANCELLED"],
    default: "PENDING",
    index: true
  },
  paymentGateway: {
    type: String,
    default: "PayHere"
  },
  payherePaymentId: {
    type: String,
    default: null
  },
  payhereMethod: {
    type: String,
    default: null
  },
  payhereStatusCode: {
    type: Number,
    default: null
  },
  qrCodeData: {
    type: String,
    default: null
  },
  verificationNotes: {
    type: String,
    default: ""
  },
  isAdmitted: {
    type: Boolean,
    default: false,
    index: true
  },
  admittedAt: {
    type: Date,
    default: null
  },
  admittedGate: {
    type: String,
    default: ""
  },
  admittedBy: {
    type: String,
    default: ""
  },
  ipAddress: {
    type: String,
    default: ""
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 minutes reservation window
    index: true
  }
}, {
  timestamps: true
});

export const TicketOrder = mongoose.models.TicketOrder || mongoose.model('TicketOrder', TicketOrderSchema);
