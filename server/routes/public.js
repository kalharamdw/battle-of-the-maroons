import express from 'express';
import { EventSetting } from '../models/EventSetting.js';
import { TicketCategory } from '../models/TicketCategory.js';
import { Match } from '../models/Match.js';
import { Team } from '../models/Team.js';
import { News } from '../models/News.js';
import { Sponsor } from '../models/Sponsor.js';
import { Inquiry } from '../models/Inquiry.js';
import { Gallery } from '../models/Gallery.js';
import { inquiryLimiter } from '../middleware/rateLimiters.js';
import { isDbConnected } from '../config/db.js';
import { localStore } from '../config/localStore.js';

import mongoose from 'mongoose';

const router = express.Router();

/**
 * GET /api/event
 * Returns current event config & countdown data
 */
router.get('/event', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  if (!isDbConnected()) {
    return res.json({ success: true, data: localStore.getEvent(), source: 'local_store' });
  }
  try {
    const setting = await EventSetting.findOne().sort({ updatedAt: -1 });
    if (!setting) {
      return res.json({ success: true, data: localStore.getEvent(), source: 'local_store' });
    }
    const data = setting.toObject();
    // Normalize aliases so frontend has guaranteed consistent fields
    data.isConfirmed = data.isConfirmed !== undefined ? Boolean(data.isConfirmed) : Boolean(data.isDateConfirmed);
    data.isDateConfirmed = data.isConfirmed;
    data.countdownTarget = data.countdownTarget || data.confirmedStartDate || data.tentativeMatchDate || "2027-03-05T10:00:00.000Z";
    data.tentativeMatchDate = data.countdownTarget;
    data.confirmedStartDate = data.isConfirmed ? data.countdownTarget : null;
    data.seriesTitle = data.seriesTitle || `${data.edition || 97}th Battle of the Maroons`;
    data.matchDates = data.matchDates || "March 2027 • SSC Colombo";
    data.venue = data.venue || data.venueName || "Sinhalese Sports Club (SSC) Grounds, Colombo";
    data.venueName = data.venue;
    data.year = data.year || (data.season ? parseInt(data.season, 10) : 2027);
    data.season = String(data.year);
    data.ticketingActive = data.ticketingActive ?? (data.ticketingStatus === 'AVAILABLE');

    res.json({ success: true, data, source: 'database' });
  } catch (error) {
    res.json({ success: true, data: localStore.getEvent(), source: 'local_store', error: error.message });
  }
});

/**
 * GET /api/tickets/categories
 * Returns active ticket categories with live quotas
 */
router.get('/tickets/categories', async (req, res) => {
  if (!isDbConnected()) {
    return res.json({ success: true, data: localStore.getTickets(), source: 'local_store' });
  }
  try {
    const categories = await TicketCategory.find({ isActive: true }).sort({ displayOrder: 1, price: 1 });
    if (!categories || categories.length === 0) {
      return res.json({ success: true, data: localStore.getTickets(), source: 'local_store' });
    }
    res.json({ success: true, data: categories, source: 'database' });
  } catch (error) {
    res.json({ success: true, data: localStore.getTickets(), source: 'local_store' });
  }
});

/**
 * POST /api/inquiries
 * Public visitor contact inquiry submission
 */
router.post('/inquiries', inquiryLimiter, async (req, res) => {
  try {
    const { name, email, phone, topic, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (!message || message.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters long.' });
    }

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    const inqPayload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      topic: topic || 'general',
      category: topic || 'general',
      subject: topic || '',
      message: message.trim(),
      ipAddress
    };

    let inquiry = null;
    if (isDbConnected()) {
      try {
        inquiry = await Inquiry.create(inqPayload);
      } catch (dbErr) {
        console.warn('MongoDB inquiry creation fallback to local store:', dbErr.message);
      }
    }

    const localInq = localStore.addInquiry({
      _id: inquiry ? String(inquiry._id) : undefined,
      ...inqPayload
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been received by the Battle of the Maroons Joint Organising Committee.',
      inquiryId: inquiry ? inquiry._id : localInq._id,
      source: inquiry ? 'mongodb' : 'local_store'
    });
  } catch (error) {
    console.error('Inquiry Submission Error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to process your inquiry at this moment. Please try again or contact info@battleofthemaroons.lk directly.'
    });
  }
});

/**
 * GET /api/matches
 * Returns match scorecards & history
 */
