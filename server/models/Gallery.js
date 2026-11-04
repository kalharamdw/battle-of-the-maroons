import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['matches', 'atmosphere', 'ceremonies', 'legends', 'heritage'],
    default: 'matches',
    index: true
  },
  categoryLabel: {
    type: String,
    default: 'Match Action'
  },
  year: {
    type: String,
    default: '2025'
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  caption: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'Sinhalese Sports Club (SSC) Grounds, Colombo'
  },
  featured: {
    type: Boolean,
    default: false
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

export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema, 'galleries');
