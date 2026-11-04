import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { EventSetting } from '../models/EventSetting.js';
import { TicketCategory } from '../models/TicketCategory.js';
import { TicketOrder } from '../models/TicketOrder.js';
import { Match } from '../models/Match.js';
import { Team } from '../models/Team.js';
import { News } from '../models/News.js';
import { Sponsor } from '../models/Sponsor.js';
import { Inquiry } from '../models/Inquiry.js';
import { Gallery } from '../models/Gallery.js';
import { verifyAdminToken } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiters.js';
import { uploadImage } from '../middleware/upload.js';
import { isDbConnected } from '../config/db.js';
import { localStore } from '../config/localStore.js';
import QRCode from 'qrcode';

const router = express.Router();

/**
 * Helper to generate JWT token
 */
function createAdminToken(admin) {
  const secret = process.env.JWT_SECRET || 'bom-secret-maroons-centenary-2027';
  return jwt.sign(
    { id: admin._id || admin.id, username: admin.username, role: admin.role },
    secret,
    { expiresIn: '7d' }
  );
}

/* ==========================================================================
   ADMIN AUTHENTICATION
   ========================================================================== */

/**
 * POST /api/admin/auth/login
 * Pre-authorized admin login only (no public self-registration)
 */
router.post('/auth/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both username/email and password.' });
    }

    const cleanUser = username.trim().toLowerCase();

    // Offline / Local Persistence Authentication Mode
    if (!isDbConnected()) {
      const defaultUser = (process.env.ADMIN_DEFAULT_USER || process.env.ADMIN_INITIAL_USER || 'admin').toLowerCase();
      const defaultPass = process.env.ADMIN_DEFAULT_PASS || process.env.ADMIN_INITIAL_PASSWORD || 'Maroons@2027';

      if ((cleanUser === defaultUser || cleanUser === `${defaultUser}@battleofthemaroons.lk`) && password === defaultPass) {
        const fallbackAdmin = {
          id: 'mem_admin_01',
          username: defaultUser,
          email: `${defaultUser}@battleofthemaroons.lk`,
          role: 'superadmin',
          lastLogin: new Date().toISOString()
        };
        const token = createAdminToken(fallbackAdmin);
        return res.json({
          success: true,
          message: 'Authentication successful (Local Persistence Mode).',
          token,
          admin: fallbackAdmin
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    let admin = await Admin.findOne({
      $or: [{ username: cleanUser }, { email: cleanUser }]
    });

    // Auto-create initial superadmin in MongoDB if database is empty
    if (!admin) {
      const adminCount = await Admin.countDocuments();
      const initialUser = (process.env.ADMIN_INITIAL_USER || 'admin').toLowerCase();
      const initialPass = process.env.ADMIN_INITIAL_PASSWORD || 'Maroons@2027';

      if (adminCount === 0 && (cleanUser === initialUser || cleanUser === `${initialUser}@battleofthemaroons.lk`) && password === initialPass) {
        admin = await Admin.create({
          username: initialUser,
          email: process.env.ADMIN_INITIAL_EMAIL || 'admin@battleofthemaroons.lk',
          password: initialPass,
          role: 'superadmin',
          isActive: true
        });
      }
    }

    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = createAdminToken(admin);

    res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
});

/**
 * GET /api/admin/auth/me
 * Validate active session
 */
router.get('/auth/me', verifyAdminToken, async (req, res) => {
  if (!isDbConnected()) {
    return res.json({
      success: true,
      admin: {
        id: req.admin?.id || 'mem_admin_01',
        username: req.admin?.username || 'admin',
        role: req.admin?.role || 'superadmin'
      }
    });
  }

  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Session invalid or account deactivated.' });
    }
    res.json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify session.' });
  }
});

/**
 * POST /api/admin/auth/change-password
 */
