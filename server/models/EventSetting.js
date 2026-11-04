import mongoose from 'mongoose';

const EventSettingSchema = new mongoose.Schema({
  eventName: {
    type: String,
    default: "Battle of the Maroons"
  },
  edition: {
    type: mongoose.Schema.Types.Mixed,
    default: "97th"
  },
  seriesTitle: {
    type: String,
    default: "97th Battle of the Maroons"
  },
  year: {
    type: Number,
    default: 2027
  },
  season: {
    type: String,
    default: "2027"
  },
  matchDates: {
    type: String,
    default: "March 2027 • SSC Colombo"
  },
  threeDayDates: {
    type: String,
    default: "March 2027"
  },
  oneDayDates: {
    type: String,
    default: "March 2027"
  },
  venue: {
    type: String,
    default: "Sinhalese Sports Club (SSC) Grounds, Colombo"
  },
  venueName: {
    type: String,
    default: "Sinhalese Sports Club (SSC) Grounds"
  },
  venueCity: {
    type: String,
    default: "Maitland Place, Colombo 07, Sri Lanka"
  },
  venueCapacity: {
    type: String,
    default: "10,000+"
  },
  countdownTarget: {
    type: String,
    default: "2027-03-05T10:00:00.000Z"
  },
  tentativeMatchDate: {
    type: String,
    default: "2027-03-05T09:30:00+05:30"
  },
  confirmedStartDate: {
    type: String,
    default: null
  },
  confirmedEndDate: {
    type: String,
    default: null
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  isDateConfirmed: {
    type: Boolean,
    default: false
  },
  ticketingActive: {
    type: Boolean,
    default: true
  },
  ticketingMode: {
    type: String,
    enum: ["ONSITE", "EXTERNAL", "HYBRID"],
    default: "HYBRID"
  },
  thirdPartyBookingUrl: {
    type: String,
    default: ""
  },
  thirdPartyBookingTitle: {
    type: String,
    default: "Book via Official Ticketing Partner"
  },
  ticketingStatus: {
    type: String,
    enum: ["AVAILABLE", "COMING_SOON", "SOLD_OUT", "CLOSED"],
    default: "AVAILABLE"
  },
  ticketingStatusMessage: {
    type: String,
    default: "Official Ticket Sales for the Next Encounter will be opened following Joint Committee announcement."
  },
  broadcastInfo: {
    type: String,
    default: "Live telecast on Sri Lanka Rupavahini / Channel Eye & Global Live Stream on YouTube."
  },
  lastUpdatedBy: {
    type: String,
    default: "System"
  }
}, {
  timestamps: true,
  strict: false
});

export const EventSetting = mongoose.models.EventSetting || mongoose.model('EventSetting', EventSettingSchema);
