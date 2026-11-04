import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { eventConfig as defaultEventConfig } from '../../src/data/event.config.js';
import { sponsorsData as defaultSponsors } from '../../src/data/sponsors.js';
import { newsArticles as defaultNews } from '../../src/data/news.js';
import { teamsData as defaultTeams } from '../../src/data/teams.js';
import { matchCentreData as defaultMatches } from '../../src/data/matches.js';
import { galleryItems as defaultGallery } from '../../src/data/gallery.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

const defaultCategories = [
  { id: "grandstand", code: "grandstand", name: "Grandstand Upper Deck", price: 2500, description: "Panoramic elevated view of the SSC pitch, shaded seating.", availableCount: 500, totalCapacity: 500, maxPerOrder: 10, soldCount: 0, reservedCount: 0, isActive: true },
  { id: "members", code: "members", name: "Members Pavilion Enclosure", price: 5000, description: "Premium clubhouse enclosure with private refreshments and lounge access.", availableCount: 200, totalCapacity: 200, maxPerOrder: 6, soldCount: 0, reservedCount: 0, isActive: true },
  { id: "marquee", code: "marquee", name: "Old Boys Maroons Marquee", price: 4000, description: "Dedicated alumni marquee with commemorative badge and hospitality.", availableCount: 300, totalCapacity: 300, maxPerOrder: 8, soldCount: 0, reservedCount: 0, isActive: true },
  { id: "papare", code: "papare", name: "Party Tent & Papare Enclosure", price: 1500, description: "Direct access to the papare band, dancing terraces, and festival area.", availableCount: 1000, totalCapacity: 1000, maxPerOrder: 10, soldCount: 0, reservedCount: 0, isActive: true }
];

function buildDefaultSponsorsList() {
  const list = [];
  let order = 1;

  (defaultSponsors.platinum || []).forEach(s => {
    list.push({
      _id: `sp_${Date.now()}_${order}`,
      id: `sp_${Date.now()}_${order}`,
      name: s.name,
      tier: 'platinum',
      title: s.title || 'Platinum Sponsor',
      role: s.role || '',
      logo: s.logo,
      website: s.website || '#',
      description: s.description || '',
      displayOrder: order++,
      isActive: true,
      createdAt: new Date().toISOString()
    });
  });

  (defaultSponsors.gold || []).forEach(s => {
    list.push({
      _id: `sp_${Date.now()}_${order}`,
      id: `sp_${Date.now()}_${order}`,
      name: s.name,
      tier: 'gold',
      title: s.title || 'Official Gold Partner',
      role: s.role || '',
      logo: s.logo,
      website: s.website || '#',
      description: s.description || '',
      displayOrder: order++,
      isActive: true,
      createdAt: new Date().toISOString()
    });
  });

  (defaultSponsors.officialPartners || []).forEach(s => {
    list.push({
      _id: `sp_${Date.now()}_${order}`,
      id: `sp_${Date.now()}_${order}`,
      name: s.name,
      tier: 'officialPartner',
      title: s.title || '',
      role: s.role || 'Official Partner',
      logo: s.logo,
      website: s.website || '#',
      description: s.description || '',
      displayOrder: order++,
      isActive: true,
      createdAt: new Date().toISOString()
    });
  });

  return list;
}