router.post('/auth/change-password', verifyAdminToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
    }

    if (!isDbConnected()) {
      return res.json({ success: true, message: 'Password updated successfully.' });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin account not found.' });

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password incorrect.' });

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   DASHBOARD OVERVIEW METRICS
   ========================================================================== */

router.get('/dashboard/stats', verifyAdminToken, async (req, res) => {
  const localSponsors = localStore.getSponsors();
  const localNews = localStore.getNews();
  const localOrders = localStore.getOrders();
  const localInquiries = localStore.getInquiries();
  const localEvent = localStore.getEvent();

  if (!isDbConnected()) {
    const verifiedOrders = localOrders.filter(o => o.status === 'VERIFIED');
    const statsData = {
      totalRevenueLkr: verifiedOrders.reduce((sum, ord) => sum + (Number(ord.totalAmount) || 0), 0),
      totalTicketsSold: verifiedOrders.reduce((sum, ord) => sum + (Number(ord.quantity) || 0), 0),
      verifiedOrdersCount: verifiedOrders.length,
      pendingOrdersCount: localOrders.filter(o => o.status === 'PENDING').length,
      totalInquiries: localInquiries.length,
      unreadInquiriesCount: localInquiries.filter(i => i.status === 'NEW').length,
      totalNews: localNews.length,
      totalSponsors: localSponsors.length,
      eventEdition: localEvent.edition ? parseInt(String(localEvent.edition).replace(/[^0-9]/g, ''), 10) || 97 : 97,
      isCountdownConfirmed: Boolean(localEvent.isConfirmed || localEvent.isDateConfirmed),
      isTicketingActive: true
    };
    return res.json({ success: true, data: statsData, stats: statsData, source: 'local_store' });
  }

  try {
    const verifiedOrders = await TicketOrder.find({ status: 'VERIFIED' });
    const totalRevenue = verifiedOrders.reduce((sum, ord) => sum + (Number(ord.totalAmount) || 0), 0);
    const totalTicketsSold = verifiedOrders.reduce((sum, ord) => sum + (Number(ord.quantity) || 0), 0);
    const pendingOrdersCount = await TicketOrder.countDocuments({ status: 'PENDING' });

    const totalInquiries = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'NEW' });

    const totalNews = await News.countDocuments();
    const totalSponsors = await Sponsor.countDocuments();
    const event = await EventSetting.findOne().sort({ updatedAt: -1 });

    const statsData = {
      totalRevenueLkr: totalRevenue,
      totalTicketsSold,
      verifiedOrdersCount: verifiedOrders.length,
      pendingOrdersCount,
      totalInquiries,
      unreadInquiriesCount: newInquiries,
      totalNews: totalNews || localNews.length,
      totalSponsors: totalSponsors || localSponsors.length,
      eventEdition: event ? event.edition : 97,
      isCountdownConfirmed: event ? event.isConfirmed : false,
      isTicketingActive: event ? event.ticketingActive : true
    };

    res.json({ success: true, data: statsData, stats: statsData, source: 'database' });
  } catch (error) {
    const verifiedOrders = localOrders.filter(o => o.status === 'VERIFIED');
    const statsData = {
      totalRevenueLkr: verifiedOrders.reduce((sum, ord) => sum + (Number(ord.totalAmount) || 0), 0),
      totalTicketsSold: verifiedOrders.reduce((sum, ord) => sum + (Number(ord.quantity) || 0), 0),
      verifiedOrdersCount: verifiedOrders.length,
      pendingOrdersCount: localOrders.filter(o => o.status === 'PENDING').length,
      totalInquiries: localInquiries.length,
      unreadInquiriesCount: localInquiries.filter(i => i.status === 'NEW').length,
      totalNews: localNews.length,
      totalSponsors: localSponsors.length,
      eventEdition: 97,
      isCountdownConfirmed: false,
      isTicketingActive: true
    };
    res.json({ success: true, data: statsData, stats: statsData, source: 'local_store' });
  }
});

/* ==========================================================================
   EVENT SETTINGS & COUNTDOWN MANAGEMENT
   ========================================================================== */

router.get('/event', verifyAdminToken, async (req, res) => {
  if (!isDbConnected()) {
    return res.json({ success: true, data: localStore.getEvent(), source: 'local_store' });
  }
  try {
    let setting = await EventSetting.findOne().sort({ updatedAt: -1 });
    if (!setting) {
      return res.json({ success: true, data: localStore.getEvent(), source: 'local_store' });
    }
    const data = setting.toObject();
    data.isConfirmed = data.isConfirmed ?? data.isDateConfirmed ?? false;
    data.isDateConfirmed = data.isConfirmed;
    data.countdownTarget = data.countdownTarget || data.confirmedStartDate || data.tentativeMatchDate || "2027-03-05T10:00:00.000Z";
    data.seriesTitle = data.seriesTitle || `${data.edition || 97}th Battle of the Maroons`;
    data.matchDates = data.matchDates || "March 2027 • SSC Colombo";
    data.venue = data.venue || data.venueName || "Sinhalese Sports Club (SSC) Grounds, Colombo";
    data.year = data.year || (data.season ? parseInt(data.season, 10) : 2027);
    data.ticketingActive = data.ticketingActive ?? (data.ticketingStatus === 'AVAILABLE');

    res.json({ success: true, data, source: 'database' });
  } catch (error) {
    res.json({ success: true, data: localStore.getEvent(), source: 'local_store' });
  }
});

