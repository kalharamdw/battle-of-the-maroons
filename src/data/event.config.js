/**
 * BATTLE OF THE MAROONS — EVENT CONFIGURATION
 * 
 * Source of truth for match schedules, dates, ticketing, and countdown status.
 * Current Local Time: October 2026.
 * 
 * Note on 2026/2027 Schedule:
 * The 96th Battle of the Maroons concluded in March 2026 (Feb 27 - Mar 1, 2026 & Mar 7, 2026).
 * As of October 2026, the 97th Battle of the Maroons (expected March 2027) schedule is awaiting
 * official announcement by the Joint Organizing Committee.
 * 
 * When `isDateConfirmed` is false, the countdown component displays the official status:
 * "THE NEXT CHAPTER AWAITS — 97TH BATTLE OF THE MAROONS DATES TO BE ANNOUNCED"
 * without fabricating false dates.
 */

export const eventConfig = {
  eventName: "Battle of the Maroons",
  edition: "97th Battle of the Maroons",
  season: "2027",
  isDateConfirmed: false, // Set to true once the Joint Committee releases official dates
  
  // Future match placeholder date (configured for demonstration if toggled on)
  // Format: ISO 8601 string
  tentativeMatchDate: "2027-03-05T09:30:00+05:30",
  confirmedStartDate: null,
  confirmedEndDate: null,

  // Historical Reference (Last Concluded Event: 96th Edition)
  lastConcludedEvent: {
    edition: "96th Battle of the Maroons",
    threeDayDates: "February 27, 28 & March 01, 2026",
    oneDayDate: "March 07, 2026 (Historic 1st Day-Night Encounter Under Lights)",
    venue: "Sinhalese Sports Club (SSC) Grounds, Colombo 07",
    jointCommitteeCoChairs: [
      { name: "Mahela Jayawardena", school: "Nalanda College", role: "Co-Chair Organising Committee" },
      { name: "Upali Dharmadasa", school: "Ananda College", role: "Co-Chair Organising Committee" }
    ]
  },

  venue: {
    name: "Sinhalese Sports Club (SSC) Grounds",
    city: "Maitland Place, Colombo 07",
    country: "Sri Lanka",
    capacity: "10,000+",
    surface: "Natural Turf Pitch",
    lights: "International Standard Floodlit (Day-Night Ready)"
  },

  matchFormats: [
    {
      type: "3-Day Traditional Encounter",
      trophy: "Dr. N. M. Perera Memorial Challenge Trophy",
      oversPerDay: "90 Overs per day",
      dressCode: "Traditional Cricket Whites"
    },
    {
      type: "50-Over One Day Encounter",
      trophy: "P. De S. Kularatne Memorial Trophy",
      timing: "Day-Night Encounter (Under Lights)",
      dressCode: "Colored Clothing / Maroon & Gold vs Maroon & Silver"
    }
  ],

  ticketing: {
    status: "COMING_SOON", // "AVAILABLE" | "COMING_SOON" | "SOLD_OUT"
    statusMessage: "Official Ticket Sales for the Next Encounter will be opened following Joint Committee announcement.",
    officialUrl: "#/ticketing",
    isPrototype: true,
    note: "All ticket selections on this frontend are for preview/planning purposes. No monetary payments are charged."
  },

  socialLinks: {
    facebook: "https://www.facebook.com/battleofthemaroons/",
    youtube: "https://www.youtube.com/@BattleoftheMaroonsOfficial",
    instagram: "https://www.instagram.com/battleofthemaroons/",
    twitter: "https://twitter.com/maroonsbattle",
    officialWebsite: "https://battleofthemaroons.lk/"
  }
};
