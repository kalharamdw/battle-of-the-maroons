import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  schoolKey: {
    type: String,
    required: true,
    unique: true,
    enum: ["ananda", "nalanda"],
    index: true
  },
  name: {
    type: String,
    required: true
  },
  sinhalaName: {
    type: String,
    required: true
  },
  founded: {
    type: Number,
    required: true
  },
  founder: {
    type: String,
    default: ""
  },
  motto: {
    type: String,
    required: true
  },
  colours: [{
    type: String
  }],
  colourNames: {
    type: String,
    required: true
  },
  crest: {
    type: String,
    required: true
  },
  flag: {
    type: String,
    default: ""
  },
  principal: {
    type: String,
    default: ""
  },
  bigMatchWins: {
    type: Number,
    default: 0
  },
  oneDayWins: {
    type: Number,
    default: 0
  },
  overview: {
    type: String,
    default: ""
  },
  recentCaptain: {
    type: String,
    default: ""
  },
  captain: {
    type: String,
    default: ""
  },
  viceCaptain: {
    type: String,
    default: ""
  },
  headCoach: {
    type: String,
    default: ""
  },
  verifiedSquadMembers: [{
    name: { type: String, required: true },
    role: { type: String, default: "" },
    specialism: { type: String, default: "" },
    jerseyNumber: { type: String, default: "" },
    photo: { type: String, default: "" }
  }],
  cricketHallOfFame: [{
    name: { type: String, required: true },
    feat: { type: String, default: "" },
    image: { type: String, default: "" }
  }]
}, {
  timestamps: true,
  strict: false
});

export const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);
