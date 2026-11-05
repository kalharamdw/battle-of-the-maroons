import express from 'express';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { TicketCategory } from '../models/TicketCategory.js';
import { TicketOrder } from '../models/TicketOrder.js';
import { orderLimiter } from '../middleware/rateLimiters.js';
import { isDbConnected } from '../config/db.js';
import { localStore } from '../config/localStore.js';

const router = express.Router();

// In-memory fallback cache when MongoDB is offline / initializing
const memoryOrders = new Map();

/**
 * Helper to compute PayHere Pre-Checkout Hash
 * hash = UPPER(MD5(merchant_id + order_id + formatted_amount + currency + UPPER(MD5(merchant_secret))))
 */
function generatePayHereHash(merchantId, orderId, amount, currency, merchantSecret) {
  const formattedAmount = Number(amount).toLocaleString('en-us', { minimumFractionDigits: 2 }).replaceAll(',', '');
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
  const hashString = merchantId + orderId + formattedAmount + currency + hashedSecret;
  return crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
}

/**
 * Helper to verify PayHere IPN Webhook Hash
 * hash = UPPER(MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + UPPER(MD5(merchant_secret))))
 */
function verifyPayHereWebhook(body, merchantId, merchantSecret) {
  const { order_id, payhere_amount, payhere_currency, status_code, md5sig } = body;
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
  const hashString = merchantId + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
  const expectedHash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();
  return expectedHash === (md5sig || '').toUpperCase();
}

/**
 * POST /api/tickets/order
 * Guest Ticket Reservation & PayHere Checkout Initialization
 */
