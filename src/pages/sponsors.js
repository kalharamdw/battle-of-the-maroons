/**
 * BATTLE OF THE MAROONS — SPONSORS & PARTNERS PAGE
 * 
 * Verified corporate partners, tier hierarchy, and sponsorship opportunities.
 * Dynamically connected to MongoDB Atlas backend with instant fallback.
 */

import { sponsorsData } from '../data/sponsors.js';
import { api } from '../services/api.js';
import { refreshScrollAnimations } from '../utils/scroll-animations.js';

export function renderSponsorsPage(container) {
  let liveSponsors = {
    platinum: sponsorsData.platinum || [],
    gold: sponsorsData.gold || [],
    officialPartners: sponsorsData.officialPartners || [],
    mediaAndBroadcast: sponsorsData.mediaAndBroadcast || []
  };

  function updateFromApiData(data) {
    if (!data) return;
    if (Array.isArray(data)) {
      liveSponsors = {
        platinum: data.filter(s => s.tier === 'platinum' && s.isActive !== false),
        gold: data.filter(s => s.tier === 'gold' && s.isActive !== false),
        officialPartners: data.filter(s => (s.tier === 'officialPartner' || s.tier === 'silver' || s.tier === 'partner' || !['platinum', 'gold', 'mediaAndBroadcast'].includes(s.tier)) && s.isActive !== false),
        mediaAndBroadcast: data.filter(s => s.tier === 'mediaAndBroadcast' && s.isActive !== false)
      };
    } else {
      liveSponsors = {
        platinum: (data.platinum || []).filter(s => s.isActive !== false),
        gold: (data.gold || []).filter(s => s.isActive !== false),
        officialPartners: (data.officialPartners || []).filter(s => s.isActive !== false),
        mediaAndBroadcast: (data.mediaAndBroadcast || []).filter(s => s.isActive !== false)
      };
    }
    render();
  }

  // Fetch live sponsors from MongoDB
  api.getSponsors().then(updateFromApiData).catch(() => {});

  // Listen for admin real-time updates
  window.addEventListener('bom-sponsors-updated', () => {
    api.getSponsors().then(updateFromApiData).catch(() => {});
  });

  function render() {
    const platinums = liveSponsors.platinum || [];
    const golds = liveSponsors.gold || [];
    const partners = liveSponsors.officialPartners || [];
    const media = liveSponsors.mediaAndBroadcast || [];

    container.innerHTML = `
      <div class="page-hero">
        <div class="container">
          <span class="page-hero-eyebrow">Corporate Alliances</span>
          <h1 class="page-hero-title">Sponsors & Partners</h1>
          <p class="page-hero-subtitle">
            Partnering with Sri Lanka's foremost corporate leaders to empower future national sporting heroes.
          </p>
        </div>
      </div>

      <section class="page-section">
        <div class="container">
          <!-- Platinum Partner Spotlight -->
          ${platinums.length > 0 ? `
            <div class="sponsors-tier-section">
              <div class="sponsor-tier-heading">Platinum Partner</div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 24px; margin-bottom: 30px;">
                ${platinums.map(p => `
                  <div style="background: rgba(18, 9, 13, 0.9); border: 2px solid var(--color-gold); border-radius: 16px; padding: 40px; text-align: center; max-width: 600px; width: 100%; box-shadow: 0 10px 40px rgba(212, 175, 55, 0.2);">
                    <img 
                      src="${p.logo}" 
                      alt="${p.name}" 
                      style="max-height: 80px; margin: 0 auto 20px; object-fit: contain;" 
                      onerror="this.onerror=null; this.src='/assets/images/sponsors/slt_mobitel.png';"
                    />
                    <h3 style="font-size: 1.8rem; margin-bottom: 10px; color: var(--color-wool);">${p.name}</h3>
                    <div class="mono-tag" style="margin-bottom: 14px; font-size: 0.72rem;">${p.title || p.role || 'Platinum Sponsor'}</div>
                    ${p.description ? `
                      <p style="font-size: 0.95rem; color: var(--color-wool-muted); line-height: 1.6; margin-bottom: 20px;">
                        ${p.description}
                      </p>
                    ` : ''}
                    ${p.website && p.website !== '#' ? `
                      <a href="${p.website}" target="_blank" rel="noopener" class="btn-primary-cinematic">
                        Visit ${p.name}
                      </a>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Gold & Banking Partners -->
          ${golds.length > 0 ? `
            <div class="sponsors-tier-section">
              <div class="sponsor-tier-heading">Banking & Experience Partners</div>
              <div class="cherished-grid-2" style="margin-bottom: 40px; gap: 24px;">
                ${golds.map(g => `
                  <div style="background: rgba(18, 9, 13, 0.8); border: 1px solid var(--border-gold); border-radius: 14px; padding: 30px; text-align: center; backdrop-filter: blur(10px); display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                      <img 
                        src="${g.logo}" 
                        alt="${g.name}" 
                        style="max-height: 64px; margin: 0 auto 16px; object-fit: contain;"
                        onerror="this.onerror=null; this.src='/assets/images/sponsors/sampath_bank.jpg';"
                      />
                      <h4 style="font-size: 1.4rem; color: var(--color-wool); margin-bottom: 8px;">${g.name}</h4>
                      <div class="mono-tag" style="margin-bottom: 12px; font-size: 0.72rem;">${g.title || g.role || 'Official Partner'}</div>
                      ${g.description ? `
                        <p style="font-size: 0.9rem; color: var(--color-wool-muted); margin-bottom: 18px;">${g.description}</p>
                      ` : ''}
                    </div>
                    ${g.website && g.website !== '#' ? `
                      <div style="margin-top: 16px;">
                        <a href="${g.website}" target="_blank" rel="noopener" class="btn-secondary-cinematic" style="font-size: 0.78rem; padding: 10px 20px;">
                          Partner Website
                        </a>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Official Brand Partners Grid -->
          ${partners.length > 0 ? `
            <div class="sponsors-tier-section">
              <div class="sponsor-tier-heading">Official Partners</div>
              <div class="sponsors-logos-grid" style="gap: 20px;">
                ${partners.map(p => `
                  <div class="sponsor-logo-card" style="flex-direction: column; min-height: 140px; width: 190px; text-align: center; padding: 16px 14px; justify-content: center;">
                    <img 
                      src="${p.logo}" 
                      alt="${p.name}" 
                      class="sponsor-logo-img" 
                      style="margin-bottom: 8px; max-height: 52px; object-fit: contain;" 
                      onerror="this.onerror=null; this.src='/assets/images/sponsors/elephant_house.png';"
                    />
                    <strong style="font-size: 0.9rem; color: #0e070a; font-weight: 700; margin-bottom: 4px; display: block; line-height: 1.25;">${p.name}</strong>
                    <span style="font-family: var(--font-mono); font-size: 0.65rem; color: #6b1424; font-weight: 700; text-transform: uppercase; line-height: 1.3;">
                      ${p.role || p.title || 'Official Partner'}
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Media & Broadcasting Partners Grid -->
          ${media.length > 0 ? `
            <div class="sponsors-tier-section">
              <div class="sponsor-tier-heading">Electronic Media & Broadcast Partners</div>
              <div class="sponsors-logos-grid" style="gap: 24px;">
                ${media.map(m => `
                  <div class="sponsor-logo-card" style="flex-direction: column; min-height: 140px; width: 200px; text-align: center; padding: 16px 14px; justify-content: center;">
                    <img 
                      src="${m.logo}" 
                      alt="${m.name}" 
                      class="sponsor-logo-img" 
                      style="margin-bottom: 8px; max-height: 52px; object-fit: contain;" 
                      onerror="this.onerror=null; this.src='/assets/images/sponsors/sirasa_tv.png';"
                    />
                    <strong style="font-size: 0.9rem; color: #0e070a; font-weight: 700; margin-bottom: 4px; display: block; line-height: 1.25;">${m.name}</strong>
                    <span style="font-family: var(--font-mono); font-size: 0.65rem; color: #6b1424; font-weight: 700; text-transform: uppercase; line-height: 1.3;">
                      ${m.role || m.title || 'Broadcast Partner'}
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Corporate Partnership Opportunities Callout -->
          <div style="margin-top: 60px; background: linear-gradient(135deg, rgba(107, 20, 36, 0.4) 0%, rgba(14, 7, 10, 0.9) 100%); border: 1px solid var(--border-gold); border-radius: 16px; padding: 48px; text-align: center;">
            <span class="mono-tag">Join The Legacy</span>
            <h3 style="font-size: 2.2rem; margin: 12px 0 16px;">Corporate Partnership Inquiries</h3>
            <p style="max-width: 680px; margin: 0 auto 28px; line-height: 1.7;">
              Led by Marketing Co-Chairs Gen. Kamal Gunaratne and Saranga Wijayaratne, the Battle of the Maroons provides unmatched brand visibility across national electronic television, international livestream broadcasts, and on-ground brand activation before over 10,000 spectators.
            </p>
            <a href="#/contact" class="btn-primary-cinematic">
              Inquire for Sponsorship Packages
            </a>
          </div>
        </div>
      </section>
    `;

    refreshScrollAnimations(container);
  }

  render();
}
