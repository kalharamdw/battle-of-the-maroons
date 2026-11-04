import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  matchId: {
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
  subTitle: {
    type: String,
    default: ""
  },
  edition: {
    type: String,
    required: true
  },
  format: {
    type: String,
    required: true,
    default: "3-Day Traditional Match"
  },
  trophy: {
    type: String,
    default: ""
  },
  dates: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    default: "Sinhalese Sports Club (SSC) Grounds, Colombo"
  },
  toss: {
    type: String,
    default: ""
  },
  result: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "CONCLUDED"
  },
  summary: {
    type: String,
    default: ""
  },
  bannerImage: {
    type: String,
    default: "/assets/images/matches/95th_encounter_final_2025.jpg"
  },
  scorecards: {
    innings: [{
      team: String,
      inningsNumber: String,
      score: String,
      overs: String,
      batting: [{
        player: String,
        runs: Number,
        balls: Number,
        fours: Number,
        sixes: Number,
        dismissal: String
      }],
      bowling: [{
        bowler: String,
        overs: String,
        maidens: Number,
        runs: Number,
        wickets: Number
      }]
    }]
  },
  awards: [{
    award: String,
    recipient: String,
    school: String
  }],
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const Match = mongoose.models.Match || mongoose.model('Match', MatchSchema);