router.get('/matches', async (req, res) => {
  if (!isDbConnected()) {
    return res.json({ success: true, data: localStore.getMatches(), source: 'local_store' });
  }
  try {
    const matches = await Match.find().sort({ displayOrder: 1, createdAt: -1 });
    if (!matches || matches.length === 0) {
      return res.json({ success: true, data: localStore.getMatches(), source: 'local_store' });
    }
    res.json({ success: true, data: { featuredMatches: matches }, source: 'database' });
  } catch (error) {
    res.json({ success: true, data: localStore.getMatches(), source: 'local_store' });
  }
});

/**
 * GET /api/teams
 * Returns Ananda and Nalanda squad rosters
 */
router.get('/teams', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');

  const defaultTeams = localStore.getTeams();

  const enrichTeam = (t) => {
    const obj = t.toObject ? t.toObject() : { ...t };
    const sKey = (obj.schoolKey || obj.school || (obj.name && obj.name.toLowerCase().includes('nalanda') ? 'nalanda' : 'ananda')).toLowerCase();
    const fallbackTeam = defaultTeams.find(dt => (dt.schoolKey || dt.school || '').toLowerCase() === sKey) || {};
    
    const rawSquad = (obj.verifiedSquadMembers && obj.verifiedSquadMembers.length > 0)
      ? obj.verifiedSquadMembers
      : (obj.squad && obj.squad.length > 0 ? obj.squad : (fallbackTeam.verifiedSquadMembers || fallbackTeam.squad || []));

    const finalSquad = Array.isArray(rawSquad) && rawSquad.length > 0 ? rawSquad : (fallbackTeam.verifiedSquadMembers || []);

    return {
      ...obj,
      schoolKey: sKey,
      school: sKey,
      name: obj.name || fallbackTeam.name || (sKey === 'ananda' ? 'Ananda College' : 'Nalanda College'),
      motto: obj.motto || fallbackTeam.motto,
      captain: obj.captain || obj.recentCaptain || fallbackTeam.captain,
      viceCaptain: obj.viceCaptain || fallbackTeam.viceCaptain,
      headCoach: obj.headCoach || fallbackTeam.headCoach,
      principal: obj.principal || fallbackTeam.principal,
      verifiedSquadMembers: finalSquad,
      squad: finalSquad,
      cricketHallOfFame: (obj.cricketHallOfFame && obj.cricketHallOfFame.length > 0)
        ? obj.cricketHallOfFame
        : (fallbackTeam.cricketHallOfFame || [])
    };
  };

  if (!isDbConnected()) {
    const teams = defaultTeams.map(enrichTeam);
    const formatted = {};
    teams.forEach(t => { formatted[t.schoolKey] = t; });
    return res.json({ success: true, data: formatted, source: 'local_store' });
  }
  try {
    const teams = await Team.find();
    if (!teams || teams.length === 0) {
      const fbTeams = defaultTeams.map(enrichTeam);
      const formatted = {};
      fbTeams.forEach(t => { formatted[t.schoolKey] = t; });
      return res.json({ success: true, data: formatted, source: 'local_store' });
    }
    const formatted = {};
    teams.forEach(t => {
      const enriched = enrichTeam(t);
      formatted[enriched.schoolKey] = enriched;
    });
    res.json({ success: true, data: formatted, source: 'database' });
  } catch (error) {
    const fbTeams = defaultTeams.map(enrichTeam);
    const formatted = {};
    fbTeams.forEach(t => { formatted[t.schoolKey] = t; });
    res.json({ success: true, data: formatted, source: 'local_store' });
  }
});

/**
 * GET /api/news
 * Returns published news articles
 */
router.get('/news', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');

  if (!isDbConnected()) {
    return res.json({ success: true, data: localStore.getNews(), source: 'local_store' });
  }
  try {
    const news = await News.find({ isPublished: true }).sort({ displayOrder: 1, createdAt: -1 });
    if (!news || news.length === 0) {
      return res.json({ success: true, data: localStore.getNews(), source: 'local_store' });
    }
    res.json({ success: true, data: news, source: 'database' });
  } catch (error) {
    res.json({ success: true, data: localStore.getNews(), source: 'local_store' });
  }
});

/**
 * GET /api/news/:slug
 * Returns single article by slug
 */
