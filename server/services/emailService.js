/**
 * BATTLE OF THE MAROONS — OFFICIAL E-TICKET EMAIL DISPATCH SERVICE
 * 
 * Generates and sends official digital QR passes directly to buyers' verified email addresses.
 * Supports SMTP (Gmail, Resend, SendGrid, Amazon SES, or custom corporate SMTP).
 * When SMTP is not configured, provides non-blocking simulation and logging.
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

let transporter = null;

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || '';
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || '';

  if (!user || !pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  return transporter;
}

/**
 * Generate official commemorative HTML email template
 */
function buildTicketEmailHtml(order, qrCid) {
  const formatTitle = order.matchFormat === '3day'
    ? '97th 3-Day Traditional Encounter'
    : 'Limited Overs One-Day Encounter (Day-Night)';

  const datesText = order.matchFormat === '3day'
    ? 'March 2027 • Days 1, 2 & 3'
    : 'March 2027 • 2:00 PM Onwards';

  const totalFormatted = (order.totalAmount || 0).toLocaleString();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Official 97th Battle of the Maroons E-Ticket</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0d0306;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0d0306;
      padding: 30px 10px;
    }
    .main-card {
      max-width: 600px;
      margin: 0 auto;
      background: linear-gradient(180deg, #24050d 0%, #150308 100%);
      border: 2px solid #d4af37;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    }
    .header {
      background: linear-gradient(135deg, #540c1a 0%, #360710 100%);
      padding: 28px 24px;
      text-align: center;
      border-bottom: 2px solid rgba(212, 175, 55, 0.4);
    }
    .header-tag {
      font-family: 'Courier New', Courier, monospace;
      font-size: 11px;
      letter-spacing: 2.5px;
      color: #ffd700;
      text-transform: uppercase;
      font-weight: bold;
      margin-bottom: 6px;
    }
    .header-title {
      font-size: 24px;
      font-weight: 900;
      color: #ffffff;
      margin: 0 0 6px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .header-subtitle {
      font-size: 13px;
      color: #e5d3d8;
      margin: 0;
    }
    .content {
      padding: 28px 24px;
    }
    .greeting {
      font-size: 16px;
      line-height: 1.5;
      color: #f3e8eb;
      margin-bottom: 20px;
    }
    .qr-container {
      background: #ffffff;
      border: 3px solid #d4af37;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      margin: 24px auto;
      max-width: 250px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
    .qr-img {
      width: 210px;
      height: 210px;
      display: block;
      margin: 0 auto;
    }
    .ref-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 18px;
      font-weight: 900;
      color: #1a0409;
      letter-spacing: 1.5px;
      margin-top: 8px;
    }
    .instruction-pill {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid #10b981;
      color: #34d399;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      margin: 16px 0 24px;
      font-family: 'Courier New', Courier, monospace;
    }
    .ticket-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      background: rgba(255,255,255,0.03);
      border-radius: 8px;
      overflow: hidden;
    }
    .ticket-table td {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.15);
      font-size: 14px;
    }
    .label-col {
      color: #c9b6bc;
      width: 40%;
      font-size: 12px;
      text-transform: uppercase;
      font-family: 'Courier New', Courier, monospace;
      letter-spacing: 1px;
    }
    .val-col {
      color: #ffffff;
      font-weight: bold;
      text-align: right;
    }
    .highlight-val {
      color: #ffd700;
      font-size: 16px;
    }
    .rules-card {
      background: rgba(0,0,0,0.4);
      border-left: 3px solid #d4af37;
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      font-size: 12px;
      color: #d1c0c6;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .rules-card ul {
      margin: 6px 0 0 16px;
      padding: 0;
    }
    .footer {
      background: #090104;
      padding: 20px;
      text-align: center;
      border-top: 1px solid rgba(255,255,255,0.08);
      font-size: 11px;
      color: #8c767d;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      
      <!-- Masthead Header -->
      <div class="header">
        <div class="header-tag">● OFFICIAL DIGITAL PASS & RECEIPT ●</div>
        <h1 class="header-title">Battle of the Maroons</h1>
        <p class="header-subtitle">97th Centenary Encounter • Ananda vs Nalanda</p>
      </div>

      <!-- Content -->
      <div class="content">
        <div class="greeting">
          Dear <strong>${order.buyerName}</strong>,<br><br>
          Thank you for reserving your passes for the prestigious Battle of the Maroons. Your official passholder admission ticket is confirmed and attached below.
        </div>

        <!-- Official Gate QR Code Presentation -->
        <div class="qr-container">
          <img src="${qrCid ? `cid:${qrCid}` : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=2&color=0-0-0&data=${encodeURIComponent(order.orderRef)}`}" alt="Gate Entry QR Code" class="qr-img" />
          <div class="ref-code">${order.orderRef}</div>
        </div>

        <div class="instruction-pill">
          ⚡ SCAN AT SSC TURNSTILES FOR INSTANT ENTRY
        </div>

        <!-- Ticket Details Table -->
        <table class="ticket-table">
          <tr>
            <td class="label-col">Passholder</td>
            <td class="val-col">${order.buyerName}</td>
          </tr>
          <tr>
            <td class="label-col">Reference ID</td>
            <td class="val-col highlight-val" style="font-family: monospace;">${order.orderRef}</td>
          </tr>
          <tr>
            <td class="label-col">Match</td>
            <td class="val-col">${formatTitle}</td>
          </tr>
          <tr>
            <td class="label-col">Ground Enclosure</td>
            <td class="val-col" style="color: #6ee7b7;">${order.categoryName}</td>
          </tr>
          <tr>
            <td class="label-col">Pass Quantity</td>
            <td class="val-col">${order.quantity} Pass(es)</td>
          </tr>
          <tr>
            <td class="label-col">Total Amount</td>
            <td class="val-col highlight-val">LKR ${totalFormatted}</td>
          </tr>
          <tr>
            <td class="label-col">Venue</td>
            <td class="val-col">Sinhalese Sports Club (SSC) Grounds, Colombo</td>
          </tr>
          <tr>
            <td class="label-col">Dates</td>
            <td class="val-col">${datesText}</td>
          </tr>
        </table>

        <!-- Gate Admission Instructions -->
        <div class="rules-card">
          <strong style="color: #ffd700;">Important Match Day Notice:</strong>
          <ul>
            <li>Please display this email or the attached QR code image directly on your mobile device at the turnstile gate.</li>
            <li>Increase your screen brightness when presenting the QR code to the gate steward's laser scanner.</li>
            <li>Gates open promptly at 8:00 AM on match mornings.</li>
            <li>Passes are unique and non-transferable once admitted at the gate.</li>
          </ul>
        </div>

      </div>

      <!-- Footer -->
      <div class="footer">
        Joint Match Organizing Committee Secretariat<br>
        Ananda College Colombo &bull; Nalanda College Colombo<br>
        Inquiries: secretariat@battleofthemaroons.lk &bull; Website: battleofthemaroons.lk
      </div>

    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Dispatch Ticket Confirmation Email with Embedded QR
 * 
 * Supports:
 * 1. Resend HTTP API (via RESEND_API_KEY — no email passwords needed)
 * 2. Standard SMTP / Gmail (via SMTP_USER and SMTP_PASS)
 * 
 * @param {Object} order - Full ticket order object
 * @returns {Promise<{success: boolean, simulated?: boolean, messageId?: string, error?: string}>}
 */
export async function sendTicketConfirmationEmail(order) {
  if (!order || !order.buyerEmail) {
    console.warn('⚠️ [EMAIL SERVICE] Cannot send email: missing order or buyerEmail.');
    return { success: false, error: 'Missing recipient email' };
  }

  const recipient = order.buyerEmail.trim().toLowerCase();
  const orderRef = order.orderRef || 'BOM-PASS';
  const resendApiKey = process.env.RESEND_API_KEY;

  // --------------------------------------------------------------------------
  // METHOD 1: Resend HTTP REST API (Zero Password / API Key only)
  // --------------------------------------------------------------------------
  if (resendApiKey) {
    try {
      const fromSender = process.env.EMAIL_FROM || process.env.SMTP_FROM || 'Battle of the Maroons <onboarding@resend.dev>';
      const subject = `Your Official 97th Battle of the Maroons E-Ticket (${orderRef})`;
      const html = buildTicketEmailHtml(order, null);

      const attachments = [];
      if (order.qrCodeData && order.qrCodeData.startsWith('data:image/')) {
        const base64Data = order.qrCodeData.split(',')[1];
        if (base64Data) {
          attachments.push({
            filename: `${orderRef}-pass-qrcode.png`,
            content: base64Data
          });
        }
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromSender,
          to: [recipient],
          subject,
          html,
          attachments
        })
      });

      const resData = await res.json();
      if (res.ok) {
        console.log(`✅ [EMAIL SERVICE: RESEND] E-Ticket delivered to ${recipient} (Ref: ${orderRef}, ID: ${resData.id})`);
        return { success: true, simulated: false, messageId: resData.id };
      } else {
        console.error(`❌ [EMAIL SERVICE: RESEND] API Error:`, resData);
      }
    } catch (apiErr) {
      console.error(`❌ [EMAIL SERVICE: RESEND] Network error:`, apiErr.message || apiErr);
    }
  }

  // --------------------------------------------------------------------------
  // METHOD 2: Standard SMTP / Gmail (Nodemailer)
  // --------------------------------------------------------------------------
  const mailTransporter = getTransporter();

  // If neither Resend nor SMTP is configured
  if (!mailTransporter) {
    console.log(`✉️ [EMAIL SERVICE] Notice: To send real emails to ${recipient}, please add either a Gmail App Password (SMTP_USER + SMTP_PASS) or a free Resend key (RESEND_API_KEY) in .env.`);
    return {
      success: true,
      simulated: true,
      message: 'Email service simulated. Configure SMTP_USER/PASS or RESEND_API_KEY in .env for live inbox delivery.'
    };
  }

  try {
    const sender = process.env.SMTP_FROM || process.env.SMTP_USER || '"Battle of the Maroons Official" <tickets@battleofthemaroons.lk>';
    const subject = `Your Official 97th Battle of the Maroons E-Ticket (${orderRef})`;

    // Convert base64 data URL to image buffer for inline CID attachment
    const attachments = [];
    let qrCid = 'gate-entry-qr';

    if (order.qrCodeData && order.qrCodeData.startsWith('data:image/')) {
      const base64Data = order.qrCodeData.split(',')[1];
      if (base64Data) {
        const qrBuffer = Buffer.from(base64Data, 'base64');
        attachments.push({
          filename: `${orderRef}-pass-qrcode.png`,
          content: qrBuffer,
          cid: qrCid,
          contentType: 'image/png'
        });
      }
    } else {
      qrCid = null;
    }

    const html = buildTicketEmailHtml(order, qrCid);

    const mailOptions = {
      from: sender,
      to: recipient,
      subject,
      html,
      attachments
    };

    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`✅ [EMAIL SERVICE: SMTP] E-Ticket dispatched successfully to ${recipient} (Ref: ${orderRef}, MessageId: ${info.messageId})`);

    return {
      success: true,
      simulated: false,
      messageId: info.messageId
    };
  } catch (err) {
    console.error(`❌ [EMAIL SERVICE: SMTP] Failed to send e-ticket email to ${recipient}:`, err.message || err);
    return {
      success: false,
      error: err.message
    };
  }
}