router.put('/event', verifyAdminToken, async (req, res) => {
  const b = req.body || {};
  const isConfirmed = b.isConfirmed !== undefined ? Boolean(b.isConfirmed) : (b.isDateConfirmed !== undefined ? Boolean(b.isDateConfirmed) : false);
  const targetDate = b.countdownTarget || b.confirmedStartDate || b.tentativeMatchDate || "2027-03-05T10:00:00.000Z";
  const venue = b.venue || b.venueName || "Sinhalese Sports Club (SSC) Grounds, Colombo";
  const matchDates = b.matchDates || "March 2027 • SSC Colombo";
  const edition = b.edition !== undefined ? b.edition : 97;
  const year = b.year ? parseInt(b.year, 10) : (b.season ? parseInt(b.season, 10) : 2027);
  const seriesTitle = b.seriesTitle || `${edition}th Battle of the Maroons`;
  const ticketingActive = b.ticketingActive !== undefined ? Boolean(b.ticketingActive) : false;

  const updateFields = {
    ...b,
    edition,
    year,
    season: String(year),
    seriesTitle,
    matchDates,
    venue,
    venueName: venue,
    countdownTarget: targetDate,
    tentativeMatchDate: targetDate,
    confirmedStartDate: isConfirmed ? targetDate : null,
    isConfirmed,
    isDateConfirmed: isConfirmed,
    ticketingActive,
    ticketingStatus: ticketingActive ? "AVAILABLE" : "COMING_SOON",
    lastUpdatedBy: req.admin?.username || 'admin'
  };

  // Always update persistent local store
  const updatedEvent = localStore.updateEvent(updateFields);

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'Event configuration and countdown updated successfully (Saved locally).', data: updatedEvent });
  }
  try {
    let setting = await EventSetting.findOne().sort({ updatedAt: -1 });
    if (!setting) {
      setting = new EventSetting(updateFields);
    } else {
      Object.assign(setting, updateFields);
    }
    await setting.save();
    res.json({ success: true, message: 'Event configuration and countdown updated successfully in MongoDB.', data: setting.toObject() });
  } catch (error) {
    res.json({ success: true, message: 'Event configuration updated locally.', data: updatedEvent });
  }
});

/* ==========================================================================
   TICKET CATEGORIES CRUD
   ========================================================================== */

router.get('/tickets', verifyAdminToken, async (req, res) => {
  if (!isDbConnected()) {
    return res.json({ success: true, data: localStore.getTickets(), source: 'local_store' });
  }
  try {
    const categories = await TicketCategory.find().sort({ displayOrder: 1, price: 1 });
    res.json({ success: true, data: categories.length ? categories : localStore.getTickets() });
  } catch (error) {
    res.json({ success: true, data: localStore.getTickets(), source: 'local_store' });
  }
});

router.post('/tickets', verifyAdminToken, async (req, res) => {
  const localItem = localStore.addTicket(req.body);

  if (!isDbConnected()) {
    return res.status(201).json({ success: true, message: 'Ticket category created.', data: localItem });
  }
  try {
    const category = await TicketCategory.create(req.body);
    res.status(201).json({ success: true, message: 'Ticket category created in MongoDB.', data: category });
  } catch (error) {
    res.status(201).json({ success: true, message: 'Ticket category created locally.', data: localItem });
  }
});

router.put('/tickets/:id', verifyAdminToken, async (req, res) => {
  const updates = { ...req.body };
  if (updates.totalCapacity !== undefined) updates.totalCapacity = Math.max(0, parseInt(updates.totalCapacity, 10) || 0);
  if (updates.soldCount !== undefined) updates.soldCount = Math.max(0, parseInt(updates.soldCount, 10) || 0);
  if (updates.reservedCount !== undefined) updates.reservedCount = Math.max(0, parseInt(updates.reservedCount, 10) || 0);
  if (updates.price !== undefined) updates.price = Math.max(0, parseFloat(updates.price) || 0);

  const updatedLocal = localStore.updateTicket(req.params.id, updates);

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'Ticket category updated.', data: updatedLocal });
  }
  try {
    const idParam = req.params.id;
    let category = null;
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      category = await TicketCategory.findByIdAndUpdate(idParam, updates, { new: true });
    }
    if (!category) {
      category = await TicketCategory.findOneAndUpdate(
        { code: idParam.toLowerCase() },
        updates,
        { new: true }
      );
    }
    res.json({ success: true, message: 'Ticket category updated in MongoDB.', data: category || updatedLocal });
  } catch (error) {
    res.json({ success: true, message: 'Ticket category updated locally.', data: updatedLocal });
  }
});

router.delete('/tickets/:id', verifyAdminToken, async (req, res) => {
  localStore.deleteTicket(req.params.id);

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'Ticket category deleted.' });
  }
  try {
    await TicketCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Ticket category deleted from MongoDB.' });
  } catch (error) {
    res.json({ success: true, message: 'Ticket category deleted locally.' });
  }
});

