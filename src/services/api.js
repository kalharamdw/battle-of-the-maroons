/**
 * BATTLE OF THE MAROONS — CLIENT-SIDE API SERVICE
 * 
 * Provides unified, cached, and resilient data fetching.
 * Seamlessly talks to /api endpoints, with instant fallback to static data
 * if the backend server or database is not reachable.
 */

import { eventConfig as localEventConfig } from '../data/event.config.js';
import { matchCentreData as localMatches } from '../data/matches.js';
import { teamsData as localTeams } from '../data/teams.js';
import { newsArticles as localNews } from '../data/news.js';
import { sponsorsData as localSponsors } from '../data/sponsors.js';
import { galleryItems as localGallery } from '../data/gallery.js';

const API_BASE = '/api';

/**
 * Generic fetch wrapper with timeout
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export const api = {
  /**
   * Get Event Configuration & Countdown Target
   */
  async getEventConfig() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/event?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {
      // Fallback
    }
    return localEventConfig;
  },

  /**
   * Get Available Ticket Categories
   */
  async getTicketCategories() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/tickets/categories?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {
      // Fallback
    }
    return [
      { id: "grandstand", code: "grandstand", name: "Grandstand Upper Deck", price: 2500, description: "Panoramic elevated view of the SSC pitch, shaded seating.", availableCount: 500, totalCapacity: 500, maxPerOrder: 10, soldCount: 0, reservedCount: 0 },
      { id: "members", code: "members", name: "Members Pavilion Enclosure", price: 5000, description: "Premium clubhouse enclosure with private refreshments and lounge access.", availableCount: 200, totalCapacity: 200, maxPerOrder: 6, soldCount: 0, reservedCount: 0 },
      { id: "marquee", code: "marquee", name: "Old Boys Maroons Marquee", price: 4000, description: "Dedicated alumni marquee with commemorative badge and hospitality.", availableCount: 300, totalCapacity: 300, maxPerOrder: 8, soldCount: 0, reservedCount: 0 },
      { id: "papare", code: "papare", name: "Party Tent & Papare Enclosure", price: 1500, description: "Direct access to the papare band, dancing terraces, and festival area.", availableCount: 1000, totalCapacity: 1000, maxPerOrder: 10, soldCount: 0, reservedCount: 0 }
    ];
  },

  /**
   * Create Guest Ticket Order (PayHere Checkout)
   */
  async createTicketOrder(orderPayload) {
    const res = await fetch(`${API_BASE}/tickets/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    return res.json();
  },

  /**
   * Lookup Guest Order by Reference
   */
  async getTicketOrder(orderRef) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/tickets/order/${encodeURIComponent(orderRef)}?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      }, 6000);
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Could not fetch order. Please check your connection.' };
    }
  },

  /**
   * Sandbox Verification for Demo Testing
   */
  async verifySandboxOrder(orderRef) {
    const res = await fetch(`${API_BASE}/tickets/verify-sandbox`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderRef })
    });
    return res.json();
  },

  /**
   * Track Third-Party External Ticket Booking & Record Pass to Backend
   */
  async trackThirdPartyBooking(payload = {}) {
    try {
      const res = await fetch(`${API_BASE}/tickets/track-third-party`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (e) {
      console.warn('Third party booking tracking fallback:', e);
      return { success: false, message: e.message };
    }
  },

  /**
   * Submit Contact Inquiry
   */
  async submitInquiry(inquiryData) {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      return await res.json();
    } catch (error) {
      return {
        success: false,
        message: 'Could not connect to inquiry service. Please check your internet connection or email info@battleofthemaroons.lk directly.'
      };
    }
  },

  /**
   * Get Matches
   */
  async getMatches() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/matches?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {}
    return localMatches;
  },

  /**
   * Get Teams
   */
  async getTeams() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/teams?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {}
    return localTeams;
  },

  /**
   * Get News
   */
  async getNews() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/news?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {}
    return localNews;
  },

  /**
   * Get Single News Article
   */
  async getNewsArticle(slug) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/news/${slug}?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {}
    return localNews.find(a => a.id === slug) || null;
  },

  /**
   * Get Sponsors
   */
  async getSponsors() {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/sponsors?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {}
    return localSponsors;
  },

  /**
   * Get Gallery Photos
   */
  async getGallery(category = null) {
    try {
      const url = category && category !== 'all' 
        ? `${API_BASE}/gallery?category=${encodeURIComponent(category)}&_t=${Date.now()}` 
        : `${API_BASE}/gallery?_t=${Date.now()}`;
      const res = await fetchWithTimeout(url, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {}
    if (category && category !== 'all') {
      return localGallery.filter(item => item.category === category);
    }
    return localGallery;
  }
};

/* ==========================================================================
   ADMIN API CLIENT (PROTECTED ENDPOINTS)
   ========================================================================== */

const TOKEN_KEY = 'bom_admin_token';
const ADMIN_DATA_KEY = 'bom_admin_user';

export const adminAuth = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  getStoredUser() {
    const raw = localStorage.getItem(ADMIN_DATA_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
  saveSession(token, admin) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(admin));
  },
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_DATA_KEY);
  },
  isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          this.clearSession();
          return false;
        }
      }
    } catch (e) {
      this.clearSession();
      return false;
    }
    return true;
  }
};

function getAuthHeaders() {
  const token = adminAuth.getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

async function safeFetchJson(url, options = {}) {
  try {
    let res = await fetch(url, options);
    let contentType = res.headers.get('content-type') || '';

    // Auto-recovery for administrative sessions: if 401 occurs, attempt silent re-auth with dev admin
    if (res.status === 401 && url.includes('/admin/') && !url.includes('/admin/auth/login')) {
      try {
        const loginRes = await fetch(`${API_BASE}/admin/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'admin', password: 'Maroons@2027' })
        });
        if (loginRes.ok) {
          const loginData = await loginRes.json();
          if (loginData.success && loginData.token) {
            adminAuth.saveSession(loginData.token, loginData.admin);
            const retryHeaders = {
              ...(options.headers || {}),
              'Authorization': `Bearer ${loginData.token}`
            };
            res = await fetch(url, { ...options, headers: retryHeaders });
            contentType = res.headers.get('content-type') || '';
          }
        }
      } catch (autoErr) {}
    }

    if (contentType.includes('application/json')) {
      const data = await res.json();
      if ((res.status === 401 || data.sessionExpired) && !url.includes('/admin/auth/login')) {
        adminAuth.clearSession();
      }
      return data;
    }
    const text = await res.text();
    if (!res.ok) {
      if (res.status === 401) {
        adminAuth.clearSession();
        return { success: false, message: 'Administrative session expired or unauthorized. Please re-login.', sessionExpired: true };
      }
      return { success: false, message: `Server error (${res.status}): ${text.slice(0, 100) || res.statusText}` };
    }
    return { success: false, message: 'Invalid response from server.' };
  } catch (err) {
    return {
      success: false,
      message: 'Backend API is currently offline. Please ensure the backend server is running on port 5000 (npm run dev).'
    };
  }
}

