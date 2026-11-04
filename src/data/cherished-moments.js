/**
 * BATTLE OF THE MAROONS — CHERISHED MOMENTS (GOLDEN MEMORIES)
 * 
 * Source of truth: https://battleofthemaroons.lk/cherishing_memories.html
 * Authentic archival photographs, historic milestones, international representations,
 * and memorable moments between Ananda and Nalanda.
 */

export const cherishedMomentsData = [
  {
    id: "world-cup-1975",
    title: "Sri Lanka Squad for the Inaugural Cricket World Cup in 1975",
    subtitle: "The Dawn of Sri Lanka's International Cricket Era featuring Maroon Heroes",
    category: "International Milestones",
    image: "/assets/images/history/sl_squad.jpg",
    narrative: `
      Sri Lanka's historic entry into the international arena at the 1975 Prudential World Cup in England was heavily powered by the products of Ananda and Nalanda. 
      Bandula Warnapura (Nalanda), Sidath Wettimuni (Ananda), and schoolboy sensation Anura Ranasinghe (Nalanda) stood tall representing the nation.
    `,
    lineup: {
      standing: "I.R.D. Mendis, L.V. Kaluperuma, S.R. de S. Wettimuny (Ananda), A.R.M. Opatha, H.S.M. Pieris, G.R.A. de Silva, D.S. de Silva, D.R. Chanmugan, A.N. Ranasinghe (Nalanda), Bandula Warnapura (Nalanda).",
      seated: "R.D. Heyn, A.P.B. Tennekoon (Captain), Mr. K. Perera (Manager), M.H. Tissera, E.R. Fernando."
    }
  },
  {
    id: "anura-ranasinghe-trio",
    title: "Anura Ranasinghe — The Wonder Schoolboy in Action",
    subtitle: "Fearless Strokeplay against the mighty West Indian Fast Bowlers",
    category: "Schoolboy Legends",
    images: [
      {
        src: "/assets/images/history/anura1.jpg",
        caption: "A No Ball! And he hooks to the boundary. Anura facing Andy Roberts in the 1st Test match vs West Indies."
      },
      {
        src: "/assets/images/history/anura.jpg",
        caption: "The Schoolboy cricketer in the Sri Lankan team in action against the West Indies at the 1975 World Cup."
      },
      {
        src: "/assets/images/history/anura2.jpg",
        caption: "Anura surprises Vanburn Holder in the 2nd Test match vs West Indies."
      }
    ],
    narrative: `
      Anura Ranasinghe of Nalanda was still a schoolboy when chosen to play for Sri Lanka in the 1975 World Cup. 
      His fearless hooking against Andy Roberts and the fearsome West Indian pace battery remains one of the most celebrated moments in Sri Lankan cricket folklore.
    `
  },
  {
    id: "arjuna-ranatunga-early",
    title: "Arjuna Ranatunga — 1982 Inaugural Test Boundary & 1983 Honors",
    subtitle: "From Schoolboy Prodigy to World Cup-Winning Captain",
    category: "National Icons",
    images: [
      {
        src: "/assets/images/history/arjuna1983.jpg",
        caption: "The most outstanding sportsman in the year 1983."
      },
      {
        src: "/assets/images/history/arjuna_paul.jpg",
        caption: "Arjuna sends Paul Allott to the boundary on Sri Lanka's first ever Test against England in 1982 at P. Sara Oval."
      }
    ],
    narrative: `
      At just 18 years of age while still a student at Ananda College, Arjuna Ranatunga scored Sri Lanka's first ever half-century (54) in Test cricket history against England in February 1982. 
      In 1983, he was crowned Sri Lanka's Most Outstanding Sportsman of the Year.
    `
  },
  {
    id: "wettimuni-classics",
    title: "Wettimuni Classics — Masterclass at Lord's",
    subtitle: "The Benchmark of Classical Sri Lankan Opening Batting",
    category: "Masterclasses",
    image: "/assets/images/history/wettimuni_clasics.jpg",
    narrative: `
      Sidath Wettimuni of Ananda etched his name permanently on the Lord's Honours Board in 1984 by crafting a monumental 190 against England — batting for 642 minutes across 11 hours, becoming the first Sri Lankan to score a Test century on English soil.
    `
  },
  {
    id: "arjuna-dhammika-brendon",
    title: "Arjuna, Dhammika & Brendon — The Brotherly Ananda Powerhouse",
    subtitle: "Ranatunga Brothers and Kuruppu playing in the same iconic Ananda team",
    category: "School Team Legends",
    image: "/assets/images/history/brotherteam.jpg",
    narrative: `
      An extraordinary era when Arjuna Ranatunga, his elder brother Dhammika Ranatunga, and Brendon Kuruppu (future Test double-centurion) dominated school cricket in the same Ananda XI.
    `,
    lineup: {
      seated: "Brendon Kuruppu, Senanka Ekanayake, Prasanna Amarasinghe, Gihan Karunaratne (Captain), Chanaka Ekanayake, Rohitha Perera, Lalith Hewawitharana.",
      standing: "Deepal Dharmasekara, Hemakantha Ekanayake, Adel Hashim, Niran Ranatunge, Kamal Dharmasiri, Upul Samarakoon, Dhammika Ranatunge, Charith Senanayake, Arjuna Ranatunge."
    }
  },
  {
    id: "mahanama-1984-nalanda",
    title: "Mahanama — The Best Ever Outfielder Leading Nalanda in 1984",
    subtitle: "Roshan Mahanama captaining a star-studded Nalanda First XI",
    category: "School Team Legends",
    image: "/assets/images/history/1984_nalanda.jpg",
    narrative: `
      In 1984, Roshan Mahanama captained Nalanda College alongside future 1996 World Cup hero Asanka Gurusinghe. Mahanama went on to become one of the greatest fielders in international cricket history and an esteemed ICC Match Referee.
    `,
    lineup: {
      seated: "Ajith Jayasinghe, Asanka Gurusinghe, Sanduna Kapugekiyana (V. Captain), Roshan Mahanama (Captain), Priya De Mel, Imal Boteju, Gamini Wickramasinghe.",
      standing: "Disnaka Weeraratne, Kushantha Dissanayake, Jayanath Saram, Asanka Nanayakkara, Nihal Pathirage, Sudarman De Silva, Sunanda Wickramasooriya, Namal Mendis, Seneke Senanayake, Migara Perera, Sanath De Silva (Absent)."
    }
  },
  {
    id: "anuruddha-polonnowita",
    title: "The Shadow Behind Great Players — Anuruddha Polonnowita",
    subtitle: "The Guru who shaped generations of Sri Lankan cricket champions",
    category: "Mentors & Coaches",
    image: "/assets/images/history/teampolonvita.jpg",
    narrative: `
      Legendary Ananda coach and administrator Anuruddha Polonnowita mentored generations of cricketers who went on to win the 1996 World Cup. His tactical genius, discipline, and devotion formed the bedrock of Ananda's golden cricket era.
    `
  },
  {
    id: "four-anandians-australia",
    title: "Four Anandians to Australia with the Sri Lanka Team (1989–1990)",
    subtitle: "Dominating the National Squad on the demanding Australian Tour",
    category: "National Dominance",
    image: "/assets/images/history/4anandians.jpg",
    narrative: `
      On the historic 1989–1990 Australian tour, four proud Anandians formed the core leadership of Sri Lanka's national team: Dhammika Ranatunga, Arjuna Ranatunga (Captain), Anuruddha Polonnowita (Assistant Manager), and Brendon Kuruppu.
    `
  },
  {
    id: "international-trio-hall",
    title: "The Trinity of Pure Class — Atapattu, Mahanama & Gurusinghe",
    subtitle: "Pillars of Sri Lanka's 1996 World Champions and Test Greatness",
    category: "International Icons",
    trio: [
      {
        name: "Marvan Atapattu",
        school: "Ananda College",
        image: "/assets/images/history/mavan.jpg",
        caption: "Technical perfection personified. Over 5,500 Test runs, 6 double centuries, and distinguished captain of Sri Lanka."
      },
      {
        name: "Roshan Mahanama",
        school: "Nalanda College",
        image: "/assets/images/history/roshan.jpg",
        caption: "The world's greatest cover fielder, 1996 World Cup winner, and world record holder with a 340-run Test marathon."
      },
      {
        name: "Asanka Gurusinghe",
        school: "Nalanda College",
        image: "/assets/images/history/asanka.jpg",
        caption: "The immovable rock at number three. 65 crucial runs in the 1996 World Cup Final and 8 Test centuries."
      }
    ]
  },
  {
    id: "modern-era-titans",
    title: "Modern Era Titans — Samaraweera, Mahela & Avishka",
    subtitle: "Carrying the Maroon Torch into the 21st Century",
    category: "Modern Greats",
    trio: [
      {
        name: "Thilan Samaraweera",
        school: "Ananda College",
        image: "/assets/images/history/tilan_samaraweera.jpg",
        caption: "Crisis man for Sri Lanka. 14 Test centuries and an average of 48.75 in Test cricket."
      },
      {
        name: "Mahela Jayawardena",
        school: "Nalanda College",
        image: "/assets/images/history/mahela.jpg",
        caption: "ICC Hall of Famer, 11,814 Test runs, 374 highest Test score by a right-hander, and 2007 World Cup Final Captain."
      },
      {
        name: "Avishka Gunawardene",
        school: "Ananda College",
        image: "/assets/images/history/avishka.jpg",
        caption: "Explosive ODI opening batsman, ICC knockout century maker, and respected international batting coach."
      }
    ]
  }
];