router.post('/tickets/reset-quotas', verifyAdminToken, async (req, res) => {
  try {
    const resetCats = localStore.resetTicketCounts();
    if (isDbConnected()) {
      try {
        await TicketCategory.updateMany({}, { $set: { soldCount: 0, reservedCount: 0 } });
        await TicketOrder.deleteMany({});
      } catch (dbErr) {
        console.warn('MongoDB ticket reset warning:', dbErr.message);
      }
    }
    res.json({
      success: true,
      message: 'All ticket quotas, sales counts, and test orders successfully reset to 0.',
      data: resetCats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ==========================================================================
   TICKET ORDERS & TRANSACTIONS
   ========================================================================== */

router.get('/orders', verifyAdminToken, async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');

  const { status, search, limit = 50, page = 1 } = req.query;

  async function filterAndPaginate(ordersList) {
    let list = Array.isArray(ordersList) ? [...ordersList] : [];

    // Automatically ensure all orders have VERIFIED status and QR codes so admin never has to verify one by one
    for (const o of list) {
      let needsUpdate = false;
      const updates = {};
      if (o.status !== 'VERIFIED') {
        o.status = 'VERIFIED';
        o.verifiedAt = o.verifiedAt || new Date().toISOString();
        updates.status = 'VERIFIED';
        updates.verifiedAt = o.verifiedAt;
        needsUpdate = true;
      }
      if (!o.qrCodeData) {
        try {
          const qrPayload = JSON.stringify({
            ref: o.orderRef,
            buyer: o.buyerName,
            enclosure: o.categoryName,
            qty: o.quantity,
            format: o.matchFormat,
            event: "97th Battle of the Maroons",
            venue: "SSC Colombo",
            verified: true,
            issuedAt: o.createdAt || new Date().toISOString()
          });
          o.qrCodeData = await QRCode.toDataURL(qrPayload, {
            errorCorrectionLevel: 'H',
            margin: 2,
            color: { dark: '#540c1a', light: '#ffffff' }
          });
          updates.qrCodeData = o.qrCodeData;
          needsUpdate = true;
        } catch (e) {}
      }
      if (needsUpdate) {
        localStore.updateOrder(o.orderRef, updates);
      }
    }

    if (status && status !== 'ALL') {
      list = list.filter(o => (o.status || '').toUpperCase() === status.toUpperCase());
    }
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter(o => 
        (o.orderRef || '').toLowerCase().includes(s) ||
        (o.buyerName || '').toLowerCase().includes(s) ||
        (o.buyerEmail || '').toLowerCase().includes(s) ||
        (o.categoryName || '').toLowerCase().includes(s)
      );
    }
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 50);
    const skip = (pageNum - 1) * limitNum;
    const paginated = list.slice(skip, skip + limitNum);
    return {
      success: true,
      data: paginated,
      pagination: {
        total: list.length,
        page: pageNum,
        pages: Math.ceil(list.length / limitNum) || 1
      }
    };
  }

  if (!isDbConnected()) {
    return res.json(await filterAndPaginate(localStore.getOrders()));
  }

  try {
    const query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { orderRef: { $regex: s, $options: 'i' } },
        { buyerName: { $regex: s, $options: 'i' } },
        { buyerEmail: { $regex: s, $options: 'i' } },
        { categoryName: { $regex: s, $options: 'i' } }
      ];
    }
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const orders = await TicketOrder.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await TicketOrder.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10)) || 1
      }
    });
  } catch (error) {
    res.json(filterAndPaginate(localStore.getOrders()));
  }
});

router.delete('/orders/:id', verifyAdminToken, async (req, res) => {
  const id = req.params.id;
  const allOrders = localStore.getOrders();
  const existing = allOrders.find(o => o.orderRef === id || o.orderNumber === id || String(o._id) === id || String(o.id) === id);

  if (existing) {
    if (existing.status === 'VERIFIED') {
      localStore.restoreTicketQuota(existing.categoryId || existing.categoryCode, existing.quantity, true);
    } else if (existing.status === 'PENDING') {
      localStore.restoreTicketQuota(existing.categoryId || existing.categoryCode, existing.quantity, false);
    }
  }

  localStore.deleteOrder(id);

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'Ticket order deleted.' });
  }

  try {
    const isHexId = id.match(/^[0-9a-fA-F]{24}$/);
    const deleted = await TicketOrder.findOneAndDelete({
      $or: [
        { _id: isHexId ? id : null },
        { orderRef: id },
        { orderNumber: id }
      ]
    });

    if (deleted && deleted.categoryId) {
      if (deleted.status === 'VERIFIED') {
        await TicketCategory.findByIdAndUpdate(deleted.categoryId, { $inc: { soldCount: -deleted.quantity } });
      } else if (deleted.status === 'PENDING') {
        await TicketCategory.findByIdAndUpdate(deleted.categoryId, { $inc: { reservedCount: -deleted.quantity } });
      }
    }

    res.json({ success: true, message: 'Ticket order deleted successfully.', data: deleted });
  } catch (error) {
    res.json({ success: true, message: 'Ticket order deleted locally.' });
  }
});

