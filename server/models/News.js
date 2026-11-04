import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    default: "Joint Organising Committee"
  },
  date: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: "Announcements",
    trim: true
  },
  image: {
    type: String,
    default: "/assets/images/news/maroons_salutation_2025.jpeg"
  },
  coverImage: {
    type: String,
    default: "/assets/images/news/maroons_salutation_2025.jpeg"
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  strict: false
});

export const News = mongoose.models.News || mongoose.model('News', NewsSchema);