function buildDefaultTeamsList() {
  const ananda = defaultTeams?.ananda || {};
  const nalanda = defaultTeams?.nalanda || {};

  return [
    {
      school: 'ananda',
      schoolKey: 'ananda',
      name: ananda.name || 'Ananda College',
      sinhalaName: ananda.sinhalaName || 'ආනන්ද විද්‍යාලය',
      founded: ananda.founded || 1886,
      established: ananda.founded || 1886,
      motto: ananda.motto || 'Appamado Amato Padam (Heedfulness is the path to Deathlessness)',
      colours: ananda.colours || ['#6b1424', '#d4af37'],
      colourNames: ananda.colourNames || 'Maroon and Gold',
      crest: ananda.crest || '/assets/images/schools/ananda_crest.svg',
      flag: ananda.flag || '/assets/images/branding/ananda_flag.jpg',
      captain: ananda.recentCaptain || ananda.captain || 'Ashinsha Nainayake (95th Encounter)',
      recentCaptain: ananda.recentCaptain || ananda.captain || 'Ashinsha Nainayake (95th Encounter)',
      viceCaptain: ananda.viceCaptain || 'Dinada Athalage',
      headCoach: ananda.headCoach || 'Dinesh Chandimal',
      principal: ananda.principal || 'Mr. Lal Dissanayake',
      bigMatchWins: ananda.bigMatchWins ?? 12,
      oneDayWins: ananda.oneDayWins ?? 26,
      overview: ananda.overview || 'Established in 1886, Ananda College is the pioneer Buddhist educational institution in Sri Lanka.',
      verifiedSquadMembers: Array.isArray(ananda.verifiedSquadMembers) ? [...ananda.verifiedSquadMembers] : [],
      squad: Array.isArray(ananda.verifiedSquadMembers) ? [...ananda.verifiedSquadMembers] : [],
      cricketHallOfFame: Array.isArray(ananda.cricketHallOfFame) ? [...ananda.cricketHallOfFame] : []
    },
    {
      school: 'nalanda',
      schoolKey: 'nalanda',
      name: nalanda.name || 'Nalanda College',
      sinhalaName: nalanda.sinhalaName || 'නාලන්දා විද්‍යාලය',
      founded: nalanda.founded || 1924,
      established: nalanda.founded || 1924,
      motto: nalanda.motto || 'Apadana Sobhini Panna (Wisdom Beautifies Character)',
      colours: nalanda.colours || ['#6b1424', '#c0c0c0'],
      colourNames: nalanda.colourNames || 'Maroon and Silver',
      crest: nalanda.crest || '/assets/images/schools/nalanda_crest.png',
      flag: nalanda.flag || '/assets/images/branding/nalanda_flag.jpg',
      captain: nalanda.recentCaptain || nalanda.captain || 'Sadew Samarasinghe (95th Encounter)',
      recentCaptain: nalanda.recentCaptain || nalanda.captain || 'Sadew Samarasinghe (95th Encounter)',
      viceCaptain: nalanda.viceCaptain || 'Nadul Jayalath',
      headCoach: nalanda.headCoach || 'Shantha Kalavitigoda',
      principal: nalanda.principal || 'Mr. Iran Champika Silva',
      bigMatchWins: nalanda.bigMatchWins ?? 7,
      oneDayWins: nalanda.oneDayWins ?? 15,
      overview: nalanda.overview || 'Established in 1924 under the stewardship of P. de S. Kularatne, Nalanda College arose as a sister school to Ananda.',
      verifiedSquadMembers: Array.isArray(nalanda.verifiedSquadMembers) ? [...nalanda.verifiedSquadMembers] : [],
      squad: Array.isArray(nalanda.verifiedSquadMembers) ? [...nalanda.verifiedSquadMembers] : [],
      cricketHallOfFame: Array.isArray(nalanda.cricketHallOfFame) ? [...nalanda.cricketHallOfFame] : []
    }
  ];
}

let store = null;

function initStore() {
  if (store) return store;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(STORE_FILE)) {
    try {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      store = JSON.parse(raw);
      return store;
    } catch (e) {
      console.warn('⚠️ Could not parse existing store.json, re-initializing from defaults.');
    }
  }

  // Create initial state
  store = {
    event: { ...defaultEventConfig },
    sponsors: buildDefaultSponsorsList(),
    news: (defaultNews || []).map((n, i) => {
      let pubDate = new Date().toISOString();
      if (n.date) {
        try {
          const cleaned = String(n.date).replace(/(\d+)(st|nd|rd|th)/i, '$1');
          const d = new Date(cleaned);
          if (!isNaN(d.getTime())) pubDate = d.toISOString();
        } catch (e) {}
      }
      return {
        _id: n.id || `news_${i + 1}`,
        id: n.id || `news_${i + 1}`,
        slug: n.id || `article-${i + 1}`,
        title: n.title,
        summary: n.excerpt || n.summary || '',
        content: n.content || n.fullArticle || n.excerpt || '',
        category: n.category || 'dispatch',
        author: n.author || 'Maroons Editorial Bureau',
        coverImage: n.image || '',
        isFeatured: Boolean(n.isFeatured),
        isPublished: true,
        displayOrder: i + 1,
        publishedAt: pubDate
      };
    }),
    teams: buildDefaultTeamsList(),
    matches: defaultMatches || {},
    gallery: (defaultGallery || []).map((g, i) => {
      const img = g.image || g.imageUrl || g.src || '';
      return {
        _id: `gal_${i + 1}`,
        id: `gal_${i + 1}`,
        title: g.title,
        category: g.category || 'matches',
        categoryLabel: g.categoryLabel || 'Match Action',
        year: g.year || '2025',
        image: img,
        imageUrl: img,
        caption: g.caption || g.alt || g.title,
        location: g.location || 'Sinhalese Sports Club (SSC) Grounds',
        displayOrder: i + 1,
        isFeatured: true,
        isActive: true
      };
    }),
    tickets: [...defaultCategories],
    inquiries: [],
    orders: []
  };

  saveStore();
  return store;
}

function saveStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('❌ Failed to save store.json:', err.message);
  }
}

export const localStore = {
  reload() {
    store = null;
    return initStore();
  },

  resetTicketCounts() {
    const s = initStore();
    (s.tickets || []).forEach(cat => {
      cat.soldCount = 0;
      cat.reservedCount = 0;
      const total = Number(cat.totalCapacity) || 500;
      cat.availableCount = total;
    });
    s.orders = [];
    saveStore();
    return s.tickets;
  },

  getStore() {
    return initStore();
  },

  getEvent() {
    return initStore().event;
  },

  updateEvent(data) {
    const s = initStore();
    s.event = { ...s.event, ...data, updatedAt: new Date().toISOString() };
    saveStore();
    return s.event;
  },

  getSponsors() {
    return initStore().sponsors || [];
  },

  getSponsorsGrouped() {
    const sponsors = (initStore().sponsors || []).filter(s => s.isActive !== false);
    return {
      platinum: sponsors.filter(s => s.tier === 'platinum'),
      gold: sponsors.filter(s => s.tier === 'gold'),
      officialPartners: sponsors.filter(s => s.tier === 'officialPartner' || s.tier === 'silver' || s.tier === 'partner' || !['platinum', 'gold', 'mediaAndBroadcast'].includes(s.tier)),
      mediaAndBroadcast: sponsors.filter(s => s.tier === 'mediaAndBroadcast')
    };
  },

  addSponsor(data) {
    const s = initStore();
    const id = `sp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newSponsor = {
      _id: id,
      id,
      name: data.name,
      tier: data.tier || 'officialPartner',
      title: data.title || '',
      role: data.role || '',
      logo: data.logo,
      website: data.website || '#',
      description: data.description || '',
      displayOrder: Number(data.displayOrder) || s.sponsors.length + 1,
      isActive: data.isActive !== false,
      createdAt: new Date().toISOString()
    };
    s.sponsors.push(newSponsor);
    saveStore();
    return newSponsor;
  },

  updateSponsor(id, updates) {
    const s = initStore();
    const idx = s.sponsors.findIndex(sp => String(sp._id) === String(id) || String(sp.id) === String(id) || sp.name === id);
    if (idx === -1) return null;
    s.sponsors[idx] = { ...s.sponsors[idx], ...updates, updatedAt: new Date().toISOString() };
    saveStore();
    return s.sponsors[idx];
  },

  deleteSponsor(id) {
    const s = initStore();
    const lenBefore = s.sponsors.length;
    s.sponsors = s.sponsors.filter(sp => String(sp._id) !== String(id) && String(sp.id) !== String(id) && sp.name !== id);
    saveStore();
    return s.sponsors.length < lenBefore;
  },

  getNews() {
    return initStore().news || [];
  },

  getNewsArticle(idOrSlug) {
    return (initStore().news || []).find(n => n.id === idOrSlug || n.slug === idOrSlug || String(n._id) === String(idOrSlug));
  },

  addNews(data) {
    const s = initStore();
    const id = `news_${Date.now()}`;
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newArticle = {
      _id: id,
      id,
      slug,
      title: data.title,
      summary: data.summary || data.excerpt || '',
      content: data.content || '',
      category: data.category || 'dispatch',
      author: data.author || 'Maroons Editorial Bureau',
      coverImage: data.coverImage || data.image || '',
      isFeatured: Boolean(data.isFeatured),
      isPublished: data.isPublished !== false,
      displayOrder: Number(data.displayOrder) || s.news.length + 1,
      publishedAt: new Date().toISOString()
    };
    s.news.unshift(newArticle);
    saveStore();
    return newArticle;
  },

  updateNews(idOrSlug, updates) {
    const s = initStore();
    const idx = s.news.findIndex(n => n.id === idOrSlug || n.slug === idOrSlug || String(n._id) === String(idOrSlug));
    if (idx === -1) return null;
    s.news[idx] = { ...s.news[idx], ...updates, updatedAt: new Date().toISOString() };
    saveStore();
    return s.news[idx];
  },

  deleteNews(idOrSlug) {
    const s = initStore();
    s.news = s.news.filter(n => n.id !== idOrSlug && n.slug !== idOrSlug && String(n._id) !== String(idOrSlug));
    saveStore();
    return true;
  },

  getTickets() {
    return initStore().tickets || [];
  },

  addTicket(data) {
    const s = initStore();
    const id = data.code || `cat_${Date.now()}`;
    const newCat = {
      _id: id,
      id,
      code: data.code || id,
      name: data.name,
      price: Number(data.price),
      description: data.description || '',
      availableCount: Number(data.availableCount) || 100,
      totalCapacity: Number(data.totalCapacity) || 100,
      maxPerOrder: Number(data.maxPerOrder) || 10,
      soldCount: 0,
      reservedCount: 0,
      isActive: data.isActive !== false
    };
    s.tickets.push(newCat);
    saveStore();
    return newCat;
  },

  updateTicket(id, updates) {
    const s = initStore();
    const idx = s.tickets.findIndex(t => String(t._id) === String(id) || String(t.id) === String(id) || t.code === id);
    if (idx === -1) return null;
    const existing = s.tickets[idx];
    const totalCapacity = updates.totalCapacity !== undefined ? Math.max(0, Number(updates.totalCapacity)) : (Number(existing.totalCapacity) || 0);
    const soldCount = updates.soldCount !== undefined ? Math.max(0, Number(updates.soldCount)) : (Number(existing.soldCount) || 0);
    const reservedCount = updates.reservedCount !== undefined ? Math.max(0, Number(updates.reservedCount)) : (Number(existing.reservedCount) || 0);
    const availableCount = Math.max(0, totalCapacity - (soldCount + reservedCount));

    s.tickets[idx] = { 
      ...existing, 
      ...updates,
      totalCapacity,
      soldCount,
      reservedCount,
      availableCount
    };
    saveStore();
    return s.tickets[idx];
  },

  deleteTicket(id) {
    const s = initStore();
    s.tickets = s.tickets.filter(t => String(t._id) !== String(id) && String(t.id) !== String(id) && t.code !== id);
    saveStore();
    return true;
  },

  reserveTicketQuota(categoryIdOrCode, qty) {
    const s = initStore();
    const count = Number(qty) || 0;
    const cat = (s.tickets || []).find(t => 
      t.id === categoryIdOrCode || 
      t.code === categoryIdOrCode || 
      String(t._id) === String(categoryIdOrCode)
    );
    if (cat) {
      cat.reservedCount = (cat.reservedCount || 0) + count;
      const total = Number(cat.totalCapacity) || 500;
      const sold = Number(cat.soldCount) || 0;
      const reserved = Number(cat.reservedCount) || 0;
      cat.availableCount = Math.max(0, total - (sold + reserved));
      saveStore();
      return cat;
    }
    return null;
  },

  deductTicketQuota(categoryIdOrCode, qty) {
    const s = initStore();
    const count = Number(qty) || 0;
    const cat = (s.tickets || []).find(t => 
      t.id === categoryIdOrCode || 
      t.code === categoryIdOrCode || 
      String(t._id) === String(categoryIdOrCode)
    );
    if (cat) {
      cat.soldCount = (cat.soldCount || 0) + count;
      cat.reservedCount = Math.max(0, (cat.reservedCount || 0) - count);
      const total = Number(cat.totalCapacity) || 500;
      const sold = Number(cat.soldCount) || 0;
      const reserved = Number(cat.reservedCount) || 0;
      // REDUCE FROM TOTAL TICKETS QUANTITY:
      cat.availableCount = Math.max(0, total - (sold + reserved));
      saveStore();
      return cat;
    }
    return null;
  },

  restoreTicketQuota(categoryIdOrCode, qty, wasSold = false) {
    const s = initStore();
    const count = Number(qty) || 0;
    const cat = (s.tickets || []).find(t => 
      t.id === categoryIdOrCode || 
      t.code === categoryIdOrCode || 
      String(t._id) === String(categoryIdOrCode)
    );
    if (cat) {
      if (wasSold) {
        cat.soldCount = Math.max(0, (cat.soldCount || 0) - count);
      } else {
        cat.reservedCount = Math.max(0, (cat.reservedCount || 0) - count);
      }
      const total = Number(cat.totalCapacity) || 500;
      const sold = Number(cat.soldCount) || 0;
      const reserved = Number(cat.reservedCount) || 0;
      cat.availableCount = Math.max(0, total - (sold + reserved));
      saveStore();
      return cat;
    }
    return null;
  },

  getTeams() {
    const s = initStore();
    if (!Array.isArray(s.teams) || s.teams.length === 0) {
      s.teams = buildDefaultTeamsList();
      saveStore();
    } else {
      // Auto-heal any team missing full squad or leadership
      const defaults = buildDefaultTeamsList();
      let modified = false;
      defaults.forEach(def => {
        let t = s.teams.find(tm => (tm.schoolKey || tm.school)?.toLowerCase() === def.schoolKey);
        if (!t) {
          s.teams.push(def);
          modified = true;
        } else {
          t.schoolKey = def.schoolKey;
          t.school = def.schoolKey;
          if (!t.name) { t.name = def.name; modified = true; }
          if (!t.motto) { t.motto = def.motto; modified = true; }
          if (!t.principal) { t.principal = def.principal; modified = true; }
          if (!t.headCoach) { t.headCoach = def.headCoach; modified = true; }
          if (!t.captain) { t.captain = def.captain; modified = true; }
          if (!t.recentCaptain) { t.recentCaptain = def.recentCaptain; modified = true; }
          if (!t.viceCaptain) { t.viceCaptain = def.viceCaptain; modified = true; }
          if (t.bigMatchWins === undefined) { t.bigMatchWins = def.bigMatchWins; modified = true; }
          if (t.oneDayWins === undefined) { t.oneDayWins = def.oneDayWins; modified = true; }
          
          const sq = t.verifiedSquadMembers || t.squad;
          if (!Array.isArray(sq) || sq.length === 0) {
            t.verifiedSquadMembers = [...def.verifiedSquadMembers];
            t.squad = [...def.verifiedSquadMembers];
            modified = true;
          } else {
            t.verifiedSquadMembers = sq;
            t.squad = sq;
          }

          if (!Array.isArray(t.cricketHallOfFame) || t.cricketHallOfFame.length === 0) {
            t.cricketHallOfFame = [...(def.cricketHallOfFame || [])];
            modified = true;
          }
        }
      });
      if (modified) {
        saveStore();
      }
    }
    return s.teams;
  },

  updateTeam(school, updates) {
    const s = initStore();
    const clean = String(school || '').toLowerCase();
    let idx = s.teams.findIndex(t => (t.schoolKey || t.school)?.toLowerCase() === clean);
    if (idx === -1) {
      const newTeam = { school: clean, schoolKey: clean, ...updates };
      s.teams.push(newTeam);
      idx = s.teams.length - 1;
    } else {
      s.teams[idx] = { 
        ...s.teams[idx], 
        ...updates, 
        school: clean, 
        schoolKey: clean,
        verifiedSquadMembers: updates.verifiedSquadMembers || updates.squad || s.teams[idx].verifiedSquadMembers || [],
        squad: updates.verifiedSquadMembers || updates.squad || s.teams[idx].squad || [],
        cricketHallOfFame: updates.cricketHallOfFame !== undefined ? updates.cricketHallOfFame : (s.teams[idx].cricketHallOfFame || [])
      };
    }
    saveStore();
    return s.teams[idx];
  },

  getMatches() {
    const s = initStore();
    if (!s.matches || typeof s.matches !== 'object') {
      s.matches = defaultMatches || { featuredMatches: [] };
      saveStore();
    }
    return s.matches;
  },

  updateMatch(id, updates) {
    const s = initStore();
    let list = Array.isArray(s.matches) ? s.matches : (s.matches?.featuredMatches || []);
    let found = false;

    list = list.map(m => {
      const mId = m._id || m.id || m.matchId;
      if (mId === id || String(m._id) === String(id) || String(m.id) === String(id)) {
        found = true;
        return { ...m, ...updates };
      }
      return m;
    });

    if (!found) {
      list.push({ id, ...updates });
    }

    if (Array.isArray(s.matches)) {
      s.matches = list;
    } else {
      s.matches.featuredMatches = list;
    }

    saveStore();
    return list.find(m => (m._id || m.id || m.matchId) === id) || updates;
  },

  addMatch(matchData) {
    const s = initStore();
    let list = Array.isArray(s.matches) ? s.matches : (s.matches?.featuredMatches || []);
    const newId = matchData.id || matchData.matchId || `bom-match-${Date.now()}`;
    const newMatch = {
      _id: newId,
      id: newId,
      matchId: newId,
      status: matchData.status || 'UPCOMING',
      ...matchData
    };
    list.unshift(newMatch);

    if (Array.isArray(s.matches)) {
      s.matches = list;
    } else {
      s.matches.featuredMatches = list;
    }

    saveStore();
    return newMatch;
  },

  deleteMatch(id) {
    const s = initStore();
    let list = Array.isArray(s.matches) ? s.matches : (s.matches?.featuredMatches || []);
    const initialLen = list.length;
    list = list.filter(m => (m._id || m.id || m.matchId) !== id && String(m._id) !== String(id) && String(m.id) !== String(id));

    if (Array.isArray(s.matches)) {
      s.matches = list;
    } else {
      s.matches.featuredMatches = list;
    }

    saveStore();
    return list.length < initialLen;
  },

  getGallery() {
    const s = initStore();
    if (!Array.isArray(s.gallery) || s.gallery.length === 0 || (!s.gallery[0].image && !s.gallery[0].imageUrl)) {
      s.gallery = (defaultGallery || []).map((g, i) => {
        const img = g.image || g.imageUrl || g.src || '';
        return {
          _id: `gal_${i + 1}`,
          id: `gal_${i + 1}`,
          title: g.title,
          category: g.category || 'matches',
          categoryLabel: g.categoryLabel || 'Match Action',
          year: g.year || '2025',
          image: img,
          imageUrl: img,
          caption: g.caption || g.alt || g.title,
          location: g.location || 'Sinhalese Sports Club (SSC) Grounds',
          displayOrder: i + 1,
          isFeatured: true,
          isActive: true
        };
      });
      saveStore();
    }
    return s.gallery || [];
  },

  addGallery(data) {
    const s = initStore();
    const id = `gal_${Date.now()}`;
    const img = data.image || data.imageUrl || data.src || '';
    const item = {
      _id: id,
      id,
      title: data.title,
      category: data.category || 'matches',
      categoryLabel: data.categoryLabel || (data.category === 'atmosphere' ? 'Crowd & Atmosphere' : data.category === 'ceremonies' ? 'Ceremonies' : data.category === 'legends' ? 'Legends & Heritage' : 'Match Action'),
      year: String(data.year || '2025'),
      image: img,
      imageUrl: img,
      caption: data.caption || data.title,
      location: data.location || 'Sinhalese Sports Club (SSC) Grounds',
      displayOrder: Number(data.displayOrder) || s.gallery.length + 1,
      isFeatured: Boolean(data.isFeatured),
      isActive: data.isActive !== false
    };
    s.gallery.push(item);
    saveStore();
    return item;
  },

  updateGallery(id, updates) {
    const s = initStore();
    const idx = s.gallery.findIndex(g => String(g._id) === String(id) || String(g.id) === String(id));
    if (idx === -1) return null;
    const img = updates.image || updates.imageUrl || updates.src || s.gallery[idx].image || s.gallery[idx].imageUrl || '';
    s.gallery[idx] = { 
      ...s.gallery[idx], 
      ...updates,
      image: img,
      imageUrl: img
    };
    saveStore();
    return s.gallery[idx];
  },

  deleteGallery(id) {
    const s = initStore();
    s.gallery = s.gallery.filter(g => String(g._id) !== String(id) && String(g.id) !== String(id));
    saveStore();
    return true;
  },

  getInquiries(filter = {}) {
    let list = initStore().inquiries || [];
    if (filter.status && filter.status !== 'ALL') {
      list = list.filter(i => i.status === filter.status);
    }
    return list;
  },

  addInquiry(data) {
    const s = initStore();
    const id = data._id || data.id || `inq_${Date.now()}`;
    const newInquiry = {
      _id: id,
      id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      category: data.category || 'general',
      subject: data.subject || '',
      message: data.message,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    s.inquiries.unshift(newInquiry);
    saveStore();
    return newInquiry;
  },

  updateInquiry(id, updates) {
    const s = initStore();
    const idx = s.inquiries.findIndex(i => String(i._id) === String(id) || String(i.id) === String(id));
    if (idx === -1) return null;
    s.inquiries[idx] = { ...s.inquiries[idx], ...updates };
    saveStore();
    return s.inquiries[idx];
  },

  deleteInquiry(id) {
    const s = initStore();
    s.inquiries = s.inquiries.filter(i => String(i._id) !== String(id) && String(i.id) !== String(id));
    saveStore();
    return true;
  },

  getOrders() {
    const s = initStore();
    return s.orders || [];
  },

  addOrder(data) {
    const s = initStore();
    if (!Array.isArray(s.orders)) {
      s.orders = [];
    }
    const orderRef = data.orderRef || data.orderNumber || `BOM-97-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      _id: data._id || `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      id: data.id || data._id || orderRef,
      orderRef,
      orderNumber: data.orderNumber || orderRef,
      buyerName: data.buyerName || '',
      buyerEmail: data.buyerEmail || '',
      buyerPhone: data.buyerPhone || '',
      schoolAffiliation: data.schoolAffiliation || 'neutral',
      matchFormat: data.matchFormat || '3day',
      categoryId: data.categoryId || '',
      categoryCode: data.categoryCode || '',
      categoryName: data.categoryName || '',
      quantity: Number(data.quantity) || 1,
      unitPrice: Number(data.unitPrice) || 0,
      totalAmount: Number(data.totalAmount) || 0,
      currency: data.currency || 'LKR',
      status: data.status || 'PENDING',
      qrCodeData: data.qrCodeData || null,
      payherePaymentId: data.payherePaymentId || '',
      payhereMethod: data.payhereMethod || '',
      payhereStatusCode: data.payhereStatusCode || null,
      verificationNotes: data.verificationNotes || '',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
    const existingIdx = s.orders.findIndex(o => o.orderRef === orderRef || o.orderNumber === orderRef);
    if (existingIdx !== -1) {
      s.orders[existingIdx] = { ...s.orders[existingIdx], ...newOrder, updatedAt: new Date().toISOString() };
    } else {
      s.orders.unshift(newOrder);
    }
    saveStore();
    return newOrder;
  },

  updateOrder(id, updates) {
    const s = initStore();
    if (!Array.isArray(s.orders)) {
      s.orders = [];
    }
    const cleanId = String(id || '').trim();
    const idx = s.orders.findIndex(o => 
      o.orderRef === cleanId || 
      o.orderNumber === cleanId || 
      String(o._id) === cleanId || 
      String(o.id) === cleanId
    );
    if (idx === -1) {
      const newOrder = {
        _id: `ord_${Date.now()}`,
        id: cleanId,
        orderRef: cleanId,
        orderNumber: cleanId,
        ...updates,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      s.orders.unshift(newOrder);
      saveStore();
      return newOrder;
    }
    s.orders[idx] = { 
      ...s.orders[idx], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    saveStore();
    return s.orders[idx];
  },

  deleteOrder(id) {
    const s = initStore();
    if (!Array.isArray(s.orders)) return true;
    const cleanId = String(id || '').trim();
    s.orders = s.orders.filter(o => 
      o.orderRef !== cleanId && 
      o.orderNumber !== cleanId && 
      String(o._id) !== cleanId && 
      String(o.id) !== cleanId
    );
    saveStore();
    return true;
  }
};