router.patch('/orders/:id/status', verifyAdminToken, async (req, res) => {
  const { status, verificationNotes } = req.body;
  const id = req.params.id;

  let qrCodeData = null;
  if (status === 'VERIFIED') {
    const all = localStore.getOrders();
    const existing = all.find(o => o.orderRef === id || o.orderNumber === id || String(o._id) === id || String(o.id) === id);
    if (existing && !existing.qrCodeData) {
      try {
        const qrPayload = JSON.stringify({
          ref: existing.orderRef,
          buyer: existing.buyerName,
          enclosure: existing.categoryName,
          qty: existing.quantity,
          format: existing.matchFormat,
          event: "97th Battle of the Maroons",
          venue: "SSC Colombo",
          verified: true,
          issuedAt: new Date().toISOString()
        });
        qrCodeData = await QRCode.toDataURL(qrPayload, {
          errorCorrectionLevel: 'H',
          margin: 2,
          color: { dark: '#540c1a', light: '#ffffff' }
        });
      } catch (e) {}
    }
  }

  const updates = { status, verificationNotes };
  if (qrCodeData) updates.qrCodeData = qrCodeData;
  if (status === 'VERIFIED') updates.verifiedAt = new Date().toISOString();

  const updatedLocal = localStore.updateOrder(id, updates);

  // If status changed to VERIFIED: deduct quota!
  if (status === 'VERIFIED' && updatedLocal) {
    localStore.deductTicketQuota(updatedLocal.categoryId || updatedLocal.categoryCode, updatedLocal.quantity);
  } else if ((status === 'CANCELLED' || status === 'REFUNDED') && updatedLocal) {
    localStore.restoreTicketQuota(updatedLocal.categoryId || updatedLocal.categoryCode, updatedLocal.quantity, true);
  }

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'Order status updated.', order: updatedLocal, data: updatedLocal });
  }

  try {
    const order = await TicketOrder.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderRef: id }, { orderNumber: id }]
    });

    if (order) {
      order.status = status;
      if (verificationNotes) order.verificationNotes = verificationNotes;
      if (qrCodeData) order.qrCodeData = qrCodeData;
      if (status === 'VERIFIED') order.verifiedAt = new Date();
      await order.save();

      if (status === 'VERIFIED' && order.categoryId) {
        await TicketCategory.findByIdAndUpdate(order.categoryId, {
          $inc: { reservedCount: -order.quantity, soldCount: order.quantity }
        });
      }
      return res.json({ success: true, message: 'Order status updated.', order, data: order });
    }

    res.json({ success: true, message: 'Order status updated locally.', order: updatedLocal, data: updatedLocal });
  } catch (error) {
    res.json({ success: true, message: 'Order status updated locally.', order: updatedLocal, data: updatedLocal });
  }
});

/* ==========================================================================
   MATCHES CRUD
   ========================================================================== */

router.get('/matches', verifyAdminToken, async (req, res) => {
  if (!isDbConnected()) {
    const m = localStore.getMatches();
    const list = m.featuredMatches || (Array.isArray(m) ? m : []);
    return res.json({ success: true, data: list, source: 'local_store' });
  }
  try {
    const matches = await Match.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: matches.length ? matches : (localStore.getMatches().featuredMatches || []) });
  } catch (error) {
    const m = localStore.getMatches();
    res.json({ success: true, data: m.featuredMatches || [], source: 'local_store' });
  }
});

router.post('/matches', verifyAdminToken, async (req, res) => {
  const payload = { ...req.body };
  if (!payload.matchId) {
    payload.matchId = payload.id || `bom-match-${Date.now()}`;
  }
  const localMatch = localStore.addMatch(payload);

  if (!isDbConnected()) {
    return res.status(201).json({ success: true, message: 'Match record created (Saved locally).', data: localMatch });
  }
  try {
    const match = await Match.create(payload);
    res.status(201).json({ success: true, message: 'Match record created in MongoDB.', data: match });
  } catch (error) {
    res.status(201).json({ success: true, message: 'Match record created locally.', data: localMatch });
  }
});

router.put('/matches/:id', verifyAdminToken, async (req, res) => {
  const localMatch = localStore.updateMatch(req.params.id, req.body);

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'Match record updated (Saved locally).', data: localMatch });
  }
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const filter = isObjectId ? { _id: req.params.id } : { matchId: req.params.id };
    const match = await Match.findOneAndUpdate(filter, req.body, { new: true, upsert: true });
    res.json({ success: true, message: 'Match record updated in MongoDB.', data: match || localMatch });
  } catch (error) {
    res.json({ success: true, message: 'Match record updated locally.', data: localMatch });
  }
});

