import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

import { Admin } from '../models/Admin.js';
import { EventSetting } from '../models/EventSetting.js';
import { TicketCategory } from '../models/TicketCategory.js';
import { Match } from '../models/Match.js';
import { Team } from '../models/Team.js';
import { News } from '../models/News.js';
import { Sponsor } from '../models/Sponsor.js';
import { Gallery } from '../models/Gallery.js';

import { eventConfig } from '../../src/data/event.config.js';
import { matchCentreData } from '../../src/data/matches.js';
import { teamsData } from '../../src/data/teams.js';
import { newsArticles } from '../../src/data/news.js';
import { sponsorsData } from '../../src/data/sponsors.js';
import { galleryItems } from '../../src/data/gallery.js';

dotenv.config();

async function runSeed() {
  console.log('🌱 Starting Battle of the Maroons Database Seeder...');
  const connected = await connectDB();

  if (!connected) {
    console.error('❌ Cannot run seeder: MongoDB connection failed. Please check MONGODB_URI in your .env file.');
    process.exit(1);
  }

  try {
    // 1. Seed Initial Pre-Authorized Administrator
    const initialUser = process.env.ADMIN_INITIAL_USER || 'admin';
    const initialEmail = (process.env.ADMIN_INITIAL_EMAIL || 'admin@battleofthemaroons.lk').toLowerCase();
    const initialPass = process.env.ADMIN_INITIAL_PASSWORD || 'Maroons@2027';

    let admin = await Admin.findOne({ $or: [{ username: initialUser }, { email: initialEmail }] });
    if (!admin) {
      const passwordHash = await bcrypt.hash(initialPass, 12);
      admin = await Admin.create({
        username: initialUser,
        email: initialEmail,
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true
      });
      console.log(`✅ Administrator Created: [User: ${initialUser}, Email: ${initialEmail}]`);
    } else {
      console.log(`ℹ️ Administrator already exists: [User: ${admin.username}]`);
    }

    // 2. Seed Event Settings
    const existingSetting = await EventSetting.findOne();
    if (!existingSetting) {
      await EventSetting.create({
        eventName: eventConfig.eventName || "Battle of the Maroons",
        edition: eventConfig.edition || "97th Battle of the Maroons",
        season: eventConfig.season || "2027",
        isDateConfirmed: eventConfig.isDateConfirmed || false,
        tentativeMatchDate: eventConfig.tentativeMatchDate || "2027-03-05T09:30:00+05:30",
        venueName: eventConfig.venue?.name || "Sinhalese Sports Club (SSC) Grounds",
        venueCity: eventConfig.venue?.city || "Maitland Place, Colombo 07",
        venueCapacity: eventConfig.venue?.capacity || "10,000+",
        ticketingStatus: eventConfig.ticketing?.status || "COMING_SOON",
        ticketingStatusMessage: eventConfig.ticketing?.statusMessage || "Official Ticket Sales for the Next Encounter will be opened following Joint Committee announcement."
      });
      console.log('✅ Event Settings Seeded.');
    }

    // 3. Seed Ticket Categories
    const existingCats = await TicketCategory.countDocuments();
    if (existingCats === 0) {
      const defaultCategories = [
        {
          code: "grandstand",
          name: "Grandstand Upper Deck",
          price: 2500,
          description: "Panoramic elevated view of the SSC pitch, shaded seating behind the bowler's arm.",
          totalCapacity: 500,
          maxPerOrder: 10,
          isActive: true,
          displayOrder: 1,
          perks: ["Shaded Roof Seating", "Direct Pitch View", "Dedicated Refreshments Stall"]
        },
        {
          code: "members",
          name: "Members Pavilion Enclosure",
          price: 5000,
          description: "Premium clubhouse enclosure with private refreshments and air-conditioned lounge access.",
          totalCapacity: 200,
          maxPerOrder: 6,
          isActive: true,
          displayOrder: 2,
          perks: ["Clubhouse Lounge Access", "Complimentary Tea & Snacks", "Formal Dress Code"]
        },
        {
          code: "marquee",
          name: "Old Boys Maroons Marquee",
          price: 4000,
          description: "Dedicated alumni marquee with commemorative badge and VIP hospitality.",
          totalCapacity: 300,
          maxPerOrder: 8,
          isActive: true,
          displayOrder: 3,
          perks: ["Alumni Souvenir Badge", "Hospitality Tent Access", "Big Screen Telecast"]
        },
        {
          code: "papare",
          name: "Party Tent & Papare Enclosure",
          price: 1500,
          description: "Direct access to the papare band, dancing terraces, and vibrant carnival area.",
          totalCapacity: 1000,
          maxPerOrder: 10,
          isActive: true,
          displayOrder: 4,
          perks: ["Live Papare Band Rhythms", "Festival Ground Terraces", "Day-Night Lighting"]
        }
      ];
      await TicketCategory.insertMany(defaultCategories);
      console.log(`✅ Seeded ${defaultCategories.length} Ticket Categories.`);
    }

    // 4. Seed Matches
    const existingMatches = await Match.countDocuments();
    if (existingMatches === 0 && matchCentreData.featuredMatches) {
      await Match.insertMany(matchCentreData.featuredMatches.map((m, idx) => ({
        matchId: m.id,
        title: m.title,
        subTitle: m.subTitle,
        edition: m.edition || "95th Edition",
        format: m.format,
        trophy: m.trophy,
        dates: m.dates,
        venue: m.venue,
        toss: m.toss,
        result: m.result,
        status: m.status || "CONCLUDED",
        summary: m.summary,
        bannerImage: m.bannerImage,
        scorecards: m.scorecards,
        awards: m.awards || [],
        displayOrder: idx
      })));
      console.log(`✅ Seeded ${matchCentreData.featuredMatches.length} Match Centre Records.`);
    }

    // 5. Seed Teams
    const existingTeams = await Team.countDocuments();
    if (existingTeams === 0 && teamsData) {
      const teamsArr = Object.entries(teamsData).map(([key, data]) => ({
        schoolKey: key,
        name: data.name,
        sinhalaName: data.sinhalaName,
        founded: data.founded,
        founder: data.founder,
        motto: data.motto,
        colours: data.colours,
        colourNames: data.colourNames,
        crest: data.crest,
        flag: data.flag,
        principal: data.principal,
        bigMatchWins: data.bigMatchWins,
        oneDayWins: data.oneDayWins,
        overview: data.overview,
        recentCaptain: data.recentCaptain,
        viceCaptain: data.viceCaptain,
        verifiedSquadMembers: data.verifiedSquadMembers || [],
        cricketHallOfFame: data.cricketHallOfFame || []
      }));
      await Team.insertMany(teamsArr);
      console.log(`✅ Seeded Ananda and Nalanda Teams.`);
    }

    // 6. Seed News
    const existingNews = await News.countDocuments();
    if (existingNews === 0 && newsArticles) {
      await News.insertMany(newsArticles.map((n, idx) => ({
        slug: n.id,
        title: n.title,
        author: n.author || "Joint Organising Committee",
        date: n.date,
        category: n.category,
        image: n.image,
        summary: n.summary,
        content: n.content,
        isPublished: true,
        featured: idx === 0,
        displayOrder: idx
      })));
      console.log(`✅ Seeded ${newsArticles.length} News Articles.`);
    }

    // 7. Seed Sponsors
    const existingSponsors = await Sponsor.countDocuments();
    if (existingSponsors === 0 && sponsorsData) {
      const sponsorsToInsert = [];
      let order = 0;

      (sponsorsData.platinum || []).forEach(s => {
        sponsorsToInsert.push({
          name: s.name,
          tier: 'platinum',
          role: s.title || "Platinum Sponsor",
          logo: s.logo,
          website: s.website,
          description: s.description || "",
          displayOrder: order++,
          isActive: true
        });
      });

      (sponsorsData.gold || []).forEach(s => {
        sponsorsToInsert.push({
          name: s.name,
          tier: 'gold',
          role: s.title || "Official Banking Partner",
          logo: s.logo,
          website: s.website,
          description: s.description || "",
          displayOrder: order++,
          isActive: true
        });
      });

      (sponsorsData.officialPartners || []).forEach(s => {
        sponsorsToInsert.push({
          name: s.name,
          tier: 'officialPartner',
          role: s.role || "Official Partner",
          logo: s.logo,
          website: s.website,
          description: "",
          displayOrder: order++,
          isActive: true
        });
      });

      (sponsorsData.mediaAndBroadcast || []).forEach(s => {
        sponsorsToInsert.push({
          name: s.name,
          tier: 'mediaAndBroadcast',
          role: s.role || "Broadcasting Partner",
          logo: s.logo,
          website: s.website,
          description: "",
          displayOrder: order++,
          isActive: true
        });
      });

      if (sponsorsToInsert.length > 0) {
        await Sponsor.insertMany(sponsorsToInsert);
        console.log(`✅ Seeded ${sponsorsToInsert.length} Corporate Sponsors.`);
      }
    }

    // 8. Seed Photo Gallery
    const existingGallery = await Gallery.countDocuments();
    if (existingGallery === 0 && galleryItems && galleryItems.length > 0) {
      const galleryToInsert = galleryItems.map((g, idx) => ({
        title: g.title,
        category: g.category || 'matches',
        categoryLabel: g.categoryLabel || 'Match Action',
        year: g.year || '2025',
        image: g.image,
        caption: g.caption || '',
        location: g.location || 'Sinhalese Sports Club (SSC) Grounds, Colombo',
        featured: Boolean(g.featured),
        displayOrder: idx,
        isActive: true
      }));
      await Gallery.insertMany(galleryToInsert);
      console.log(`✅ Seeded ${galleryToInsert.length} Photo Gallery items.`);
    }

    console.log(`
🎉 ======================================================== 🎉
   DATABASE SEEDING COMPLETE!
   Initial Administrator:
   Username: ${initialUser}
   Password: ${initialPass}
🎉 ======================================================== 🎉
    `);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
}

runSeed();