router.post('/order', orderLimiter, async (req, res) => {
  try {
    const {
      buyerName,
      buyerEmail,
      buyerPhone,
      schoolAffiliation = 'neutral',
      matchFormat = '3day',
      categoryId,
      categoryCode,
      quantity = 1
    } = req.body;

    // 1. Validation
    if (!buyerName || !buyerName.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide the ticket passholder name.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!buyerEmail || !emailRegex.test(buyerEmail.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address for pass delivery.' });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1 || qty > 20) {
      return res.status(400).json({ success: false, message: 'Invalid quantity. Maximum 20 passes per order.' });
    }

    // 2. Fetch category and verify capacity
    let category = null;
    if (isDbConnected()) {
      if (categoryId && categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        category = await TicketCategory.findById(categoryId);
      } else if (categoryCode) {
        category = await TicketCategory.findOne({ code: categoryCode.toLowerCase(), isActive: true });
      }
    } else {
      const tickets = localStore.getTickets();
      category = tickets.find(c => c.id === categoryId || c.code === categoryCode || c.id === categoryCode) || tickets[0];
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Selected enclosure category not found or currently unavailable.' });
    }

    const totalCapacity = category.totalCapacity || 500;
    const reservedCount = category.reservedCount || 0;
    const soldCount = category.soldCount || 0;
    const available = totalCapacity - (reservedCount + soldCount);

    if (available < qty) {
      return res.status(400).json({
        success: false,
        message: `Only ${Math.max(0, available)} passes remain for ${category.name}. Please adjust your quantity.`
      });
    }

    // 3. Atomically allocate quota (Mark as sold directly)
    if (isDbConnected() && category._id) {
      await TicketCategory.findByIdAndUpdate(category._id, {
        $inc: { soldCount: qty }
      });
    }
    localStore.deductTicketQuota(category._id || category.code || category.id, qty);

    // 4. Generate unique ticket reference code
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderRef = `BOM-97-${randomSuffix}`;
    const totalAmount = category.price * qty;

    // 5. Instantly generate official verifiable Gate QR Code (Optimized for instant mobile turnstile scanning)
    const qrCodeData = await QRCode.toDataURL(orderRef, {
      errorCorrectionLevel: 'M',
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });

    // 6. Create Verified Order directly
    const orderData = {
      orderRef,
      orderNumber: orderRef,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim().toLowerCase(),
      buyerPhone: (buyerPhone || '').trim(),
      schoolAffiliation,
      matchFormat,
      categoryId: category._id || category.id || category.code,
      categoryCode: category.code || category.id,
      categoryName: category.name,
      quantity: qty,
      unitPrice: category.price,
      totalAmount,
      currency: "LKR",
      status: "VERIFIED",
      qrCodeData,
      verifiedAt: new Date().toISOString(),
      payhereMethod: "DIRECT_PASS",
      payherePaymentId: `PASS_${Date.now()}`,
      verificationNotes: "Pass automatically confirmed and QR code generated.",
      ipAddress: req.ip || req.socket.remoteAddress || '',
      createdAt: new Date().toISOString()
    };

    let order = null;
    if (isDbConnected()) {
      try {
        order = await TicketOrder.create(orderData);
      } catch (err) {
        console.error('❌ MongoDB order creation error:', err.message || err);
      }
    }

    if (!order) {
      order = { ...orderData, _id: `ord_${Date.now()}` };
    }

    // Always record to localStore and memoryOrders
    const plainOrder = order.toObject ? order.toObject() : order;
    localStore.addOrder(plainOrder);
    memoryOrders.set(orderRef, plainOrder);

    // 6. PayHere Gateway parameters
    const merchantId = process.env.PAYHERE_MERCHANT_ID || '1220000'; // Default PayHere Sandbox Merchant ID
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || 'portal_secret_demo';
    const isSandbox = (process.env.PAYHERE_ENV || 'sandbox').toLowerCase() === 'sandbox';

    const hash = generatePayHereHash(merchantId, orderRef, totalAmount, "LKR", merchantSecret);

    const payhereEndpoint = isSandbox
      ? 'https://sandbox.payhere.lk/pay/checkout'
      : 'https://www.payhere.lk/pay/checkout';

    res.status(201).json({
      success: true,
      order: plainOrder,
      orderRef: order.orderRef,
      orderId: order._id,
      totalAmount,
      currency: "LKR",
      itemTitle: `${qty}x ${category.name} (${matchFormat === '3day' ? '3-Day Encounter' : 'Day-Night Match'})`,
      buyer: {
        name: order.buyerName,
        email: order.buyerEmail,
        phone: order.buyerPhone
      },
      payhere: {
        endpoint: payhereEndpoint,
        merchantId,
        hash,
        returnUrl: `${req.protocol}://${req.get('host')}/#/ticketing?status=success&ref=${order.orderRef}`,
        cancelUrl: `${req.protocol}://${req.get('host')}/#/ticketing?status=cancelled&ref=${order.orderRef}`,
        notifyUrl: `${req.protocol}://${req.get('host')}/api/tickets/payhere-notify`
      }
    });

  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Unable to process ticket reservation.' });
  }
});

/**
 * POST /api/tickets/payhere-notify
 * PayHere Instant Payment Notification (IPN) Webhook
 */
router.post('/payhere-notify', async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      method,
      status_message
    } = req.body;

    console.log(`💳 PayHere IPN Notification Received: Order ${order_id}, Status: ${status_code}, Amount: ${payhere_amount}`);

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || 'portal_secret_demo';
    const isSignatureValid = verifyPayHereWebhook(req.body, merchant_id, merchantSecret);

    if (!isSignatureValid) {
      console.warn(`⚠️ PayHere Webhook Signature Verification FAILED for Order: ${order_id}`);
      return res.status(400).send('Invalid signature verification');
    }

    let order = null;
    if (isDbConnected()) {
      try {
        order = await TicketOrder.findOne({ orderRef: order_id });
      } catch (e) {}
    }
    if (!order) {
      const all = localStore.getOrders();
      order = all.find(o => o.orderRef === order_id || o.orderNumber === order_id);
    }
    if (!order && memoryOrders.has(order_id)) {
      order = memoryOrders.get(order_id);
    }

    if (!order) {
      console.error(`❌ PayHere Webhook: Order reference not found: ${order_id}`);
      return res.status(404).send('Order not found');
    }

    if (order.status === 'VERIFIED') {
      console.log(`ℹ️ Order ${order_id} is already verified.`);
      return res.status(200).send('Already processed');
    }

    // Status 2 = Success
    if (status_code === '2') {
      // 1. Generate digital verifiable QR code (Optimized for instant mobile turnstile scanning)
      const qrCodeData = await QRCode.toDataURL(order.orderRef, {
        errorCorrectionLevel: 'M',
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      });

      const updates = {
        status: 'VERIFIED',
        payherePaymentId: payment_id,
        payhereMethod: method,
        payhereStatusCode: 2,
        qrCodeData,
        verificationNotes: `Verified via PayHere IPN. Method: ${method}, Amount: ${payhere_amount} LKR`,
        verifiedAt: new Date().toISOString()
      };

      // Always update localStore and memory
      localStore.updateOrder(order_id, updates);
      // DEDUCT FROM TOTAL TICKETS QUANTITY:
      localStore.deductTicketQuota(order.categoryId || order.categoryCode, order.quantity);

      if (memoryOrders.has(order_id)) {
        memoryOrders.set(order_id, { ...(order.toObject ? order.toObject() : order), ...updates });
      }

      if (isDbConnected()) {
        try {
          if (typeof order.save === 'function') {
            Object.assign(order, updates);
            await order.save();
          } else {
            await TicketOrder.findOneAndUpdate({ orderRef: order_id }, { $set: updates });
          }

          if (order.categoryId) {
            await TicketCategory.findByIdAndUpdate(order.categoryId, {
              $inc: {
                reservedCount: -order.quantity,
                soldCount: order.quantity
              }
            });
          }
        } catch (dbErr) {
          console.warn('MongoDB IPN sync warning:', dbErr.message);
        }
      }

      console.log(`✅ Order ${order_id} VERIFIED successfully. QR Code generated & tickets quantity deducted.`);
      return res.status(200).send('Payment Verified');
    }

    // Status -1 = Cancelled, Status -2 = Failed
    if (status_code === '-1' || status_code === '-2') {
      const updates = {
        status: status_code === '-1' ? 'CANCELLED' : 'FAILED',
        payherePaymentId: payment_id,
        payhereStatusCode: parseInt(status_code, 10),
        verificationNotes: `Payment ${status_code === '-1' ? 'Cancelled' : 'Failed'}: ${status_message || ''}`,
        updatedAt: new Date().toISOString()
      };

      localStore.updateOrder(order_id, updates);
      localStore.restoreTicketQuota(order.categoryId || order.categoryCode, order.quantity, false);

      if (memoryOrders.has(order_id)) {
        memoryOrders.set(order_id, { ...(order.toObject ? order.toObject() : order), ...updates });
      }

      if (isDbConnected()) {
        try {
          if (typeof order.save === 'function') {
            Object.assign(order, updates);
            await order.save();
          } else {
            await TicketOrder.findOneAndUpdate({ orderRef: order_id }, { $set: updates });
          }

          if (order.categoryId) {
            await TicketCategory.findByIdAndUpdate(order.categoryId, {
              $inc: { reservedCount: -order.quantity }
            });
          }
        } catch (dbErr) {
          console.warn('MongoDB cancellation quota restore warning:', dbErr.message);
        }
      }

      console.log(`⚠️ Order ${order_id} marked as ${updates.status}. Quota restored.`);
      return res.status(200).send('Payment status recorded');
    }

    res.status(200).send('Notification received');
  } catch (error) {
    console.error('PayHere IPN Error:', error);
    res.status(500).send('Server Error');
  }
});