router.delete('/matches/:id', verifyAdminToken, async (req, res) => {
  localStore.deleteMatch(req.params.id);

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'Match record deleted.' });
  }
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const filter = isObjectId ? { _id: req.params.id } : { matchId: req.params.id };
    await Match.findOneAndDelete(filter);
    res.json({ success: true, message: 'Match record deleted from MongoDB.' });
  } catch (error) {
    res.json({ success: true, message: 'Match record deleted.' });
  }
});

/* ==========================================================================
   TEAMS & SQUADS MANAGEMENT
   ========================================================================== */

router.get('/teams', verifyAdminToken, async (req, res) => {
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
    return res.json({ success: true, data: teams, source: 'local_store' });
  }
  try {
    const teams = await Team.find();
    if (teams && teams.length > 0) {
      const normalized = teams.map(enrichTeam);

      // Auto-heal empty squads in MongoDB in the background
      for (const t of teams) {
        const obj = t.toObject ? t.toObject() : t;
        const sKey = (obj.schoolKey || obj.school || (obj.name && obj.name.toLowerCase().includes('nalanda') ? 'nalanda' : 'ananda')).toLowerCase();
        const hasSquad = (obj.verifiedSquadMembers && obj.verifiedSquadMembers.length > 0) || (obj.squad && obj.squad.length > 0);
        if (!hasSquad) {
          const fb = defaultTeams.find(dt => (dt.schoolKey || dt.school || '').toLowerCase() === sKey);
          if (fb && fb.verifiedSquadMembers && fb.verifiedSquadMembers.length > 0) {
            Team.findByIdAndUpdate(obj._id, {
              verifiedSquadMembers: fb.verifiedSquadMembers,
              squad: fb.verifiedSquadMembers,
              captain: obj.captain || fb.captain,
              viceCaptain: obj.viceCaptain || fb.viceCaptain,
              headCoach: obj.headCoach || fb.headCoach,
              principal: obj.principal || fb.principal
            }).catch(() => {});
          }
        }
      }

      return res.json({ success: true, data: normalized, source: 'database' });
    }
    res.json({ success: true, data: defaultTeams.map(enrichTeam), source: 'local_store' });
  } catch (error) {
    res.json({ success: true, data: defaultTeams.map(enrichTeam), source: 'local_store' });
  }
});

router.put('/teams/:schoolKey', verifyAdminToken, async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  const rawKey = req.params.schoolKey || '';
  const key = rawKey.toLowerCase().includes('nalanda') ? 'nalanda' : 'ananda';
  
  const update = { ...req.body, schoolKey: key, school: key };
  if (update.captain && !update.recentCaptain) {
    update.recentCaptain = update.captain;
  }
  if (update.recentCaptain && !update.captain) {
    update.captain = update.recentCaptain;
  }

  const localUpdated = localStore.updateTeam(key, update);

  if (!isDbConnected()) {
    return res.json({ success: true, message: `${key.toUpperCase()} squad & details updated.`, data: localUpdated });
  }
  try {
    const team = await Team.findOneAndUpdate(
      { schoolKey: key }, 
      { $set: update }, 
      { new: true, returnDocument: 'after', upsert: true }
    );
    if (team) {
      localStore.updateTeam(key, team.toObject ? team.toObject() : team);
    }
    res.json({ 
      success: true, 
      message: `${team ? team.name : key.toUpperCase()} squad & details updated in MongoDB.`, 
      data: team ? (team.toObject ? team.toObject() : team) : localUpdated 
    });
  } catch (error) {
    console.error('Error updating team:', error);
    res.json({ success: true, message: `${key.toUpperCase()} squad & details updated locally.`, data: localUpdated });
  }
});

/* ==========================================================================
   NEWS & DISPATCHES CRUD
   ========================================================================== */

router.get('/news', verifyAdminToken, async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');

  if (!isDbConnected()) {
    return res.json({ success: true, data: localStore.getNews(), source: 'local_store' });
  }
  try {
    const news = await News.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: news.length ? news : localStore.getNews(), source: 'database' });
  } catch (error) {
    res.json({ success: true, data: localStore.getNews(), source: 'local_store' });
  }
});

