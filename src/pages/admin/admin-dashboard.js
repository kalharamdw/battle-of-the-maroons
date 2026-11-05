/**
 * BATTLE OF THE MAROONS — ADMINISTRATIVE CONTROL PANEL
 * 
 * Provides authorized committee members with full management of:
 * 1. Overview & Live System Metrics
 * 2. Event & Countdown Configuration
 * 3. Ticket Categories & Inventory
 * 4. Ticket Orders, Verification & QR Code Inspection
 * 5. Match Centre Scorecards & Trophy
 * 6. Team Squads & Player Specialisms
 * 7. News & Dispatches
 * 8. Corporate Sponsors & Tier Logos
 * 9. Private Public Inquiries Inbox
 * 10. Security & Password Changes
 */

import { adminApi, adminAuth, api } from '../../services/api.js';
import { Icons } from '../../components/icons.js';

export function renderAdminDashboardPage(container, onLogout) {
  let activeTab = 'overview';
  let currentUser = adminAuth.getStoredUser() || { username: 'Admin', role: 'admin' };
  let stats = null;
  let eventData = null;
  let categories = [];
  let orders = [];
  let inquiries = [];
  let matches = [];
  let teams = [];
  let gallery = [];
  let galleryFilter = 'all';
  let news = [];
  let sponsors = [];
  let isLoading = false;
  let tabLoadError = null;
  let toastMessage = '';
  let toastType = 'success'; // 'success' | 'error'

  // Modal inspection states
  let activeOrderModal = null;
  let activeInquiryModal = null;
  let activeCategoryEdit = null;
  let activeTeamEdit = null;
  let activeGalleryEdit = null;
  let activeMatchEdit = null;
  let activeNewsEdit = null;
  let activeSponsorEdit = null;

  function showToast(msg, type = 'success') {
    toastMessage = msg;
    toastType = type;
    renderToast();
    setTimeout(() => {
      toastMessage = '';
      renderToast();
    }, 4000);
  }

  function renderToast() {
    const el = container.querySelector('#admin-toast');
    if (!el) return;
    if (!toastMessage) {
      el.style.display = 'none';
      return;
    }
    el.style.display = 'block';
    el.style.background = toastType === 'success' ? 'rgba(34, 187, 85, 0.95)' : 'rgba(220, 38, 38, 0.95)';
    el.innerHTML = `<span style="display: inline-flex; align-items: center; gap: 8px;">${toastType === 'success' ? Icons.check() : Icons.alert()} <span>${toastMessage}</span></span>`;
  }

  async function loadData() {
    isLoading = true;
    tabLoadError = null;
    render();

    try {
      if (activeTab === 'overview') {
        const res = await adminApi.getDashboardStats();
        if (res && res.success) stats = res.data;
        else tabLoadError = res?.message || 'Error loading overview metrics.';
      } else if (activeTab === 'event') {
        const res = await adminApi.getEventSettings();
        if (res && res.success) eventData = res.data;
        else tabLoadError = res?.message || 'Error loading event configuration.';
      } else if (activeTab === 'tickets') {
        const res = await adminApi.getTicketCategories();
        if (res && res.success) {
          categories = Array.isArray(res.data) ? res.data : (res.data ? Object.values(res.data) : []);
        } else {
          tabLoadError = res?.message || 'Could not load ticket categories from server.';
        }
      } else if (activeTab === 'orders') {
        const res = await adminApi.getOrders();
        if (res && res.success) {
          orders = Array.isArray(res.data) ? res.data : (res.data ? Object.values(res.data) : []);
          tabLoadError = null;
        } else {
          tabLoadError = res?.message || 'Error loading orders.';
        }
      } else if (activeTab === 'matches') {
        const res = await adminApi.getMatches();
        if (res && res.success) matches = res.data;
        else tabLoadError = res?.message || 'Error loading matches.';
      } else if (activeTab === 'teams') {
        const res = await adminApi.getTeams();
        if (res && res.success && res.data && (Array.isArray(res.data) ? res.data.length > 0 : Object.keys(res.data).length > 0)) {
          teams = Array.isArray(res.data) ? res.data : Object.values(res.data);
          tabLoadError = null;
        } else {
          // Automatic resilient fallback to public teams or local store
          const fallback = await api.getTeams();
          if (fallback) {
            teams = Array.isArray(fallback) ? fallback : Object.values(fallback);
            tabLoadError = null;
          } else {
            tabLoadError = res?.message || 'Could not load teams from server.';
          }
        }
      } else if (activeTab === 'gallery') {
        const res = await adminApi.getGallery();
        if (res && res.success) {
          const list = Array.isArray(res.data) ? res.data : [];
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
          gallery = list.sort((a, b) => {
            const yA = getYearWeight(a);
            const yB = getYearWeight(b);
            if (yB !== yA) return yB - yA;
            const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            if (tB !== tA) return tB - tA;
            return 0;
          });
        } else {
          tabLoadError = res?.message || 'Error loading gallery photographs.';
        }
      } else if (activeTab === 'news') {
        const res = await adminApi.getNews();
        if (res && res.success) news = res.data;
        else tabLoadError = res?.message || 'Error loading news.';
      } else if (activeTab === 'sponsors') {
        const res = await adminApi.getSponsors();
        if (res && res.success) sponsors = res.data;
        else tabLoadError = res?.message || 'Error loading sponsors.';
      } else if (activeTab === 'inquiries') {
        const res = await adminApi.getInquiries();
        if (res && res.success) inquiries = res.data;
        else tabLoadError = res?.message || 'Error loading inquiries.';
      }
    } catch (err) {
      console.error('Error loading admin tab data:', err);
      tabLoadError = err.message || 'Error connecting to backend.';
      showToast('Error loading ' + activeTab + ' data.', 'error');
    } finally {
      isLoading = false;
      render();
    }
  }

  function render() {
    container.innerHTML = `
      <div class="admin-dashboard-container" style="min-height: 100vh; background: #0e0508; color: var(--color-wool); padding: 28px 20px 60px; position: relative; z-index: 1;">
        <div class="container" style="max-width: 1280px; margin: 0 auto; position: relative;">
          
          <!-- Admin Control Bar (Cricket Heritage Themed Border) -->
          <div class="cricket-admin-control-bar">
            <!-- Top & Bottom Cricket Ball Seam Rails -->
            <div class="cricket-seam-rail rail-top" aria-hidden="true"></div>
            <div class="cricket-seam-rail rail-bottom" aria-hidden="true"></div>

            <!-- Cricket Pitch Crease Corner Markers -->
            <div class="cricket-crease-corner corner-tl" aria-hidden="true"></div>
            <div class="cricket-crease-corner corner-tr" aria-hidden="true"></div>
            <div class="cricket-crease-corner corner-bl" aria-hidden="true"></div>
            <div class="cricket-crease-corner corner-br" aria-hidden="true"></div>

            <!-- Left: Cricket Bat Badge & Title -->
            <div class="cricket-control-content" style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: 8px; background: rgba(212,175,55,0.15); border: 1px solid var(--color-gold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
                ${Icons.cricket('gold-accent', 22)}
              </div>
              <div>
                <div style="font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-gold-bright); font-weight: 700; display: flex; align-items: center; gap: 6px;">
                  <span>CONTROL ROOM</span>
                  <span style="display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: var(--color-gold);"></span>
                  <span style="color: var(--color-wool-subtle); font-size: 0.65rem; letter-spacing: 0.1em;">EST. 1924</span>
                </div>
                <h1 style="font-family: var(--font-display); font-size: 1.4rem; color: var(--color-wool); margin: 0; font-weight: 800; line-height: 1.2;">
                  Battle of the Maroons Secretariat
                </h1>
              </div>
            </div>

            <!-- Right: Admin Status & Action Buttons -->
            <div class="cricket-control-content" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-wool-muted); background: rgba(255,255,255,0.05); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-light); display: inline-flex; align-items: center; gap: 6px;">
                ${Icons.user('gold-accent', 14)} ${currentUser.username} (${currentUser.role || 'Admin'})
              </span>
              <a href="#/" target="_blank" style="padding: 8px 14px; border-radius: 6px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); color: var(--color-wool); text-decoration: none; font-family: var(--font-mono); font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;">
                ${Icons.eye('', 14)} View Live Website
              </a>
              <button type="button" id="btn-admin-logout" style="padding: 8px 14px; border-radius: 6px; background: rgba(220, 38, 38, 0.2); border: 1px solid rgba(220, 38, 38, 0.4); color: #fca5a5; font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;">
                ${Icons.logOut('', 14)} Sign Out
              </button>
            </div>
          </div>

          <!-- Toast Notification Banner -->
          <div id="admin-toast" style="display: none; position: fixed; top: 24px; right: 24px; z-index: 10001; padding: 14px 20px; border-radius: 8px; font-family: var(--font-mono); font-size: 0.85rem; color: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.5);"></div>

          <!-- Navigation Tabs -->
          <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 24px; border-bottom: 1px solid var(--border-light);">
            ${[
              { id: 'overview', icon: Icons.chart('', 15), label: 'Overview' },
              { id: 'event', icon: Icons.clock('', 15), label: 'Event & Countdown' },
              { id: 'tickets', icon: Icons.ticket('', 15), label: 'Ticket Categories' },
              { id: 'orders', icon: Icons.clipboard('', 15), label: 'Orders & QR Passes' },
              { id: 'matches', icon: Icons.cricket('', 15), label: 'Match Centre' },
              { id: 'teams', icon: Icons.users('', 15), label: 'Teams & Squads' },
              { id: 'gallery', icon: Icons.camera('', 15), label: 'Photo Gallery' },
              { id: 'news', icon: Icons.newspaper('', 15), label: 'News' },
              { id: 'sponsors', icon: Icons.handshake('', 15), label: 'Sponsors' },
              { id: 'inquiries', icon: Icons.inbox('', 15), label: 'Inquiries' },
              { id: 'security', icon: Icons.lock('', 15), label: 'Security' }
            ].map(tab => `
              <button 
                type="button" 
                data-tab="${tab.id}" 
                class="admin-tab-btn"
                style="white-space: nowrap; padding: 10px 16px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; cursor: pointer; border: 1px solid ${activeTab === tab.id ? 'var(--color-gold)' : 'transparent'}; background: ${activeTab === tab.id ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.03)'}; color: ${activeTab === tab.id ? 'var(--color-gold)' : 'var(--color-wool-muted)'}; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s;"
              >
                ${tab.icon} <span>${tab.label}</span>
              </button>
            `).join('')}
          </div>

          <!-- Main Tab Body -->
          <div class="admin-tab-content">
            ${isLoading ? `
              <div style="text-align: center; padding: 60px 20px;">
                <div class="spinner" style="margin: 0 auto 16px; width: 36px; height: 36px; border: 3px solid rgba(212,175,55,0.2); border-top-color: var(--color-gold); border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
                <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-gold);">LOADING CONTENT...</p>
              </div>
            ` : renderTabContent()}
          </div>

        </div>
      </div>

      <!-- Modals Container -->
      ${activeOrderModal ? renderOrderModal(activeOrderModal) : ''}
      ${activeInquiryModal ? renderInquiryModal(activeInquiryModal) : ''}
      ${activeCategoryEdit ? renderCategoryModal(activeCategoryEdit) : ''}
      ${activeTeamEdit ? renderTeamModal(activeTeamEdit) : ''}
      ${activeGalleryEdit ? renderGalleryModal(activeGalleryEdit) : ''}
      ${activeSponsorEdit ? renderSponsorModal(activeSponsorEdit) : ''}
      ${activeNewsEdit ? renderNewsModal(activeNewsEdit) : ''}
      ${activeMatchEdit ? renderMatchModal(activeMatchEdit) : ''}
    `;

    attachEvents();
  }

  function renderTabContent() {
    if (tabLoadError) {
      return renderTabErrorBox(tabLoadError);
    }
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'event': return renderEventTab();
      case 'tickets': return renderTicketsTab();
      case 'orders': return renderOrdersTab();
      case 'matches': return renderMatchesTab();
      case 'teams': return renderTeamsTab();
      case 'gallery': return renderGalleryTab();
      case 'news': return renderNewsTab();
      case 'sponsors': return renderSponsorsTab();
      case 'inquiries': return renderInquiriesTab();
      case 'security': return renderSecurityTab();
      default: return renderOverviewTab();
    }
  }

  function renderTabErrorBox(errorMsg) {
    const isAuth = errorMsg && (
      errorMsg.toLowerCase().includes('token') || 
      errorMsg.toLowerCase().includes('expired') || 
      errorMsg.toLowerCase().includes('unauthorized') || 
      errorMsg.toLowerCase().includes('session') ||
      errorMsg.toLowerCase().includes('access denied') ||
      errorMsg.toLowerCase().includes('credentials')
    );

    if (isAuth) {
      return `
        <div style="background: rgba(212, 175, 55, 0.08); border: 1.5px solid var(--color-gold); border-radius: 12px; padding: 36px 24px; text-align: center; margin: 20px 0;">
          <div style="margin-bottom: 12px; font-size: 2rem;">🔒</div>
          <h3 style="font-size: 1.3rem; color: var(--color-gold); margin: 0 0 8px;">Administrator Authentication Required</h3>
          <p style="font-size: 0.88rem; color: var(--color-wool-muted); max-width: 520px; margin: 0 auto 20px; line-height: 1.6;">
            Your administrative session requires authentication or your token has timed out.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button type="button" class="btn-quick-dev-reauth" style="padding: 10px 22px; background: rgba(34,187,85,0.2); border: 1px solid #22bb55; border-radius: 6px; color: #75f0a0; font-family: var(--font-mono); font-size: 0.85rem; cursor: pointer; font-weight: 700; display: inline-flex; align-items: center; gap: 8px;">
              ⚡ Quick Re-Connect (admin)
            </button>
            <button type="button" class="btn-admin-relogin btn-primary-cinematic" style="padding: 10px 24px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 8px;">
              ${Icons.lock()} Log In With Password
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div style="background: rgba(220, 38, 38, 0.12); border: 1px solid rgba(220, 38, 38, 0.35); border-radius: 12px; padding: 36px 24px; text-align: center; margin: 20px 0;">
        <div style="margin-bottom: 12px; color: var(--color-gold);">${Icons.alert('', 36)}</div>
        <h3 style="font-size: 1.25rem; color: #fca5a5; margin: 0 0 8px;">Backend Connection Notice</h3>
        <p style="font-size: 0.88rem; color: var(--color-wool-muted); max-width: 580px; margin: 0 auto 20px; line-height: 1.6;">
          ${errorMsg || 'Could not retrieve data from server.'}<br />
          Backend API runs on port 5000 and is automatically managed.
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button type="button" class="btn-quick-dev-reauth" style="padding: 10px 20px; background: rgba(34,187,85,0.2); border: 1px solid #22bb55; border-radius: 6px; color: #75f0a0; font-family: var(--font-mono); font-size: 0.85rem; cursor: pointer; font-weight: 700; display: inline-flex; align-items: center; gap: 8px;">
            ⚡ Quick Re-Connect (admin)
          </button>
          <button type="button" class="btn-reconnect-tab" style="padding: 10px 24px; background: rgba(212,175,55,0.2); border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold); font-family: var(--font-mono); font-size: 0.85rem; cursor: pointer; font-weight: 700; display: inline-flex; align-items: center; gap: 8px;">
            ${Icons.refresh()} Retry Loading
          </button>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     TAB 1: OVERVIEW
     -------------------------------------------------------------------------- */
  function renderOverviewTab() {
    const s = stats || {
      totalRevenueLkr: 0,
      totalTicketsSold: 0,
      verifiedOrdersCount: 0,
      pendingOrdersCount: 0,
      unreadInquiriesCount: 0,
      eventEdition: 97,
      isCountdownConfirmed: false,
      isTicketingActive: true
    };

    return `
      <div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; margin-bottom: 28px;">
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 10px; padding: 20px;">
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-wool-muted); text-transform: uppercase;">
              Total Verified Revenue
            </div>
            <div style="font-family: var(--font-display); font-size: 2rem; color: var(--color-gold); font-weight: 900; margin-top: 6px;">
              LKR ${(s.totalRevenueLkr || 0).toLocaleString()}
            </div>
            <div style="font-size: 0.75rem; color: var(--color-wool-subtle); margin-top: 4px;">
              Direct from PayHere Gateway
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 10px; padding: 20px;">
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-wool-muted); text-transform: uppercase;">
              Passes Issued & Verified
            </div>
            <div style="font-family: var(--font-display); font-size: 2rem; color: #75f0a0; font-weight: 900; margin-top: 6px;">
              ${s.totalTicketsSold || 0}
            </div>
            <div style="font-size: 0.75rem; color: var(--color-wool-subtle); margin-top: 4px;">
              Active QR Gate Passes Issued
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 10px; padding: 20px;">
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-wool-muted); text-transform: uppercase;">
              Public Inquiries
            </div>
            <div style="font-family: var(--font-display); font-size: 2rem; color: ${s.unreadInquiriesCount > 0 ? '#fca5a5' : 'var(--color-wool)'}; font-weight: 900; margin-top: 6px;">
              ${s.unreadInquiriesCount || 0} Unread
            </div>
            <div style="font-size: 0.75rem; color: var(--color-wool-subtle); margin-top: 4px;">
              Messages from contact page
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 10px; padding: 20px;">
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-wool-muted); text-transform: uppercase;">
              Match Chapter & Countdown
            </div>
            <div style="font-family: var(--font-display); font-size: 1.6rem; color: var(--color-wool); font-weight: 800; margin-top: 6px;">
              ${s.eventEdition || 97}th Encounter
            </div>
            <div style="font-size: 0.75rem; color: ${s.isCountdownConfirmed ? '#75f0a0' : 'var(--color-gold-bright)'}; margin-top: 4px; font-family: var(--font-mono);">
              ${s.isCountdownConfirmed ? '● Dates Formally Announced' : '○ Awaiting Joint Committee Notice'}
            </div>
          </div>
        </div>

        <!-- Quick Shortcuts -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-light); border-radius: 12px; padding: 24px;">
          <h3 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--color-gold); margin-bottom: 12px;">
            Quick Management Actions
          </h3>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button type="button" class="btn-primary-cinematic" id="shortcut-event" style="padding: 10px 18px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 8px;">
              ${Icons.clock()} Update Countdown Dates
            </button>
            <button type="button" class="btn-primary-cinematic" id="shortcut-orders" style="padding: 10px 18px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 8px;">
              ${Icons.clipboard()} View Recent Orders
            </button>
            <button type="button" class="btn-primary-cinematic" id="shortcut-inquiries" style="padding: 10px 18px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 8px;">
              ${Icons.inbox()} Check Inquiries Inbox
            </button>
            <button type="button" class="btn-primary-cinematic" id="shortcut-tickets" style="padding: 10px 18px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 8px;">
              ${Icons.ticket()} Adjust Stand Prices
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     TAB 2: EVENT & COUNTDOWN
     -------------------------------------------------------------------------- */
  function renderEventTab() {
    const ev = eventData || {
      edition: 97,
      seriesTitle: "97th Battle of the Maroons",
      year: 2027,
      matchDates: "March 2027 • SSC Colombo",
      threeDayDates: "March 2027",
      oneDayDates: "March 2027",
      venue: "Sinhalese Sports Club (SSC) Grounds, Colombo",
      isConfirmed: false,
      countdownTarget: "2027-03-05T10:00:00.000Z",
      ticketingActive: true
    };

    // Format target date for datetime-local input in user's local timezone
    let dtValue = '';
    try {
      const targetStr = ev.countdownTarget || ev.confirmedStartDate || ev.tentativeMatchDate || "2027-03-05T10:00:00.000Z";
      const d = new Date(targetStr);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        dtValue = `${year}-${month}-${day}T${hours}:${minutes}`;
      } else {
        dtValue = "2027-03-05T10:00";
      }
    } catch (e) {
      dtValue = "2027-03-05T10:00";
    }

    return `
      <div style="max-width: 800px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-light); border-radius: 12px; padding: 32px;">
        <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-gold); margin-bottom: 8px;">
          Match Chapter & Countdown Clock Settings
        </h2>
        <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin-bottom: 24px;">
          Control the countdown display shown on the homepage and ticketing section across the entire website.
        </p>

        <form id="form-event-settings">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label" for="ev-edition">Encounter Edition</label>
              <input type="number" id="ev-edition" class="form-input" value="${ev.edition || 97}" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="ev-year">Event Year</label>
              <input type="number" id="ev-year" class="form-input" value="${ev.year || 2027}" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="ev-title">Official Series Title</label>
            <input type="text" id="ev-title" class="form-input" value="${ev.seriesTitle || '97th Battle of the Maroons'}" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="ev-dates">Display Dates Label</label>
            <input type="text" id="ev-dates" class="form-input" value="${ev.matchDates || 'March 2027 • SSC Colombo'}" required />
            <span style="font-size: 0.75rem; color: var(--color-wool-subtle); margin-top: 4px;">Appears on badges and hero headers.</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="ev-target">Target Countdown Date & Time (UTC/Local)</label>
            <input type="datetime-local" id="ev-target" class="form-input" value="${dtValue}" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="ev-venue">Match Venue</label>
            <input type="text" id="ev-venue" class="form-input" value="${ev.venue || 'Sinhalese Sports Club (SSC) Grounds, Colombo'}" required />
          </div>

          <div style="border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 20px; margin-top: 24px;">
            <h3 style="font-family: var(--font-display); font-size: 1.15rem; color: var(--color-gold); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              ${Icons.ticket()} Third-Party & Online Ticketing Configuration
            </h3>
            <p style="font-size: 0.8rem; color: var(--color-wool-muted); margin-bottom: 16px;">
              Configure whether passes are issued on-site, routed to an external partner (e.g. Tickets.lk), or offered as a hybrid.
            </p>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="ev-ticketing-mode">Ticketing Mode</label>
              <select id="ev-ticketing-mode" class="form-input" style="background: #18090f; color: #fff;">
                <option value="HYBRID" ${(ev.ticketingMode || 'HYBRID') === 'HYBRID' ? 'selected' : ''}>Hybrid (Both On-Site Reservations & External Partner Link)</option>
                <option value="EXTERNAL" ${ev.ticketingMode === 'EXTERNAL' ? 'selected' : ''}>External Partner Only (Direct visitors to official ticketing portal)</option>
                <option value="ONSITE" ${ev.ticketingMode === 'ONSITE' ? 'selected' : ''}>On-Site Only (PayHere Gateway passes with digital QR)</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="ev-third-party-ticket-url">Official Third-Party / Partner Booking URL</label>
              <input 
                type="url" 
                id="ev-third-party-ticket-url" 
                class="form-input" 
                placeholder="https://www.tickets.lk/event/battle-of-the-maroons" 
                value="${ev.thirdPartyBookingUrl || ''}" 
              />
              <span style="font-size: 0.74rem; color: var(--color-wool-subtle); margin-top: 4px; display: block;">
                When provided, a prominent verified booking link is displayed on the public ticketing page and in the ticket builder.
              </span>
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="ev-third-party-ticket-label">Partner Button / Card Title</label>
              <input 
                type="text" 
                id="ev-third-party-ticket-label" 
                class="form-input" 
                placeholder="Book via Official Ticketing Partner" 
                value="${ev.thirdPartyBookingTitle || 'Book via Official Ticketing Partner'}" 
              />
            </div>
          </div>

          <div style="display: flex; gap: 24px; margin: 20px 0; flex-wrap: wrap;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.9rem;">
              <input type="checkbox" id="ev-confirmed" ${ev.isConfirmed ? 'checked' : ''} style="width: 18px; height: 18px;" />
              <span>Mark Dates as <strong>Formally Confirmed</strong> (Unhides definitive live countdown clock)</span>
            </label>

            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.9rem;">
              <input type="checkbox" id="ev-ticketing" ${ev.ticketingActive ? 'checked' : ''} style="width: 18px; height: 18px;" />
              <span>Enable <strong>Online Pass Reservations</strong></span>
            </label>
          </div>

          <button type="submit" class="btn-primary-cinematic" id="btn-save-event" style="padding: 12px 28px; display: inline-flex; align-items: center; gap: 8px;">
            ${Icons.download()} Save Event & Countdown Settings
          </button>
        </form>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     TAB 3: TICKET CATEGORIES
     -------------------------------------------------------------------------- */
  function renderTicketsTab() {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-gold); margin: 0;">
              Enclosure Categories & Capacity Quotas
            </h2>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin: 4px 0 0;">
              Manage ticket prices in LKR, total allocated capacity, and active availability.
            </p>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button type="button" id="btn-add-ticket-cat" class="btn-primary-cinematic" style="padding: 8px 16px; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;">
              ${Icons.ticket('', 15)} Add New Category
            </button>
            <button type="button" id="btn-refresh-tickets" style="padding: 8px 14px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); cursor: pointer; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;">
              ${Icons.refresh()} Refresh Categories
            </button>
            <button type="button" id="btn-reset-ticket-quotas" style="padding: 8px 14px; background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.4); border-radius: 6px; color: #fca5a5; cursor: pointer; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;" title="Reset all category sold counts and orders to 0">
              🔄 Reset Quotas & Orders to 0
            </button>
          </div>
        </div>

        ${tabLoadError ? renderTabErrorBox(tabLoadError) : categories.length === 0 ? `
          <div style="text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-light); border-radius: 12px; margin: 20px 0;">
            <div style="margin-bottom: 12px; color: var(--color-gold);">${Icons.ticket('', 36)}</div>
            <h3 style="font-size: 1.2rem; color: var(--color-wool); margin: 0 0 8px;">No Ticket Categories Available</h3>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted); max-width: 480px; margin: 0 auto 16px;">
              No categories have been added yet or they are loading. Click Refresh to reload from database.
            </p>
            <button type="button" class="btn-reconnect-tab" style="padding: 8px 18px; background: rgba(212,175,55,0.2); border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; margin: 0 auto;">
              ${Icons.refresh()} Refresh Categories
            </button>
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;">
            ${categories.map(cat => {
              const available = (cat.totalCapacity || 0) - (cat.reservedCount || 0) - (cat.soldCount || 0);
              return `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; padding: 22px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div>
                      <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-gold-bright); text-transform: uppercase;">
                        CODE: ${cat.code}
                      </span>
                      <h3 style="font-size: 1.2rem; color: var(--color-wool); margin: 4px 0;">
                        ${cat.name}
                      </h3>
                    </div>
                    <span style="padding: 3px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; ${cat.isActive !== false ? 'background: rgba(34,187,85,0.2); color: #75f0a0;' : 'background: rgba(220,38,38,0.2); color: #fca5a5;'}">
                      ${cat.isActive !== false ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </div>

                  <div style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-gold); font-weight: 800; margin-bottom: 12px;">
                    LKR ${(cat.price || 0).toLocaleString()}
                  </div>

                  <p style="font-size: 0.82rem; color: var(--color-wool-muted); min-height: 40px; margin-bottom: 16px; line-height: 1.4;">
                    ${cat.description || ''}
                  </p>

                  <div 
                    class="btn-edit-category" 
                    data-cat-id="${cat._id || cat.id || cat.code}"
                    title="Click to check and edit capacity, sold, or reserved quotas"
                    style="background: rgba(0,0,0,0.35); border: 1px solid rgba(212,175,55,0.2); border-radius: 8px; padding: 14px; font-family: var(--font-mono); font-size: 0.78rem; margin-bottom: 16px; cursor: pointer; transition: all 0.2s ease;"
                  >
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.07); padding-bottom: 6px;">
                      <span style="color: var(--color-gold); font-weight: 700; font-size: 0.72rem; letter-spacing: 0.5px;">INVENTORY QUOTAS</span>
                      <span style="font-size: 0.68rem; color: var(--color-gold-bright); display: flex; align-items: center; gap: 4px;">
                        ✏️ Edit Quotas
                      </span>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                      <span style="color: var(--color-wool-muted);">Total Capacity:</span>
                      <span style="color: #ffffff; font-weight: 600;">${cat.totalCapacity} passes</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                      <span style="color: var(--color-wool-muted);">Sold:</span>
                      <span style="color: #75f0a0; font-weight: 600;">${cat.soldCount || 0}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                      <span style="color: var(--color-wool-muted);">Reserved:</span>
                      <span style="color: #f59e0b; font-weight: 600;">${cat.reservedCount || 0}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-top: 1px dashed rgba(255,255,255,0.12); padding-top: 6px; margin-top: 2px;">
                      <span style="color: var(--color-gold); font-weight: 700;">Remaining:</span>
                      <strong style="color: var(--color-gold); font-size: 0.95rem;">${Math.max(0, available)}</strong>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    class="btn-edit-category" 
                    data-cat-id="${cat._id || cat.id || cat.code}" 
                    style="width: 100%; padding: 8px; background: rgba(212,175,55,0.1); border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px;"
                  >
                    ${Icons.edit()} Edit Pricing & Quotas
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     TAB 4: TICKET ORDERS & QR INSPECTION
     -------------------------------------------------------------------------- */
  function renderOrdersTab() {
    const totalOrdersCount = orders.length;
    const totalPassesIssued = orders.reduce((sum, o) => sum + (parseInt(o.quantity, 10) || 1), 0);
    const admittedOrders = orders.filter(o => o.isAdmitted);
    const totalPassesAdmitted = admittedOrders.reduce((sum, o) => sum + (parseInt(o.quantity, 10) || 1), 0);
    const pendingPassesCount = Math.max(0, totalPassesIssued - totalPassesAdmitted);

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-gold); margin: 0;">
              Ticket Orders & Gate Pass Inspection
            </h2>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin: 4px 0 0;">
              Verify passholder admittance, view issued QR codes, and inspect transaction references in real time.
            </p>
          </div>

          <div style="display: flex; gap: 8px;">
            <input 
              type="text" 
              id="orders-search-input" 
              class="form-input" 
              placeholder="Search reference or buyer..." 
              style="max-width: 260px; padding: 8px 12px; font-size: 0.82rem;" 
            />
            <button type="button" id="btn-refresh-orders" style="padding: 8px 14px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); cursor: pointer; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;">
              ${Icons.refresh()} Refresh
            </button>
          </div>
        </div>

        <!-- Real-Time Gate Admission Metric Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px;">
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 8px; padding: 14px 18px;">
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-wool-muted); text-transform: uppercase;">Total Passes Issued</div>
            <div style="font-family: var(--font-mono); font-size: 1.5rem; font-weight: 800; color: var(--color-gold); margin-top: 4px;">${totalPassesIssued}</div>
          </div>
          <div style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.3); border-radius: 8px; padding: 14px 18px;">
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: #6ee7b7; text-transform: uppercase;">Gate Admitted (Turnstiles)</div>
            <div style="font-family: var(--font-mono); font-size: 1.5rem; font-weight: 800; color: #10b981; margin-top: 4px;">${totalPassesAdmitted} Admitted</div>
          </div>
          <div style="background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.3); border-radius: 8px; padding: 14px 18px;">
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: #fde68a; text-transform: uppercase;">Pending At Gates</div>
            <div style="font-family: var(--font-mono); font-size: 1.5rem; font-weight: 800; color: #f59e0b; margin-top: 4px;">${pendingPassesCount} Remaining</div>
          </div>
        </div>

        ${orders.length === 0 ? `
          <div style="text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-light); border-radius: 12px;">
            <div style="margin-bottom: 12px; color: var(--color-gold);">${Icons.ticket('', 40)}</div>
            <h3 style="font-size: 1.2rem; color: var(--color-wool); margin-bottom: 6px;">No Ticket Orders Placed Yet</h3>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted);">
              When visitors reserve passes through the ticketing page, their orders and digital QR codes will appear here.
            </p>
          </div>
        ` : `
          <div style="overflow-x: auto; background: rgba(255,255,255,0.02); border: 1px solid var(--border-light); border-radius: 12px;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
              <thead>
                <tr style="border-bottom: 1px solid var(--border-light); background: rgba(0,0,0,0.3); font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-wool-muted);">
                  <th style="padding: 14px 16px;">REFERENCE</th>
                  <th style="padding: 14px 16px;">BUYER</th>
                  <th style="padding: 14px 16px;">ENCLOSURE</th>
                  <th style="padding: 14px 16px;">PASSES</th>
                  <th style="padding: 14px 16px;">TOTAL</th>
                  <th style="padding: 14px 16px;">STATUS</th>
                  <th style="padding: 14px 16px;">GATE ENTRY</th>
                  <th style="padding: 14px 16px;">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map(order => {
                  const isVerified = order.status === 'VERIFIED';
                  const isAdmitted = !!order.isAdmitted;
                  return `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s;">
                      <td style="padding: 14px 16px; font-family: var(--font-mono); font-weight: 700; color: var(--color-gold);">
                        ${order.orderRef}
                      </td>
                      <td style="padding: 14px 16px;">
                        <div style="font-weight: 600; color: var(--color-wool);">${order.buyerName}</div>
                        <div style="font-size: 0.75rem; color: var(--color-wool-muted);">${order.buyerEmail}</div>
                      </td>
                      <td style="padding: 14px 16px;">
                        <div>${order.categoryName}</div>
                        <div style="font-size: 0.75rem; color: var(--color-wool-muted); text-transform: uppercase;">${order.matchFormat === '3day' ? '3-Day Encounter' : 'One Day Day-Night'}</div>
                      </td>
                      <td style="padding: 14px 16px; font-weight: 700; font-family: var(--font-mono);">
                        ${order.quantity}
                      </td>
                      <td style="padding: 14px 16px; font-weight: 700; font-family: var(--font-mono); color: var(--color-gold);">
                        LKR ${(order.totalAmount || 0).toLocaleString()}
                      </td>
                      <td style="padding: 14px 16px;">
                        <span style="display: inline-block; padding: 3px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; ${isVerified ? 'background: rgba(34,187,85,0.2); color: #75f0a0; border: 1px solid rgba(34,187,85,0.4);' : 'background: rgba(245,158,11,0.2); color: #fbbf24; border: 1px solid rgba(245,158,11,0.4);'}">
                          ${order.status}
                        </span>
                      </td>
                      <td style="padding: 14px 16px;">
                        ${isAdmitted ? `
                          <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.5);">
                            ✓ SCANNED & ADMITTED
                          </span>
                          <div style="font-size: 0.68rem; color: var(--color-wool-muted); margin-top: 4px; font-family: var(--font-mono);">
                            ${order.admittedAt ? new Date(order.admittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''} • ${order.admittedGate || 'Main Gate'}
                          </div>
                        ` : `
                          <span style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600; background: rgba(255,255,255,0.05); color: var(--color-wool-muted); border: 1px solid rgba(255,255,255,0.12);">
                            ⏳ NOT SCANNED
                          </span>
                        `}
                      </td>
                      <td style="padding: 14px 16px;">
                        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                          ${!isVerified ? `
                            <button 
                              type="button" 
                              class="btn-approve-order" 
                              data-order-id="${order._id || order.id || order.orderRef}" 
                              title="Approve Order & Generate Gate QR"
                              style="padding: 6px 12px; background: rgba(34,187,85,0.18); border: 1px solid rgba(34,187,85,0.5); border-radius: 6px; color: #75f0a0; font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-weight: 700;"
                            >
                              ${Icons.check()} Approve / Issue QR
                            </button>
                          ` : ''}
                          <button 
                            type="button" 
                            class="btn-inspect-order" 
                            data-order-id="${order._id || order.id || order.orderRef}" 
                            style="padding: 6px 12px; background: rgba(212,175,55,0.12); border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold); font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;"
                          >
                            ${Icons.eye()} Inspect QR Pass
                          </button>
                          <button 
                            type="button" 
                            class="btn-delete-order" 
                            data-order-id="${order._id || order.id || order.orderRef}" 
                            title="Delete Order"
                            style="padding: 6px 10px; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.4); border-radius: 6px; color: #f87171; font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;"
                          >
                            ${Icons.trash()}
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     TAB 5: MATCH CENTRE
     -------------------------------------------------------------------------- */
  function renderMatchesTab() {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-gold); margin: 0;">
              Match Scorecards & Series Archive
            </h2>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin: 4px 0 0;">
              Publish match summaries, scores, innings details, and challenge trophy status.
            </p>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button type="button" id="btn-add-match" class="btn-primary-cinematic" style="padding: 8px 16px; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;">
              ${Icons.cricket('', 15)} Add New Match
            </button>
            <button type="button" id="btn-refresh-matches" style="padding: 8px 14px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); cursor: pointer; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;">
              ${Icons.refresh()} Refresh Matches
            </button>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${matches.map(m => {
            const mId = m._id || m.id || m.matchId;
            return `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; padding: 22px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div>
                  <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-gold-bright); text-transform: uppercase;">
                    ${m.format === '3day' ? '3-DAY TRADITIONAL ENCOUNTER' : (m.format || 'ANNUAL CRICKET ENCOUNTER')} • ${m.edition || '97'}TH ENCOUNTER
                  </span>
                  <h3 style="font-size: 1.3rem; color: var(--color-wool); margin: 4px 0;">
                    ${m.title}
                  </h3>
                  <div style="font-size: 0.85rem; color: var(--color-wool-muted);">
                    ${m.dates || ''} • ${m.venue || ''}
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span style="padding: 4px 10px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; background: rgba(212,175,55,0.15); color: var(--color-gold); border: 1px solid var(--color-gold);">
                    Trophy: ${m.trophyHolder || m.trophy || 'Retained'}
                  </span>
                  <button 
                    type="button" 
                    class="btn-edit-match" 
                    data-id="${mId}"
                    style="padding: 6px 14px; background: rgba(212,175,55,0.15); border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold-bright); font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;"
                  >
                    ${Icons.edit()} Edit Details
                  </button>
                  <button 
                    type="button" 
                    class="btn-delete-match" 
                    data-id="${mId}"
                    style="padding: 6px 12px; background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.4); border-radius: 6px; color: #fca5a5; font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s;"
                  >
                    ${Icons.trash()} Delete
                  </button>
                </div>
              </div>

              <div style="margin-top: 14px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 8px; font-size: 0.9rem; color: var(--color-wool);">
                <strong>Result:</strong> ${m.summaryResult || m.result}
              </div>
            </div>
          `}).join('')}
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     TAB 6: TEAMS & SQUADS
     -------------------------------------------------------------------------- */
  function renderTeamsTab() {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-gold); margin: 0 0 4px;">
              Teams & Squad Rosters
            </h2>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin: 0;">
              Manage the active 1st XI squads, leadership appointments, and coaching staff for Ananda College and Nalanda College.
            </p>
          </div>
          <button type="button" id="btn-refresh-teams" style="padding: 8px 14px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); cursor: pointer; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;">
            ${Icons.refresh()} Refresh Teams
          </button>
        </div>

        ${tabLoadError ? renderTabErrorBox(tabLoadError) : teams.length === 0 ? `
          <div style="text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-light); border-radius: 12px; margin: 20px 0;">
            <p style="color: var(--color-wool-muted);">No team rosters found. Click Refresh Teams to load rosters from database.</p>
            <button type="button" class="btn-reconnect-tab" style="padding: 8px 18px; background: rgba(212,175,55,0.2); border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; margin: 12px auto 0;">
              ${Icons.refresh()} Refresh Teams
            </button>
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
            ${teams.map(team => {
              const squadList = team.verifiedSquadMembers || team.squad || [];
              const teamTitle = team.name || team.schoolName || (team.schoolKey === 'ananda' ? 'Ananda College' : 'Nalanda College');
              return `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                      <div style="width: 48px; height: 48px; border-radius: 50%; background: ${team.schoolKey === 'ananda' ? 'rgba(140,29,46,0.3)' : 'rgba(212,175,55,0.2)'}; border: 1px solid var(--color-gold); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                        ${team.schoolKey === 'ananda' ? Icons.shield('maroon-accent', 24) : Icons.sun('gold-accent', 24)}
                      </div>
                      <div>
                        <h3 style="font-size: 1.3rem; color: var(--color-wool); margin: 0;">
                          ${teamTitle}
                        </h3>
                        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-gold-bright);">
                          ${team.motto || ''}
                        </span>
                      </div>
                    </div>

                    <div style="font-size: 0.85rem; line-height: 1.7; color: var(--color-wool-muted); margin-bottom: 16px;">
                      <div><strong>Captain:</strong> <span style="color: var(--color-wool);">${team.captain || team.recentCaptain || 'To be announced'}</span></div>
                      <div><strong>Vice Captain:</strong> <span style="color: var(--color-wool);">${team.viceCaptain || 'To be announced'}</span></div>
                      <div><strong>Head Coach:</strong> <span style="color: var(--color-wool);">${team.headCoach || 'To be announced'}</span></div>
                      <div><strong>Principal:</strong> <span style="color: var(--color-wool);">${team.principal || 'To be announced'}</span></div>
                      <div style="display: flex; gap: 16px; margin-top: 4px;">
                        <span><strong>Big Match Wins:</strong> <strong style="color: var(--color-gold);">${team.bigMatchWins ?? 0}</strong></span>
                        <span><strong>One Day Wins:</strong> <strong style="color: var(--color-silver);">${team.oneDayWins ?? 0}</strong></span>
                      </div>
                      <div><strong>Registered Squad:</strong> <span style="color: var(--color-gold); font-family: var(--font-mono);">${squadList.length} Players</span></div>
                      <div><strong>Hall of Fame:</strong> <span style="color: var(--color-gold); font-family: var(--font-mono);">${(team.cricketHallOfFame || []).length} Legends</span></div>
                    </div>

                    <div style="max-height: 180px; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 12px; font-size: 0.8rem; font-family: var(--font-mono); margin-bottom: 18px;">
                      ${squadList.length > 0 ? squadList.map(p => `
                        <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                          <span style="color: var(--color-wool);">${p.name}</span>
                          <span style="color: var(--color-wool-muted);">${p.role || p.specialism || ''}</span>
                        </div>
                      `).join('') : '<div style="color: var(--color-wool-muted); text-align: center;">No squad members listed yet</div>'}
                    </div>
                  </div>

                  <button 
                    type="button" 
                    class="btn-edit-team" 
                    data-school-key="${team.schoolKey || team.school || (team.name && team.name.toLowerCase().includes('nalanda') ? 'nalanda' : 'ananda')}" 
                    style="width: 100%; padding: 10px; background: rgba(212,175,55,0.1); border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold); font-family: var(--font-mono); font-size: 0.82rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;"
                  >
                    ${Icons.edit()} Edit Leadership, Squad & Hall of Fame
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     TAB 6.5: PHOTO GALLERY MANAGEMENT
     -------------------------------------------------------------------------- */
  function renderGalleryTab() {
    const totalCount = gallery.length;
    const activeCount = gallery.filter(g => g.isActive !== false).length;
    const featuredCount = gallery.filter(g => g.featured).length;

    const filtered = galleryFilter === 'all'
      ? gallery
      : gallery.filter(g => g.category === galleryFilter);

    const categoriesList = [
      { id: 'all', label: 'All Photos', count: totalCount },
      { id: 'matches', label: 'Match Action', count: gallery.filter(g => g.category === 'matches').length },
      { id: 'atmosphere', label: 'Crowd & Carnival', count: gallery.filter(g => g.category === 'atmosphere').length },
      { id: 'ceremonies', label: 'Ceremonies', count: gallery.filter(g => g.category === 'ceremonies').length },
      { id: 'legends', label: 'Legends & Heritage', count: gallery.filter(g => g.category === 'legends' || g.category === 'heritage').length }
    ];

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-gold-bright); font-weight: 700; margin-bottom: 4px;">
              VISUAL CHRONICLE & MEDIA ARCHIVES
            </div>
            <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-gold); margin: 0;">
              Photo Gallery Management
            </h2>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin: 4px 0 0;">
              Curate match photographs, crowd atmospheres, ceremonies, and historical captures. Upload new photos directly for upcoming matches.
            </p>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button 
              type="button" 
              id="btn-refresh-gallery"
              style="padding: 8px 14px; background: rgba(255,255,255,0.06); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); font-family: var(--font-mono); font-size: 0.78rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;"
            >
              ${Icons.refresh()} Refresh
            </button>
            <button 
              type="button" 
              id="btn-add-gallery-photo"
              class="btn-primary-cinematic"
              style="padding: 10px 18px; font-size: 0.85rem; display: flex; align-items: center; gap: 8px;"
            >
              ${Icons.plus()} Add New Photo
            </button>
          </div>
        </div>

        <!-- Metric Badges -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-bottom: 20px;">
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 8px; padding: 12px 16px;">
            <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--color-wool-muted); text-transform: uppercase;">Total Stored</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: var(--color-gold); font-family: var(--font-display);">${totalCount}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 8px; padding: 12px 16px;">
            <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--color-wool-muted); text-transform: uppercase;">Public Active</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: #75f0a0; font-family: var(--font-display);">${activeCount}</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 8px; padding: 12px 16px;">
            <div style="font-size: 0.72rem; font-family: var(--font-mono); color: var(--color-wool-muted); text-transform: uppercase;">Featured Highlights</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: var(--color-gold-bright); font-family: var(--font-display);">${featuredCount}</div>
          </div>
        </div>

        <!-- Filter Chips -->
        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 20px;">
          ${categoriesList.map(cat => `
            <button 
              type="button" 
              class="btn-gallery-filter"
              data-cat="${cat.id}"
              style="padding: 6px 14px; border-radius: 20px; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; cursor: pointer; border: 1px solid ${galleryFilter === cat.id ? 'var(--color-gold)' : 'var(--border-light)'}; background: ${galleryFilter === cat.id ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.03)'}; color: ${galleryFilter === cat.id ? 'var(--color-gold-bright)' : 'var(--color-wool-muted)'}; transition: all 0.2s;"
            >
              ${cat.label} (${cat.count})
            </button>
          `).join('')}
        </div>

        <!-- Gallery Grid -->
        ${filtered.length === 0 ? `
          <div style="text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-light); border-radius: 12px;">
            <div style="margin-bottom: 12px; color: var(--color-gold);">${Icons.camera('', 40)}</div>
            <h3 style="font-size: 1.2rem; color: var(--color-wool); margin-bottom: 6px;">No Photographs in this Category</h3>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin-bottom: 16px;">Click "Add New Photo" to upload photographs for this filter.</p>
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 20px;">
            ${filtered.map(item => {
              const itemId = item._id || item.id;
              const isActive = item.isActive !== false;
              return `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, border-color 0.2s;">
                  
                  <!-- Thumbnail Container -->
                  <div style="position: relative; width: 100%; height: 180px; background: #000; overflow: hidden;">
                    <img 
                      src="${item.image || item.imageUrl || item.src || '/assets/images/gallery/crowd_atmosphere_1.jpg'}" 
                      alt="${item.title || 'Photo'}" 
                      loading="lazy"
                      style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;"
                      onerror="this.onerror=null; this.src='/assets/images/gallery/crowd_atmosphere_1.jpg';"
                    />
                    
                    <!-- Top Badges -->
                    <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 6px;">
                      <span style="padding: 3px 8px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; background: rgba(0,0,0,0.75); color: var(--color-gold); border: 1px solid var(--border-gold); backdrop-filter: blur(4px);">
                        ${item.categoryLabel || item.category || 'Match Action'}
                      </span>
                    </div>

                    <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 6px;">
                      ${item.featured ? `
                        <span style="padding: 3px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.65rem; font-weight: 700; background: rgba(212,175,55,0.9); color: #000; display: inline-flex; align-items: center; gap: 4px;">
                          ${Icons.star('fill-gold', 11)} FEATURED
                        </span>
                      ` : ''}
                      <span style="padding: 3px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.65rem; font-weight: 700; background: ${isActive ? 'rgba(34,187,85,0.85)' : 'rgba(220,38,38,0.85)'}; color: #fff;">
                        ${isActive ? 'ACTIVE' : 'HIDDEN'}
                      </span>
                    </div>

                    <!-- Bottom Tag -->
                    <div style="position: absolute; bottom: 8px; left: 10px;">
                      <span style="padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.65rem; background: rgba(0,0,0,0.75); color: var(--color-wool-muted); display: inline-flex; align-items: center; gap: 4px;">
                        ${Icons.calendar()} ${item.year || '2025'}
                      </span>
                    </div>
                  </div>

                  <!-- Details -->
                  <div style="padding: 16px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                      <h4 style="font-size: 1rem; color: var(--color-wool); margin: 0 0 6px; line-height: 1.35; font-weight: 700;">
                        ${item.title}
                      </h4>
                      ${item.location ? `
                        <div style="font-size: 0.76rem; color: var(--color-wool-muted); margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">
                          ${Icons.mapPin()} ${item.location}
                        </div>
                      ` : ''}
                      ${item.caption ? `
                        <p style="font-size: 0.8rem; color: var(--color-wool-subtle); line-height: 1.45; margin: 0 0 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                          ${item.caption}
                        </p>
                      ` : ''}
                    </div>

                    <!-- Actions -->
                    <div style="display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; margin-top: 8px;">
                      <button 
                        type="button" 
                        class="btn-edit-gallery" 
                        data-id="${itemId}"
                        style="flex: 1; padding: 7px 12px; background: rgba(212,175,55,0.12); border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold); font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;"
                      >
                        ${Icons.edit()} Edit
                      </button>
                      <button 
                        type="button" 
                        class="btn-delete-gallery" 
                        data-id="${itemId}"
                        style="padding: 7px 12px; background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.4); border-radius: 6px; color: #fca5a5; font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;"
                      >
                        ${Icons.trash()} Delete
                      </button>
                    </div>

                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     TAB 7: NEWS & DISPATCHES
     -------------------------------------------------------------------------- */
  function renderNewsTab() {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-gold); margin: 0;">
              News & Joint Committee Dispatches
            </h2>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin: 4px 0 0;">
              Publish official announcements, press releases, team selections, and match bulletins.
            </p>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button type="button" id="btn-refresh-news" style="padding: 8px 14px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); cursor: pointer; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;">
              ${Icons.refresh()} Refresh News
            </button>
            <button type="button" id="btn-add-news" class="btn-primary-cinematic" style="padding: 8px 16px; font-size: 0.82rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              ${Icons.plus()} Publish New Article
            </button>
          </div>
        </div>

        ${news.length === 0 ? `
          <div style="text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-light); border-radius: 12px;">
            <div style="margin-bottom: 12px; color: var(--color-gold);">${Icons.newspaper('', 40)}</div>
            <h3 style="font-size: 1.2rem; color: var(--color-wool); margin-bottom: 6px;">No Articles Published Yet</h3>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin-bottom: 18px;">
              Publish the first dispatch or press release to the live website.
            </p>
            <button type="button" class="btn-primary-cinematic" id="btn-add-first-news" style="padding: 8px 18px; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px; margin: 0 auto;">
              ${Icons.plus()} Publish First Article
            </button>
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
            ${news.map(art => {
              const artId = art._id || art.id || art.slug;
              const imgUrl = art.coverImage || art.image || '/assets/images/news/maroons_salutation_2025.jpeg';
              return `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
                  <!-- Thumbnail -->
                  <div style="width: 100%; height: 160px; overflow: hidden; background: #000; position: relative;">
                    <img src="${imgUrl}" alt="${art.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/assets/images/news/maroons_salutation_2025.jpeg';" />
                    <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 6px;">
                      <span style="font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: rgba(0,0,0,0.75); color: var(--color-gold-bright); border: 1px solid var(--border-gold); text-transform: uppercase;">
                        ${art.category || 'ANNOUNCEMENTS'}
                      </span>
                      ${art.featured ? `
                        <span style="font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: rgba(212,175,55,0.9); color: #000; display: inline-flex; align-items: center; gap: 4px;">
                          ${Icons.star('fill-gold', 11)} FEATURED
                        </span>
                      ` : ''}
                    </div>
                    <div style="position: absolute; top: 10px; right: 10px;">
                      <span style="padding: 3px 8px; border-radius: 4px; font-size: 0.68rem; font-family: var(--font-mono); font-weight: 700; ${art.isPublished !== false ? 'background: rgba(34,187,85,0.85); color: #fff;' : 'background: rgba(245,158,11,0.85); color: #000;'}">
                        ${art.isPublished !== false ? 'LIVE' : 'DRAFT'}
                      </span>
                    </div>
                  </div>

                  <!-- Content Body -->
                  <div style="padding: 18px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                      <h3 style="font-size: 1.15rem; color: var(--color-wool); margin: 0 0 8px; line-height: 1.4; font-weight: 700;">
                        ${art.title}
                      </h3>
                      <p style="font-size: 0.82rem; color: var(--color-wool-muted); line-height: 1.5; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                        ${art.summary || art.excerpt || ''}
                      </p>
                    </div>

                    <div>
                      <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--color-wool-subtle); margin-bottom: 14px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px; display: flex; align-items: center; gap: 6px;">
                        ${Icons.calendar()} ${art.date || 'March 2026'} &bull; By ${art.author || 'Joint Secretariat'}
                      </div>

                      <div style="display: flex; gap: 8px;">
                        <button 
                          type="button" 
                          class="btn-edit-news" 
                          data-id="${artId}"
                          style="flex: 1; padding: 7px 12px; background: rgba(212,175,55,0.12); border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold); font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;"
                        >
                          ${Icons.edit()} Edit
                        </button>
                        <button 
                          type="button" 
                          class="btn-delete-news" 
                          data-id="${artId}"
                          style="padding: 7px 12px; background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.4); border-radius: 6px; color: #fca5a5; font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;"
                        >
                          ${Icons.trash()} Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     TAB 8: SPONSORS & PARTNERS
     -------------------------------------------------------------------------- */
  function renderSponsorsTab() {
    // Helper to get friendly tier label & styling
    function getTierBadge(tier) {
      const t = String(tier || '').toLowerCase();
      if (t === 'platinum') {
        return { label: 'PLATINUM PARTNER', bg: 'rgba(212,175,55,0.2)', color: 'var(--color-gold-bright)', border: 'var(--color-gold)' };
      }
      if (t === 'gold') {
        return { label: 'GOLD SPONSOR', bg: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: 'rgba(245,158,11,0.5)' };
      }
      if (t === 'mediaandbroadcast' || t === 'media') {
        return { label: 'MEDIA & BROADCAST', bg: 'rgba(6,182,212,0.2)', color: '#38bdf8', border: 'rgba(6,182,212,0.5)' };
      }
      return { label: 'OFFICIAL PARTNER', bg: 'rgba(168,85,247,0.2)', color: '#c084fc', border: 'rgba(168,85,247,0.5)' };
    }

    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-gold); margin: 0 0 4px;">
              Corporate Sponsors & Official Partners
            </h2>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin: 0;">
              Manage partner tier assignments, logos, websites, and brand visibility on the live site.
            </p>
          </div>

          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <button type="button" id="btn-refresh-sponsors" style="padding: 8px 14px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); cursor: pointer; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;">
              ${Icons.refresh()} Refresh Sponsors
            </button>
            <button type="button" id="btn-add-sponsor" class="btn-primary-cinematic" style="padding: 8px 16px; font-size: 0.82rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              ${Icons.plus()} Add New Sponsor
            </button>
          </div>
        </div>

        ${sponsors.length === 0 ? `
          <div style="text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-light); border-radius: 12px;">
            <div style="margin-bottom: 12px; color: var(--color-gold);">${Icons.handshake('', 40)}</div>
            <h3 style="font-size: 1.2rem; color: var(--color-wool); margin-bottom: 6px;">No Corporate Sponsors Added Yet</h3>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin-bottom: 18px;">
              Add official sponsors and corporate partners to show on the public website and home page.
            </p>
            <button type="button" class="btn-primary-cinematic" id="btn-add-first-sponsor" style="padding: 8px 18px; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px; margin: 0 auto;">
              ${Icons.plus()} Add First Sponsor
            </button>
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;">
            ${sponsors.map(sp => {
              const spId = sp._id || sp.id;
              const badge = getTierBadge(sp.tier);
              const webUrl = sp.website || sp.websiteUrl || '#';
              return `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <!-- Card Top: Tier Badge & Status -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                      <span style="display: inline-block; padding: 3px 10px; border-radius: 20px; font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; background: ${badge.bg}; color: ${badge.color}; border: 1px solid ${badge.border}; text-transform: uppercase;">
                        ${badge.label}
                      </span>
                      <span style="font-family: var(--font-mono); font-size: 0.68rem; padding: 2px 6px; border-radius: 4px; ${sp.isActive !== false ? 'background: rgba(34,187,85,0.2); color: #75f0a0;' : 'background: rgba(220,38,38,0.2); color: #fca5a5;'}">
                        ${sp.isActive !== false ? 'ACTIVE' : 'HIDDEN'}
                      </span>
                    </div>

                    <!-- Logo Light Box: ensures dark/transparent logos are 100% visible -->
                    <div style="background: #ffffff; border-radius: 8px; padding: 12px; height: 80px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                      <img 
                        src="${sp.logo || ''}" 
                        alt="${sp.name}" 
                        style="max-width: 100%; max-height: 100%; object-fit: contain;" 
                        onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='block';"
                      />
                      <span style="display: none; color: #180a0f; font-family: var(--font-display); font-weight: 800; font-size: 1.1rem; text-align: center;">
                        ${sp.name}
                      </span>
                    </div>

                    <!-- Sponsor Name & Designation -->
                    <h3 style="font-size: 1.2rem; color: var(--color-wool); margin: 0 0 4px; font-weight: 700;">
                      ${sp.name}
                    </h3>
                    ${sp.role || sp.title ? `
                      <div style="font-size: 0.78rem; color: var(--color-gold); font-family: var(--font-mono); margin-bottom: 8px;">
                        ${sp.role || sp.title}
                      </div>
                    ` : ''}

                    ${sp.description || sp.tagline ? `
                      <p style="font-size: 0.8rem; color: var(--color-wool-muted); line-height: 1.45; margin-bottom: 12px;">
                        ${sp.description || sp.tagline}
                      </p>
                    ` : ''}
                  </div>

                  <div>
                    <!-- Website URL Link -->
                    <div style="margin-bottom: 14px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
                      ${webUrl && webUrl !== '#' ? `
                        <a href="${webUrl}" target="_blank" rel="noopener noreferrer" style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--color-gold); text-decoration: none; display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                          ${Icons.globe()} <span>${webUrl.replace(/^https?:\/\//, '')}</span> ${Icons.externalLink()}
                        </a>
                      ` : `
                        <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-wool-subtle);">
                          No external website link
                        </span>
                      `}
                    </div>

                    <!-- Action Buttons -->
                    <div style="display: flex; gap: 8px;">
                      <button 
                        type="button" 
                        class="btn-edit-sponsor" 
                        data-id="${spId}"
                        style="flex: 1; padding: 7px 12px; background: rgba(212,175,55,0.12); border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold); font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;"
                      >
                        ${Icons.edit()} Edit
                      </button>
                      <button 
                        type="button" 
                        class="btn-delete-sponsor" 
                        data-id="${spId}"
                        style="padding: 7px 12px; background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.4); border-radius: 6px; color: #fca5a5; font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;"
                      >
                        ${Icons.trash()} Delete
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     TAB 9: INQUIRIES INBOX
     -------------------------------------------------------------------------- */
  function renderInquiriesTab() {
    return `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-gold); margin: 0;">
              Secretariat Inquiries Inbox
            </h2>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin: 4px 0 0;">
              Private incoming messages submitted through the public website contact form.
            </p>
          </div>

          <button type="button" id="btn-refresh-inquiries" style="padding: 8px 14px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); cursor: pointer; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;">
            ${Icons.refresh()} Refresh Inbox
          </button>
        </div>

        ${inquiries.length === 0 ? `
          <div style="text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-light); border-radius: 12px;">
            <div style="margin-bottom: 12px; color: var(--color-gold);">${Icons.inbox('', 40)}</div>
            <h3 style="font-size: 1.2rem; color: var(--color-wool); margin-bottom: 6px;">Inbox is Clear</h3>
            <p style="font-size: 0.85rem; color: var(--color-wool-muted);">
              When visitors send inquiries through the contact page, they will arrive here for committee review.
            </p>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${inquiries.map(inq => {
              const isNew = inq.status === 'NEW';
              return `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid ${isNew ? 'rgba(212,175,55,0.4)' : 'var(--border-light)'}; border-radius: 10px; padding: 20px; transition: all 0.2s;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 10px;">
                        <strong style="font-size: 1.05rem; color: var(--color-wool);">${inq.name}</strong>
                        <span style="font-family: var(--font-mono); font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; ${isNew ? 'background: rgba(212,175,55,0.2); color: var(--color-gold-bright);' : 'background: rgba(255,255,255,0.08); color: var(--color-wool-muted);'}">
                          ${inq.status}
                        </span>
                      </div>
                      <div style="font-size: 0.8rem; color: var(--color-wool-muted); margin-top: 2px;">
                        ${inq.email} ${inq.phone ? `&bull; ${inq.phone}` : ''} &bull; Category: <span style="text-transform: capitalize; color: var(--color-gold);">${inq.category || 'General'}</span>
                      </div>
                    </div>

                    <div style="display: flex; gap: 8px;">
                      <button 
                        type="button" 
                        class="btn-mark-resolved" 
                        data-inq-id="${inq._id || inq.id}"
                        style="padding: 6px 12px; background: rgba(34,187,85,0.15); border: 1px solid rgba(34,187,85,0.4); border-radius: 6px; color: #75f0a0; font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;"
                      >
                        ${Icons.check()} Mark Resolved
                      </button>
                      <button 
                        type="button" 
                        class="btn-delete-inquiry" 
                        data-inq-id="${inq._id || inq.id}"
                        title="Delete Inquiry"
                        style="padding: 6px 12px; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.4); border-radius: 6px; color: #f87171; font-family: var(--font-mono); font-size: 0.75rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;"
                      >
                        ${Icons.trash()} Delete
                      </button>
                    </div>
                  </div>

                  <div style="font-size: 0.88rem; line-height: 1.5; color: var(--color-wool); background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px; margin-top: 8px;">
                    ${inq.message}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     TAB 10: SECURITY
     -------------------------------------------------------------------------- */
  function renderSecurityTab() {
    return `
      <div style="max-width: 600px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-light); border-radius: 12px; padding: 32px;">
        <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-gold); margin-bottom: 8px;">
          Security & Password Management
        </h2>
        <p style="font-size: 0.85rem; color: var(--color-wool-muted); margin-bottom: 24px;">
          Update your administrative credentials. Ensure high complexity for production deployment.
        </p>

        <form id="form-change-password">
          <div class="form-group">
            <label class="form-label" for="pass-current">Current Password</label>
            <input type="password" id="pass-current" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="pass-new">New Complex Password</label>
            <input type="password" id="pass-new" class="form-input" minlength="8" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="pass-confirm">Confirm New Password</label>
            <input type="password" id="pass-confirm" class="form-input" minlength="8" required />
          </div>

          <button type="submit" class="btn-primary-cinematic" id="btn-save-password" style="padding: 12px 28px; margin-top: 12px; display: inline-flex; align-items: center; gap: 8px;">
            ${Icons.lock()} Update Password
          </button>
        </form>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     MODALS
     -------------------------------------------------------------------------- */
  function renderOrderModal(order) {
    return `
      <div class="checkout-modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;">
        <div class="checkout-modal-card" style="background: #180a0f; border: 2px solid var(--color-gold); border-radius: 16px; max-width: 580px; width: 100%; padding: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); position: relative;">
          <button type="button" id="btn-close-order-modal" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.2rem; color: var(--color-wool-muted); cursor: pointer; display: flex; align-items: center; justify-content: center;">${Icons.close()}</button>

          <span style="font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-gold-bright); font-weight: 700;">
            PASS DETAILS & VERIFICATION
          </span>
          <h2 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--color-wool); margin: 6px 0 16px;">
            Order ${order.orderRef}
          </h2>

          <div style="display: grid; grid-template-columns: 1fr 140px; gap: 20px; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <div style="font-size: 0.85rem; line-height: 1.6;">
              <div><strong>Passholder:</strong> ${order.buyerName}</div>
              <div><strong>Email:</strong> ${order.buyerEmail}</div>
              <div><strong>Phone:</strong> ${order.buyerPhone || 'N/A'}</div>
              <div><strong>Enclosure:</strong> ${order.categoryName}</div>
              <div><strong>Format:</strong> ${order.matchFormat === '3day' ? '3-Day Encounter' : 'One Day Match'}</div>
              <div><strong>Quantity:</strong> ${order.quantity} passes</div>
              <div><strong>Amount:</strong> LKR ${(order.totalAmount || 0).toLocaleString()}</div>
              <div><strong>Status:</strong> <span style="color: ${order.status === 'VERIFIED' ? '#75f0a0' : '#fbbf24'}; font-weight: 700; font-family: var(--font-mono);">${order.status}</span></div>
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed rgba(255,255,255,0.1);">
                <strong>Gate Admission:</strong> 
                <span style="color: ${order.isAdmitted ? '#34d399' : '#fbbf24'}; font-weight: 700; font-family: var(--font-mono);">
                  ${order.isAdmitted ? `✓ SCANNED & ADMITTED at ${new Date(order.admittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})} (${order.admittedGate || 'Main Gate'})` : '⏳ NOT YET SCANNED AT GATE'}
                </span>
              </div>
            </div>

            <div style="text-align: center;">
              ${order.qrCodeData ? `
                <img src="${order.qrCodeData}" alt="QR Pass" style="width: 120px; height: 120px; background: white; border-radius: 8px; padding: 4px;" />
                <div style="font-size: 0.65rem; color: var(--color-gold-bright); margin-top: 4px; font-family: var(--font-mono);">
                  VALID GATE QR
                </div>
              ` : `
                <div style="padding: 20px 10px; font-size: 0.75rem; color: var(--color-wool-muted);">
                  No QR generated
                </div>
              `}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
            <button type="button" id="btn-modal-delete-order" data-order-ref="${order.orderRef}" data-order-id="${order._id || order.id || order.orderRef}" style="padding: 10px 16px; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.4); border-radius: 6px; color: #f87171; font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              ${Icons.trash()} Delete Order
            </button>
            <div style="display: flex; gap: 10px;">
              ${order.status !== 'VERIFIED' ? `
                <button type="button" id="btn-manual-verify-order" data-order-ref="${order.orderRef}" style="padding: 10px 18px; background: rgba(34,187,85,0.2); border: 1px solid #22bb55; border-radius: 6px; color: #75f0a0; font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                  ${Icons.check()} Manually Mark Verified & Issue QR
                </button>
              ` : ''}
              <button type="button" id="btn-modal-close-action" style="padding: 10px 18px; background: rgba(255,255,255,0.1); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer;">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderInquiryModal() {
    return '';
  }

  function renderCategoryModal(cat) {
    const isNew = !cat || cat._isNew;
    const totalCap = Number(cat?.totalCapacity ?? 500);
    const sold = Number(cat?.soldCount ?? 0);
    const reserved = Number(cat?.reservedCount ?? 0);
    const available = Math.max(0, totalCap - (sold + reserved));
    return `
      <div class="checkout-modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;">
        <div class="checkout-modal-card" style="background: #180a0f; border: 2px solid var(--color-gold); border-radius: 16px; max-width: 580px; width: 100%; padding: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.85); position: relative; max-height: 90vh; overflow-y: auto;">
          <button type="button" id="btn-close-cat-modal" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.2rem; color: var(--color-wool-muted); cursor: pointer; display: flex; align-items: center; justify-content: center;">${Icons.close()}</button>

          <span class="mono-tag" style="background: rgba(212,175,55,0.15); color: var(--color-gold); border: 1px solid rgba(212,175,55,0.3); padding: 4px 10px; border-radius: 4px; font-size: 0.72rem;">
            ${isNew ? 'CREATE NEW ENCLOSURE' : 'ENCLOSURE CONFIGURATION'}
          </span>

          <h3 style="font-size: 1.4rem; color: var(--color-wool); margin: 8px 0 4px; font-family: var(--font-display);">
            ${isNew ? 'Add Ticket Category' : `Edit ${cat.name}`}
          </h3>
          <p style="font-size: 0.82rem; color: var(--color-wool-muted); margin-bottom: 20px;">
            ${isNew ? 'Configure a new match pass category, quota, and pricing in LKR.' : `Enclosure Code: <strong style="color: var(--color-gold); font-family: var(--font-mono);">${cat.code}</strong>`}
          </p>

          <form id="form-edit-category">
            ${isNew ? `
              <div class="form-group" style="margin-bottom: 16px;">
                <label class="form-label" for="edit-cat-code">Category Code (Unique Slug)</label>
                <input type="text" id="edit-cat-code" class="form-input" value="${cat?.code || ''}" placeholder="e.g. corporate-box" required />
              </div>
            ` : ''}

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-cat-name">Category Title</label>
              <input type="text" id="edit-cat-name" class="form-input" value="${cat?.name || ''}" placeholder="e.g. Corporate Hospitality Suite" required />
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-cat-price">Price per Pass (LKR)</label>
              <input type="number" id="edit-cat-price" class="form-input" value="${cat?.price ?? 2500}" min="0" step="50" required />
            </div>

            <!-- INVENTORY & QUOTA ALLOCATION (EDITABLE) -->
            <div style="background: rgba(0,0,0,0.45); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; padding: 18px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
                <div>
                  <span style="font-family: var(--font-display); font-size: 0.95rem; color: var(--color-gold); font-weight: 700; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
                    ${Icons.ticket('', 16)} Pass Allocation & Quotas
                  </span>
                  <span style="font-size: 0.72rem; color: var(--color-wool-muted);">
                    Directly check and edit capacity, sold, or reserved quotas
                  </span>
                </div>
                <span style="font-family: var(--font-mono); font-size: 0.7rem; background: rgba(212,175,55,0.15); color: var(--color-gold); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(212,175,55,0.25);">
                  LIVE CALIBRATION
                </span>
              </div>

              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 14px;">
                <div class="form-group" style="margin: 0;">
                  <label class="form-label" for="edit-cat-capacity" style="font-size: 0.76rem; color: var(--color-wool);">
                    Total Capacity
                  </label>
                  <input 
                    type="number" 
                    id="edit-cat-capacity" 
                    class="form-input" 
                    value="${totalCap}" 
                    min="0" 
                    required 
                    style="font-family: var(--font-mono); font-weight: 700; font-size: 0.95rem; background: #0c0507; color: #ffffff;"
                  />
                  <span style="font-size: 0.68rem; color: var(--color-wool-subtle); display: block; margin-top: 4px;">
                    Total passes allocated
                  </span>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label" for="edit-cat-sold" style="font-size: 0.76rem; color: #75f0a0;">
                    Sold Passes
                  </label>
                  <input 
                    type="number" 
                    id="edit-cat-sold" 
                    class="form-input" 
                    value="${sold}" 
                    min="0" 
                    required 
                    style="font-family: var(--font-mono); font-weight: 700; font-size: 0.95rem; background: #0c0507; color: #75f0a0; border-color: rgba(117,240,160,0.3);"
                  />
                  <span style="font-size: 0.68rem; color: var(--color-wool-subtle); display: block; margin-top: 4px;">
                    Confirmed purchases
                  </span>
                </div>

                <div class="form-group" style="margin: 0;">
                  <label class="form-label" for="edit-cat-reserved" style="font-size: 0.76rem; color: #f59e0b;">
                    Reserved Passes
                  </label>
                  <input 
                    type="number" 
                    id="edit-cat-reserved" 
                    class="form-input" 
                    value="${reserved}" 
                    min="0" 
                    required 
                    style="font-family: var(--font-mono); font-weight: 700; font-size: 0.95rem; background: #0c0507; color: #f59e0b; border-color: rgba(245,158,11,0.3);"
                  />
                  <span style="font-size: 0.68rem; color: var(--color-wool-subtle); display: block; margin-top: 4px;">
                    VIP / Held allocation
                  </span>
                </div>
              </div>

              <!-- Live Calculated Remaining Passes Display -->
              <div style="background: rgba(212,175,55,0.07); border: 1px dashed rgba(212,175,55,0.4); border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono);">
                <div>
                  <div style="font-size: 0.78rem; color: var(--color-gold); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                    Remaining (Public Availability)
                  </div>
                  <div id="live-cat-calc-formula" style="font-size: 0.7rem; color: var(--color-wool-muted); margin-top: 2px;">
                    Capacity (${totalCap}) - Sold (${sold}) - Reserved (${reserved})
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="display: flex; align-items: baseline; gap: 4px; justify-content: flex-end;">
                    <span id="live-cat-remaining-val" style="font-size: 1.5rem; font-weight: 800; color: var(--color-gold-bright); line-height: 1;">
                      ${available}
                    </span>
                    <span style="font-size: 0.75rem; color: var(--color-wool-muted);">passes</span>
                  </div>
                  <span id="live-cat-remaining-status" style="font-size: 0.68rem; color: ${available > 0 ? '#75f0a0' : '#f59e0b'}; font-weight: 600;">
                    ${available > 0 ? 'AVAILABLE FOR SALE' : 'SOLD OUT'}
                  </span>
                </div>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-cat-desc">Spectator Description</label>
              <textarea id="edit-cat-desc" class="form-input" rows="3" style="resize: vertical;" placeholder="Describe view, perks, hospitality, or amenities...">${cat?.description || ''}</textarea>
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-cat-booking-url">Category-Specific Partner Booking Link (Optional)</label>
              <input type="url" id="edit-cat-booking-url" class="form-input" placeholder="https://www.tickets.lk/event/...#grandstand" value="${cat?.bookingUrl || ''}" />
              <span style="font-size: 0.72rem; color: var(--color-wool-subtle); margin-top: 4px; display: block;">Leave empty to inherit the global partner booking link.</span>
            </div>

            <div style="margin-bottom: 24px;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="edit-cat-active" ${!cat || cat.isActive !== false ? 'checked' : ''} style="width: 18px; height: 18px;" />
                <span>Mark as <strong>Active & Open for Public Booking</strong></span>
              </label>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end; align-items: center;">
              ${!isNew ? `
                <button type="button" id="btn-delete-cat" data-id="${cat._id || cat.id || cat.code}" style="margin-right: auto; padding: 10px 16px; background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.4); border-radius: 6px; color: #fca5a5; font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                  ${Icons.trash()} Delete
                </button>
              ` : ''}
              <button type="button" id="btn-cat-cancel" style="padding: 10px 18px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer;">
                Cancel
              </button>
              <button type="submit" id="btn-save-cat" class="btn-primary-cinematic" style="padding: 10px 22px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
                ${Icons.download()} ${isNew ? 'Create Category' : 'Save to MongoDB'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function renderTeamModal(team) {
    const squad = team.verifiedSquadMembers || team.squad || [];
    const squadText = squad.map(p => `${p.name} - ${p.role || 'Squad Member'} - ${p.specialism || ''}`).join('\n');
    const hof = team.cricketHallOfFame || [];
    const hofText = hof.map(h => `${h.name} | ${h.feat || ''} | ${h.image || ''}`).join('\n');
    const schoolKey = (team.schoolKey || team.school || (team.name && team.name.toLowerCase().includes('nalanda') ? 'nalanda' : 'ananda')).toLowerCase();

    return `
      <div class="checkout-modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;">
        <div class="checkout-modal-card" style="background: #180a0f; border: 2px solid var(--color-gold); border-radius: 16px; max-width: 680px; width: 100%; padding: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); position: relative; max-height: 90vh; overflow-y: auto;">
          <button type="button" id="btn-close-team-modal" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.2rem; color: var(--color-wool-muted); cursor: pointer; display: flex; align-items: center; justify-content: center;">${Icons.close()}</button>

          <span class="mono-tag" style="background: rgba(212,175,55,0.15); color: var(--color-gold); border: 1px solid rgba(212,175,55,0.3); padding: 4px 10px; border-radius: 4px; font-size: 0.72rem;">
            TEAM, SQUAD & HALL OF FAME MANAGEMENT
          </span>

          <h3 style="font-size: 1.4rem; color: var(--color-wool); margin: 8px 0 4px; font-family: var(--font-display);">
            Edit ${team.name || (schoolKey === 'ananda' ? 'Ananda College' : 'Nalanda College')}
          </h3>
          <p style="font-size: 0.82rem; color: var(--color-wool-muted); margin-bottom: 20px;">
            School Key: <strong style="color: var(--color-gold); font-family: var(--font-mono);">${schoolKey.toUpperCase()}</strong>
          </p>

          <form id="form-edit-team">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group">
                <label class="form-label" for="edit-team-name">College Name</label>
                <input type="text" id="edit-team-name" class="form-input" value="${team.name || ''}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="edit-team-motto">School Motto</label>
                <input type="text" id="edit-team-motto" class="form-input" value="${team.motto || ''}" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group">
                <label class="form-label" for="edit-team-captain">1st XI Captain</label>
                <input type="text" id="edit-team-captain" class="form-input" value="${team.captain || team.recentCaptain || ''}" placeholder="e.g. Kanchana De Silva" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="edit-team-vice-captain">Vice Captain</label>
                <input type="text" id="edit-team-vice-captain" class="form-input" value="${team.viceCaptain || ''}" placeholder="e.g. Dinada Athalage" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group">
                <label class="form-label" for="edit-team-coach">Head Coach</label>
                <input type="text" id="edit-team-coach" class="form-input" value="${team.headCoach || ''}" placeholder="e.g. Shantha Kalavitigoda" />
              </div>
              <div class="form-group">
                <label class="form-label" for="edit-team-principal">College Principal</label>
                <input type="text" id="edit-team-principal" class="form-input" value="${team.principal || ''}" placeholder="e.g. Mr. D.M. Lal Dissanayake" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group">
                <label class="form-label" for="edit-team-big-wins">Big Match Wins (3-Day)</label>
                <input type="number" id="edit-team-big-wins" class="form-input" value="${team.bigMatchWins ?? 0}" min="0" />
              </div>
              <div class="form-group">
                <label class="form-label" for="edit-team-oneday-wins">One Day Wins (50-Over)</label>
                <input type="number" id="edit-team-oneday-wins" class="form-input" value="${team.oneDayWins ?? 0}" min="0" />
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 18px;">
              <label class="form-label" for="edit-team-squad">
                Squad Members (Format: <code>Player Name - Role - Specialism</code>, one per line)
              </label>
              <textarea id="edit-team-squad" class="form-input" rows="6" style="resize: vertical; font-family: var(--font-mono); font-size: 0.78rem;">${squadText}</textarea>
              <span style="font-size: 0.72rem; color: var(--color-wool-subtle); margin-top: 4px; display: block;">
                Example: <code>Aashan Perera - Top-order Batsman - Right-hand bat</code>
              </span>
            </div>

            <div class="form-group" style="margin-bottom: 20px;">
              <label class="form-label" for="edit-team-hof" style="display: flex; justify-content: space-between; align-items: center;">
                <span>Cricket Hall of Fame Legends</span>
                <span style="font-size: 0.72rem; color: var(--color-gold); font-family: var(--font-mono); font-weight: normal;">${hof.length} Legends Listed</span>
              </label>
              <p style="font-size: 0.75rem; color: var(--color-wool-muted); margin-bottom: 6px; line-height: 1.4;">
                Format: <code>Legend Name | Historical Feat / Bio | Image URL</code> (one legend per line)
              </p>
              <textarea id="edit-team-hof" class="form-input" rows="7" style="resize: vertical; font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.5;" placeholder="Arjuna Ranatunga | Captain of Sri Lanka's 1996 Cricket World Cup Champions | /assets/images/history/legend_arjuna_ranatunga.jpg">${hofText}</textarea>
              <span style="font-size: 0.72rem; color: var(--color-wool-subtle); margin-top: 4px; display: block;">
                Example: <code>Mahela Jayawardena | ICC Hall of Fame; 11,814 Test runs | /assets/images/history/farewell_mahela.jpg</code>
              </span>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
              <button type="button" id="btn-team-cancel" style="padding: 10px 18px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer;">
                Cancel
              </button>
              <button type="submit" id="btn-save-team" class="btn-primary-cinematic" style="padding: 10px 22px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
                ${Icons.download()} Save Team to MongoDB
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function renderGalleryModal(photo) {
    const isEditing = Boolean(photo._id || photo.id);
    const photoCategory = photo.category || 'matches';
    return `
      <div class="checkout-modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;">
        <div class="checkout-modal-card" style="background: #180a0f; border: 2px solid var(--color-gold); border-radius: 16px; max-width: 650px; width: 100%; padding: 28px; box-shadow: 0 20px 50px rgba(0,0,0,0.85); position: relative; max-height: 90vh; overflow-y: auto;">
          <button type="button" id="btn-close-gallery-modal" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.2rem; color: var(--color-wool-muted); cursor: pointer; display: flex; align-items: center; justify-content: center;">${Icons.close()}</button>

          <span class="mono-tag" style="background: rgba(212,175,55,0.15); color: var(--color-gold); border: 1px solid rgba(212,175,55,0.3); padding: 4px 10px; border-radius: 4px; font-size: 0.72rem;">
            PHOTO GALLERY CURATION
          </span>

          <h3 style="font-size: 1.4rem; color: var(--color-wool); margin: 8px 0 4px; font-family: var(--font-display);">
            ${isEditing ? 'Edit Photograph' : 'Add New Photograph to Gallery'}
          </h3>
          <p style="font-size: 0.82rem; color: var(--color-wool-muted); margin-bottom: 20px;">
            Supports instant file upload from computer or external image web URLs.
          </p>

          <form id="form-edit-gallery">
            <!-- Hidden File Input for Native File Upload -->
            <input type="file" id="gallery-file-input" accept="image/*" style="display: none;" />

            <!-- Image Upload & Preview Card -->
            <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-light); border-radius: 10px; padding: 16px; margin-bottom: 18px;">
              <label class="form-label" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span>Photograph File or URL</span>
                <span style="font-size: 0.72rem; color: var(--color-gold-bright);">Supports JPG, PNG, WEBP</span>
              </label>

              <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
                <button 
                  type="button" 
                  id="btn-browse-photo"
                  style="padding: 9px 16px; background: rgba(212,175,55,0.18); border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold-bright); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 6px;"
                >
                  ${Icons.folder()} Upload Photo from Computer
                </button>
                <span style="font-size: 0.8rem; color: var(--color-wool-muted); align-self: center;">or enter URL / path below:</span>
              </div>

              <input 
                type="text" 
                id="edit-gallery-image" 
                class="form-input" 
                value="${photo.image || ''}" 
                placeholder="e.g. /uploads/photo-1700000000.jpg or /assets/images/... or https://..." 
                required 
              />

              <!-- Live Preview Area -->
              <div id="gallery-preview-box" style="margin-top: 12px; width: 100%; height: 180px; border: 1px dashed ${photo.image ? 'var(--color-gold)' : 'var(--border-light)'}; border-radius: 8px; overflow: hidden; background: #080305; display: flex; align-items: center; justify-content: center; position: relative;">
                <img 
                  id="gallery-preview-img" 
                  src="${photo.image || ''}" 
                  alt="Preview" 
                  style="max-width: 100%; max-height: 100%; object-fit: contain; ${photo.image ? '' : 'display: none;'}" 
                  onerror="this.style.display='none'; document.getElementById('gallery-preview-placeholder').style.display='block';"
                />
                <div id="gallery-preview-placeholder" style="color: var(--color-wool-muted); font-size: 0.8rem; font-family: var(--font-mono); text-align: center; padding: 20px; ${photo.image ? 'display: none;' : ''}">
                  ${Icons.camera()} Photo Preview will appear here once selected or entered
                </div>
              </div>
            </div>

            <!-- Title Field -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-gallery-title">Photograph Title</label>
              <input type="text" id="edit-gallery-title" class="form-input" value="${photo.title || ''}" placeholder="e.g. Captain Lifts 97th Battle Trophy" required />
            </div>

            <!-- Category & Year -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group">
                <label class="form-label" for="edit-gallery-category">Gallery Category</label>
                <select id="edit-gallery-category" class="form-input" style="background: #14070a; color: var(--color-wool); cursor: pointer;">
                  <option value="matches" ${photoCategory === 'matches' ? 'selected' : ''}>Match Action</option>
                  <option value="atmosphere" ${photoCategory === 'atmosphere' ? 'selected' : ''}>Crowd & Atmosphere</option>
                  <option value="ceremonies" ${photoCategory === 'ceremonies' ? 'selected' : ''}>Ceremonies & Toss</option>
                  <option value="legends" ${photoCategory === 'legends' ? 'selected' : ''}>Legends & Heritage</option>
                  <option value="heritage" ${photoCategory === 'heritage' ? 'selected' : ''}>Historical Archives</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="edit-gallery-year">Encounter Year</label>
                <input type="text" id="edit-gallery-year" class="form-input" value="${photo.year || '2026'}" placeholder="e.g. 2026" required />
              </div>
            </div>

            <!-- Location -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-gallery-location">Venue / Location</label>
              <input type="text" id="edit-gallery-location" class="form-input" value="${photo.location || 'Sinhalese Sports Club (SSC) Grounds, Colombo'}" placeholder="e.g. SSC Grounds, Colombo" />
            </div>

            <!-- Caption -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-gallery-caption">Caption / Chronicle Detail</label>
              <textarea id="edit-gallery-caption" class="form-input" rows="3" style="resize: vertical;" placeholder="Brief description of the moment, players involved, or atmosphere...">${photo.caption || ''}</textarea>
            </div>

            <!-- Display Order -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-gallery-order">Display Priority Order (Lower appears first)</label>
              <input type="number" id="edit-gallery-order" class="form-input" value="${photo.displayOrder ?? 0}" min="0" />
            </div>

            <!-- Status Checkboxes -->
            <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.88rem;">
                <input type="checkbox" id="edit-gallery-active" ${photo.isActive !== false ? 'checked' : ''} style="width: 18px; height: 18px;" />
                <span>Publish to <strong>Public Website Gallery</strong> (Active)</span>
              </label>

              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.88rem;">
                <input type="checkbox" id="edit-gallery-featured" ${photo.featured ? 'checked' : ''} style="width: 18px; height: 18px;" />
                <span>Mark as <strong>Featured Photo</strong> (Highlights in primary showcases)</span>
              </label>
            </div>

            <!-- Form Buttons -->
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button type="button" id="btn-gallery-cancel" style="padding: 10px 18px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer;">
                Cancel
              </button>
              <button type="submit" id="btn-save-gallery" class="btn-primary-cinematic" style="padding: 10px 22px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
                ${Icons.download()} Save Photo to MongoDB
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function renderSponsorModal(sponsor) {
    const isEditing = Boolean(sponsor._id || sponsor.id);
    const tierVal = sponsor.tier || 'officialPartner';
    return `
      <div class="checkout-modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;">
        <div class="checkout-modal-card" style="background: #180a0f; border: 2px solid var(--color-gold); border-radius: 16px; max-width: 620px; width: 100%; padding: 28px; box-shadow: 0 20px 50px rgba(0,0,0,0.85); position: relative; max-height: 90vh; overflow-y: auto;">
          <button type="button" id="btn-close-sponsor-modal" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.2rem; color: var(--color-wool-muted); cursor: pointer; display: flex; align-items: center; justify-content: center;">${Icons.close()}</button>

          <span class="mono-tag" style="background: rgba(212,175,55,0.15); color: var(--color-gold); border: 1px solid rgba(212,175,55,0.3); padding: 4px 10px; border-radius: 4px; font-size: 0.72rem;">
            CORPORATE PARTNERSHIP
          </span>

          <h3 style="font-size: 1.4rem; color: var(--color-wool); margin: 8px 0 4px; font-family: var(--font-display);">
            ${isEditing ? 'Edit Sponsor & Partner Details' : 'Add New Corporate Sponsor'}
          </h3>
          <p style="font-size: 0.82rem; color: var(--color-wool-muted); margin-bottom: 20px;">
            Manage brand assets, official tier assignments, and website backlinks with instant MongoDB synchronization.
          </p>

          <form id="form-edit-sponsor">
            <input type="file" id="sponsor-logo-file-input" accept="image/*" style="display: none;" />

            <!-- Brand Logo Upload & Preview -->
            <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-light); border-radius: 10px; padding: 16px; margin-bottom: 18px;">
              <label class="form-label" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span>Official Logo Image (PNG / SVG / JPG / WEBP)</span>
                <span style="font-size: 0.72rem; color: var(--color-gold-bright);">Transparent PNG recommended</span>
              </label>

              <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
                <button 
                  type="button" 
                  id="btn-browse-sponsor-logo"
                  style="padding: 9px 16px; background: rgba(212,175,55,0.18); border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold-bright); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 6px;"
                >
                  ${Icons.folder()} Upload Logo from Computer
                </button>
                <span style="font-size: 0.8rem; color: var(--color-wool-muted); align-self: center;">or enter URL / path below:</span>
              </div>

              <input 
                type="text" 
                id="edit-sponsor-logo" 
                class="form-input" 
                value="${sponsor.logo || ''}" 
                placeholder="e.g. /assets/images/sponsors/dialog.png or /uploads/... or https://..." 
                required 
              />

              <!-- Live High-Contrast Preview Area (White box ensures dark logos are crisp) -->
              <div id="sponsor-preview-box" style="margin-top: 12px; width: 100%; height: 110px; border: 1px dashed ${sponsor.logo ? 'var(--color-gold)' : 'var(--border-light)'}; border-radius: 8px; overflow: hidden; background: #ffffff; display: flex; align-items: center; justify-content: center; position: relative;">
                <img 
                  id="sponsor-preview-img" 
                  src="${sponsor.logo || ''}" 
                  alt="Sponsor Logo Preview" 
                  style="max-width: 90%; max-height: 80px; object-fit: contain; ${sponsor.logo ? '' : 'display: none;'}" 
                  onerror="this.style.display='none'; document.getElementById('sponsor-preview-placeholder').style.display='block';"
                />
                <div id="sponsor-preview-placeholder" style="color: #64748b; font-size: 0.8rem; font-family: var(--font-mono); text-align: center; padding: 14px; ${sponsor.logo ? 'display: none;' : ''}">
                  ${Icons.handshake()} Logo preview will appear here on high-contrast background
                </div>
              </div>
            </div>

            <!-- Sponsor Name -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-sponsor-name">Company / Sponsor Name</label>
              <input type="text" id="edit-sponsor-name" class="form-input" value="${sponsor.name || ''}" placeholder="e.g. Dialog Axiata PLC" required />
            </div>

            <!-- Tier & Role -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group">
                <label class="form-label" for="edit-sponsor-tier">Partnership Tier</label>
                <select id="edit-sponsor-tier" class="form-input" style="background: #14070a; color: var(--color-wool); cursor: pointer;">
                  <option value="platinum" ${tierVal === 'platinum' ? 'selected' : ''}>Platinum Partner</option>
                  <option value="gold" ${tierVal === 'gold' ? 'selected' : ''}>Gold Sponsor</option>
                  <option value="officialPartner" ${tierVal === 'officialPartner' ? 'selected' : ''}>Official Partner</option>
                  <option value="mediaAndBroadcast" ${tierVal === 'mediaAndBroadcast' || tierVal === 'media' ? 'selected' : ''}>Media & Broadcast Partner</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="edit-sponsor-role">Designation / Role</label>
                <input type="text" id="edit-sponsor-role" class="form-input" value="${sponsor.role || sponsor.title || ''}" placeholder="e.g. Official Telecommunications Partner" />
              </div>
            </div>

            <!-- Website -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-sponsor-website">Official Website URL</label>
              <input type="text" id="edit-sponsor-website" class="form-input" value="${sponsor.website || sponsor.websiteUrl || ''}" placeholder="e.g. https://www.dialog.lk" />
            </div>

            <!-- Description / Tagline -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-sponsor-desc">Tagline or Description</label>
              <textarea id="edit-sponsor-desc" class="form-input" rows="2" style="resize: vertical;" placeholder="e.g. Empowering Sri Lankan sports and legacy across schools.">${sponsor.description || sponsor.tagline || ''}</textarea>
            </div>

            <!-- Display Order -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-sponsor-order">Display Priority (Lower appears first, e.g. 1, 2, 3...)</label>
              <input type="number" id="edit-sponsor-order" class="form-input" value="${sponsor.displayOrder ?? 0}" min="0" />
            </div>

            <!-- Active Status -->
            <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; margin-bottom: 20px;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.88rem;">
                <input type="checkbox" id="edit-sponsor-active" ${sponsor.isActive !== false ? 'checked' : ''} style="width: 18px; height: 18px;" />
                <span>Show in <strong>Official Sponsors & Partners</strong> on Website (Active)</span>
              </label>
            </div>

            <!-- Form Buttons -->
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button type="button" id="btn-sponsor-cancel" style="padding: 10px 18px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer;">
                Cancel
              </button>
              <button type="submit" id="btn-save-sponsor" class="btn-primary-cinematic" style="padding: 10px 22px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
                ${Icons.download()} Save Sponsor to MongoDB
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function renderNewsModal(article) {
    const isEditing = Boolean(article._id || article.id || article.slug);
    const cat = article.category || 'Announcements';
    return `
      <div class="checkout-modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;">
        <div class="checkout-modal-card" style="background: #180a0f; border: 2px solid var(--color-gold); border-radius: 16px; max-width: 680px; width: 100%; padding: 28px; box-shadow: 0 20px 50px rgba(0,0,0,0.85); position: relative; max-height: 90vh; overflow-y: auto;">
          <button type="button" id="btn-close-news-modal" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.2rem; color: var(--color-wool-muted); cursor: pointer; display: flex; align-items: center; justify-content: center;">${Icons.close()}</button>

          <span class="mono-tag" style="background: rgba(212,175,55,0.15); color: var(--color-gold); border: 1px solid rgba(212,175,55,0.3); padding: 4px 10px; border-radius: 4px; font-size: 0.72rem;">
            PRESS & DISPATCHES
          </span>

          <h3 style="font-size: 1.4rem; color: var(--color-wool); margin: 8px 0 4px; font-family: var(--font-display);">
            ${isEditing ? 'Edit News Dispatch' : 'Publish New Article to Website'}
          </h3>
          <p style="font-size: 0.82rem; color: var(--color-wool-muted); margin-bottom: 20px;">
            Articles will be immediately featured on the Home Page and News section.
          </p>

          <form id="form-edit-news">
            <input type="file" id="news-img-file-input" accept="image/*" style="display: none;" />

            <!-- Cover Image Upload & Preview -->
            <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-light); border-radius: 10px; padding: 16px; margin-bottom: 18px;">
              <label class="form-label" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span>Cover Photograph</span>
                <span style="font-size: 0.72rem; color: var(--color-gold-bright);">Supports JPG, PNG, WEBP</span>
              </label>

              <div style="display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
                <button 
                  type="button" 
                  id="btn-browse-news-img"
                  style="padding: 9px 16px; background: rgba(212,175,55,0.18); border: 1px solid var(--color-gold); border-radius: 6px; color: var(--color-gold-bright); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 6px;"
                >
                  ${Icons.folder()} Upload Cover Image from Computer
                </button>
                <span style="font-size: 0.8rem; color: var(--color-wool-muted); align-self: center;">or enter URL / path below:</span>
              </div>

              <input 
                type="text" 
                id="edit-news-image" 
                class="form-input" 
                value="${article.coverImage || article.image || ''}" 
                placeholder="e.g. /assets/images/news/press-release.jpg or /uploads/..." 
                required 
              />

              <!-- Live Preview Area -->
              <div id="news-preview-box" style="margin-top: 12px; width: 100%; height: 160px; border: 1px dashed ${article.image || article.coverImage ? 'var(--color-gold)' : 'var(--border-light)'}; border-radius: 8px; overflow: hidden; background: #000; display: flex; align-items: center; justify-content: center; position: relative;">
                <img 
                  id="news-preview-img" 
                  src="${article.coverImage || article.image || ''}" 
                  alt="News Preview" 
                  style="width: 100%; height: 100%; object-fit: cover; ${article.image || article.coverImage ? '' : 'display: none;'}" 
                  onerror="this.style.display='none'; document.getElementById('news-preview-placeholder').style.display='block';"
                />
                <div id="news-preview-placeholder" style="color: var(--color-wool-muted); font-size: 0.8rem; font-family: var(--font-mono); text-align: center; padding: 20px; ${article.image || article.coverImage ? 'display: none;' : ''}">
                  ${Icons.newspaper()} Cover preview will appear here
                </div>
              </div>
            </div>

            <!-- Title Field -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-news-title">Article Headline</label>
              <input type="text" id="edit-news-title" class="form-input" value="${article.title || ''}" placeholder="e.g. Joint Committee Confirms Dates for 97th Battle of the Maroons" required />
            </div>

            <!-- Category & Author & Date -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group">
                <label class="form-label" for="edit-news-category">Category</label>
                <select id="edit-news-category" class="form-input" style="background: #14070a; color: var(--color-wool); cursor: pointer;">
                  <option value="Announcements" ${cat === 'Announcements' ? 'selected' : ''}>Announcements</option>
                  <option value="Match Reports" ${cat === 'Match Reports' ? 'selected' : ''}>Match Reports</option>
                  <option value="Events" ${cat === 'Events' ? 'selected' : ''}>Events & Galas</option>
                  <option value="Advisory" ${cat === 'Advisory' ? 'selected' : ''}>Advisory & Public Notices</option>
                  <option value="Community" ${cat === 'Community' ? 'selected' : ''}>Community</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="edit-news-author">Author / Byline</label>
                <input type="text" id="edit-news-author" class="form-input" value="${article.author || 'Joint Organising Committee'}" placeholder="e.g. Joint Organising Committee" />
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-news-date">Publication Date Display</label>
              <input type="text" id="edit-news-date" class="form-input" value="${article.date || 'March 2026'}" placeholder="e.g. March 2026 or 12 March 2026" required />
            </div>

            <!-- Excerpt / Summary -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-news-summary">Brief Summary (Used on Home Cards)</label>
              <textarea id="edit-news-summary" class="form-input" rows="2" style="resize: vertical;" placeholder="1-2 sentences summarizing the announcement..." required>${article.summary || article.excerpt || ''}</textarea>
            </div>

            <!-- Full Content -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-news-content">Full Article Content</label>
              <textarea id="edit-news-content" class="form-input" rows="7" style="resize: vertical; font-family: var(--font-body); font-size: 0.9rem;" placeholder="Full story narrative, details, official quote, and notices..." required>${article.content || article.summary || article.excerpt || ''}</textarea>
            </div>

            <!-- Display Order -->
            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-news-order">Display Order (Lower appears first)</label>
              <input type="number" id="edit-news-order" class="form-input" value="${article.displayOrder ?? 0}" min="0" />
            </div>

            <!-- Status Checkboxes -->
            <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.88rem;">
                <input type="checkbox" id="edit-news-published" ${article.isPublished !== false ? 'checked' : ''} style="width: 18px; height: 18px;" />
                <span>Publish to <strong>Public Website</strong> (Live)</span>
              </label>

              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.88rem;">
                <input type="checkbox" id="edit-news-featured" ${article.featured ? 'checked' : ''} style="width: 18px; height: 18px;" />
                <span>Mark as <strong>Lead Featured Story</strong> (Highlights in primary hero banner)</span>
              </label>
            </div>

            <!-- Form Buttons -->
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
              <button type="button" id="btn-news-cancel" style="padding: 10px 18px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer;">
                Cancel
              </button>
              <button type="submit" id="btn-save-news" class="btn-primary-cinematic" style="padding: 10px 22px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
                ${Icons.download()} Save Article to MongoDB
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function renderMatchModal(match) {
    const isNew = !match || match._isNew;
    const m = match || {};
    return `
      <div class="checkout-modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;">
        <div class="checkout-modal-card" style="background: #180a0f; border: 2px solid var(--color-gold); border-radius: 16px; max-width: 650px; width: 100%; padding: 28px; box-shadow: 0 20px 50px rgba(0,0,0,0.85); position: relative; max-height: 90vh; overflow-y: auto;">
          <button type="button" id="btn-close-match-modal" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 1.2rem; color: var(--color-wool-muted); cursor: pointer; display: flex; align-items: center; justify-content: center;">${Icons.close()}</button>

          <span class="mono-tag" style="background: rgba(212,175,55,0.15); color: var(--color-gold); border: 1px solid rgba(212,175,55,0.3); padding: 4px 10px; border-radius: 4px; font-size: 0.72rem;">
            ${isNew ? 'NEW MATCH ENCOUNTER' : 'MATCH CENTRE & SCORECARDS'}
          </span>

          <h3 style="font-size: 1.4rem; color: var(--color-wool); margin: 8px 0 4px; font-family: var(--font-display);">
            ${isNew ? 'Add New Match Encounter' : 'Edit Match Details'}
          </h3>
          <p style="font-size: 0.82rem; color: var(--color-wool-muted); margin-bottom: 20px;">
            Update scores, toss decisions, results narrative, and trophy holder in MongoDB.
          </p>

          <form id="form-edit-match">
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group">
                <label class="form-label" for="edit-match-title">Match Title</label>
                <input type="text" id="edit-match-title" class="form-input" value="${m.title || ''}" placeholder="e.g. 97th Battle of the Maroons" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="edit-match-edition">Encounter Edition</label>
                <input type="text" id="edit-match-edition" class="form-input" value="${m.edition || '97'}" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group">
                <label class="form-label" for="edit-match-format">Format</label>
                <input type="text" id="edit-match-format" class="form-input" value="${m.format || '3-Day Traditional Match'}" placeholder="e.g. 3-Day Traditional Match or 50-Over One Day" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="edit-match-dates">Match Dates</label>
                <input type="text" id="edit-match-dates" class="form-input" value="${m.dates || ''}" placeholder="e.g. March 5, 6 & 7, 2027" required />
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-match-venue">Venue</label>
              <input type="text" id="edit-match-venue" class="form-input" value="${m.venue || 'Sinhalese Sports Club (SSC) Grounds, Colombo'}" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group">
                <label class="form-label" for="edit-match-trophy-holder">Trophy Holder</label>
                <input type="text" id="edit-match-trophy-holder" class="form-input" value="${m.trophyHolder || m.trophy || 'Retained by Ananda'}" placeholder="e.g. Retained by Ananda" />
              </div>
              <div class="form-group">
                <label class="form-label" for="edit-match-status">Match Status</label>
                <select id="edit-match-status" class="form-input" style="background: #14070a; color: var(--color-wool); cursor: pointer;">
                  <option value="CONCLUDED" ${m.status === 'CONCLUDED' ? 'selected' : ''}>Concluded</option>
                  <option value="LIVE" ${m.status === 'LIVE' ? 'selected' : ''}>Live In Progress</option>
                  <option value="UPCOMING" ${m.status === 'UPCOMING' ? 'selected' : ''}>Upcoming Match</option>
                </select>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-match-toss">Toss Decision</label>
              <input type="text" id="edit-match-toss" class="form-input" value="${m.toss || ''}" placeholder="e.g. Nalanda won the toss and elected to field" />
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="edit-match-result">Summary Result</label>
              <input type="text" id="edit-match-result" class="form-input" value="${m.summaryResult || m.result || ''}" placeholder="e.g. Match Drawn - Ananda retained the Challenge Trophy" required />
            </div>

            <div class="form-group" style="margin-bottom: 20px;">
              <label class="form-label" for="edit-match-summary">Summary Narrative</label>
              <textarea id="edit-match-summary" class="form-input" rows="4" style="resize: vertical;" placeholder="Detailed match summary, highlights, and milestones...">${m.summary || ''}</textarea>
            </div>

            <!-- Form Buttons -->
            <div style="display: flex; gap: 12px; justify-content: flex-end; align-items: center;">
              ${!isNew ? `
                <button type="button" id="btn-delete-match-modal" data-id="${m._id || m.id || m.matchId}" style="margin-right: auto; padding: 10px 16px; background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.4); border-radius: 6px; color: #fca5a5; font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer;">
                  ${Icons.trash()} Delete Match
                </button>
              ` : ''}
              <button type="button" id="btn-match-cancel" style="padding: 10px 18px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-light); border-radius: 6px; color: var(--color-wool); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer;">
                Cancel
              </button>
              <button type="submit" id="btn-save-match" class="btn-primary-cinematic" style="padding: 10px 22px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
                ${Icons.download()} ${isNew ? 'Create Match Record' : 'Save Match Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     EVENT LISTENERS & BINDINGS
     -------------------------------------------------------------------------- */
  function attachEvents() {
    // Tab switching
    container.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        loadData();
      });
    });

    // Shortcuts
    const scEvent = container.querySelector('#shortcut-event');
    if (scEvent) scEvent.addEventListener('click', () => { activeTab = 'event'; loadData(); });
    const scOrders = container.querySelector('#shortcut-orders');
    if (scOrders) scOrders.addEventListener('click', () => { activeTab = 'orders'; loadData(); });
    const scInquiries = container.querySelector('#shortcut-inquiries');
    if (scInquiries) scInquiries.addEventListener('click', () => { activeTab = 'inquiries'; loadData(); });
    const scTickets = container.querySelector('#shortcut-tickets');
    if (scTickets) scTickets.addEventListener('click', () => { activeTab = 'tickets'; loadData(); });

    // Logout
    const logoutBtn = container.querySelector('#btn-admin-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        adminAuth.clearSession();
        if (typeof onLogout === 'function') onLogout();
      });
    }

    // Refresh buttons
    const refOrders = container.querySelector('#btn-refresh-orders');
    if (refOrders) refOrders.addEventListener('click', () => loadData());
    const ordersSearchInput = container.querySelector('#orders-search-input');
    if (ordersSearchInput) {
      ordersSearchInput.addEventListener('input', (e) => {
        const query = (e.target.value || '').toLowerCase().trim();
        const rows = container.querySelectorAll('.admin-tab-content table tbody tr');
        rows.forEach(tr => {
          const text = tr.innerText.toLowerCase();
          tr.style.display = text.includes(query) ? '' : 'none';
        });
      });
    }
    const refInq = container.querySelector('#btn-refresh-inquiries');
    if (refInq) refInq.addEventListener('click', () => loadData());
    const refTickets = container.querySelector('#btn-refresh-tickets');
    if (refTickets) refTickets.addEventListener('click', () => loadData());
    const resetQuotasBtn = container.querySelector('#btn-reset-ticket-quotas');
    if (resetQuotasBtn) {
      resetQuotasBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to reset all ticket sold quantities and test orders back to 0?')) return;
        resetQuotasBtn.disabled = true;
        resetQuotasBtn.innerHTML = 'Resetting...';
        try {
          const res = await adminApi.resetTicketQuotas();
          if (res && res.success) {
            showToast('All ticket quantities and orders reset to 0 successfully!');
            tabLoadError = null;
            await loadData();
          } else {
            showToast(res?.message || 'Could not reset ticket quotas.', 'error');
          }
        } catch (e) {
          showToast('Failed to reset: ' + e.message, 'error');
        } finally {
          resetQuotasBtn.disabled = false;
        }
      });
    }
    const refTeams = container.querySelector('#btn-refresh-teams');
    if (refTeams) refTeams.addEventListener('click', () => loadData());
    container.querySelectorAll('.btn-reconnect-tab').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        try {
          if (!adminAuth.isAuthenticated()) {
            await adminApi.login('admin', 'Maroons@2027');
          }
        } catch (e) {}
        tabLoadError = null;
        await loadData();
      });
    });

    // Event Settings form submit
    const eventForm = container.querySelector('#form-event-settings');
    if (eventForm) {
      eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const targetRaw = container.querySelector('#ev-target').value;
        let targetIso = targetRaw;
        try {
          const parsed = new Date(targetRaw);
          if (!isNaN(parsed.getTime())) {
            targetIso = parsed.toISOString();
          }
        } catch (err) {
          targetIso = targetRaw;
        }

        const isConf = container.querySelector('#ev-confirmed').checked;
        const tickActive = container.querySelector('#ev-ticketing').checked;
        const editionVal = container.querySelector('#ev-edition').value.trim();
        const yearVal = parseInt(container.querySelector('#ev-year').value, 10) || 2027;
        const seriesTitleVal = container.querySelector('#ev-title').value.trim();
        const matchDatesVal = container.querySelector('#ev-dates').value.trim();
        const venueVal = container.querySelector('#ev-venue').value.trim();
        const ticketingModeVal = container.querySelector('#ev-ticketing-mode')?.value || 'HYBRID';
        const thirdPartyUrlVal = container.querySelector('#ev-third-party-ticket-url')?.value.trim() || '';
        const thirdPartyTitleVal = container.querySelector('#ev-third-party-ticket-label')?.value.trim() || 'Book via Official Ticketing Partner';

        const payload = {
          edition: editionVal,
          year: yearVal,
          season: String(yearVal),
          seriesTitle: seriesTitleVal,
          matchDates: matchDatesVal,
          venue: venueVal,
          venueName: venueVal,
          countdownTarget: targetIso,
          tentativeMatchDate: targetIso,
          confirmedStartDate: isConf ? targetIso : null,
          isConfirmed: isConf,
          isDateConfirmed: isConf,
          ticketingActive: tickActive,
          ticketingStatus: tickActive ? 'AVAILABLE' : 'COMING_SOON',
          ticketingMode: ticketingModeVal,
          thirdPartyBookingUrl: thirdPartyUrlVal,
          thirdPartyBookingTitle: thirdPartyTitleVal
        };

        const saveBtn = container.querySelector('#btn-save-event');
        saveBtn.disabled = true;
        saveBtn.innerHTML = 'Saving Settings...';

        try {
          const res = await adminApi.updateEventSettings(payload);
          if (res.success) {
            showToast('Event & countdown settings updated successfully!');
            eventData = res.data;
            window.dispatchEvent(new CustomEvent('bom-event-updated', { detail: res.data }));
          } else {
            showToast(res.message || 'Error updating settings', 'error');
          }
        } catch (err) {
          showToast('Failed to save settings to server.', 'error');
        } finally {
          saveBtn.disabled = false;
          saveBtn.innerHTML = `${Icons.download()} Save Event & Countdown Settings`;
        }
      });
    }

    // Session Expired Re-login button
    container.querySelectorAll('.btn-admin-relogin').forEach(btn => {
      btn.addEventListener('click', () => {
        adminAuth.clearSession();
        if (typeof onLogout === 'function') onLogout();
        else window.location.reload();
      });
    });

    // Quick Re-Connect (admin)
    container.querySelectorAll('.btn-quick-dev-reauth').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.innerHTML = 'Connecting...';
        try {
          const res = await adminApi.login('admin', 'Maroons@2027');
          if (res && res.success) {
            showToast('Administrator session established successfully!');
            tabLoadError = null;
            await loadData();
          } else {
            showToast(res?.message || 'Authentication failed.', 'error');
            adminAuth.clearSession();
            if (typeof onLogout === 'function') onLogout();
          }
        } catch (e) {
          adminAuth.clearSession();
          if (typeof onLogout === 'function') onLogout();
        }
      });
    });

    // Tab Retry Loading button
    container.querySelectorAll('.btn-reconnect-tab').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        try {
          if (!adminAuth.isAuthenticated()) {
            await adminApi.login('admin', 'Maroons@2027');
          }
        } catch (e) {}
        tabLoadError = null;
        await loadData();
      });
    });

    // Approve / Verify order buttons
    container.querySelectorAll('.btn-approve-order').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-order-id');
        btn.disabled = true;
        btn.innerHTML = 'Approving...';
        try {
          const res = await adminApi.updateOrderStatus(id, 'VERIFIED', 'Manually verified and confirmed by Committee Admin.');
          if (res.success) {
            showToast('Pass approved! QR code generated and quota allocated.');
            await loadData();
          } else {
            showToast(res.message || 'Could not verify order.', 'error');
            btn.disabled = false;
            btn.innerHTML = `${Icons.check()} Approve / Issue QR`;
          }
        } catch (e) {
          showToast('Failed to communicate with server.', 'error');
          btn.disabled = false;
          btn.innerHTML = `${Icons.check()} Approve / Issue QR`;
        }
      });
    });

    // Inspect order buttons
    container.querySelectorAll('.btn-inspect-order').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-order-id');
        const found = orders.find(o => (o._id === id || o.id === id || o.orderRef === id));
        if (found) {
          activeOrderModal = found;
          render();
        }
      });
    });

    // Delete order buttons from list
    container.querySelectorAll('.btn-delete-order').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-order-id');
        if (!confirm('Are you sure you want to permanently delete this ticket order? This cannot be undone.')) return;
        btn.disabled = true;
        try {
          const res = await adminApi.deleteOrder(id);
          if (res.success) {
            showToast('Ticket order permanently deleted.');
            await loadData();
          } else {
            showToast(res.message || 'Could not delete order.', 'error');
            btn.disabled = false;
          }
        } catch (e) {
          showToast('Failed to communicate with server.', 'error');
          btn.disabled = false;
        }
      });
    });

    // Add Ticket Category button
    const btnAddTicketCat = container.querySelector('#btn-add-ticket-cat');
    if (btnAddTicketCat) {
      btnAddTicketCat.addEventListener('click', () => {
        activeCategoryEdit = {
          _isNew: true,
          code: '',
          name: '',
          price: 2500,
          totalCapacity: 500,
          description: '',
          isActive: true
        };
        render();
      });
    }

    // Edit Category buttons & Modal
    container.querySelectorAll('.btn-edit-category').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-cat-id');
        const found = categories.find(c => (c._id === id || c.id === id || c.code === id));
        if (found) {
          activeCategoryEdit = found;
          render();
        }
      });
    });

    const closeCatBtn = container.querySelector('#btn-close-cat-modal');
    const cancelCatBtn = container.querySelector('#btn-cat-cancel');
    if (closeCatBtn) closeCatBtn.addEventListener('click', () => { activeCategoryEdit = null; render(); });
    if (cancelCatBtn) cancelCatBtn.addEventListener('click', () => { activeCategoryEdit = null; render(); });

    // Delete Category button from modal
    const btnDeleteCat = container.querySelector('#btn-delete-cat');
    if (btnDeleteCat) {
      btnDeleteCat.addEventListener('click', async () => {
        const catId = btnDeleteCat.getAttribute('data-id');
        if (!confirm('Are you sure you want to delete this ticket category?')) return;
        btnDeleteCat.disabled = true;
        try {
          const res = await adminApi.deleteTicketCategory(catId);
          if (res.success) {
            showToast('Ticket category deleted.');
            activeCategoryEdit = null;
            window.dispatchEvent(new CustomEvent('bom-tickets-updated'));
            await loadData();
          } else {
            showToast(res.message || 'Error deleting category', 'error');
            btnDeleteCat.disabled = false;
          }
        } catch (err) {
          showToast('Failed to communicate with server', 'error');
          btnDeleteCat.disabled = false;
        }
      });
    }

    const formEditCat = container.querySelector('#form-edit-category');
    if (formEditCat && activeCategoryEdit) {
      // Dynamic live quota calculation
      const capInput = container.querySelector('#edit-cat-capacity');
      const soldInput = container.querySelector('#edit-cat-sold');
      const resInput = container.querySelector('#edit-cat-reserved');
      const remVal = container.querySelector('#live-cat-remaining-val');
      const formulaEl = container.querySelector('#live-cat-calc-formula');
      const statusEl = container.querySelector('#live-cat-remaining-status');

      const updateRemainingPreview = () => {
        if (!capInput || !soldInput || !resInput || !remVal) return;
        const cap = Math.max(0, parseInt(capInput.value, 10) || 0);
        const sold = Math.max(0, parseInt(soldInput.value, 10) || 0);
        const res = Math.max(0, parseInt(resInput.value, 10) || 0);
        const diff = cap - (sold + res);
        const remaining = Math.max(0, diff);
        remVal.textContent = remaining;
        if (formulaEl) {
          formulaEl.textContent = `Capacity (${cap}) - Sold (${sold}) - Reserved (${res})`;
        }
        if (statusEl) {
          if (diff < 0) {
            statusEl.textContent = `OVERALLOCATED (BY ${Math.abs(diff)})`;
            statusEl.style.color = '#ef4444';
            remVal.style.color = '#ef4444';
          } else if (remaining === 0) {
            statusEl.textContent = 'SOLD OUT';
            statusEl.style.color = '#f59e0b';
            remVal.style.color = '#f59e0b';
          } else {
            statusEl.textContent = 'AVAILABLE FOR SALE';
            statusEl.style.color = '#75f0a0';
            remVal.style.color = 'var(--color-gold-bright)';
          }
        }
      };

      capInput?.addEventListener('input', updateRemainingPreview);
      soldInput?.addEventListener('input', updateRemainingPreview);
      resInput?.addEventListener('input', updateRemainingPreview);

      formEditCat.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isNew = activeCategoryEdit._isNew;
        const catId = activeCategoryEdit._id || activeCategoryEdit.id || activeCategoryEdit.code;
        const totalCapacity = parseInt(container.querySelector('#edit-cat-capacity').value, 10) || 0;
        const soldCount = parseInt(container.querySelector('#edit-cat-sold')?.value, 10) || 0;
        const reservedCount = parseInt(container.querySelector('#edit-cat-reserved')?.value, 10) || 0;
        const availableCount = Math.max(0, totalCapacity - (soldCount + reservedCount));

        const payload = {
          name: container.querySelector('#edit-cat-name').value.trim(),
          price: parseFloat(container.querySelector('#edit-cat-price').value) || 0,
          totalCapacity,
          soldCount,
          reservedCount,
          availableCount,
          description: container.querySelector('#edit-cat-desc').value.trim(),
          bookingUrl: container.querySelector('#edit-cat-booking-url')?.value.trim() || '',
          isActive: container.querySelector('#edit-cat-active').checked
        };

        if (isNew) {
          const rawCode = container.querySelector('#edit-cat-code')?.value.trim().toLowerCase() || `cat_${Date.now()}`;
          payload.code = rawCode;
          payload.id = rawCode;
        }

        const saveBtn = container.querySelector('#btn-save-cat');
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.innerHTML = 'Saving to MongoDB...';
        }

        try {
          const res = isNew 
            ? await adminApi.createTicketCategory(payload) 
            : await adminApi.updateTicketCategory(catId, payload);
            
          if (res.success) {
            showToast(isNew ? 'New ticket category created!' : 'Ticket category & quotas updated successfully in MongoDB!');
            activeCategoryEdit = null;
            window.dispatchEvent(new CustomEvent('bom-tickets-updated', { detail: res.data }));
            await loadData();
          } else {
            showToast(res.message || 'Error saving category', 'error');
          }
        } catch (err) {
          showToast('Failed to save category to MongoDB.', 'error');
        } finally {
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `${Icons.download()} ${isNew ? 'Create Category' : 'Save to MongoDB'}`;
          }
        }
      });
    }

    // Edit Team buttons & Modal
    container.querySelectorAll('.btn-edit-team').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = (btn.getAttribute('data-school-key') || '').toLowerCase();
        const found = teams.find(t => {
          const sk = (t.schoolKey || t.school || (t.name && t.name.toLowerCase().includes('nalanda') ? 'nalanda' : 'ananda')).toLowerCase();
          return sk === key;
        });
        if (found) {
          activeTeamEdit = found;
          render();
        }
      });
    });

    const closeTeamBtn = container.querySelector('#btn-close-team-modal');
    const cancelTeamBtn = container.querySelector('#btn-team-cancel');
    if (closeTeamBtn) closeTeamBtn.addEventListener('click', () => { activeTeamEdit = null; render(); });
    if (cancelTeamBtn) cancelTeamBtn.addEventListener('click', () => { activeTeamEdit = null; render(); });

    const formEditTeam = container.querySelector('#form-edit-team');
    if (formEditTeam && activeTeamEdit) {
      formEditTeam.addEventListener('submit', async (e) => {
        e.preventDefault();
        const squadText = container.querySelector('#edit-team-squad').value;
        const squadLines = squadText.split('\n').map(l => l.trim()).filter(Boolean);
        const parsedSquad = squadLines.map(line => {
          // Robust parser: split only on ' - ' or ' | ' surrounded by whitespace
          const parts = line.split(/\s+[-|–—]\s+/).map(p => p.trim());
          return {
            name: parts[0] || 'Player',
            role: parts[1] || 'Squad Member',
            specialism: parts.slice(2).join(' - ') || ''
          };
        });

        const hofText = container.querySelector('#edit-team-hof')?.value || '';
        const hofLines = hofText.split('\n').map(l => l.trim()).filter(Boolean);
        const parsedHof = hofLines.map(line => {
          const parts = line.split(/\s*\|\s*/);
          return {
            name: parts[0] || 'Legend',
            feat: parts[1] || '',
            image: parts[2] || '/assets/images/history/legend_placeholder.jpg'
          };
        });

        const captainVal = container.querySelector('#edit-team-captain').value.trim();
        const payload = {
          name: container.querySelector('#edit-team-name').value.trim(),
          motto: container.querySelector('#edit-team-motto').value.trim(),
          captain: captainVal,
          recentCaptain: captainVal,
          viceCaptain: container.querySelector('#edit-team-vice-captain').value.trim(),
          headCoach: container.querySelector('#edit-team-coach').value.trim(),
          principal: container.querySelector('#edit-team-principal').value.trim(),
          bigMatchWins: parseInt(container.querySelector('#edit-team-big-wins').value, 10) || 0,
          oneDayWins: parseInt(container.querySelector('#edit-team-oneday-wins').value, 10) || 0,
          verifiedSquadMembers: parsedSquad.length > 0 ? parsedSquad : (activeTeamEdit.verifiedSquadMembers || []),
          cricketHallOfFame: parsedHof.length > 0 ? parsedHof : (activeTeamEdit.cricketHallOfFame || [])
        };

        const targetSchoolKey = (activeTeamEdit.schoolKey || activeTeamEdit.school || (activeTeamEdit.name && activeTeamEdit.name.toLowerCase().includes('nalanda') ? 'nalanda' : 'ananda')).toLowerCase();

        const saveBtn = container.querySelector('#btn-save-team');
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.innerHTML = 'Saving to MongoDB...';
        }

        try {
          const res = await adminApi.updateTeam(targetSchoolKey, payload);
          if (res.success) {
            showToast('Team roster updated successfully in MongoDB!');
            activeTeamEdit = null;
            window.dispatchEvent(new CustomEvent('bom-teams-updated', { detail: res.data }));
            await loadData();
          } else {
            showToast(res.message || 'Error updating team', 'error');
          }
        } catch (err) {
          showToast('Failed to save team to MongoDB.', 'error');
        } finally {
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `${Icons.download()} Save Team to MongoDB`;
          }
        }
      });
    }

    // Gallery Management Events
    const btnAddPhoto = container.querySelector('#btn-add-gallery-photo');
    if (btnAddPhoto) {
      btnAddPhoto.addEventListener('click', () => {
        activeGalleryEdit = {
          title: '',
          category: galleryFilter !== 'all' ? galleryFilter : 'matches',
          year: '2026',
          image: '',
          caption: '',
          location: 'Sinhalese Sports Club (SSC) Grounds, Colombo',
          featured: false,
          displayOrder: gallery.length,
          isActive: true
        };
        render();
      });
    }

    const btnRefGallery = container.querySelector('#btn-refresh-gallery');
    if (btnRefGallery) {
      btnRefGallery.addEventListener('click', () => loadData());
    }

    container.querySelectorAll('.btn-gallery-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFilter = btn.getAttribute('data-cat');
        render();
      });
    });

    container.querySelectorAll('.btn-edit-gallery').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const found = gallery.find(g => (g._id === id || g.id === id));
        if (found) {
          activeGalleryEdit = found;
          render();
        }
      });
    });

    container.querySelectorAll('.btn-delete-gallery').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('Are you sure you want to delete this photo from MongoDB?')) return;
        btn.disabled = true;
        btn.innerHTML = 'Deleting...';
        try {
          const res = await adminApi.deleteGalleryItem(id);
          if (res.success) {
            showToast('Photo deleted from gallery.');
            window.dispatchEvent(new CustomEvent('bom-gallery-updated'));
            await loadData();
          } else {
            showToast(res.message || 'Error deleting photo', 'error');
          }
        } catch (err) {
          showToast('Failed to delete photo from server.', 'error');
        }
      });
    });

    // Gallery Modal Close & Cancel
    const closeGalBtn = container.querySelector('#btn-close-gallery-modal');
    const cancelGalBtn = container.querySelector('#btn-gallery-cancel');
    if (closeGalBtn) closeGalBtn.addEventListener('click', () => { activeGalleryEdit = null; render(); });
    if (cancelGalBtn) cancelGalBtn.addEventListener('click', () => { activeGalleryEdit = null; render(); });

    // Gallery Image Upload from Computer
    const btnBrowsePhoto = container.querySelector('#btn-browse-photo');
    const galFileInput = container.querySelector('#gallery-file-input');
    const galImgInput = container.querySelector('#edit-gallery-image');
    const galPreviewImg = container.querySelector('#gallery-preview-img');
    const galPreviewPlaceholder = container.querySelector('#gallery-preview-placeholder');

    if (btnBrowsePhoto && galFileInput) {
      btnBrowsePhoto.addEventListener('click', () => {
        galFileInput.click();
      });
    }

    if (galFileInput) {
      galFileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        btnBrowsePhoto.disabled = true;
        btnBrowsePhoto.innerHTML = `${Icons.clock()} Uploading Photo...`;

        try {
          const uploadRes = await adminApi.uploadFile(file);
          if (uploadRes && uploadRes.success && uploadRes.url) {
            if (galImgInput) galImgInput.value = uploadRes.url;
            if (galPreviewImg) {
              galPreviewImg.src = uploadRes.url;
              galPreviewImg.style.display = 'block';
            }
            if (galPreviewPlaceholder) {
              galPreviewPlaceholder.style.display = 'none';
            }
            showToast('Photograph uploaded successfully!');
          } else {
            showToast(uploadRes?.message || 'File upload failed', 'error');
          }
        } catch (err) {
          showToast('Error uploading photo to server', 'error');
        } finally {
          btnBrowsePhoto.disabled = false;
          btnBrowsePhoto.innerHTML = `${Icons.folder()} Upload Photo from Computer`;
        }
      });
    }

    if (galImgInput) {
      galImgInput.addEventListener('input', () => {
        const val = galImgInput.value.trim();
        if (val) {
          if (galPreviewImg) {
            galPreviewImg.src = val;
            galPreviewImg.style.display = 'block';
          }
          if (galPreviewPlaceholder) galPreviewPlaceholder.style.display = 'none';
        } else {
          if (galPreviewImg) galPreviewImg.style.display = 'none';
          if (galPreviewPlaceholder) galPreviewPlaceholder.style.display = 'block';
        }
      });
    }

    // Gallery Modal Form Submit
    const formEditGallery = container.querySelector('#form-edit-gallery');
    if (formEditGallery && activeGalleryEdit) {
      formEditGallery.addEventListener('submit', async (e) => {
        e.preventDefault();

        const catSelect = container.querySelector('#edit-gallery-category');
        const selectedCat = catSelect ? catSelect.value : 'matches';
        const catLabels = {
          matches: 'Match Action',
          atmosphere: 'Crowd & Atmosphere',
          ceremonies: 'Ceremonies',
          legends: 'Legends & Heritage',
          heritage: 'Visual Heritage'
        };

        const payload = {
          title: container.querySelector('#edit-gallery-title').value.trim(),
          category: selectedCat,
          categoryLabel: catLabels[selectedCat] || 'Match Action',
          year: container.querySelector('#edit-gallery-year').value.trim(),
          image: container.querySelector('#edit-gallery-image').value.trim(),
          location: container.querySelector('#edit-gallery-location').value.trim(),
          caption: container.querySelector('#edit-gallery-caption').value.trim(),
          displayOrder: parseInt(container.querySelector('#edit-gallery-order').value, 10) || 0,
          isActive: container.querySelector('#edit-gallery-active').checked,
          featured: container.querySelector('#edit-gallery-featured').checked
        };

        const saveBtn = container.querySelector('#btn-save-gallery');
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.innerHTML = 'Saving to MongoDB...';
        }

        try {
          const isEdit = Boolean(activeGalleryEdit._id || activeGalleryEdit.id);
          const photoId = activeGalleryEdit._id || activeGalleryEdit.id;
          const res = isEdit
            ? await adminApi.updateGalleryItem(photoId, payload)
            : await adminApi.createGalleryItem(payload);

          if (res.success) {
            showToast(isEdit ? 'Photo updated successfully in MongoDB!' : 'New photo added to MongoDB Gallery!');
            activeGalleryEdit = null;
            window.dispatchEvent(new CustomEvent('bom-gallery-updated'));
            await loadData();
          } else {
            showToast(res.message || 'Error saving photo', 'error');
          }
        } catch (err) {
          showToast('Failed to save photo to MongoDB.', 'error');
        } finally {
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `${Icons.download()} Save Photo to MongoDB`;
          }
        }
      });
    }

    // Close order modal
    const closeOrderBtn = container.querySelector('#btn-close-order-modal');
    const modalCloseAction = container.querySelector('#btn-modal-close-action');
    if (closeOrderBtn) closeOrderBtn.addEventListener('click', () => { activeOrderModal = null; render(); });
    if (modalCloseAction) modalCloseAction.addEventListener('click', () => { activeOrderModal = null; render(); });

    // Manually mark verified from modal
    const manualVerifyBtn = container.querySelector('#btn-manual-verify-order');
    if (manualVerifyBtn && activeOrderModal) {
      manualVerifyBtn.addEventListener('click', async () => {
        manualVerifyBtn.disabled = true;
        manualVerifyBtn.innerHTML = 'Generating Verifiable QR...';

        try {
          const res = await adminApi.updateOrderStatus(activeOrderModal._id || activeOrderModal.orderRef, 'VERIFIED', 'Manually verified by admin.');
          if (res.success) {
            showToast('Order verified & QR code issued!');
            activeOrderModal = res.order;
            await loadData();
          } else {
            showToast(res.message || 'Verification failed', 'error');
          }
        } catch (e) {
          showToast('Error verifying order', 'error');
        }
      });
    }

    // Delete order from modal
    const modalDeleteOrderBtn = container.querySelector('#btn-modal-delete-order');
    if (modalDeleteOrderBtn && activeOrderModal) {
      modalDeleteOrderBtn.addEventListener('click', async () => {
        const id = modalDeleteOrderBtn.getAttribute('data-order-id') || activeOrderModal._id || activeOrderModal.orderRef;
        if (!confirm('Are you sure you want to permanently delete this ticket order? This cannot be undone.')) return;
        modalDeleteOrderBtn.disabled = true;
        try {
          const res = await adminApi.deleteOrder(id);
          if (res.success) {
            showToast('Ticket order permanently deleted.');
            activeOrderModal = null;
            await loadData();
          } else {
            showToast(res.message || 'Could not delete order.', 'error');
            modalDeleteOrderBtn.disabled = false;
          }
        } catch (e) {
          showToast('Failed to communicate with server.', 'error');
          modalDeleteOrderBtn.disabled = false;
        }
      });
    }

    // Mark inquiry resolved
    container.querySelectorAll('.btn-mark-resolved').forEach(btn => {
      btn.addEventListener('click', async () => {
        const inqId = btn.getAttribute('data-inq-id');
        btn.disabled = true;
        btn.innerHTML = 'Updating...';

        try {
          const res = await adminApi.updateInquiry(inqId, 'RESOLVED', 'Reviewed by secretariat.');
          if (res.success) {
            showToast('Inquiry marked as resolved.');
            await loadData();
          } else {
            showToast('Could not update inquiry', 'error');
            btn.disabled = false;
          }
        } catch (e) {
          showToast('Error communicating with server', 'error');
          btn.disabled = false;
        }
      });
    });

    // Delete inquiry
    container.querySelectorAll('.btn-delete-inquiry').forEach(btn => {
      btn.addEventListener('click', async () => {
        const inqId = btn.getAttribute('data-inq-id');
        if (!confirm('Are you sure you want to permanently delete this incoming inquiry?')) return;
        btn.disabled = true;
        btn.innerHTML = 'Deleting...';

        try {
          const res = await adminApi.deleteInquiry(inqId);
          if (res.success) {
            showToast('Inquiry permanently deleted.');
            await loadData();
          } else {
            showToast(res.message || 'Could not delete inquiry', 'error');
            btn.disabled = false;
            btn.innerHTML = `${Icons.trash()} Delete`;
          }
        } catch (e) {
          showToast('Error communicating with server', 'error');
          btn.disabled = false;
          btn.innerHTML = `${Icons.trash()} Delete`;
        }
      });
    });

    // =========================================================================
    // MATCH CENTRE CRUD EVENTS
    // =========================================================================
    const refMatches = container.querySelector('#btn-refresh-matches');
    if (refMatches) refMatches.addEventListener('click', () => loadData());

    const btnAddMatch = container.querySelector('#btn-add-match');
    if (btnAddMatch) {
      btnAddMatch.addEventListener('click', () => {
        activeMatchEdit = {
          _isNew: true,
          title: '98th Battle of the Maroons',
          edition: '98',
          format: '3-Day Traditional Match',
          dates: 'March 2028',
          venue: 'Sinhalese Sports Club (SSC) Grounds, Colombo',
          trophyHolder: 'Retained by Ananda',
          status: 'UPCOMING',
          toss: '',
          result: 'Match Scheduled',
          summaryResult: 'Match Scheduled',
          summary: ''
        };
        render();
      });
    }

    container.querySelectorAll('.btn-edit-match').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const found = matches.find(m => String(m._id) === String(id) || String(m.id) === String(id) || String(m.matchId) === String(id));
        if (found) {
          activeMatchEdit = found;
          render();
        }
      });
    });

    container.querySelectorAll('.btn-delete-match').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('Are you sure you want to delete this match record?')) return;
        btn.disabled = true;
        try {
          const res = await adminApi.deleteMatch(id);
          if (res.success) {
            showToast('Match record deleted successfully.');
            window.dispatchEvent(new CustomEvent('bom-matches-updated'));
            await loadData();
          } else {
            showToast(res.message || 'Error deleting match', 'error');
            btn.disabled = false;
          }
        } catch (err) {
          showToast('Failed to communicate with server', 'error');
          btn.disabled = false;
        }
      });
    });

    const closeMatchBtn = container.querySelector('#btn-close-match-modal');
    const cancelMatchBtn = container.querySelector('#btn-match-cancel');
    if (closeMatchBtn) closeMatchBtn.addEventListener('click', () => { activeMatchEdit = null; render(); });
    if (cancelMatchBtn) cancelMatchBtn.addEventListener('click', () => { activeMatchEdit = null; render(); });

    const btnDeleteMatchModal = container.querySelector('#btn-delete-match-modal');
    if (btnDeleteMatchModal) {
      btnDeleteMatchModal.addEventListener('click', async () => {
        const id = btnDeleteMatchModal.getAttribute('data-id');
        if (!confirm('Are you sure you want to delete this match record?')) return;
        btnDeleteMatchModal.disabled = true;
        try {
          const res = await adminApi.deleteMatch(id);
          if (res.success) {
            showToast('Match record deleted.');
            activeMatchEdit = null;
            window.dispatchEvent(new CustomEvent('bom-matches-updated'));
            await loadData();
          } else {
            showToast(res.message || 'Error deleting match', 'error');
            btnDeleteMatchModal.disabled = false;
          }
        } catch (err) {
          showToast('Failed to communicate with server', 'error');
          btnDeleteMatchModal.disabled = false;
        }
      });
    }

    const formEditMatch = container.querySelector('#form-edit-match');
    if (formEditMatch && activeMatchEdit) {
      formEditMatch.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isNew = activeMatchEdit._isNew;
        const mId = activeMatchEdit._id || activeMatchEdit.id || activeMatchEdit.matchId;
        const payload = {
          title: container.querySelector('#edit-match-title').value.trim(),
          edition: container.querySelector('#edit-match-edition').value.trim(),
          format: container.querySelector('#edit-match-format').value.trim(),
          dates: container.querySelector('#edit-match-dates').value.trim(),
          venue: container.querySelector('#edit-match-venue').value.trim(),
          trophyHolder: container.querySelector('#edit-match-trophy-holder').value.trim(),
          status: container.querySelector('#edit-match-status').value,
          toss: container.querySelector('#edit-match-toss').value.trim(),
          result: container.querySelector('#edit-match-result').value.trim(),
          summaryResult: container.querySelector('#edit-match-result').value.trim(),
          summary: container.querySelector('#edit-match-summary').value.trim()
        };

        if (isNew) {
          payload.matchId = `bom-${payload.edition}th-${payload.format.toLowerCase().includes('one') ? 'oneday' : '3day'}-${Date.now()}`;
        }

        const saveBtn = container.querySelector('#btn-save-match');
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.innerHTML = 'Saving to MongoDB...';
        }

        try {
          const res = isNew 
            ? await adminApi.createMatch(payload) 
            : await adminApi.updateMatch(mId, payload);

          if (res.success) {
            showToast(isNew ? 'New match encounter created!' : 'Match record updated in MongoDB!');
            activeMatchEdit = null;
            window.dispatchEvent(new CustomEvent('bom-matches-updated', { detail: res.data }));
            await loadData();
          } else {
            showToast(res.message || 'Error saving match', 'error');
          }
        } catch (err) {
          showToast('Failed to save match to MongoDB.', 'error');
        } finally {
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `${Icons.download()} ${isNew ? 'Create Match Record' : 'Save Match Record'}`;
          }
        }
      });
    }

    // =========================================================================
    // NEWS DISPATCHES CRUD EVENTS
    // =========================================================================
    const refNews = container.querySelector('#btn-refresh-news');
    if (refNews) refNews.addEventListener('click', () => loadData());

    const btnAddNews = container.querySelector('#btn-add-news');
    const btnAddFirstNews = container.querySelector('#btn-add-first-news');
    if (btnAddNews) btnAddNews.addEventListener('click', () => { activeNewsEdit = {}; render(); });
    if (btnAddFirstNews) btnAddFirstNews.addEventListener('click', () => { activeNewsEdit = {}; render(); });

    container.querySelectorAll('.btn-edit-news').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const found = news.find(n => String(n._id) === String(id) || String(n.id) === String(id) || String(n.slug) === String(id));
        if (found) {
          activeNewsEdit = found;
          render();
        }
      });
    });

    container.querySelectorAll('.btn-delete-news').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('Are you sure you want to permanently delete this news dispatch?')) return;

        try {
          const res = await adminApi.deleteNews(id);
          if (res.success) {
            showToast('News article deleted.');
            window.dispatchEvent(new CustomEvent('bom-news-updated'));
            await loadData();
          } else {
            showToast(res.message || 'Error deleting article', 'error');
          }
        } catch (err) {
          showToast('Failed to delete article.', 'error');
        }
      });
    });

    const closeNewsBtn = container.querySelector('#btn-close-news-modal');
    const cancelNewsBtn = container.querySelector('#btn-news-cancel');
    if (closeNewsBtn) closeNewsBtn.addEventListener('click', () => { activeNewsEdit = null; render(); });
    if (cancelNewsBtn) cancelNewsBtn.addEventListener('click', () => { activeNewsEdit = null; render(); });

    // File upload for news cover
    const btnBrowseNews = container.querySelector('#btn-browse-news-img');
    const newsFileInput = container.querySelector('#news-img-file-input');
    const newsImgInput = container.querySelector('#edit-news-image');
    const newsPreviewImg = container.querySelector('#news-preview-img');
    const newsPreviewPlaceholder = container.querySelector('#news-preview-placeholder');

    if (btnBrowseNews && newsFileInput) {
      btnBrowseNews.addEventListener('click', () => newsFileInput.click());
    }

    if (newsFileInput) {
      newsFileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        btnBrowseNews.disabled = true;
        btnBrowseNews.innerHTML = `${Icons.clock()} Uploading Image...`;

        try {
          const uploadRes = await adminApi.uploadFile(file);
          if (uploadRes && uploadRes.success && uploadRes.url) {
            if (newsImgInput) newsImgInput.value = uploadRes.url;
            if (newsPreviewImg) {
              newsPreviewImg.src = uploadRes.url;
              newsPreviewImg.style.display = 'block';
            }
            if (newsPreviewPlaceholder) newsPreviewPlaceholder.style.display = 'none';
            showToast('Cover image uploaded successfully!');
          } else {
            showToast(uploadRes?.message || 'File upload failed', 'error');
          }
        } catch (err) {
          showToast('Error uploading image', 'error');
        } finally {
          btnBrowseNews.disabled = false;
          btnBrowseNews.innerHTML = `${Icons.folder()} Upload Cover Image from Computer`;
        }
      });
    }

    if (newsImgInput) {
      newsImgInput.addEventListener('input', () => {
        const val = newsImgInput.value.trim();
        if (val) {
          if (newsPreviewImg) {
            newsPreviewImg.src = val;
            newsPreviewImg.style.display = 'block';
          }
          if (newsPreviewPlaceholder) newsPreviewPlaceholder.style.display = 'none';
        } else {
          if (newsPreviewImg) newsPreviewImg.style.display = 'none';
          if (newsPreviewPlaceholder) newsPreviewPlaceholder.style.display = 'block';
        }
      });
    }

    // Form submit for news
    const formEditNews = container.querySelector('#form-edit-news');
    if (formEditNews && activeNewsEdit) {
      formEditNews.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isEdit = Boolean(activeNewsEdit._id || activeNewsEdit.id || activeNewsEdit.slug);
        const artId = activeNewsEdit._id || activeNewsEdit.id || activeNewsEdit.slug;

        const titleVal = container.querySelector('#edit-news-title').value.trim();
        const payload = {
          title: titleVal,
          category: container.querySelector('#edit-news-category').value,
          author: container.querySelector('#edit-news-author').value.trim(),
          date: container.querySelector('#edit-news-date').value.trim(),
          summary: container.querySelector('#edit-news-summary').value.trim(),
          content: container.querySelector('#edit-news-content').value.trim(),
          image: container.querySelector('#edit-news-image').value.trim(),
          coverImage: container.querySelector('#edit-news-image').value.trim(),
          displayOrder: parseInt(container.querySelector('#edit-news-order').value, 10) || 0,
          isPublished: container.querySelector('#edit-news-published').checked,
          featured: container.querySelector('#edit-news-featured').checked
        };

        const saveBtn = container.querySelector('#btn-save-news');
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.innerHTML = 'Saving to MongoDB...';
        }

        try {
          const res = isEdit
            ? await adminApi.updateNews(artId, payload)
            : await adminApi.createNews(payload);

          if (res.success) {
            showToast(isEdit ? 'Article updated successfully!' : 'Article published successfully!');
            activeNewsEdit = null;
            window.dispatchEvent(new CustomEvent('bom-news-updated'));
            await loadData();
          } else {
            showToast(res.message || 'Error saving article', 'error');
          }
        } catch (err) {
          showToast('Failed to save article to MongoDB.', 'error');
        } finally {
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `${Icons.download()} Save Article to MongoDB`;
          }
        }
      });
    }

    // =========================================================================
    // SPONSORS & PARTNERS CRUD EVENTS
    // =========================================================================
    const refSponsors = container.querySelector('#btn-refresh-sponsors');
    if (refSponsors) refSponsors.addEventListener('click', () => loadData());

    const btnAddSponsor = container.querySelector('#btn-add-sponsor');
    const btnAddFirstSponsor = container.querySelector('#btn-add-first-sponsor');
    if (btnAddSponsor) btnAddSponsor.addEventListener('click', () => { activeSponsorEdit = {}; render(); });
    if (btnAddFirstSponsor) btnAddFirstSponsor.addEventListener('click', () => { activeSponsorEdit = {}; render(); });

    container.querySelectorAll('.btn-edit-sponsor').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const found = sponsors.find(s => String(s._id) === String(id) || String(s.id) === String(id));
        if (found) {
          activeSponsorEdit = found;
          render();
        }
      });
    });

    container.querySelectorAll('.btn-delete-sponsor').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('Are you sure you want to remove this corporate sponsor?')) return;

        try {
          const res = await adminApi.deleteSponsor(id);
          if (res.success) {
            showToast('Sponsor removed.');
            window.dispatchEvent(new CustomEvent('bom-sponsors-updated'));
            await loadData();
          } else {
            showToast(res.message || 'Error deleting sponsor', 'error');
          }
        } catch (err) {
          showToast('Failed to delete sponsor from server.', 'error');
        }
      });
    });

    const closeSponsorBtn = container.querySelector('#btn-close-sponsor-modal');
    const cancelSponsorBtn = container.querySelector('#btn-sponsor-cancel');
    if (closeSponsorBtn) closeSponsorBtn.addEventListener('click', () => { activeSponsorEdit = null; render(); });
    if (cancelSponsorBtn) cancelSponsorBtn.addEventListener('click', () => { activeSponsorEdit = null; render(); });

    // File upload for sponsor logo
    const btnBrowseSponsor = container.querySelector('#btn-browse-sponsor-logo');
    const sponsorFileInput = container.querySelector('#sponsor-logo-file-input');
    const sponsorLogoInput = container.querySelector('#edit-sponsor-logo');
    const sponsorPreviewImg = container.querySelector('#sponsor-preview-img');
    const sponsorPreviewPlaceholder = container.querySelector('#sponsor-preview-placeholder');

    if (btnBrowseSponsor && sponsorFileInput) {
      btnBrowseSponsor.addEventListener('click', () => sponsorFileInput.click());
    }

    if (sponsorFileInput) {
      sponsorFileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        btnBrowseSponsor.disabled = true;
        btnBrowseSponsor.innerHTML = `${Icons.clock()} Uploading Logo...`;

        try {
          const uploadRes = await adminApi.uploadFile(file);
          if (uploadRes && uploadRes.success && uploadRes.url) {
            if (sponsorLogoInput) sponsorLogoInput.value = uploadRes.url;
            if (sponsorPreviewImg) {
              sponsorPreviewImg.src = uploadRes.url;
              sponsorPreviewImg.style.display = 'block';
            }
            if (sponsorPreviewPlaceholder) sponsorPreviewPlaceholder.style.display = 'none';
            showToast('Brand logo uploaded successfully!');
          } else {
            showToast(uploadRes?.message || 'File upload failed', 'error');
          }
        } catch (err) {
          showToast('Error uploading logo', 'error');
        } finally {
          btnBrowseSponsor.disabled = false;
          btnBrowseSponsor.innerHTML = `${Icons.folder()} Upload Logo from Computer`;
        }
      });
    }

    if (sponsorLogoInput) {
      sponsorLogoInput.addEventListener('input', () => {
        const val = sponsorLogoInput.value.trim();
        if (val) {
          if (sponsorPreviewImg) {
            sponsorPreviewImg.src = val;
            sponsorPreviewImg.style.display = 'block';
          }
          if (sponsorPreviewPlaceholder) sponsorPreviewPlaceholder.style.display = 'none';
        } else {
          if (sponsorPreviewImg) sponsorPreviewImg.style.display = 'none';
          if (sponsorPreviewPlaceholder) sponsorPreviewPlaceholder.style.display = 'block';
        }
      });
    }

    // Form submit for sponsor
    const formEditSponsor = container.querySelector('#form-edit-sponsor');
    if (formEditSponsor && activeSponsorEdit) {
      formEditSponsor.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isEdit = Boolean(activeSponsorEdit._id || activeSponsorEdit.id);
        const spId = activeSponsorEdit._id || activeSponsorEdit.id;

        const payload = {
          name: container.querySelector('#edit-sponsor-name').value.trim(),
          tier: container.querySelector('#edit-sponsor-tier').value,
          role: container.querySelector('#edit-sponsor-role').value.trim(),
          title: container.querySelector('#edit-sponsor-role').value.trim(),
          website: container.querySelector('#edit-sponsor-website').value.trim(),
          websiteUrl: container.querySelector('#edit-sponsor-website').value.trim(),
          description: container.querySelector('#edit-sponsor-desc').value.trim(),
          tagline: container.querySelector('#edit-sponsor-desc').value.trim(),
          logo: container.querySelector('#edit-sponsor-logo').value.trim(),
          displayOrder: parseInt(container.querySelector('#edit-sponsor-order').value, 10) || 0,
          isActive: container.querySelector('#edit-sponsor-active').checked
        };

        const saveBtn = container.querySelector('#btn-save-sponsor');
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.innerHTML = 'Saving to MongoDB...';
        }

        try {
          const res = isEdit
            ? await adminApi.updateSponsor(spId, payload)
            : await adminApi.createSponsor(payload);

          if (res.success) {
            showToast(isEdit ? 'Sponsor updated successfully!' : 'New corporate sponsor added!');
            activeSponsorEdit = null;
            window.dispatchEvent(new CustomEvent('bom-sponsors-updated'));
            await loadData();
          } else {
            showToast(res.message || 'Error saving sponsor', 'error');
          }
        } catch (err) {
          showToast('Failed to save sponsor to MongoDB.', 'error');
        } finally {
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `${Icons.download()} Save Sponsor to MongoDB`;
          }
        }
      });
    }

    // Change Password form submit
    const passForm = container.querySelector('#form-change-password');
    if (passForm) {
      passForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPass = container.querySelector('#pass-current').value;
        const newPass = container.querySelector('#pass-new').value;
        const confirmPass = container.querySelector('#pass-confirm').value;

        if (newPass !== confirmPass) {
          showToast('New passwords do not match.', 'error');
          return;
        }

        const btn = container.querySelector('#btn-save-password');
        btn.disabled = true;
        btn.innerHTML = 'Updating Password...';

        try {
          const res = await adminApi.changePassword(currentPass, newPass);
          if (res.success) {
            showToast('Password changed successfully!');
            passForm.reset();
          } else {
            showToast(res.message || 'Failed to change password.', 'error');
          }
        } catch (err) {
          showToast('Error connecting to server.', 'error');
        } finally {
          btn.disabled = false;
          btn.innerHTML = `${Icons.lock()} Update Password`;
        }
      });
    }
  }

  loadData();
}
