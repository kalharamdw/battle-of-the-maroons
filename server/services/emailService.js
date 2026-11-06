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

  const matchTypeBadge = order.matchFormat === '3day'
    ? '🏏 3-DAY TRADITIONAL TEST ENCOUNTER'
    : '🏆 50-OVER LIMITED OVERS MATCH';

  const totalFormatted = (order.totalAmount || 0).toLocaleString();
  const qrUrl = qrCid ? `cid:${qrCid}` : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=2&color=0-0-0&data=${encodeURIComponent(order.orderRef)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Official 97th Battle of the Maroons E-Ticket</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0a0204;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0204;">
  <div style="width: 100%; background-color: #0a0204; padding: 32px 10px;">
    <!-- Main Commemorative Ticket Container -->
    <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; margin: 0 auto; background: #1a0409; border: 2px solid #d4af37; border-radius: 18px; overflow: hidden; box-shadow: 0 16px 50px rgba(0,0,0,0.85);">
      
      <!-- Top Gold Foil Trim Bar -->
      <tr>
        <td style="background: linear-gradient(90deg, #d4af37 0%, #fff1a8 50%, #d4af37 100%); height: 6px; font-size: 0; line-height: 0;">&nbsp;</td>
      </tr>

      <!-- Cricket Crest & Masthead -->
      <tr>
        <td style="background: linear-gradient(180deg, #420814 0%, #26040b 100%); padding: 32px 24px 24px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.4);">
          <!-- Centenary Ribbon -->
          <div style="display: inline-block; background: rgba(212, 175, 55, 0.15); border: 1px solid #d4af37; border-radius: 30px; padding: 5px 16px; margin-bottom: 14px;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 800; color: #ffd700; letter-spacing: 2px; text-transform: uppercase;">
              ★ 97TH CENTENARY COMMEMORATIVE PASS ★
            </span>
          </div>

          <!-- Cricket Bats & Main Title -->
          <h1 style="margin: 0 0 6px; font-size: 26px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 1.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.7);">
            🏏 BATTLE OF THE MAROONS 🏏
          </h1>
          <div style="font-size: 16px; font-weight: 700; color: #ffd700; letter-spacing: 1px; margin-bottom: 6px;">
            ANANDA COLLEGE <span style="color: #ffffff; font-weight: 400; padding: 0 4px;">vs</span> NALANDA COLLEGE
          </div>
          <div style="font-size: 12px; color: #e5cfd5; letter-spacing: 0.5px; text-transform: uppercase;">
            🏟️ Sinhalese Sports Club (SSC) Grounds &bull; Maitland Place, Colombo
          </div>

          <!-- Match Format Badge -->
          <div style="margin-top: 16px;">
            <span style="display: inline-block; background: #064e3b; border: 1px solid #10b981; color: #6ee7b7; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: bold; padding: 6px 14px; border-radius: 6px; letter-spacing: 1px;">
              ${matchTypeBadge}
            </span>
          </div>
        </td>
      </tr>

      <!-- Match Day Schedule Quick Bar -->
      <tr>
        <td style="background: #140206; padding: 12px 20px; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="text-align: center;">
            <tr>
              <td width="33%" style="padding: 6px; border-right: 1px solid rgba(212, 175, 55, 0.2);">
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #a89299; text-transform: uppercase;">Dates &amp; Play</div>
                <div style="font-size: 12px; font-weight: 800; color: #ffffff; margin-top: 2px;">${datesText}</div>
              </td>
              <td width="33%" style="padding: 6px; border-right: 1px solid rgba(212, 175, 55, 0.2);">
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #a89299; text-transform: uppercase;">Gates Open</div>
                <div style="font-size: 12px; font-weight: 800; color: #ffd700; margin-top: 2px;">08:00 AM Prompt</div>
              </td>
              <td width="33%" style="padding: 6px;">
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #a89299; text-transform: uppercase;">First Ball</div>
                <div style="font-size: 12px; font-weight: 800; color: #ffffff; margin-top: 2px;">09:45 AM</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Passholder & Enclosure Details Section -->
      <tr>
        <td style="padding: 24px 24px 16px;">
          <div style="font-size: 14px; color: #e8d7db; line-height: 1.5; margin-bottom: 18px;">
            Dear <strong>${order.buyerName}</strong>,<br>
            Your official passholder admission for the 97th Battle of the Maroons is confirmed. Please present the scannable gate pass below upon arrival at the SSC turnstiles.
          </div>

          <!-- Enclosure Highlight Banner -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, rgba(84, 12, 26, 0.8) 0%, rgba(36, 5, 13, 0.9) 100%); border: 1.5px solid #d4af37; border-radius: 10px; margin-bottom: 18px; overflow: hidden;">
            <tr>
              <td style="padding: 14px 18px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #ffd700; letter-spacing: 1.5px; text-transform: uppercase; font-weight: bold;">
                        ASSIGNED GROUND ENCLOSURE
                      </div>
                      <div style="font-size: 18px; font-weight: 900; color: #ffffff; margin-top: 3px;">
                        ${order.categoryName}
                      </div>
                      <div style="font-size: 12px; color: #6ee7b7; margin-top: 2px;">
                        📍 Designated Turnstile: Gate 02 &amp; Gate 03 (Maitland Place Entrance)
                      </div>
                    </td>
                    <td align="right" valign="middle">
                      <div style="background: rgba(212, 175, 55, 0.2); border: 1px solid #d4af37; padding: 6px 12px; border-radius: 6px; text-align: center;">
                        <span style="font-size: 18px; font-weight: 900; color: #ffd700; display: block;">${order.quantity}</span>
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 9px; color: #ffffff; text-transform: uppercase; font-weight: bold;">PASS(ES)</span>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Details Table -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: rgba(0,0,0,0.3); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
            <tr>
              <td style="padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #a89299; text-transform: uppercase; width: 40%;">Passholder</td>
              <td style="padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: bold; color: #ffffff; text-align: right;">${order.buyerName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #a89299; text-transform: uppercase;">Reference Code</td>
              <td style="padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: 'Courier New', Courier, monospace; font-size: 14px; font-weight: 900; color: #ffd700; text-align: right; letter-spacing: 1px;">${order.orderRef}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #a89299; text-transform: uppercase;">Admissions</td>
              <td style="padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: bold; color: #ffffff; text-align: right;">${order.quantity} Person(s)</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #a89299; text-transform: uppercase;">Total Paid</td>
              <td style="padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: 'Courier New', Courier, monospace; font-size: 14px; font-weight: 900; color: #ffd700; text-align: right;">LKR ${totalFormatted}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #a89299; text-transform: uppercase;">Status</td>
              <td style="padding: 10px 16px; font-size: 12px; font-weight: bold; color: #34d399; text-align: right;">● ADMISSION CONFIRMED</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Perforated Ticket Stub Divider with Circular Notches -->
      <tr>
        <td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="22" style="font-size:0; line-height:0; width: 22px; height: 34px; background-color: #0a0204; border-radius: 0 17px 17px 0; border-top: 2px solid #d4af37; border-right: 2px solid #d4af37; border-bottom: 2px solid #d4af37; border-left: none;">&nbsp;</td>
              <td style="border-bottom: 2px dashed #d4af37; height: 34px; text-align: center; vertical-align: middle;">
                <span style="background-color: #1a0409; padding: 3px 16px; font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #ffd700; letter-spacing: 2px; font-weight: bold; text-transform: uppercase;">
                  ✂️ TURNSTILE GATE ADMISSION STUB ✂️
                </span>
              </td>
              <td width="22" style="font-size:0; line-height:0; width: 22px; height: 34px; background-color: #0a0204; border-radius: 17px 0 0 17px; border-top: 2px solid #d4af37; border-left: 2px solid #d4af37; border-bottom: 2px solid #d4af37; border-right: none;">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Scannable QR Gate Stub -->
      <tr>
        <td style="background: linear-gradient(180deg, #1f040b 0%, #110206 100%); padding: 24px; text-align: center;">
          
          <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 800; color: #ffd700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">
            ⚡ OPTICAL TURNSTILE SCAN PASS ⚡
          </div>

          <!-- White High-Contrast QR Card with Gold Trim -->
          <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; background: #ffffff; border: 3px solid #d4af37; border-radius: 14px; padding: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
            <tr>
              <td align="center">
                <img src="${qrUrl}" alt="Gate Admission QR Code" width="210" height="210" style="display: block; width: 210px; height: 210px; border: 0;" />
                <div style="margin-top: 10px; font-family: 'Courier New', Courier, monospace; font-size: 18px; font-weight: 900; color: #0c0205; letter-spacing: 2px;">
                  ${order.orderRef}
                </div>
                <div style="font-size: 10px; font-weight: 800; color: #064e3b; letter-spacing: 1px; text-transform: uppercase; margin-top: 2px;">
                  ✓ OFFICIAL COMMITTEE VERIFIED
                </div>
              </td>
            </tr>
          </table>

          <!-- Admission Instruction Pill -->
          <div style="margin: 18px auto 12px; max-width: 440px; background: rgba(16, 185, 129, 0.12); border: 1px solid #10b981; border-radius: 8px; padding: 10px 14px; text-align: center;">
            <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 800; color: #34d399; letter-spacing: 1px;">
              ⚡ SCAN AT SSC TURNSTILES FOR INSTANT ENTRY
            </div>
            <div style="font-size: 11px; color: #d1fae5; margin-top: 4px; line-height: 1.4;">
              Present this QR directly on your mobile screen or screenshot. Increase screen brightness to 100% when presenting to the steward's laser scanner.
            </div>
          </div>

          <!-- Match Day Gate Notice Card -->
          <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 16px; background: rgba(0,0,0,0.4); border-left: 3px solid #d4af37; border-radius: 0 8px 8px 0; text-align: left;">
            <tr>
              <td style="padding: 12px 16px; font-size: 11px; color: #cfbec4; line-height: 1.6;">
                <strong style="color: #ffd700; text-transform: uppercase; font-family: 'Courier New', Courier, monospace; letter-spacing: 1px; display: block; margin-bottom: 4px;">
                  Match Day Admission Notice:
                </strong>
                &bull; Gates open at 8:00 AM on each match day.<br>
                &bull; This pass admits <strong>${order.quantity} Person(s)</strong> to the <strong>${order.categoryName}</strong>.<br>
                &bull; Turnstile barcode/QR is unique and non-transferable once scanned at the turnstiles.<br>
                &bull; Standard SSC ground regulations and spirit of cricket policies apply.
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Footer & Committee Seal -->
      <tr>
        <td style="background: #090104; padding: 22px 24px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.3);">
          <div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #d4af37; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px;">
            ★ JOINT MATCH ORGANIZING COMMITTEE ★
          </div>
          <div style="font-size: 12px; color: #ffffff; font-weight: bold; margin-bottom: 4px;">
            Ananda College Colombo &bull; Nalanda College Colombo
          </div>
          <div style="font-size: 10px; color: #8f7980; line-height: 1.5;">
            Inquiries: <a href="mailto:secretariat@battleofthemaroons.lk" style="color: #ffd700; text-decoration: none;">secretariat@battleofthemaroons.lk</a> &bull; Web: <a href="https://battleofthemaroons.lk" style="color: #ffd700; text-decoration: none;">battleofthemaroons.lk</a>
          </div>
        </td>
      </tr>

      <!-- Bottom Gold Foil Trim Bar -->
      <tr>
        <td style="background: linear-gradient(90deg, #d4af37 0%, #fff1a8 50%, #d4af37 100%); height: 6px; font-size: 0; line-height: 0;">&nbsp;</td>
      </tr>

    </table>
  </div>
</body>
</html>`;
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
  const mailTransporter = getTransporter();
  const resendApiKey = process.env.RESEND_API_KEY;

  // --------------------------------------------------------------------------
  // METHOD 1: Direct SMTP / Gmail (Instant 1-2s delivery bypassing shared queues)
  // --------------------------------------------------------------------------
  if (mailTransporter) {
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
      console.log(`⚡ [EMAIL SERVICE: SMTP] E-Ticket delivered instantly to ${recipient} (Ref: ${orderRef}, MessageId: ${info.messageId})`);

      return {
        success: true,
        simulated: false,
        messageId: info.messageId
      };
    } catch (err) {
      console.error(`❌ [EMAIL SERVICE: SMTP] Failed:`, err.message || err);
      // Fall through to Resend if SMTP failed
    }
  }

  // --------------------------------------------------------------------------
  // METHOD 2: Resend HTTP REST API
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
        console.log(`✅ [EMAIL SERVICE: RESEND] E-Ticket sent to ${recipient} (Ref: ${orderRef}, ID: ${resData.id})`);
        return { success: true, simulated: false, messageId: resData.id };
      } else {
        console.error(`❌ [EMAIL SERVICE: RESEND] API Error:`, resData);
      }
    } catch (apiErr) {
      console.error(`❌ [EMAIL SERVICE: RESEND] Network error:`, apiErr.message || apiErr);
    }
  }

  // If neither Resend nor SMTP is configured
  console.log(`✉️ [EMAIL SERVICE] Notice: To send real emails to ${recipient}, please configure SMTP_USER/PASS or RESEND_API_KEY in .env.`);
  return {
    success: true,
    simulated: true,
    message: 'Email service simulated.'
  };
}

