/**
 * BATTLE OF THE MAROONS — TEAMS & PLAYERS DATA
 * 
 * Verified school details, colours, crests, squads, leadership,
 * and legends produced by Ananda College & Nalanda College.
 */

export const teamsData = {
  ananda: {
    id: "ananda",
    name: "Ananda College",
    sinhalaName: "ආනන්ද විද්‍යාලය",
    founded: 1886,
    founder: "Col. Henry Steel Olcott & Ven. Mohottiwatte Gunananda Thero",
    motto: "Appamado Amato Padam (Heedfulness is the path to Deathlessness)",
    colours: ["#6b1424", "#d4af37"], // Maroon & Gold
    colourNames: "Maroon and Gold",
    crest: "/assets/images/schools/ananda_crest.svg",
    flag: "/assets/images/branding/ananda_flag.jpg",
    principal: "Mr. Lal Dissanayake",
    bigMatchWins: 12,
    oneDayWins: 26,
    overview: "Established in 1886, Ananda College is the pioneer Buddhist educational institution in Sri Lanka. Its cricket tradition has nurtured some of the world's most accomplished cricketers, national captains, and pioneers of modern Sri Lankan sports.",
    
    recentCaptain: "Ashinsha Nainayake (95th Encounter)",
    viceCaptain: "Dinada Athalage",
    
    verifiedSquadMembers: [
      { name: "Ashinsha Nainayake", role: "Captain / All-rounder", specialism: "Right-hand bat / Right-arm medium" },
      { name: "Dinada Athalage", role: "Vice Captain / All-rounder", specialism: "Right-hand bat / Off-break (95th BoM Centurion 131)" },
      { name: "Kenul De Zoysa", role: "Top-order Batsman", specialism: "Right-hand bat (95th BoM 73 runs)" },
      { name: "Nethula Edirimanne", role: "Top-order Batsman", specialism: "Right-hand bat (95th BoM 49 runs)" },
      { name: "Sharada Jayarathne", role: "Strike Bowler", specialism: "Right-arm fast-medium (95th BoM 4/58)" },
      { name: "Kithma Vidanapathirana", role: "Middle-order Batsman", specialism: "Right-hand bat" },
      { name: "Danindu Sellapperuma", role: "Opening Batsman", specialism: "Left-hand bat" },
      { name: "Ahan Wickramasinghe", role: "Wicketkeeper Batsman", specialism: "Right-hand bat" },
      { name: "Janidu Jayawardena", role: "Spin Bowler", specialism: "Slow left-arm orthodox" },
      { name: "Dasun Chamara", role: "Seam Bowler", specialism: "Right-arm fast" }
    ],

    cricketHallOfFame: [
      { name: "Arjuna Ranatunga", feat: "Captain of Sri Lanka's 1996 Cricket World Cup Champions; scored Sri Lanka's first Test half-century (54) at age 18 in 1982.", image: "/assets/images/history/legend_arjuna_ranatunga.jpg" },
      { name: "Sidath Wettimuni", feat: "Scored Sri Lanka's historic first Test century at Lord's (190 runs vs England, 1984); legendary opening batsman.", image: "/assets/images/history/sidath_wettimuni.jpg" },
      { name: "Marvan Atapattu", feat: "Former Sri Lanka Test Captain; over 5,500 Test runs, 6 Test Double Centuries; BoM centurion (1991).", image: "/assets/images/history/marvan_atapattu.jpg" },
      { name: "Dinesh Chandimal", feat: "Sri Lanka National Captain across all formats; wicketkeeper-batsman; 80th BoM Captain.", image: "/assets/images/history/dinesh_chandimal.jpg" },
      { name: "Brendon Kuruppu", feat: "Scored a double century on Test debut (201* vs New Zealand 1987); 1996 World Cup selection committee member.", image: "/assets/images/history/brendon_kuruppu.jpg" },
      { name: "Thilina Kandamby", feat: "Sri Lanka ODI & T20 international; Big Match centurion (144 in 1999); leading coach.", image: "/assets/images/history/thilina_kandamby.jpg" },
      { name: "Mithra Wettimuni", feat: "Sri Lanka opening batsman and 1970 Ananda Captain; part of the famous Wettimuni cricketing family.", image: "/assets/images/history/mithra_wettimuni.jpg" }
    ]
  },

  nalanda: {
    id: "nalanda",
    name: "Nalanda College",
    sinhalaName: "නාලන්දා විද්‍යාලය",
    founded: 1924,
    founder: "P. de S. Kularatne (Offshoot of Ananda College)",
    motto: "Apadana Sobhini Panna (Wisdom Beautifies Character)",
    colours: ["#6b1424", "#c0c0c0"], // Maroon & Silver
    colourNames: "Maroon and Silver",
    crest: "/assets/images/schools/nalanda_crest.png",
    flag: "/assets/images/branding/nalanda_flag.jpg",
    principal: "Mr. Iran Champika Silva",
    bigMatchWins: 7,
    oneDayWins: 15,
    overview: "Established in 1924 under the stewardship of P. de S. Kularatne, Nalanda College arose as a sister school to Ananda. It has produced Sri Lanka's inaugural Test captain, World Cup winners, international match referees, and ICC Elite panel umpires.",

    recentCaptain: "Sadew Samarasinghe (95th Encounter)",
    viceCaptain: "Nadul Jayalath",

    verifiedSquadMembers: [
      { name: "Sadew Samarasinghe", role: "Captain / Opening Batsman", specialism: "Left-hand bat (95th BoM 40 runs & 2 wickets)" },
      { name: "Nadul Jayalath", role: "Vice Captain / Top-order Batsman", specialism: "Right-hand bat (95th BoM Centurion 111)" },
      { name: "Nemidu Akmeemana", role: "Top-order Batsman", specialism: "Right-hand bat (95th BoM 43 runs)" },
      { name: "Lithum Wijesekera", role: "Top-order Batsman", specialism: "Left-hand bat (48th One Day 29* runs)" },
      { name: "Malsha Fernando", role: "Middle-order Batsman", specialism: "Right-hand bat (95th BoM 34* runs)" },
      { name: "Manasa De Silva", role: "All-rounder", specialism: "Right-hand bat / Right-arm off break" },
      { name: "Hasitha Ratnayake", role: "Strike Bowler", specialism: "Right-arm fast-medium (48th One Day 4/46)" },
      { name: "Osanda Pamuditha", role: "Fast Bowler", specialism: "Left-arm fast (95th BoM 2 wickets)" },
      { name: "Punsara Rajakaruna", role: "Spin Bowler", specialism: "Right-arm leg-break (95th BoM 2 wickets)" },
      { name: "Thisara Dewdunu", role: "Fielder / Batsman", specialism: "Right-hand bat (95th BoM Best Fielder Award)" }
    ],

    cricketHallOfFame: [
      { name: "Bandula Warnapura", feat: "Sri Lanka's Inaugural Test Captain (1982); captained Sri Lanka in first 4 Tests and 1979 World Cup; 1971 Nalanda Captain.", image: "/assets/images/history/bandula_warnapura.jpg" },
      { name: "Mahela Jayawardena", feat: "ICC Cricket Hall of Fame; over 11,814 Test runs & 12,650 ODI runs; 2007 World Cup finalist captain; BoM Committee Co-Chair.", image: "/assets/images/history/farewell_mahela.jpg" },
      { name: "Roshan Mahanama", feat: "1996 World Cup winner; ICC Match Referee; world record partnership with Sanath Jayasuriya (576 runs); 1984 Nalanda Captain.", image: "/assets/images/history/roshan_mahanama.jpg" },
      { name: "Asanka Gurusinghe", feat: "1996 World Cup winner; scored 65 runs in the 1996 World Cup Final; 1985 Nalanda Captain.", image: "/assets/images/history/asanka_gurusinghe.jpg" },
      { name: "Kumar Dharmasena", feat: "1996 World Cup winner; ICC Elite Umpire of the Year (David Shepherd Trophy); BoM centurion (105 in 1989).", image: "/assets/images/history/kumar_dharmasena_icc.jpg" },
      { name: "Chandika Hathurusinghe", feat: "Sri Lanka international cricketer and high-profile international head coach (Sri Lanka, Bangladesh).", image: "/assets/images/history/chandika_hathurusinghe.jpg" },
      { name: "Shantha Kalavitigoda", feat: "Holds all-time highest individual score in Battle of the Maroons history with 149 runs in 1997.", image: "/assets/images/history/shantha_kalavitigoda.jpg" }
    ]
  }
};