router.get('/news/:slug', async (req, res) => {
  if (!isDbConnected()) {
    const fallback = localStore.getNewsArticle(req.params.slug);
    if (fallback) return res.json({ success: true, data: fallback, source: 'local_store' });
    return res.status(404).json({ success: false, message: 'Article not found.' });
  }
  try {
    const article = await News.findOne({ slug: req.params.slug, isPublished: true });
    if (!article) {
      const fallback = localStore.getNewsArticle(req.params.slug);
      if (fallback) return res.json({ success: true, data: fallback, source: 'local_store' });
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }
    res.json({ success: true, data: article, source: 'database' });
  } catch (error) {
    const fallback = localStore.getNewsArticle(req.params.slug);
    if (fallback) return res.json({ success: true, data: fallback, source: 'local_store' });
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/sponsors
 * Returns active sponsors grouped by tier
 */
router.get('/sponsors', async (req, res) => {
  if (!isDbConnected()) {
    return res.json({ success: true, data: localStore.getSponsorsGrouped(), all: localStore.getSponsors(), source: 'local_store' });
  }
  try {
    const sponsors = await Sponsor.find({ isActive: true }).sort({ displayOrder: 1 });
    if (!sponsors || sponsors.length === 0) {
      return res.json({ success: true, data: localStore.getSponsorsGrouped(), all: localStore.getSponsors(), source: 'local_store' });
    }
    const grouped = {
      platinum: sponsors.filter(s => s.tier === 'platinum'),
      gold: sponsors.filter(s => s.tier === 'gold'),
      officialPartners: sponsors.filter(s => s.tier === 'officialPartner' || s.tier === 'silver' || s.tier === 'partner' || !['platinum', 'gold', 'mediaAndBroadcast'].includes(s.tier)),
      mediaAndBroadcast: sponsors.filter(s => s.tier === 'mediaAndBroadcast')
    };
    res.json({ success: true, data: grouped, all: sponsors, source: 'database' });
  } catch (error) {
    res.json({ success: true, data: localStore.getSponsorsGrouped(), all: localStore.getSponsors(), source: 'local_store' });
  }
});

function sortGalleryByRecent(list) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const getYearWeight = (item) => {
      if (!item) return 0;
      const str = String(item.year || '');
      const match = str.match(/\d{4}/);
      if (match) return parseInt(match[0], 10);
      const titleMatch = (item.title || '').match(/\d{4}/);
      if (titleMatch) return parseInt(titleMatch[0], 10);
      const captionMatch = (item.caption || '').match(/\d{4}/);
      if (captionMatch) return parseInt(captionMatch[0], 10);
      if (/archival|vintage|historic|heritage/i.test(str)) return 1900;
      return 0;
    };
    const yA = getYearWeight(a);
    const yB = getYearWeight(b);
    if (yB !== yA) return yB - yA;
    const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (tB !== tA) return tB - tA;
    return 0;
  });
}

/**
 * GET /api/gallery
 * Returns published gallery photos
 */
router.get('/gallery', async (req, res) => {
  if (!isDbConnected()) {
    const { category } = req.query;
    let items = localStore.getGallery();
    if (category && category !== 'all') {
      items = items.filter(g => g.category === category);
    }
    return res.json({ success: true, data: sortGalleryByRecent(items), source: 'local_store' });
  }
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') {
      filter.category = category;
    }

    let items = await Gallery.find(filter).sort({ displayOrder: 1, createdAt: -1 });

    if (!items || items.length === 0) {
      let fb = localStore.getGallery();
      if (category && category !== 'all') {
        fb = fb.filter(g => g.category === category);
      }
      return res.json({ success: true, data: sortGalleryByRecent(fb), source: 'local_store' });
    }

    res.json({ success: true, data: sortGalleryByRecent(items), source: 'database' });
  } catch (error) {
    let fb = localStore.getGallery();
    if (category && category !== 'all') {
      fb = fb.filter(g => g.category === category);
    }
    res.json({ success: true, data: sortGalleryByRecent(fb), source: 'local_store', error: error.message });
  }
});

/**
 * GET /api/gallery/:id
 * Returns single gallery item
 */
router.get('/gallery/:id', async (req, res) => {
  if (!isDbConnected()) {
    const item = localStore.getGallery().find(g => g.id === req.params.id || String(g._id) === String(req.params.id));
    if (item) return res.json({ success: true, data: item, source: 'local_store' });
    return res.status(404).json({ success: false, message: 'Photo not found.' });
  }
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      const fbItem = localStore.getGallery().find(g => g.id === req.params.id || String(g._id) === String(req.params.id));
      if (fbItem) return res.json({ success: true, data: fbItem, source: 'local_store' });
      return res.status(404).json({ success: false, message: 'Photo not found.' });
    }
    res.json({ success: true, data: item, source: 'database' });
  } catch (error) {
    const fbItem = localStore.getGallery().find(g => g.id === req.params.id || String(g._id) === String(req.params.id));
    if (fbItem) return res.json({ success: true, data: fbItem, source: 'local_store' });
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
