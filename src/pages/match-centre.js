/**
 * BATTLE OF THE MAROONS — MATCH CENTRE PAGE
 * 
 * Verified scorecards, toss, awards, summaries, and SSC ground layout.
 */

import { matchCentreData } from '../data/matches.js';
import { api } from '../services/api.js';
import { refreshScrollAnimations } from '../utils/scroll-animations.js';
import { Icons } from '../components/icons.js';

export function renderMatchCentrePage(container) {
  let selectedMatchId = "bom-95th-3day";
  let activeInningIndex = 0;
  let matchesList = matchCentreData.featuredMatches || [];

  function updateFromApi(data) {
    if (!data) return;
    const list = data.featuredMatches || (Array.isArray(data) ? data : null);
    if (list && list.length > 0) {
      matchesList = list;
      if (!matchesList.some(m => (m.matchId === selectedMatchId || m.id === selectedMatchId))) {
        selectedMatchId = matchesList[0].matchId || matchesList[0].id;
      }
      render();
    }
  }

  // Fetch live matches from MongoDB
  api.getMatches().then(updateFromApi).catch(() => {});

  // Listen for admin real-time updates
  window.addEventListener('bom-matches-updated', () => {
    api.getMatches().then(updateFromApi).catch(() => {});
  });

  function render() {
    const currentMatch = matchesList.find(m => (m.matchId === selectedMatchId || m.id === selectedMatchId)) || matchesList[0] || matchCentreData.featuredMatches[0];

    container.innerHTML = `
      <!-- Hero -->
      <div class="page-hero">
        <div class="container">
          <span class="page-hero-eyebrow">Sinhalese Sports Club (SSC) • Maitland Place</span>
          <h1 class="page-hero-title">Official Match Centre</h1>
          <p class="page-hero-subtitle">
            Authentic scorecards, toss results, bowling analysis, and awards from the Big Match and One Day encounters.
          </p>
        </div>
      </div>

      <section class="page-section">
        <div class="container">
          <!-- Match Switcher Bar -->
          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 40px;">
            ${matchesList.map(m => {
              const mId = m.matchId || m.id;
              return `
                <button 
                  type="button" 
                  class="gallery-filter-btn ${mId === selectedMatchId ? 'active' : ''}" 
                  data-match-select="${mId}"
                >
                  ${m.title}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Featured Match Scorecard Card -->
          <div class="match-card">
            <!-- Header -->
            <div class="match-card-header">
              <div class="match-header-info">
                <h3>${currentMatch.title}</h3>
                <div class="match-header-meta">
                  <span style="display: inline-flex; align-items: center; gap: 6px;">${Icons.calendar('gold-accent')} ${currentMatch.dates}</span>
                  <span style="display: inline-flex; align-items: center; gap: 6px;">${Icons.mapPin('gold-accent')} ${currentMatch.venue}</span>
                  <span style="display: inline-flex; align-items: center; gap: 6px;">${Icons.trophy('gold-accent')} ${currentMatch.trophy}</span>
                </div>
              </div>

              <div class="match-result-badge">
                ${currentMatch.result}
              </div>
            </div>

            <!-- Body -->
            <div class="match-card-body">
              <!-- Toss Banner -->
              <div style="padding: 12px 18px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 8px; margin-bottom: 24px; font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-gold); display: flex; align-items: center; gap: 8px;">
                ${Icons.coin('gold-accent')} <strong>Toss:</strong> ${currentMatch.toss}
              </div>

              <!-- Summary Paragraph -->
              <p style="font-size: 1rem; line-height: 1.7; margin-bottom: 30px;">
                ${currentMatch.summary}
              </p>

              ${currentMatch.scorecards ? `
                <!-- Innings Navigation Tabs -->
                <div class="innings-tabs">
                  ${currentMatch.scorecards.innings.map((inn, idx) => `
                    <button 
                      type="button" 
                      class="tab-btn ${idx === activeInningIndex ? 'active' : ''}" 
                      data-inning-tab="${idx}"
                    >
                      ${inn.team} (${inn.inningsNumber}) — ${inn.score}
                    </button>
                  `).join('')}
                </div>

                <!-- Active Inning Batting Table -->
                <div class="table-responsive">
                  <div class="mobile-table-hint">
                    <span class="hint-icon">⇄</span>
                    <span>Swipe horizontally to view full scorecard</span>
                  </div>
                  <h4 style="font-size: 1.1rem; color: var(--color-gold); margin: 12px 14px; font-family: var(--font-mono);">
                    BATTING SCORECARD — ${currentMatch.scorecards.innings[activeInningIndex].team} (${currentMatch.scorecards.innings[activeInningIndex].score} in ${currentMatch.scorecards.innings[activeInningIndex].overs} Overs)
                  </h4>
                  <table class="scorecard-table">
                    <thead>
                      <tr>
                        <th>Batsman</th>
                        <th>Dismissal</th>
                        <th>Runs</th>
                        <th>Balls</th>
                        <th>4s</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${currentMatch.scorecards.innings[activeInningIndex].batting.map(b => `
                        <tr>
                          <td class="player-highlight">${b.player}</td>
                          <td>${b.dismissal}</td>
                          <td style="font-weight: 700; color: var(--color-wool);">${b.runs}</td>
                          <td>${b.balls || '-'}</td>
                          <td>${b.fours || 0}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>

                <!-- Active Inning Bowling Table -->
                <div class="table-responsive">
                  <div class="mobile-table-hint">
                    <span class="hint-icon">⇄</span>
                    <span>Swipe horizontally to view full bowling figures</span>
                  </div>
                  <h4 style="font-size: 1.1rem; color: var(--color-gold); margin: 12px 14px; font-family: var(--font-mono);">
                    BOWLING FIGURES
                  </h4>
                  <table class="scorecard-table">
                    <thead>
                      <tr>
                        <th>Bowler</th>
                        <th>Overs</th>
                        <th>Maidens</th>
                        <th>Runs</th>
                        <th>Wickets</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${currentMatch.scorecards.innings[activeInningIndex].bowling.map(bowl => `
                        <tr>
                          <td class="player-highlight">${bowl.bowler}</td>
                          <td>${bowl.overs}</td>
                          <td>${bowl.maidens}</td>
                          <td>${bowl.runs}</td>
                          <td style="font-weight: 700; color: var(--color-gold-bright);">${bowl.wickets}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              ` : `
                <div style="padding: 40px; text-align: center; background: rgba(255, 255, 255, 0.02); border-radius: 8px;">
                  <h4 style="margin-bottom: 10px;">Encounter Concluded & Archived</h4>
                  <p>Detailed historical bulletins and announcements are accessible in the News & Records sections.</p>
                </div>
              `}

              <!-- Awards Section -->
              ${currentMatch.awards && currentMatch.awards.length > 0 ? `
                <h4 style="font-size: 1.2rem; margin-top: 36px; margin-bottom: 16px; color: var(--color-wool);">
                  Match Honors & Awards
                </h4>
                <div class="match-awards-grid">
                  ${currentMatch.awards.map(a => `
                    <div class="award-item">
                      <div class="award-title">${a.title}</div>
                      <div class="award-recipient">${a.recipient}</div>
                      <div class="award-school">${a.school}</div>
                      ${a.note ? `<div style="font-size: 0.75rem; color: var(--color-wool-subtle); margin-top: 4px;">${a.note}</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>

          <!-- SSC Ground Layout & Stadium Experience Section -->
          <div style="margin-top: 60px; background: rgba(18, 9, 13, 0.85); border: 1px solid var(--border-light); border-radius: 16px; padding: clamp(20px, 4vw, 40px); backdrop-filter: blur(14px);">
            <div class="contact-grid-2" style="align-items: center;">
              <div>
                <span class="mono-tag">Venue Dossier</span>
                <h3 style="font-size: 2rem; margin-bottom: 16px;">Sinhalese Sports Club (SSC) Grounds</h3>
                <p style="margin-bottom: 16px;">
                  The spiritual home of the Battle of the Maroons at Maitland Place, Colombo 07. Widely regarded as one of Test cricket's most iconic grounds, featuring natural turf wickets, world-class broadcast lighting, and dedicated enclosures for students and alumni.
                </p>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-gold);">
                  <li style="display: flex; align-items: center; gap: 8px;">${Icons.check('gold-accent')} Location: Maitland Place, Colombo 07, Sri Lanka</li>
                  <li style="display: flex; align-items: center; gap: 8px;">${Icons.check('gold-accent')} Capacity: 10,000+ Spectator Stands</li>
                  <li style="display: flex; align-items: center; gap: 8px;">${Icons.check('gold-accent')} Floodlights: International ICC Standard broadcast illumination</li>
                  <li style="display: flex; align-items: center; gap: 8px;">${Icons.check('gold-accent')} Pitch: True fast bowler bounce with turn for spinners on Day 3</li>
                </ul>
              </div>

              <div style="text-align: center; background: rgba(0, 0, 0, 0.4); border-radius: 12px; padding: 24px; border: 1px solid var(--border-subtle);">
                <img src="/assets/images/ui/ssc_ground_plan_icon.png" alt="SSC Ground Layout" style="max-height: 180px; margin: 0 auto 16px; object-fit: contain;" />
                <h4 style="font-size: 1.1rem; color: var(--color-wool); margin-bottom: 6px;">Ground Enclosures</h4>
                <p style="font-size: 0.82rem; color: var(--color-wool-muted);">
                  Grandstand • Members Pavilion • Maroons Marquee • Papare & Student Enclosure
                </p>
                <a href="#/ticketing" class="btn-nav-ticket" style="margin-top: 16px; display: inline-flex;">
                  View Enclosure Passes
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Match select event
    container.querySelectorAll('[data-match-select]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedMatchId = btn.getAttribute('data-match-select');
        activeInningIndex = 0;
        render();
      });
    });

    // Inning tab event
    container.querySelectorAll('[data-inning-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeInningIndex = parseInt(btn.getAttribute('data-inning-tab'), 10);
        render();
      });
    });

    refreshScrollAnimations(container);
  }

  render();
}
