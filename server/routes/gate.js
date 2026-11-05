/**
 * BATTLE OF THE MAROONS — GATE VERIFICATION & SCANNER API
 * 
 * High-speed QR pass verification & attendee admission tracking
 * for the Organizing Committee & Gate Stewards at SSC Grounds.
 */

import express from 'express';
import { TicketOrder } from '../models/TicketOrder.js';
import { localStore } from '../config/localStore.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();

// Helper to extract clean order reference from QR code payloads or manual entries
function extractOrderRef(rawInput) {
  if (!rawInput) return '';
  let str = String(rawInput).trim();

  // 1. Try parsing JSON QR code payload
  if ((str.startsWith('{') && str.endsWith('}')) || (str.includes('{') && str.includes('}'))) {
    try {
      const cleanJson = str.substring(str.indexOf('{'), str.lastIndexOf('}') + 1);
      const parsed = JSON.parse(cleanJson);
      if (parsed.ref) return String(parsed.ref).trim().toUpperCase();
      if (parsed.orderRef) return String(parsed.orderRef).trim().toUpperCase();
      if (parsed.orderNumber) return String(parsed.orderNumber).trim().toUpperCase();
    } catch (e) {}
  }

  // 1b. Direct regex for JSON ref fields in case JSON was partially formatted
  const jsonRefMatch = str.match(/"(?:ref|orderRef|orderNumber)"\s*:\s*"([^"]+)"/i);
  if (jsonRefMatch && jsonRefMatch[1]) {
    return jsonRefMatch[1].trim().toUpperCase();
  }

  // 2. Check if input is a receipt URL or has query param ref=
  if (str.includes('ref=')) {
    try {
      const match = str.match(/ref=([^&/#]+)/i);
      if (match && match[1]) return decodeURIComponent(match[1]).trim().toUpperCase();
    } catch (e) {}
  }

  // 3. Check for standard BOM prefix anywhere in string (e.g. BOM-97-92366 or BOM-97-VIP)
  const bomMatch = str.match(/BOM-97-[A-Z0-9_-]+/i);
  if (bomMatch) {
    return bomMatch[0].toUpperCase();
  }

  // 4. Raw digits only (e.g. user typed just "92366")
  const digitMatch = str.match(/^\s*(\d{4,6})\s*$/);
  if (digitMatch) {
    return `BOM-97-${digitMatch[1]}`;
  }

  return str.toUpperCase();
}

/**
 * POST /api/gate/verify
 * Instant QR Pass Verification
 */
router.post('/verify', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  const { code, gateName = 'Main Gate', steward = 'Steward' } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      valid: false,
      status: 'EMPTY_CODE',
      statusClass: 'status-danger',
      title: 'NO CODE PROVIDED',
      message: 'Please point the camera at a ticket QR code or enter a pass reference.'
    });
  }

  const orderRef = extractOrderRef(code);
  let order = null;

  // Search in MongoDB if connected
  if (isDbConnected()) {
    try {
      order = await TicketOrder.findOne({
        $or: [
          { orderRef: orderRef },
          { orderNumber: orderRef },
          { orderRef: new RegExp(`^${orderRef}$`, 'i') }
        ]
      }).lean();
    } catch (dbErr) {
      console.warn('Gate verify MongoDB search warning:', dbErr.message);
    }
  }

  // Fallback to localStore
  if (!order) {
    const allOrders = localStore.getOrders();
    order = allOrders.find(o => 
      (o.orderRef && o.orderRef.toUpperCase() === orderRef) ||
      (o.orderNumber && o.orderNumber.toUpperCase() === orderRef) ||
      String(o._id) === orderRef ||
      String(o.id) === orderRef
    );
  }

  // TICKET NOT FOUND -> FAKE OR UNRECOGNIZED PASS
  if (!order) {
    return res.json({
      success: false,
      valid: false,
      status: 'NOT_FOUND',
      statusClass: 'status-danger',
      title: 'INVALID PASS — REJECT ENTRY',
      message: `No record found for code "${orderRef}". This ticket was not purchased through the official Battle of the Maroons system.`,
      scannedCode: orderRef
    });
  }

  // Check if status is VERIFIED
  const isStatusVerified = (order.status || '').toUpperCase() === 'VERIFIED';
  if (!isStatusVerified) {
    return res.json({
      success: true,
      valid: false,
      status: 'PENDING_PAYMENT',
      statusClass: 'status-warning',
      title: 'PAYMENT UNVERIFIED',
      message: 'This pass has a PENDING status. Payment was not settled. Do not admit until verified in Admin Panel.',
      order: sanitizeOrder(order)
    });
  }

  // Check if ALREADY ADMITTED (DUPLICATE PASS USE ATTEMPT)
  if (order.isAdmitted) {
    return res.json({
      success: true,
      valid: false,
      status: 'ALREADY_ADMITTED',
      statusClass: 'status-danger',
      title: '⚠️ ALREADY SCANNED AT GATE',
      message: `DUPLICATE ENTRY DETECTED! This pass was already scanned and admitted at ${formatTime(order.admittedAt)} at ${order.admittedGate || 'Gate'}. Check if this is a forwarded screenshot!`,
      admittedAt: order.admittedAt,
      admittedGate: order.admittedGate,
      admittedBy: order.admittedBy,
      order: sanitizeOrder(order)
    });
  }

  // VALID PASS — APPROVED FOR ENTRY
  return res.json({
    success: true,
    valid: true,
    status: 'VALID',
    statusClass: 'status-success',
    title: 'ADMISSION APPROVED',
    message: `✓ Legitimate ticket pass. Admit ${order.quantity || 1} Person(s).`,
    order: sanitizeOrder(order)
  });
});