/**
 * POST /api/tickets/verify-sandbox
 * Sandbox / Testing endpoint to simulate verified completion for demo and testing
 */
router.post('/verify-sandbox', async (req, res) => {
  try {
    const { orderRef } = req.body;
    if (!orderRef) {
      return res.status(400).json({ success: false, message: 'orderRef is required' });
    }

    let order = null;
    if (isDbConnected()) {
      try {
        order = await TicketOrder.findOne({ orderRef });
      } catch (e) {}
    }
    if (!order && memoryOrders.has(orderRef)) {
      order = memoryOrders.get(orderRef);
    }
    if (!order) {
      const all = localStore.getOrders();
      order = all.find(o => o.orderRef === orderRef || o.orderNumber === orderRef || String(o._id) === String(orderRef));
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found in reservations.' });
    }

    if (order.status === 'VERIFIED') {
      return res.json({ success: true, message: 'Order is already verified', order });
    }

    // Generate High-Speed, High-Contrast QR Code for instant gate scanning
    const qrCodeData = await QRCode.toDataURL(order.orderRef, {
      errorCorrectionLevel: 'M',
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });

    const updates = {
      status: 'VERIFIED',
      payherePaymentId: `SANDBOX_${Date.now()}`,
      payhereMethod: 'TEST_SANDBOX_CARD',
      payhereStatusCode: 2,
      qrCodeData: qrCodeData,
      verificationNotes: 'Verified in Sandbox/Demo mode with genuine QR code issuance.',
      verifiedAt: new Date().toISOString()
    };

    // Update in localStore and memory
    const updatedLocal = localStore.updateOrder(orderRef, updates);
    // DEDUCT FROM TOTAL TICKETS QUANTITY:
    localStore.deductTicketQuota(order.categoryId || order.categoryCode, order.quantity);

    order.status = updates.status;
    order.payherePaymentId = updates.payherePaymentId;
    order.payhereMethod = updates.payhereMethod;
    order.payhereStatusCode = updates.payhereStatusCode;
    order.qrCodeData = updates.qrCodeData;
    order.verificationNotes = updates.verificationNotes;
    order.verifiedAt = updates.verifiedAt;
    memoryOrders.set(orderRef, order.toObject ? order.toObject() : order);

    if (isDbConnected()) {
      try {
        if (typeof order.save === 'function') {
          await order.save();
        } else {
          await TicketOrder.findOneAndUpdate({ orderRef }, { $set: updates });
        }
        if (order.categoryId) {
          await TicketCategory.findByIdAndUpdate(order.categoryId, {
            $inc: {
              reservedCount: -order.quantity,
              soldCount: order.quantity
            }
          });
        }
      } catch (err) {
        console.warn('MongoDB order verification update warning:', err.message);
      }
    }

    res.json({
      success: true,
      message: 'Sandbox order successfully verified with genuine QR code issuance.',
      order: order.toObject ? order.toObject() : (updatedLocal || order)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/tickets/track-third-party
 * Logs when a visitor books tickets through an external/third-party booking link
 * and records it immediately in the Admin Backend Orders and Pass statistics.
 */
router.post('/track-third-party', async (req, res) => {
  try {
    const {
      buyerName = 'Guest (Partner Ticket Booking)',
      buyerEmail = 'external_booking@battleofthemaroons.lk',
      buyerPhone = '',
      categoryName = 'Official Partner Admission',
      targetUrl = '',
      quantity = 1,
      totalAmount = 0,
      matchFormat = '3day'
    } = req.body || {};

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderRef = `BOM-97-EXT-${randomSuffix}`;

    // Generate High-Speed, High-Contrast QR Code for instant gate scanning
    const qrCodeData = await QRCode.toDataURL(orderRef, {
      errorCorrectionLevel: 'M',
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });

    const orderData = {
      orderRef,
      orderNumber: orderRef,
      buyerName: (buyerName || 'Guest User').trim(),
      buyerEmail: (buyerEmail || 'external_booking@battleofthemaroons.lk').trim().toLowerCase(),
      buyerPhone: (buyerPhone || '').trim(),
      schoolAffiliation: 'neutral',
      matchFormat,
      categoryName,
      quantity: Number(quantity) || 1,
      unitPrice: Number(totalAmount) || 0,
      totalAmount: Number(totalAmount) || 0,
      currency: "LKR",
      status: "VERIFIED",
      payhereMethod: "THIRD_PARTY_PARTNER",
      payherePaymentId: `EXT_${Date.now()}`,
      verificationNotes: `Booked via Official Third-Party Partner Link: ${targetUrl || 'External Link'}`,
      verifiedAt: new Date().toISOString(),
      qrCodeData,
      ipAddress: req.ip || req.socket.remoteAddress || '',
      createdAt: new Date().toISOString()
    };

    let order = null;
    if (isDbConnected()) {
      try {
        order = await TicketOrder.create(orderData);
      } catch (err) {
        console.error('MongoDB external order creation error:', err.message || err);
      }
    }

    if (!order) {
      order = { ...orderData, _id: `ord_${Date.now()}` };
    }

    const plainOrder = order.toObject ? order.toObject() : order;
    localStore.addOrder(plainOrder);
    memoryOrders.set(orderRef, plainOrder);

    res.status(201).json({
      success: true,
      orderRef,
      order: plainOrder,
      message: 'Third-party ticket booking recorded successfully.'
    });
  } catch (error) {
    console.error('Third-party booking tracking error:', error);
    res.status(500).json({ success: false, message: 'Could not record third-party booking.' });
  }
});

/**
 * GET /api/tickets/order/:orderRef
 * Public order status lookup for guest receipt & QR code inspection
 */
router.get('/order/:orderRef', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  try {
    let order = null;
    if (isDbConnected()) {
      try {
        order = await TicketOrder.findOne({ orderRef: req.params.orderRef })
          .select('-ipAddress -__v');
      } catch (e) {}
    }

    if (!order && memoryOrders.has(req.params.orderRef)) {
      order = memoryOrders.get(req.params.orderRef);
    }

    if (!order) {
      const all = localStore.getOrders();
      order = all.find(o => o.orderRef === req.params.orderRef || o.orderNumber === req.params.orderRef || String(o._id) === String(req.params.orderRef));
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Ticket pass order reference not found.' });
    }

    // Auto-verify and generate QR if not yet present
    const plain = order.toObject ? order.toObject() : { ...order };
    if (!plain.qrCodeData || plain.status !== 'VERIFIED') {
      try {
        plain.qrCodeData = await QRCode.toDataURL(plain.orderRef, {
          errorCorrectionLevel: 'M',
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' }
        });
        plain.status = 'VERIFIED';
        plain.verifiedAt = plain.verifiedAt || new Date().toISOString();

        localStore.updateOrder(plain.orderRef, { status: 'VERIFIED', qrCodeData: plain.qrCodeData, verifiedAt: plain.verifiedAt });
        memoryOrders.set(plain.orderRef, plain);

        if (isDbConnected()) {
          try {
            await TicketOrder.findOneAndUpdate(
              { orderRef: plain.orderRef },
              { status: 'VERIFIED', qrCodeData: plain.qrCodeData, verifiedAt: plain.verifiedAt }
            );
          } catch (e) {}
        }
      } catch (err) {
        console.error('Auto QR generation error:', err);
      }
    }

    res.json({ success: true, order: plain });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

