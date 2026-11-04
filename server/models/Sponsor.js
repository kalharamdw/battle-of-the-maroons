import mongoose from 'mongoose';

const SponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  tier: {
    type: String,
    required: true,
    default: "officialPartner",
    index: true
  },
  role: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  },
  logo: {
    type: String,
    required: true
  },
  website: {
    type: String,
    default: "#"
  },
  description: {
    type: String,
    default: ""
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

export const Sponsor = mongoose.models.Sponsor || mongoose.model('Sponsor', SponsorSchema);
