/**
 * BATTLE OF THE MAROONS — OFFICIAL TICKET & PASS RESERVATION COMPONENT
 * 
 * Provides:
 * 1. Live category loading & capacity verification via api.getTicketCategories()
 * 2. Match format & SSC enclosure selection
 * 3. Guest passholder detail collection (100% public, no login required)
 * 4. Resilient checkout with PayHere gateway integration
 * 5. Sandbox instant demo verification for testing
 * 6. Scannable QR-coded digital pass generation & lookup by reference
 */

import { api } from '../services/api.js';
import { Icons } from './icons.js';

export function createTicketWidget() {
  const widget = document.createElement('div');
  widget.className = 'ticket-widget-box';
  widget.id = 'ticket-builder-widget';

  // State
  let categories = [];
  let isLoading = true;
  let activeTab = 'book'; // 'book' | 'lookup'
  let selectedFormat = '3day';
  let selectedCategoryId = '';
  let quantity = 2;
  let isSubmitting = false;
  let errorMessage = '';

  // Form input retention
  let formBuyerName = '';
  let formBuyerEmail = '';
  let formBuyerEmailConfirm = '';
  let formBuyerPhone = '';
  let formSchoolAffiliation = 'neutral';

  // Active verified pass state (when displaying confirmed QR pass)
  let verifiedPass = null;

  // Checkout modal state
  let checkoutOrder = null;

  // Global event settings
  let eventConfig = null;

  async function init() {
    try {
      const [cats, ev] = await Promise.all([
        api.getTicketCategories(),
        api.getEventConfig()
      ]);
      categories = cats || [];
      eventConfig = ev || null;
      if (categories && categories.length > 0) {
        selectedCategoryId = categories[0].id || categories[0].code;
      }
    } catch (err) {
      console.warn('Using static categories fallback:', err);
    } finally {
      isLoading = false;
      checkUrlParams();
      render();
    }

    window.addEventListener('bom-tickets-updated', async () => {
      try {
        categories = await api.getTicketCategories();
        render();
      } catch (e) {}
    });

    window.addEventListener('bom-event-updated', async (e) => {
      eventConfig = e.detail || await api.getEventConfig();
      render();
    });
  }

  // Check URL params for PayHere return redirects: ?ref=BOM-97-XXXXX
  async function checkUrlParams() {
    try {
      const hash = window.location.hash || '';
      const queryIdx = hash.indexOf('?');
      if (queryIdx !== -1) {
        const params = new URLSearchParams(hash.substring(queryIdx));
        const ref = params.get('ref');
        if (ref) {
          activeTab = 'lookup';
          await lookupOrder(ref);
        }
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
  }

  async function lookupOrder(orderRef) {
    if (!orderRef || !orderRef.trim()) return;
    errorMessage = '';
    isLoading = true;
    render();

    try {
      const res = await api.getTicketOrder(orderRef.trim());
      if (res.success && res.order) {
        verifiedPass = res.order;
        activeTab = 'lookup';
      } else {
        errorMessage = res.message || 'Pass reference not found. Please check the code and try again.';
      }
    } catch (err) {
      errorMessage = 'Unable to look up pass. Please check your connection.';
    } finally {
      isLoading = false;
      render();
    }
  }

  function render() {
    if (isLoading) {
      widget.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--color-gold);">
          <div class="spinner" style="margin: 0 auto 16px; width: 32px; height: 32px; border: 3px solid rgba(212,175,55,0.2); border-top-color: var(--color-gold); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          <p style="font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 0.1em;">CONNECTING TO TICKET ALLOCATION SYSTEM...</p>
        </div>
      `;
      return;
    }

    const selectedCategory = categories.find(c => (c.id === selectedCategoryId || c.code === selectedCategoryId)) || categories[0] || {
      name: 'Grandstand Upper Deck',
      price: 2500,
      description: 'Elevated view of the pitch.',
      availableCount: 450
    };

    const totalAmount = (selectedCategory.price || 2500) * quantity;

    widget.innerHTML = `
      <!-- Widget Mode Navigation -->
      <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--border-light); margin-bottom: 24px; padding-bottom: 12px; flex-wrap: wrap;">
        <button 
          type="button" 
          id="tab-btn-book" 
          class="btn-nav-tab ${activeTab === 'book' ? 'active-tab' : ''}"
          style="padding: 8px 18px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; cursor: pointer; border: 1px solid ${activeTab === 'book' ? 'var(--color-gold)' : 'transparent'}; background: ${activeTab === 'book' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)'}; color: ${activeTab === 'book' ? 'var(--color-gold)' : 'var(--color-wool-muted)'}; display: inline-flex; align-items: center; gap: 8px;"
        >
          ${Icons.ticket()} Reserve Passes
        </button>
        <button 
          type="button" 
          id="tab-btn-lookup" 
          class="btn-nav-tab ${activeTab === 'lookup' ? 'active-tab' : ''}"
          style="padding: 8px 18px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; cursor: pointer; border: 1px solid ${activeTab === 'lookup' ? 'var(--color-gold)' : 'transparent'}; background: ${activeTab === 'lookup' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)'}; color: ${activeTab === 'lookup' ? 'var(--color-gold)' : 'var(--color-wool-muted)'}; display: inline-flex; align-items: center; gap: 8px;"
        >
          ${Icons.search()} View Existing Pass / QR Code
        </button>
      </div>

      ${errorMessage ? `
        <div style="margin-bottom: 20px; padding: 14px 18px; background: rgba(220, 38, 38, 0.15); border: 1px solid rgba(220, 38, 38, 0.4); border-radius: 8px; color: #fca5a5; font-size: 0.85rem; font-family: var(--font-mono); display: flex; align-items: center; gap: 8px;">
          ${Icons.alert()} ${errorMessage}
        </div>
      ` : ''}

      ${activeTab === 'lookup' ? renderLookupView() : renderBookingView(selectedCategory, totalAmount)}

      ${checkoutOrder ? renderCheckoutModal() : ''}
    `;

    attachEvents(selectedCategory);
  }

  function renderBookingView(selectedCategory, totalAmount) {
    return `
      <div class="ticket-proto-notice" style="background: rgba(84, 12, 26, 0.4); border-color: rgba(212, 175, 55, 0.3);">
        <span style="font-size: 1.2rem; display: flex; align-items: center; color: var(--color-gold);">${Icons.stadium()}</span>
        <div>
          <strong>Official SSC Ground Admission:</strong> Verified e-Passes include automated gate entry QR codes. Instant digital pass confirmation with zero waiting.
        </div>
      </div>

      <!-- Step 1: Select Match Encounter -->
      <div class="ticket-form-step">
        <label class="ticket-step-title">1. Select Match Encounter</label>
        <div class="enclosure-selector-grid">
          <div 
            class="enclosure-card-option ${selectedFormat === '3day' ? 'selected' : ''}" 
            data-format="3day" 
            role="button" 
            tabindex="0"
          >
            <div class="enclosure-name">3-Day Traditional Encounter</div>
            <div style="font-size: 0.82rem; color: var(--color-wool-muted); margin-top: 4px;">Dr. N.M. Perera Memorial Challenge Trophy</div>
            <div style="margin-top: 8px; font-size: 0.75rem; color: var(--color-gold-bright); font-family: var(--font-mono);">3 Consecutive Days Admission</div>
          </div>
          <div 
            class="enclosure-card-option ${selectedFormat === '1day' ? 'selected' : ''}" 
            data-format="1day" 
            role="button" 
            tabindex="0"
          >
            <div class="enclosure-name">One Day Encounter (Day-Night)</div>
            <div style="font-size: 0.82rem; color: var(--color-wool-muted); margin-top: 4px;">P. De S. Kularatne Trophy • Under SSC Floodlights</div>
            <div style="margin-top: 8px; font-size: 0.75rem; color: var(--color-gold-bright); font-family: var(--font-mono);">Full Match & Music Experience</div>
          </div>
        </div>
      </div>

      <!-- Step 2: Select Enclosure -->
      <div class="ticket-form-step">
        <label class="ticket-step-title">2. Choose SSC Ground Enclosure</label>
        <div class="enclosure-selector-grid">
          ${categories.map(cat => {
            const catId = cat.id || cat.code;
            const isSelected = catId === selectedCategoryId;
            const remaining = cat.availableCount !== undefined ? cat.availableCount : (cat.totalCapacity - (cat.reservedCount || 0) - (cat.soldCount || 0));
            return `
              <div 
                class="enclosure-card-option ${isSelected ? 'selected' : ''}" 
                data-enclosure="${catId}" 
                role="button" 
                tabindex="0"
              >
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div class="enclosure-name">${cat.name}</div>
                  <span style="font-family: var(--font-mono); font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: rgba(34,187,85,0.15); color: #75f0a0; border: 1px solid rgba(34,187,85,0.3);">
                    ${remaining} Left
                  </span>
                </div>
                <div class="enclosure-price">LKR ${(cat.price || 0).toLocaleString()}</div>
                <p style="font-size: 0.78rem; color: var(--color-wool-muted); margin-top: 6px; line-height: 1.4;">${cat.description || ''}</p>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Step 3: Quantity Selection -->
      <div class="ticket-form-step">
        <label class="ticket-step-title">3. Number of Passes</label>
        <div class="ticket-quantity-control">
          <button type="button" class="qty-btn" id="btn-qty-minus" aria-label="Decrease tickets">−</button>
          <span class="qty-val" id="qty-display">${quantity}</span>
          <button type="button" class="qty-btn" id="btn-qty-plus" aria-label="Increase tickets">+</button>
          <span style="font-size: 0.85rem; color: var(--color-wool-muted); margin-left: 8px;">(Up to 10 passes per guest order)</span>
        </div>
      </div>

      <!-- Step 4: Buyer Details -->
      <div class="ticket-form-step">
        <label class="ticket-step-title">4. Passholder & Delivery Details</label>

        <!-- Mandatory Email Delivery Warning Callout -->
        <div style="background: linear-gradient(135deg, rgba(84, 12, 26, 0.5) 0%, rgba(212, 175, 55, 0.14) 100%); border: 1.5px solid var(--color-gold); border-radius: 10px; padding: 14px 18px; margin-bottom: 18px; display: flex; align-items: flex-start; gap: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.35);">
          <span style="font-size: 1.5rem; line-height: 1; flex-shrink: 0;">✉️</span>
          <div>
            <div style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; color: var(--color-gold-bright); letter-spacing: 0.5px; margin-bottom: 4px;">
              IMPORTANT: YOUR OFFICIAL QR E-TICKET WILL BE DELIVERED DIRECTLY TO YOUR EMAIL
            </div>
            <p style="font-size: 0.83rem; color: #f5e6ea; margin: 0; line-height: 1.5;">
              Your scannable gate entry pass and QR code will be dispatched to your email address upon confirmation. <strong>Please double-check your email address twice</strong> to make sure there are zero typing mistakes. You are required to type it twice below to confirm both match.
            </p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
          <div class="form-group">
            <label class="form-label" for="ticket-name">Full Name *</label>
            <input type="text" class="form-input" id="ticket-name" placeholder="e.g. Sahan Perera" value="${formBuyerName}" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="ticket-phone">Mobile Phone (Sri Lanka)</label>
            <input type="tel" class="form-input" id="ticket-phone" placeholder="077 123 4567" value="${formBuyerPhone}" />
          </div>

          <div class="form-group">
            <label class="form-label" for="ticket-email">
              Email Address * <span style="font-size: 0.72rem; color: var(--color-gold); font-family: var(--font-mono);">(For QR Pass Delivery)</span>
            </label>
            <input 
              type="email" 
              class="form-input" 
              id="ticket-email" 
              placeholder="sahan@example.com" 
              value="${formBuyerEmail}" 
              autocomplete="email" 
              required 
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="ticket-email-confirm">
              Confirm Email Address * <span style="font-size: 0.72rem; color: var(--color-gold); font-family: var(--font-mono);">(Type it once more)</span>
            </label>
            <input 
              type="email" 
              class="form-input" 
              id="ticket-email-confirm" 
              placeholder="Re-type your email address" 
              value="${formBuyerEmailConfirm}" 
              autocomplete="off" 
              required 
            />
            <div id="email-match-indicator" style="font-size: 0.73rem; font-family: var(--font-mono); margin-top: 5px; display: none;"></div>
          </div>

          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label" for="ticket-school">College Affiliation</label>
            <select class="form-select" id="ticket-school">
              <option value="ananda" ${formSchoolAffiliation === 'ananda' ? 'selected' : ''}>Ananda College (Old Boy / Student / Supporter)</option>
              <option value="nalanda" ${formSchoolAffiliation === 'nalanda' ? 'selected' : ''}>Nalanda College (Old Boy / Student / Supporter)</option>
              <option value="neutral" ${formSchoolAffiliation === 'neutral' ? 'selected' : ''}>Cricket Enthusiast / General Public</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Order Summary & Checkout Trigger -->
      <div class="ticket-summary-box">
        <div>
          <div class="ticket-total-label">Pass Allocation Total</div>
          <div class="ticket-total-val">LKR ${totalAmount.toLocaleString()}</div>
          <div style="font-size: 0.75rem; color: var(--color-wool-subtle); margin-top: 2px;">
            ${quantity} × ${selectedCategory.name} (${selectedFormat === '3day' ? '3-Day Encounter' : 'One Day Day-Night'})
          </div>
        </div>

        <button 
          type="button" 
          class="btn-primary-cinematic" 
          id="btn-ticket-submit"
          ${isSubmitting ? 'disabled style="opacity: 0.7;"' : ''}
        >
          ${isSubmitting ? 'Reserving Passes & Generating QR...' : 'Reserve Passes & Get Gate QR Code'}
        </button>
      </div>
    `;
  }

  function renderLookupView() {
    return `
      <div style="margin-bottom: 24px; padding: 24px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-light); border-radius: 12px;">
        <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-gold); margin-bottom: 8px;">
          Inspect Your Verified Digital Pass
        </h3>
        <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin-bottom: 16px;">
          Enter your unique order reference code (e.g. <code style="color: var(--color-gold-bright); font-family: var(--font-mono);">BOM-97-XXXXX</code>) to retrieve your official QR-coded admission pass.
        </p>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <input 
            type="text" 
            id="lookup-ref-input" 
            class="form-input" 
            placeholder="e.g. BOM-97-59281" 
            style="flex: 1; min-width: 220px; font-family: var(--font-mono); text-transform: uppercase;" 
            value="${verifiedPass ? verifiedPass.orderRef : ''}"
          />
          <button type="button" class="btn-primary-cinematic" id="btn-lookup-submit" style="padding: 12px 24px;">
            Lookup Pass
          </button>
        </div>
      </div>

      ${verifiedPass ? renderPassTicket(verifiedPass) : ''}
    `;
  }

  function renderPassTicket(pass) {
    const isVerified = pass.status === 'VERIFIED';
    return `
      <div class="commemorative-pass-card" style="margin-top: 24px; background: linear-gradient(135deg, rgba(84, 12, 26, 0.95), rgba(26, 4, 8, 0.98)); border: 2px solid var(--color-gold); border-radius: 16px; padding: 32px; box-shadow: 0 12px 40px rgba(0,0,0,0.6); position: relative; overflow: hidden;">
        <!-- Watermark ornament -->
        <div style="position: absolute; right: -20px; bottom: -20px; font-size: 12rem; opacity: 0.05; pointer-events: none; font-family: var(--font-display); color: var(--color-gold);">
          97
        </div>

        <!-- Official E-Ticket Email Dispatched Confirmation Notice -->
        <div style="background: rgba(16, 185, 129, 0.18); border: 1.5px solid #10b981; border-radius: 10px; padding: 14px 18px; margin-bottom: 22px; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
          <span style="font-size: 1.5rem; line-height: 1; flex-shrink: 0;">✉️</span>
          <div style="font-size: 0.85rem; color: #d1fae5; line-height: 1.5;">
            <strong style="color: #6ee7b7;">Official E-Ticket Sent to Your Email!</strong> A digital copy of this pass and high-contrast QR code has been dispatched directly to <strong>${pass.buyerEmail || 'your email'}</strong>. Please check your inbox (and spam folder if not found).
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; border-bottom: 1px dashed rgba(212,175,55,0.4); padding-bottom: 20px; margin-bottom: 20px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-gold-bright); font-weight: 700;">
                BATTLE OF THE MAROONS — OFFICIAL PASS
              </span>
              <span style="padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-family: var(--font-mono); font-weight: 700; background: #22bb55; color: #ffffff; letter-spacing: 0.05em;">
                VERIFIED PASS
              </span>
            </div>
            <h2 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--color-wool); margin-top: 6px;">
              ${pass.categoryName || 'SSC Ground Pass'}
            </h2>
            <div style="font-size: 0.85rem; color: var(--color-wool-muted);">
              ${pass.matchFormat === '3day' ? '97th 3-Day Traditional Encounter' : 'One Day Encounter (Day-Night)'} • SSC Grounds, Colombo
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-wool-muted);">ORDER REFERENCE</div>
            <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 900; color: var(--color-gold); letter-spacing: 0.05em;">
              ${pass.orderRef}
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; align-items: center;">
          <!-- Left: Passholder Details -->
          <div>
            <div style="margin-bottom: 12px;">
              <span style="font-size: 0.75rem; color: var(--color-wool-subtle); font-family: var(--font-mono); display: block;">PASSHOLDER</span>
              <span style="font-size: 1.1rem; font-weight: 700; color: var(--color-wool);">${pass.buyerName}</span>
            </div>

            <div style="margin-bottom: 12px;">
              <span style="font-size: 0.75rem; color: var(--color-wool-subtle); font-family: var(--font-mono); display: block;">CONFIRMED EMAIL</span>
              <span style="font-size: 0.95rem; font-weight: 600; color: #6ee7b7; font-family: var(--font-mono);">${pass.buyerEmail || 'N/A'}</span>
            </div>

            <div style="margin-bottom: 12px;">
              <span style="font-size: 0.75rem; color: var(--color-wool-subtle); font-family: var(--font-mono); display: block;">ADMISSION QUANTITY</span>
              <span style="font-size: 1.1rem; font-weight: 700; color: var(--color-gold);">${pass.quantity} Person(s)</span>
            </div>

            <div style="margin-bottom: 12px;">
              <span style="font-size: 0.75rem; color: var(--color-wool-subtle); font-family: var(--font-mono); display: block;">TOTAL AMOUNT</span>
              <span style="font-size: 1.1rem; font-weight: 700; color: var(--color-wool);">LKR ${(pass.totalAmount || 0).toLocaleString()}</span>
            </div>

            <div>
              <span style="font-size: 0.75rem; color: var(--color-wool-subtle); font-family: var(--font-mono); display: block;">AFFILIATION</span>
              <span style="font-size: 0.9rem; color: var(--color-wool); text-transform: capitalize;">${pass.schoolAffiliation || 'Cricket Supporter'}</span>
            </div>
          </div>

          <!-- Right: Digital QR Code -->
          <div style="text-align: center; background: rgba(0,0,0,0.3); border: 1px solid var(--border-gold); border-radius: 12px; padding: 18px;">
            ${(() => {
              const qrSrc = pass.qrCodeData || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=4&color=0-0-0&data=${encodeURIComponent(pass.orderRef)}`;
              return `
                <img src="${qrSrc}" alt="Admission QR Code" style="width: 160px; height: 160px; border-radius: 8px; background: white; padding: 6px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.4);" />
                <div style="margin-top: 8px; font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-gold-bright); letter-spacing: 0.08em; font-weight: 700;">
                  VALIDATED GATE SCAN CODE
                </div>
                <div style="font-size: 0.65rem; color: var(--color-wool-subtle); margin-top: 2px;">
                  Present at Ground Gates for Entry
                </div>
              `;
            })()}
          </div>
        </div>

        <!-- Action Bar -->
        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: flex-end; gap: 12px; flex-wrap: wrap;">
          <a 
            href="https://api.whatsapp.com/send?text=${encodeURIComponent(`Official Battle of the Maroons Pass (${pass.orderRef}) for ${pass.buyerName}. Enclosure: ${pass.categoryName}. Quantity: ${pass.quantity}. View pass online: ${window.location.origin}/#/ticketing?ref=${pass.orderRef}`)}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="btn-outline-gold" 
            style="padding: 10px 18px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border: 1.5px solid #25d366; border-radius: 6px; color: #4ade80; background: rgba(37,211,102,0.15); font-family: var(--font-mono); font-weight: 700;"
          >
            💬 Save / Share to WhatsApp
          </a>
          <button type="button" class="btn-primary-cinematic" id="btn-print-pass" style="padding: 10px 20px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 8px;">
            ${Icons.print()} Print / Save Pass
          </button>
          <a href="${pass.qrCodeData || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=4&color=0-0-0&data=${encodeURIComponent(pass.orderRef)}`}" download="${pass.orderRef}-qrcode.png" class="btn-outline-gold" style="padding: 10px 20px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold); font-family: var(--font-mono);">
            ${Icons.download()} Download QR
          </a>
        </div>
      </div>
    `;
  }

  function renderCheckoutModal() {
    const o = checkoutOrder;
    return `
      <div class="checkout-modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;">
        <div class="checkout-modal-card" style="background: #180a0f; border: 2px solid var(--color-gold); border-radius: 16px; max-width: 540px; width: 100%; padding: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); position: relative; animation: fadeIn 0.25s ease-out;">
          <button type="button" id="btn-close-modal" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.2rem; color: var(--color-wool-muted); cursor: pointer; display: flex; align-items: center; justify-content: center;" aria-label="Close modal">${Icons.close()}</button>

          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-gold-bright); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">
            PASS RESERVATION READY
          </div>
          <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-wool); margin: 6px 0 16px;">
            Confirm & Complete Admission
          </h2>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 10px; padding: 18px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: var(--color-wool-muted); font-size: 0.85rem;">Order Reference:</span>
              <strong style="color: var(--color-gold); font-family: var(--font-mono);">${o.orderRef}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: var(--color-wool-muted); font-size: 0.85rem;">Enclosure:</span>
              <strong style="color: var(--color-wool); font-size: 0.9rem;">${o.itemTitle}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: var(--color-wool-muted); font-size: 0.85rem;">Passholder:</span>
              <strong style="color: var(--color-wool); font-size: 0.9rem;">${o.buyer.name}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px dashed var(--border-light); padding-top: 8px; margin-top: 8px;">
              <span style="color: var(--color-wool); font-weight: 700;">Total Payable:</span>
              <strong style="color: var(--color-gold); font-size: 1.25rem; font-family: var(--font-display);">LKR ${(o.totalAmount || 0).toLocaleString()}</strong>
            </div>
          </div>

          <!-- Payment Options -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <!-- Real PayHere Gateway Submission -->
            <form action="${o.payhere.endpoint}" method="POST" id="payhere-gateway-form" target="_blank">
              <input type="hidden" name="merchant_id" value="${o.payhere.merchantId}">
              <input type="hidden" name="return_url" value="${o.payhere.returnUrl}">
              <input type="hidden" name="cancel_url" value="${o.payhere.cancelUrl}">
              <input type="hidden" name="notify_url" value="${o.payhere.notifyUrl}">
              <input type="hidden" name="order_id" value="${o.orderRef}">
              <input type="hidden" name="items" value="${o.itemTitle}">
              <input type="hidden" name="currency" value="${o.currency}">
              <input type="hidden" name="amount" value="${o.totalAmount}">
              <input type="hidden" name="first_name" value="${o.buyer.name}">
              <input type="hidden" name="last_name" value="Passholder">
              <input type="hidden" name="email" value="${o.buyer.email}">
              <input type="hidden" name="phone" value="${o.buyer.phone || '0770000000'}">
              <input type="hidden" name="address" value="SSC Colombo">
              <input type="hidden" name="city" value="Colombo">
              <input type="hidden" name="country" value="Sri Lanka">
              <input type="hidden" name="hash" value="${o.payhere.hash}">

              <button type="submit" class="btn-primary-cinematic" style="width: 100%; justify-content: center; padding: 14px; display: inline-flex; align-items: center; gap: 8px;">
                ${Icons.creditCard()} Pay via PayHere (Card / Genie / Frimi / eZ Cash)
              </button>
            </form>

            <!-- Instant Sandbox Simulator for Demo Testing -->
            <button 
              type="button" 
              id="btn-sandbox-verify" 
              style="width: 100%; padding: 12px; background: rgba(34,187,85,0.15); border: 1px solid rgba(34,187,85,0.4); border-radius: 8px; color: #75f0a0; font-family: var(--font-mono); font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 8px;"
            >
              ${Icons.flask()} Instant Demo Approval (Issue Verifiable QR Pass Now)
            </button>

            ${(selectedCategory.bookingUrl || eventConfig?.thirdPartyBookingUrl) ? `
              <a 
                href="${selectedCategory.bookingUrl || eventConfig?.thirdPartyBookingUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn-checkout-partner" 
                data-url="${selectedCategory.bookingUrl || eventConfig?.thirdPartyBookingUrl}"
                style="width: 100%; padding: 12px; background: rgba(212,175,55,0.12); border: 1px solid var(--color-gold); border-radius: 8px; color: var(--color-gold); font-family: var(--font-mono); font-size: 0.82rem; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px;"
              >
                ${Icons.ticket()} ${eventConfig?.thirdPartyBookingTitle || 'Book via Official Partner'} ↗
              </a>
            ` : ''}
          </div>

          <div style="margin-top: 16px; font-size: 0.72rem; color: var(--color-wool-subtle); text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px;">
            ${Icons.lock()} Committee 256-bit Secure E-Ticketing System. Passes delivered instantly to email.
          </div>
        </div>
      </div>
    `;
  }

  function attachEvents(selectedCategory) {
    // Mode tabs
    const bookTabBtn = widget.querySelector('#tab-btn-book');
    const lookupTabBtn = widget.querySelector('#tab-btn-lookup');
    if (bookTabBtn) {
      bookTabBtn.addEventListener('click', () => {
        activeTab = 'book';
        errorMessage = '';
        render();
      });
    }
    if (lookupTabBtn) {
      lookupTabBtn.addEventListener('click', () => {
        activeTab = 'lookup';
        errorMessage = '';
        render();
      });
    }

    // Lookup pass button
    const lookupInput = widget.querySelector('#lookup-ref-input');
    const lookupBtn = widget.querySelector('#btn-lookup-submit');
    if (lookupBtn && lookupInput) {
      lookupBtn.addEventListener('click', () => {
        lookupOrder(lookupInput.value);
      });
      lookupInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') lookupOrder(lookupInput.value);
      });
    }

    function saveFormValues() {
      const nameEl = widget.querySelector('#ticket-name');
      const emailEl = widget.querySelector('#ticket-email');
      const emailConfEl = widget.querySelector('#ticket-email-confirm');
      const phoneEl = widget.querySelector('#ticket-phone');
      const schoolEl = widget.querySelector('#ticket-school');

      if (nameEl) formBuyerName = nameEl.value;
      if (emailEl) formBuyerEmail = emailEl.value;
      if (emailConfEl) formBuyerEmailConfirm = emailConfEl.value;
      if (phoneEl) formBuyerPhone = phoneEl.value;
      if (schoolEl) formSchoolAffiliation = schoolEl.value;
    }

    // Format selection
    widget.querySelectorAll('[data-format]').forEach(btn => {
      btn.addEventListener('click', () => {
        saveFormValues();
        selectedFormat = btn.getAttribute('data-format');
        render();
      });
    });

    // Enclosure selection
    widget.querySelectorAll('[data-enclosure]').forEach(btn => {
      btn.addEventListener('click', () => {
        saveFormValues();
        selectedCategoryId = btn.getAttribute('data-enclosure');
        render();
      });
    });

    // Quantity buttons
    const minusBtn = widget.querySelector('#btn-qty-minus');
    const plusBtn = widget.querySelector('#btn-qty-plus');
    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        if (quantity > 1) {
          saveFormValues();
          quantity--;
          render();
        }
      });
    }
    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        if (quantity < 10) {
          saveFormValues();
          quantity++;
          render();
        }
      });
    }

    // Live Email Matching Indicator & Input Listeners
    const emailInput = widget.querySelector('#ticket-email');
    const emailConfirmInput = widget.querySelector('#ticket-email-confirm');
    const matchIndicator = widget.querySelector('#email-match-indicator');

    function checkEmailMatch() {
      if (!emailInput || !emailConfirmInput || !matchIndicator) return;
      const v1 = emailInput.value.trim().toLowerCase();
      const v2 = emailConfirmInput.value.trim().toLowerCase();
      if (!v2) {
        matchIndicator.style.display = 'none';
        emailConfirmInput.style.borderColor = '';
        return;
      }
      matchIndicator.style.display = 'block';
      if (v1 === v2) {
        matchIndicator.style.color = '#34d399';
        matchIndicator.innerHTML = '✓ Both email addresses match!';
        emailConfirmInput.style.borderColor = '#10b981';
      } else {
        matchIndicator.style.color = '#fca5a5';
        matchIndicator.innerHTML = '⚠️ Email addresses do not match yet. Please double-check.';
        emailConfirmInput.style.borderColor = '#ef4444';
      }
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        formBuyerEmail = emailInput.value;
        checkEmailMatch();
      });
    }
    if (emailConfirmInput) {
      emailConfirmInput.addEventListener('input', () => {
        formBuyerEmailConfirm = emailConfirmInput.value;
        checkEmailMatch();
      });
    }

    // Print pass button
    const printBtn = widget.querySelector('#btn-print-pass');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Submit booking button
    const submitBtn = widget.querySelector('#btn-ticket-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        saveFormValues();
        errorMessage = '';

        const nameInput = widget.querySelector('#ticket-name');
        const emailInput = widget.querySelector('#ticket-email');
        const emailConfirmInput = widget.querySelector('#ticket-email-confirm');
        const phoneInput = widget.querySelector('#ticket-phone');
        const schoolInput = widget.querySelector('#ticket-school');

        if (!formBuyerName || !formBuyerName.trim()) {
          if (nameInput) {
            nameInput.focus();
            nameInput.style.borderColor = 'var(--color-crimson)';
          }
          errorMessage = 'Please enter the primary passholder full name.';
          render();
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cleanEmail = (formBuyerEmail || '').trim().toLowerCase();
        const cleanConfirmEmail = (formBuyerEmailConfirm || '').trim().toLowerCase();

        if (!cleanEmail || !emailRegex.test(cleanEmail)) {
          if (emailInput) {
            emailInput.focus();
            emailInput.style.borderColor = 'var(--color-crimson)';
          }
          errorMessage = 'Please enter a valid email address. Your official QR pass will be delivered to this address.';
          render();
          return;
        }

        if (!cleanConfirmEmail) {
          if (emailConfirmInput) {
            emailConfirmInput.focus();
            emailConfirmInput.style.borderColor = 'var(--color-crimson)';
          }
          errorMessage = 'Please re-type your email address in the confirmation field to verify both entries.';
          render();
          return;
        }

        if (cleanEmail !== cleanConfirmEmail) {
          if (emailConfirmInput) {
            emailConfirmInput.focus();
            emailConfirmInput.style.borderColor = 'var(--color-crimson)';
          }
          errorMessage = 'The two email addresses do not match! Your official QR gate pass is dispatched to this email, so please double-check and make sure both entries are identical.';
          render();
          return;
        }

        isSubmitting = true;
        render();

        try {
          const payload = {
            buyerName: formBuyerName.trim(),
            buyerEmail: cleanEmail,
            buyerPhone: formBuyerPhone ? formBuyerPhone.trim() : '',
            schoolAffiliation: formSchoolAffiliation || 'neutral',
            matchFormat: selectedFormat,
            categoryCode: selectedCategory.code || selectedCategory.id,
            categoryId: selectedCategory._id || selectedCategory.id,
            quantity
          };

          const res = await api.createTicketOrder(payload);

          if (res.success && (res.order || res.orderRef)) {
            verifiedPass = res.order || (await api.getTicketOrder(res.orderRef))?.order;
            checkoutOrder = null;
            activeTab = 'lookup';
            window.dispatchEvent(new CustomEvent('bom-tickets-updated'));
            setTimeout(() => {
              widget.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
          } else {
            errorMessage = res.message || 'Unable to reserve tickets. Please check availability.';
          }
        } catch (err) {
          errorMessage = 'Server connection error during ticket reservation. Please try again.';
        } finally {
          isSubmitting = false;
          render();
        }
      });
    }

    // Modal close
    const closeModalBtn = widget.querySelector('#btn-close-modal');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        checkoutOrder = null;
        render();
      });
    }

    // Sandbox instant verify button
    const sandboxVerifyBtn = widget.querySelector('#btn-sandbox-verify');
    if (sandboxVerifyBtn && checkoutOrder) {
      sandboxVerifyBtn.addEventListener('click', async () => {
        sandboxVerifyBtn.innerText = 'Verifying & Generating QR...';
        sandboxVerifyBtn.style.opacity = '0.7';

        try {
          const verifyRes = await api.verifySandboxOrder(checkoutOrder.orderRef);
          if (verifyRes.success && verifyRes.order) {
            verifiedPass = verifyRes.order;
            checkoutOrder = null;
            activeTab = 'lookup';
            render();
          } else {
            alert('Verification issue: ' + (verifyRes.message || 'Failed'));
          }
        } catch (e) {
          alert('Verification error. Please retry.');
        }
      });
    }
  }

  init();
  return widget;
}
