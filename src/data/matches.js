/**
 * BATTLE OF THE MAROONS — MATCH CENTRE DATA
 * 
 * Verified official match scorecards, summaries, and awards.
 */

export const matchCentreData = {
  featuredMatches: [
    {
      id: "bom-95th-3day",
      title: "95th Battle of the Maroons (3-Day Historic Encounter)",
      subTitle: "The Inaugural 3-Day Format Encounter",
      format: "3-Day Traditional Match",
      trophy: "Dr. N. M. Perera Memorial Challenge Trophy",
      dates: "February 28, March 01 & 02, 2025",
      venue: "Sinhalese Sports Club (SSC) Grounds, Colombo",
      toss: "Nalanda College won the toss and elected to field first",
      result: "Match Drawn",
      status: "CONCLUDED",
      summary: "A thrilling high-scoring contest worked out over three days for the first time in the series history dating back to 1924. Featuring majestic centuries from Dinada Athalage (131 for Ananda) and Nadul Jayalath (111 for Nalanda). Both sides declared at 324 and 325 respectively before rain curbed the final session.",
      bannerImage: "/assets/images/matches/95th_encounter_final_2025.jpg",
      
      scorecards: {
        innings: [
          {
            team: "Ananda College",
            inningsNumber: "1st Innings",
            score: "324/6 declared",
            overs: "92.2",
            batting: [
              { player: "Danindu Sellapperuma", runs: 0, balls: 3, fours: 0, dismissal: "c sub b Osanda Pamuditha" },
              { player: "Dinada Athalage", runs: 131, balls: 287, fours: 11, dismissal: "c & b Punsara Rajakaruna" },
              { player: "Nethula Edirimanne", runs: 49, balls: 98, fours: 5, dismissal: "lbw b Osanda Pamuditha" },
              { player: "Kenul De Zoysa", runs: 73, balls: 142, fours: 7, dismissal: "b Punsara Rajakaruna" },
              { player: "Kithma Vidanapathirana", runs: 32, balls: 38, fours: 4, dismissal: "run out" },
              { player: "Ashinsha Nainayake (c)", runs: 18, balls: 24, fours: 2, dismissal: "not out" },
              { player: "Sharada Jayarathne", runs: 12, balls: 14, fours: 1, dismissal: "not out" }
            ],
            bowling: [
              { bowler: "Osanda Pamuditha", overs: "22.2", maidens: 4, runs: 80, wickets: 2 },
              { bowler: "Punsara Rajakaruna", overs: "24.0", maidens: 5, runs: 69, wickets: 2 },
              { bowler: "Sadew Samarasinghe", overs: "18.0", maidens: 3, runs: 58, wickets: 0 },
              { bowler: "Hasitha Ratnayake", overs: "16.0", maidens: 2, runs: 62, wickets: 0 }
            ]
          },
          {
            team: "Nalanda College",
            inningsNumber: "1st Innings",
            score: "325/6 declared",
            overs: "88.4",
            batting: [
              { player: "Sadew Samarasinghe (c)", runs: 40, balls: 84, fours: 4, dismissal: "c keeper b Sharada Jayarathne" },
              { player: "Nadul Jayalath", runs: 111, balls: 192, fours: 12, dismissal: "c sub b Sharada Jayarathne" },
              { player: "Nemidu Akmeemana", runs: 43, balls: 88, fours: 5, dismissal: "c & b Sharada Jayarathne" },
              { player: "Manupa Manmitha", runs: 23, balls: 46, fours: 2, dismissal: "lbw b Sharada Jayarathne" },
              { player: "Malsha Fernando", runs: 34, balls: 68, fours: 3, dismissal: "not out" },
              { player: "Manasa De Silva", runs: 25, balls: 42, fours: 2, dismissal: "not out" }
            ],
            bowling: [
              { bowler: "Sharada Jayarathne", overs: "28.4", maidens: 6, runs: 58, wickets: 4 },
              { bowler: "Dinada Athalage", overs: "20.0", maidens: 4, runs: 68, wickets: 1 },
              { bowler: "Kenul De Zoysa", overs: "18.0", maidens: 3, runs: 74, wickets: 1 }
            ]
          },
          {
            team: "Ananda College",
            inningsNumber: "2nd Innings",
            score: "27/1",
            overs: "7.0",
            batting: [
              { player: "Danindu Sellapperuma", runs: 14, balls: 22, fours: 2, dismissal: "not out" },
              { player: "Nethula Edirimanne", runs: 9, balls: 18, fours: 1, dismissal: "c keeper b Osanda Pamuditha" }
            ],
            bowling: [
              { bowler: "Osanda Pamuditha", overs: "3.0", maidens: 1, runs: 12, wickets: 1 },
              { bowler: "Punsara Rajakaruna", overs: "3.0", maidens: 0, runs: 14, wickets: 0 }
            ]
          }
        ]
      },

      awards: [
        { title: "Man of the Match", recipient: "Dinada Athalage", school: "Ananda College", note: "131 Runs & All-round contribution" },
        { title: "Best Batsman", recipient: "Nadul Jayalath", school: "Nalanda College", note: "111 Runs in 192 balls" },
        { title: "Best Bowler", recipient: "Sharada Jayarathne", school: "Ananda College", note: "4 wickets for 58 runs" },
        { title: "Best Fielder", recipient: "Thisara Dewdunu", school: "Nalanda College", note: "Outstanding catching & ground stops" },
        { title: "Best Allrounder", recipient: "Dinada Athalage", school: "Ananda College", note: "Century & tight bowling spells" }
      ],

      dignitaries: [
        "Opening Ceremony: Sidath Wettimuni (Ananda) & Roshan Mahanama (Nalanda)",
        "Post-Match Awards: Nelson Mendis (Past Coach, Nalanda) & Imal Kaluthotage (Old Anandian Sports Patron)"
      ]
    },

    {
      id: "bom-48th-oneday",
      title: "48th One Day Encounter",
      subTitle: "P. De S. Kularatne Memorial Trophy",
      format: "50 Overs Limited Overs Match",
      trophy: "P. De S. Kularatne Memorial Trophy (Shared)",
      dates: "March 16, 2025",
      venue: "Sinhalese Sports Club (SSC) Grounds, Colombo",
      toss: "Nalanda College won the toss and elected to field first",
      result: "No Decision (Rain Interruption)",
      status: "CONCLUDED",
      summary: "Two stalwarts of Maroons cricket, Mr. Saliya Senanayake and Mr. Palitha Seneviratne (captains in the 1970s), graced the opening. Ananda posted 249/9 in 50 overs with Kenul de Zoysa scoring 39. Nalanda were 62/2 in 12.2 overs when torrential rain stopped play. As minimum 20 overs required for D/L method could not be completed, the match was declared a no-decision and the trophy was shared.",
      bannerImage: "/assets/images/matches/48th_oneday_2025.jpg",
      
      scorecards: {
        innings: [
          {
            team: "Ananda College",
            inningsNumber: "1st Innings",
            score: "249/9",
            overs: "50.0",
            batting: [
              { player: "Kenul de Zoysa", runs: 39, balls: 61, fours: 3, dismissal: "c & b Hasitha Ratnayake" },
              { player: "Nethul Edirimanne", runs: 34, balls: 48, fours: 3, dismissal: "c sub b Sadew Samarasinghe" },
              { player: "Ashinsha Nainayake (c)", runs: 30, balls: 36, fours: 2, dismissal: "run out" },
              { player: "Dinada Athalage", runs: 29, balls: 42, fours: 2, dismissal: "c & b Hasitha Ratnayake" }
            ],
            bowling: [
              { bowler: "Hasitha Ratnayake", overs: "10.0", maidens: 1, runs: 46, wickets: 4 },
              { bowler: "Sadew Samarasinghe", overs: "10.0", maidens: 0, runs: 41, wickets: 2 }
            ]
          },
          {
            team: "Nalanda College",
            inningsNumber: "2nd Innings",
            score: "62/2",
            overs: "12.2",
            batting: [
              { player: "Lithum Wijesekera", runs: 29, balls: 38, fours: 3, dismissal: "not out" },
              { player: "Sadew Samarasinghe (c)", runs: 16, balls: 24, fours: 1, dismissal: "c keeper" }
            ],
            bowling: [
              { bowler: "Sharada Jayarathne", overs: "6.0", maidens: 1, runs: 28, wickets: 1 },
              { bowler: "Dinada Athalage", overs: "5.2", maidens: 0, runs: 31, wickets: 1 }
            ]
          }
        ]
      },
      awards: [
        { title: "Trophy Presentation", recipient: "P. De S. Kularatne Memorial Trophy Shared", school: "Both Captains", note: "Presented by Chief Guest Upul Gamage (Nalanda 50th BoM Captain)" }
      ]
    },

    {
      id: "bom-96th-edition",
      title: "96th Battle of the Maroons & Historic Day-Night Encounter",
      subTitle: "Sri Lanka's Premier Big Match Festival",
      format: "3-Day Encounter & 1-Day Day-Night",
      dates: "February 27, 28 & March 01, 2026 (3-Day) | March 07, 2026 (Day-Night)",
      venue: "Sinhalese Sports Club (SSC) Grounds, Colombo",
      toss: "Official Toss on Match Morning",
      result: "Historic 96th Edition Concluded at SSC",
      status: "ARCHIVED",
      summary: "Launched at the Cinnamon Grand Hotel by Co-Chairs Mahela Jayawardena and Upali Dharmadasa. Featured Rs 25 million presentation to the college principals and the groundbreaking introduction of the One Day match under lights.",
      bannerImage: "/assets/images/matches/1day_match_2026_dn.jpg",
      scorecards: null
    }
  ]
};