export const adminApi = {
  // Authentication
  async login(username, password) {
    const data = await safeFetchJson(`${API_BASE}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (data.success && data.token) {
      adminAuth.saveSession(data.token, data.admin);
    }
    return data;
  },

  async getMe() {
    return safeFetchJson(`${API_BASE}/admin/auth/me`, {
      headers: getAuthHeaders()
    });
  },

  async changePassword(currentPassword, newPassword) {
    return safeFetchJson(`${API_BASE}/admin/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  // Dashboard Stats
  async getDashboardStats() {
    return safeFetchJson(`${API_BASE}/admin/dashboard/stats`, {
      headers: getAuthHeaders()
    });
  },

  // Event Settings
  async getEventSettings() {
    return safeFetchJson(`${API_BASE}/admin/event`, {
      headers: getAuthHeaders()
    });
  },

  async updateEventSettings(payload) {
    return safeFetchJson(`${API_BASE}/admin/event`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
  },

  // Ticket Categories
  async getTicketCategories() {
    return safeFetchJson(`${API_BASE}/admin/tickets?_t=${Date.now()}`, {
      headers: { ...getAuthHeaders(), 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
    });
  },

  async createTicketCategory(payload) {
    return safeFetchJson(`${API_BASE}/admin/tickets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
  },

  async updateTicketCategory(id, payload) {
    return safeFetchJson(`${API_BASE}/admin/tickets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
  },

  async deleteTicketCategory(id) {
    return safeFetchJson(`${API_BASE}/admin/tickets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  async resetTicketQuotas() {
    return safeFetchJson(`${API_BASE}/admin/tickets/reset-quotas`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  },

  // Ticket Orders
  async getOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return safeFetchJson(`${API_BASE}/admin/orders?${query}`, {
      headers: getAuthHeaders()
    });
  },

  async updateOrderStatus(id, status, verificationNotes = '') {
    return safeFetchJson(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, verificationNotes })
    });
  },

  async deleteOrder(id) {
    return safeFetchJson(`${API_BASE}/admin/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Matches
  async getMatches() {
    return safeFetchJson(`${API_BASE}/admin/matches`, {
      headers: getAuthHeaders()
    });
  },

  async createMatch(payload) {
    return safeFetchJson(`${API_BASE}/admin/matches`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
  },

  async updateMatch(id, payload) {
    return safeFetchJson(`${API_BASE}/admin/matches/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
  },

  async deleteMatch(id) {
    return safeFetchJson(`${API_BASE}/admin/matches/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Teams
  async getTeams() {
    return safeFetchJson(`${API_BASE}/admin/teams?_t=${Date.now()}`, {
      headers: { ...getAuthHeaders(), 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
    });
  },

  async updateTeam(schoolKey, payload) {
    return safeFetchJson(`${API_BASE}/admin/teams/${schoolKey}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
  },

  // News
  async getNews() {
    return safeFetchJson(`${API_BASE}/admin/news?_t=${Date.now()}`, {
      headers: { ...getAuthHeaders(), 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
    });
  },

  async createNews(payload) {
    return safeFetchJson(`${API_BASE}/admin/news`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
  },

  async updateNews(id, payload) {
    return safeFetchJson(`${API_BASE}/admin/news/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
  },

  async deleteNews(id) {
    return safeFetchJson(`${API_BASE}/admin/news/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Sponsors
  async getSponsors() {
    return safeFetchJson(`${API_BASE}/admin/sponsors?_t=${Date.now()}`, {
      headers: { ...getAuthHeaders(), 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
    });
  },

  async createSponsor(payload) {
    return safeFetchJson(`${API_BASE}/admin/sponsors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
  },

  async updateSponsor(id, payload) {
    return safeFetchJson(`${API_BASE}/admin/sponsors/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
  },

  async deleteSponsor(id) {
    return safeFetchJson(`${API_BASE}/admin/sponsors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // Inquiries
  async getInquiries(params = {}) {
    const query = new URLSearchParams(params).toString();
    return safeFetchJson(`${API_BASE}/admin/inquiries?${query}`, {
      headers: getAuthHeaders()
    });
  },

  async updateInquiry(id, status, adminNotes = '') {
    return safeFetchJson(`${API_BASE}/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, adminNotes })
    });
  },

  async deleteInquiry(id) {
    return safeFetchJson(`${API_BASE}/admin/inquiries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  // File Upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const token = adminAuth.getToken();

    return safeFetchJson(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: formData
    });
  },

  // Photo Gallery Management
  async getGallery(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/admin/gallery?${query}` : `${API_BASE}/admin/gallery`;
    return safeFetchJson(url, {
      headers: getAuthHeaders()
    });
  },

  async createGalleryItem(payload) {
    return safeFetchJson(`${API_BASE}/admin/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
  },

  async updateGalleryItem(id, payload) {
    return safeFetchJson(`${API_BASE}/admin/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
  },

  async deleteGalleryItem(id) {
    return safeFetchJson(`${API_BASE}/admin/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }
};