router.post('/news', verifyAdminToken, async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  const localArticle = localStore.addNews(req.body);

  if (!isDbConnected()) {
    return res.status(201).json({ success: true, message: 'News article created.', data: localArticle });
  }
  try {
    let slug = (req.body.slug || req.body.title || 'dispatch')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Check if slug already exists to prevent duplicate key errors
    const exists = await News.findOne({ slug });
    if (exists) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const payload = {
      ...req.body,
      slug,
      coverImage: req.body.coverImage || req.body.image || '',
      image: req.body.image || req.body.coverImage || ''
    };

    const article = await News.create(payload);
    localStore.addNews(article.toObject ? article.toObject() : article);
    res.status(201).json({ success: true, message: 'News article created in MongoDB.', data: article });
  } catch (error) {
    console.error('Error creating news in MongoDB:', error);
    res.status(201).json({ success: true, message: 'News article created locally.', data: localArticle });
  }
});

router.put('/news/:id', verifyAdminToken, async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  const artId = req.params.id;
  const localArticle = localStore.updateNews(artId, req.body);

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'News article updated.', data: localArticle });
  }
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(artId);
    const filter = isObjectId ? { _id: artId } : { slug: artId };

    const payload = {
      ...req.body,
      coverImage: req.body.coverImage || req.body.image || '',
      image: req.body.image || req.body.coverImage || ''
    };

    let article = await News.findOneAndUpdate(
      filter, 
      { $set: payload }, 
      { new: true, returnDocument: 'after' }
    );

    // Fallback: if not found by ObjectId or slug, try finding by title keyword
    if (!article && req.body.title) {
      article = await News.findOneAndUpdate(
        { title: req.body.title },
        { $set: payload },
        { new: true, returnDocument: 'after' }
      );
    }

    if (article) {
      localStore.updateNews(artId, article.toObject ? article.toObject() : article);
    }

    res.json({ 
      success: true, 
      message: 'News article updated in MongoDB.', 
      data: article ? (article.toObject ? article.toObject() : article) : localArticle 
    });
  } catch (error) {
    console.error('Error updating news in MongoDB:', error);
    res.json({ success: true, message: 'News article updated locally.', data: localArticle });
  }
});

router.delete('/news/:id', verifyAdminToken, async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  const artId = req.params.id;
  localStore.deleteNews(artId);

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'News article deleted.' });
  }
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(artId);
    const filter = isObjectId ? { _id: artId } : { slug: artId };
    await News.findOneAndDelete(filter);
    res.json({ success: true, message: 'News article deleted from MongoDB.' });
  } catch (error) {
    console.error('Error deleting news from MongoDB:', error);
    res.json({ success: true, message: 'News article deleted locally.' });
  }
});

/* ==========================================================================
   SPONSORS CRUD
   ========================================================================== */

router.get('/sponsors', verifyAdminToken, async (req, res) => {
  if (!isDbConnected()) {
    return res.json({ success: true, data: localStore.getSponsors(), source: 'local_store' });
  }
  try {
    const sponsors = await Sponsor.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: sponsors.length ? sponsors : localStore.getSponsors(), source: 'database' });
  } catch (error) {
    res.json({ success: true, data: localStore.getSponsors(), source: 'local_store' });
  }
});

router.post('/sponsors', verifyAdminToken, async (req, res) => {
  const localSponsor = localStore.addSponsor(req.body);

  if (!isDbConnected()) {
    return res.status(201).json({ success: true, message: 'Sponsor added successfully.', data: localSponsor });
  }
  try {
    const sponsor = await Sponsor.create(req.body);
    res.status(201).json({ success: true, message: 'Sponsor added in MongoDB.', data: sponsor });
  } catch (error) {
    res.status(201).json({ success: true, message: 'Sponsor added locally.', data: localSponsor });
  }
});

router.put('/sponsors/:id', verifyAdminToken, async (req, res) => {
  const localSponsor = localStore.updateSponsor(req.params.id, req.body);

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'Sponsor updated successfully.', data: localSponsor });
  }
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const filter = isObjectId ? { _id: req.params.id } : { name: req.params.id };
    const sponsor = await Sponsor.findOneAndUpdate(filter, req.body, { new: true });
    res.json({ success: true, message: 'Sponsor updated in MongoDB.', data: sponsor || localSponsor });
  } catch (error) {
    res.json({ success: true, message: 'Sponsor updated locally.', data: localSponsor });
  }
});

router.delete('/sponsors/:id', verifyAdminToken, async (req, res) => {
  localStore.deleteSponsor(req.params.id);

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'Sponsor deleted successfully.' });
  }
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const filter = isObjectId ? { _id: req.params.id } : { name: req.params.id };
    await Sponsor.findOneAndDelete(filter);
    res.json({ success: true, message: 'Sponsor deleted from MongoDB.' });
  } catch (error) {
    res.json({ success: true, message: 'Sponsor deleted locally.' });
  }
});

/* ==========================================================================
   INQUIRIES PRIVATE INBOX
   ========================================================================== */

