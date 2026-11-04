import mongoose from 'mongoose';

const TicketCategorySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: "LKR"
  },
  description: {
    type: String,
    default: ""
  },
  totalCapacity: {
    type: Number,
    required: true,
    default: 500,
    min: 0
  },
  reservedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  soldCount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxPerOrder: {
    type: Number,
    default: 10,
    min: 1,
    max: 20
  },
  bookingUrl: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  perks: [{
    type: String
  }]
}, {
  timestamps: true
});

TicketCategorySchema.virtual('availableCount').get(function() {
  return Math.max(0, this.totalCapacity - (this.reservedCount + this.soldCount));
});

TicketCategorySchema.set('toJSON', { virtuals: true });
TicketCategorySchema.set('toObject', { virtuals: true });

export const TicketCategory = mongoose.models.TicketCategory || mongoose.model('TicketCategory', TicketCategorySchema);