/**
 * POST /api/gate/check-in
 * Check in attendee at gate (prevents pass reuse)
 */
router.post('/check-in', async (req, res) => {
  const { orderRef, gateName = 'Main Gate', steward = 'Gate Steward' } = req.body;

  if (!orderRef) {
    return res.status(400).json({ success: false, message: 'Missing order reference.' });
  }

  const cleanRef = extractOrderRef(orderRef);
  const now = new Date().toISOString();

  const updates = {
    isAdmitted: true,
    admittedAt: now,
    admittedGate: gateName,
    admittedBy: steward
  };

  // 1. Update localStore
  localStore.updateOrder(cleanRef, updates);

  // 2. Update MongoDB if connected
  if (isDbConnected()) {
    try {
      await TicketOrder.findOneAndUpdate(
        { $or: [{ orderRef: cleanRef }, { orderNumber: cleanRef }] },
        { $set: updates }
      );
    } catch (e) {
      console.warn('Check-in MongoDB update error:', e.message);
    }
  }

  res.json({
    success: true,
    message: `Pass [${cleanRef}] successfully checked in at ${gateName}!`,
    admittedAt: now,
    admittedGate: gateName
  });
});

/**
 * POST /api/gate/undo-check-in
 * Revert accidental check-in
 */
router.post('/undo-check-in', async (req, res) => {
  const { orderRef } = req.body;
  if (!orderRef) return res.status(400).json({ success: false });

  const cleanRef = extractOrderRef(orderRef);
  const updates = {
    isAdmitted: false,
    admittedAt: null,
    admittedGate: '',
    admittedBy: ''
  };

  localStore.updateOrder(cleanRef, updates);

  if (isDbConnected()) {
    try {
      await TicketOrder.findOneAndUpdate(
        { $or: [{ orderRef: cleanRef }, { orderNumber: cleanRef }] },
        { $set: updates }
      );
    } catch (e) {}
  }

  res.json({ success: true, message: `Check-in reverted for [${cleanRef}].` });
});

/**
 * GET /api/gate/stats
 * Real-time Gate & Turnstile Statistics
 */
router.get('/stats', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  let orders = [];

  if (isDbConnected()) {
    try {
      orders = await TicketOrder.find({ status: 'VERIFIED' }).lean();
    } catch (e) {}
  }

  if (orders.length === 0) {
    orders = localStore.getOrders().filter(o => o.status === 'VERIFIED');
  }

  let totalTicketsSold = 0;
  let totalAdmittedTickets = 0;
  let totalAdmittedPersons = 0;
  let totalExpectedPersons = 0;
  const enclosureBreakdown = {};

  for (const o of orders) {
    const qty = parseInt(o.quantity, 10) || 1;
    totalTicketsSold += 1;
    totalExpectedPersons += qty;

    const encName = o.categoryName || 'Other';
    if (!enclosureBreakdown[encName]) {
      enclosureBreakdown[encName] = { total: 0, admitted: 0 };
    }
    enclosureBreakdown[encName].total += qty;

    if (o.isAdmitted) {
      totalAdmittedTickets += 1;
      totalAdmittedPersons += qty;
      enclosureBreakdown[encName].admitted += qty;
    }
  }

  res.json({
    success: true,
    totalTicketsSold,
    totalExpectedPersons,
    totalAdmittedTickets,
    totalAdmittedPersons,
    remainingExpectedPersons: Math.max(0, totalExpectedPersons - totalAdmittedPersons),
    enclosureBreakdown
  });
});

function sanitizeOrder(o) {
  return {
    orderRef: o.orderRef,
    buyerName: o.buyerName,
    buyerEmail: o.buyerEmail,
    buyerPhone: o.buyerPhone || 'N/A',
    categoryName: o.categoryName,
    quantity: o.quantity || 1,
    matchFormat: o.matchFormat === '1day' ? '50-Over One Day Encounter' : '97th 3-Day Traditional Encounter',
    schoolAffiliation: (o.schoolAffiliation || '').toUpperCase(),
    totalAmount: o.totalAmount,
    currency: o.currency || 'LKR',
    status: o.status,
    isAdmitted: Boolean(o.isAdmitted),
    admittedAt: o.admittedAt || null,
    admittedGate: o.admittedGate || null,
    createdAt: o.createdAt
  };
}

function formatTime(isoStr) {
  if (!isoStr) return 'Earlier today';
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch (e) {
    return 'Earlier today';
  }
}

export default router;