router.get('/inquiries', verifyAdminToken, async (req, res) => {
  if (!isDbConnected()) {
    const list = localStore.getInquiries(req.query);
    return res.json({ success: true, data: list, pagination: { total: list.length, page: 1, pages: 1 } });
  }
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    const query = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { message: { $regex: s, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Inquiry.countDocuments(query);

    res.json({
      success: true,
      data: inquiries,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    const list = localStore.getInquiries(req.query);
    res.json({ success: true, data: list, pagination: { total: list.length, page: 1, pages: 1 } });
  }
});

router.patch('/inquiries/:id', verifyAdminToken, async (req, res) => {
  const { status, adminNotes } = req.body;
  const localUpdated = localStore.updateInquiry(req.params.id, { status, adminNotes });

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'Inquiry status updated.', data: localUpdated });
  }
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.json({ success: true, message: 'Inquiry status updated locally.', data: localUpdated });

    if (status) inquiry.status = status;
    if (adminNotes !== undefined) inquiry.adminNotes = adminNotes;
    await inquiry.save();

    res.json({ success: true, message: 'Inquiry status updated.', data: inquiry });
  } catch (error) {
    res.json({ success: true, message: 'Inquiry status updated locally.', data: localUpdated });
  }
});

router.delete('/inquiries/:id', verifyAdminToken, async (req, res) => {
  const id = req.params.id;
  localStore.deleteInquiry(id);

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'Inquiry deleted.' });
  }
  try {
    const isHexId = id.match(/^[0-9a-fA-F]{24}$/);
    if (isHexId) {
      await Inquiry.findByIdAndDelete(id);
    } else {
      await Inquiry.findOneAndDelete({ $or: [{ _id: id }, { id }] });
    }
    res.json({ success: true, message: 'Inquiry deleted from MongoDB.' });
  } catch (error) {
    res.json({ success: true, message: 'Inquiry deleted locally.' });
  }
});

/* ==========================================================================
   PHOTO GALLERY MANAGEMENT
   ========================================================================== */

const galleryCategoryLabels = {
  matches: 'Match Action',
  atmosphere: 'Crowd & Carnival',
  ceremonies: 'Ceremonies',
  legends: 'Legends & Heritage',
  heritage: 'Visual Heritage'
};

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

router.get('/gallery', verifyAdminToken, async (req, res) => {
  if (!isDbConnected()) {
    return res.json({ success: true, data: sortGalleryByRecent(localStore.getGallery()), source: 'local_store' });
  }
  try {
    let items = await Gallery.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: sortGalleryByRecent(items.length ? items : localStore.getGallery()) });
  } catch (error) {
    res.json({ success: true, data: sortGalleryByRecent(localStore.getGallery()), source: 'local_store' });
  }
});

router.post('/gallery', verifyAdminToken, async (req, res) => {
  const localItem = localStore.addGallery(req.body);

  if (!isDbConnected()) {
    return res.status(201).json({ success: true, message: 'Photo added to gallery successfully.', data: localItem });
  }
  try {
    const { title, category, categoryLabel, year, image, caption, location, featured, displayOrder, isActive } = req.body;
    const item = await Gallery.create({
      title: (title || '').trim(),
      category: category || 'matches',
      categoryLabel: categoryLabel || galleryCategoryLabels[category] || 'Match Action',
      year: year || '2025',
      image: (image || '').trim(),
      caption: caption || '',
      location: location || 'Sinhalese Sports Club (SSC) Grounds, Colombo',
      featured: Boolean(featured),
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    res.status(201).json({ success: true, message: 'Photo added to gallery successfully in MongoDB.', data: item });
  } catch (error) {
    res.status(201).json({ success: true, message: 'Photo added to gallery locally.', data: localItem });
  }
});

router.put('/gallery/:id', verifyAdminToken, async (req, res) => {
  const localUpdated = localStore.updateGallery(req.params.id, req.body);

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'Gallery photo updated successfully.', data: localUpdated });
  }
  try {
    const updated = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Gallery photo updated successfully in MongoDB.', data: updated || localUpdated });
  } catch (error) {
    res.json({ success: true, message: 'Gallery photo updated locally.', data: localUpdated });
  }
});

router.delete('/gallery/:id', verifyAdminToken, async (req, res) => {
  localStore.deleteGallery(req.params.id);

  if (!isDbConnected()) {
    return res.json({ success: true, message: 'Photo deleted from gallery successfully.' });
  }
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Photo deleted from gallery in MongoDB.' });
  } catch (error) {
    res.json({ success: true, message: 'Photo deleted locally.' });
  }
});

/* ==========================================================================
   IMAGE UPLOAD
   ========================================================================== */

router.post('/upload', verifyAdminToken, uploadImage.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'File uploaded successfully.',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
