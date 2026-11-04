/**
 * BATTLE OF THE MAROONS — TEAMS & SQUADS PAGE
 * 
 * Ananda College & Nalanda College squad rosters, leadership, and Hall of Fame.
 */

import { teamsData } from '../data/teams.js';
import { api } from '../services/api.js';
import { refreshScrollAnimations } from '../utils/scroll-animations.js';

export function renderTeamsPage(container) {
  let activeSchoolKey = "ananda";
  let liveTeams = { ...teamsData };

  // Fetch live teams from MongoDB
  api.getTeams().then(data => {
    if (data) {
      if (Array.isArray(data)) {
        data.forEach(t => {
          const k = (t.schoolKey || t.school || '').toLowerCase();
          if (k && liveTeams[k]) {
            liveTeams[k] = { ...liveTeams[k], ...t };
          }
        });
      } else if (typeof data === 'object') {
        Object.keys(data).forEach(k => {
          const key = k.toLowerCase();
          if (liveTeams[key]) {
            liveTeams[key] = { ...liveTeams[key], ...data[k] };
          } else {
            liveTeams[key] = data[k];
          }
        });
      }
      render();
    }
  }).catch(() => {});

  // Listen for admin real-time updates
  window.addEventListener('bom-teams-updated', (e) => {
    if (e.detail) {
      const k = (e.detail.schoolKey || e.detail.school || '').toLowerCase();
      if (k) {
        liveTeams[k] = { ...(liveTeams[k] || teamsData[k] || {}), ...e.detail };
        render();
      }
    }
  });

  function render() {
    const school = liveTeams[activeSchoolKey] || teamsData[activeSchoolKey];

    container.innerHTML = `
      <div class="page-hero">
        <div class="container">
          <span class="page-hero-eyebrow">The Maroon Gladiators</span>
          <h1 class="page-hero-title">College Squads & Legends</h1>
          <p class="page-hero-subtitle">
            Meet the young sportsmen carrying the maroon mantle and the international legends who forged Sri Lanka's cricket destiny.
          </p>
        </div>
      </div>

      <section class="page-section">
        <div class="container">
          <!-- School Switcher Tabs -->
          <div class="team-view-tabs">
            <button 
              type="button" 
              class="team-tab-btn ananda ${activeSchoolKey === 'ananda' ? 'active' : ''}" 
              data-school="ananda"
            >
              <img src="/assets/images/branding/ananda_flag.jpg" alt="Ananda Flag" class="team-tab-flag" />
              <span>Ananda College</span>
            </button>

            <button 
              type="button" 
              class="team-tab-btn nalanda ${activeSchoolKey === 'nalanda' ? 'active' : ''}" 
              data-school="nalanda"
            >
              <img src="/assets/images/branding/nalanda_flag.jpg" alt="Nalanda Flag" class="team-tab-flag" />
              <span>Nalanda College</span>
            </button>
          </div>

          <!-- School Profile Overview Card -->
          <div style="background: rgba(18, 9, 13, 0.85); border: 1px solid var(--border-light); border-radius: 16px; padding: clamp(20px, 4vw, 40px); margin-bottom: 48px; backdrop-filter: blur(14px);">
            <div class="contact-grid-2" style="align-items: center;">
              <div style="display: flex; gap: clamp(14px, 3vw, 24px); align-items: center; flex-wrap: wrap;">
                <div style="width: 96px; height: 106px; flex-shrink: 0; background: #ffffff; border-radius: 14px; padding: 6px 8px; border: 2px solid ${activeSchoolKey === 'nalanda' ? 'rgba(220, 230, 255, 0.6)' : 'rgba(212, 175, 55, 0.6)'}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                  <img src="${school.crest}" alt="${school.name} Crest" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                </div>
                <div>
                  <h2 style="font-size: clamp(1.6rem, 4vw, 2.2rem); margin-bottom: 4px; color: ${activeSchoolKey === 'ananda' ? 'var(--color-gold)' : 'var(--color-silver)'};">
                    ${school.name}
                  </h2>
                  <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-wool-muted); margin-bottom: 8px;">
                    ${school.sinhalaName} • Est. ${school.founded}
                  </div>
                  <div class="mono-tag" style="font-size: 0.72rem;">Colours: ${school.colourNames}</div>
                </div>
              </div>

              <div>
                <p style="font-size: 0.95rem; line-height: 1.7; margin-bottom: 12px;">
                  ${school.overview}
                </p>
                <div style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--color-wool-muted);">
                  <strong>Motto:</strong> <em>"${school.motto}"</em><br />
                  <strong>Principal:</strong> ${school.principal}
                </div>
              </div>
            </div>
          </div>

          <!-- Squad Roster Table -->
          <div class="match-card">
            <div class="match-card-header">
              <h3>Verified Squad Roster & Match Lineup</h3>
              <span class="mono-tag">Led by Captain: ${school.captain || school.recentCaptain || 'To be announced'}</span>
            </div>
            <div class="table-responsive">
              <div class="mobile-table-hint">
                <span class="hint-icon">⇄</span>
                <span>Swipe horizontally to view full squad roster</span>
              </div>
              <table class="scorecard-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cricketer Name</th>
                    <th>Playing Role</th>
                    <th>Specialism & Match Highlights</th>
                  </tr>
                </thead>
                <tbody>
                  ${(school.verifiedSquadMembers || school.squad || []).map((p, idx) => `
                    <tr>
                      <td style="font-family: var(--font-mono); color: var(--color-gold);">${idx + 1}</td>
                      <td class="player-highlight" style="font-size: 1rem;">${p.name}</td>
                      <td style="font-family: var(--font-mono); font-size: 0.85rem;">${p.role || ''}</td>
                      <td style="color: var(--color-wool-muted);">${p.specialism || ''}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Cricket Hall of Fame Produced by this School -->
          <div style="margin-top: 60px;">
            <div class="section-header-block" style="text-align: left; margin-bottom: 28px;">
              <span class="mono-tag">National & World Cup Icons</span>
              <h2>${school.name} Cricket Hall of Fame</h2>
              <p>Stalwarts who led Sri Lanka to world glory and inaugurated Test cricket history.</p>
            </div>

            <div class="hof-cards-grid">
              ${(school.cricketHallOfFame || []).map(legend => `
                <div class="hof-card">
                  <div class="hof-photo-wrap">
                    <img src="${legend.image}" alt="${legend.name}" loading="lazy" />
                  </div>
                  <div class="hof-card-content">
                    <h4 class="hof-player-name">${legend.name}</h4>
                    <p class="hof-player-feat">${legend.feat}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;

    // Attach School Tab Switcher
    container.querySelectorAll('[data-school]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSchoolKey = btn.getAttribute('data-school');
        render();
      });
    });

    refreshScrollAnimations(container);
  }

  render();
}
