/**
 * BATTLE OF THE MAROONS — HISTORICAL RECORDS PAGE
 * 
 * Comprehensive archive of past encounters by decade (1924–2026),
 * batting records, bowling feats, centurions, and family traditions.
 */

import { historicalOverview, encountersDecades } from '../data/history.js';
import { initHistoryMatchModal, openHistoryMatchModal } from '../components/history-match-modal.js';
import { Icons } from '../components/icons.js';

export function renderHistoryPage(container) {
  initHistoryMatchModal();
  let selectedDecade = encountersDecades[0].decade;
  let searchTerm = '';

  function render() {
    const currentDecadeData = encountersDecades.find(d => d.decade === selectedDecade) || encountersDecades[0];
    
    // Filter encounters by search term
    const displayedEncounters = currentDecadeData.encounters.filter(item => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        item.year.toString().includes(term) ||
        item.match.toLowerCase().includes(term) ||
        item.anandaCapt.toLowerCase().includes(term) ||
        item.nalandaCapt.toLowerCase().includes(term) ||
        item.result.toLowerCase().includes(term)
      );
    });

    container.innerHTML = `
      <div class="page-hero">
        <div class="container">
          <span class="page-hero-eyebrow">Centenary Archive (1924 – Present)</span>
          <h1 class="page-hero-title">Historical Records</h1>
          <p class="page-hero-subtitle">
            An unbroken archive of 96 encounters, record centuries, legendary bowling spells, and cherished family heritage.
          </p>
        </div>
      </div>

      <!-- Overall Head-to-Head Tally Overview -->
      <section class="page-section" style="padding-bottom: 20px;">
        <div class="container">
          <div class="numbers-stats-grid" style="margin-top: 0;">
            <div class="number-stat-card">
              <div class="stat-counter-large">${historicalOverview.bigMatchTally.total}</div>
              <div class="stat-title">Big Matches Played</div>
              <div class="stat-desc">Traditional multi-day encounters since 1924</div>
            </div>
            <div class="number-stat-card" style="border-top: 3px solid var(--color-gold);">
              <div class="stat-counter-large">${historicalOverview.bigMatchTally.anandaWins}</div>
              <div class="stat-title">Ananda Wins</div>
              <div class="stat-desc">Most recent: 2003 under Daminda Kularatne</div>
            </div>
            <div class="number-stat-card" style="border-top: 3px solid var(--color-silver);">
              <div class="stat-counter-large">${historicalOverview.bigMatchTally.nalandaWins}</div>
              <div class="stat-title">Nalanda Wins</div>
              <div class="stat-desc">Most recent: 2022 under Dineth Samaraweera</div>
            </div>
            <div class="number-stat-card">
              <div class="stat-counter-large">${historicalOverview.bigMatchTally.draws}</div>
              <div class="stat-title">Draws</div>
              <div class="stat-desc">Hard-fought sporting battles celebrated as one</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Cherished Moments Archival Callout -->
      <section class="container" style="margin-bottom: 50px;">
        <div style="background: linear-gradient(135deg, rgba(38, 7, 14, 0.95) 0%, rgba(14, 7, 10, 0.98) 100%); border: 1.5px solid var(--border-gold); border-radius: 18px; padding: 32px 36px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);">
          <div style="max-width: 660px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span class="mono-tag" style="color: var(--color-gold);">Archival Chronicles</span>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-wool-muted);">17 Rare Photographs & Rosters</span>
            </div>
            <h3 style="font-size: clamp(1.4rem, 2.5vw, 1.9rem); color: var(--color-wool); margin: 0 0 10px;">
              Cherished Moments & Archival Memories
            </h3>
            <p style="font-size: 0.95rem; color: var(--color-wool-muted); line-height: 1.6; margin: 0;">
              Immerse yourself in authentic historical team rosters and iconic moments: the 1975 Inaugural World Cup Sri Lanka squad, Anura Ranasinghe facing the West Indies pace battery, Arjuna Ranatunga's 1982 Test boundary, and Roshan Mahanama's 1984 Nalanda XI.
            </p>
          </div>
          <div>
            <a href="#/cherished-moments" class="btn-primary-cinematic" style="white-space: nowrap; padding: 14px 28px;">
              View Cherished Moments &rarr;
            </a>
          </div>
        </div>
      </section>

      <!-- Decades Archive Section -->
      <section class="page-section darker">
        <div class="container">
          <div class="section-header-block">
            <span class="mono-tag">Chronological Annals</span>
            <h2>Encounters by Decade</h2>
            <p>Select any era to view captains, venues, match results, and historic milestones.</p>
          </div>

          <!-- Decade Filter Buttons -->
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 30px;">
            ${encountersDecades.map(d => `
              <button 
                type="button" 
                class="gallery-filter-btn ${d.decade === selectedDecade ? 'active' : ''}" 
                data-decade="${d.decade}"
              >
                ${d.decade}
              </button>
            `).join('')}
          </div>

          <!-- Search Filter Input -->
          <div style="max-width: 480px; margin: 0 auto 30px;">
            <input 
              type="text" 
              class="form-input" 
              id="history-search-input" 
              placeholder="Search by year, captain name, or result..." 
              value="${searchTerm}"
            />
          </div>

          <!-- Encounters Table -->
          <div class="match-card" style="margin-bottom: 0;">
            <div class="table-responsive">
              <div class="mobile-table-hint">
                <span class="hint-icon">⇄</span>
                <span>Swipe horizontally to view full match archives & stats</span>
              </div>
              <table class="scorecard-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Match</th>
                    <th>Format</th>
                    <th>Ananda Captain</th>
                    <th>Nalanda Captain</th>
                    <th>Venue</th>
                    <th>Result</th>
                    <th>Key Highlights</th>
                    <th style="text-align: right; min-width: 140px;">Archives</th>
                  </tr>
                </thead>
                <tbody>
                  ${displayedEncounters.length > 0 ? displayedEncounters.map(item => `
                    <tr>
                      <td style="font-family: var(--font-mono); font-weight: 700; color: var(--color-gold);">${item.year}</td>
                      <td style="font-family: var(--font-mono);">${item.match}</td>
                      <td>${item.format}</td>
                      <td class="player-highlight">${item.anandaCapt}</td>
                      <td class="player-highlight">${item.nalandaCapt}</td>
                      <td>${item.venue}</td>
                      <td style="font-weight: 700; color: var(--color-wool);">${item.result}</td>
                      <td style="font-size: 0.85rem;">${item.details}</td>
                      <td style="text-align: right; white-space: nowrap;">
                        <button 
                          type="button" 
                          class="btn-match-details" 
                          data-match-year="${item.year}"
                          aria-label="View full details and photos for ${item.match} match (${item.year})"
                        >
                          <span class="btn-match-details-icon">${Icons.camera()}</span>
                          <span>View Full Details</span>
                        </button>
                      </td>
                    </tr>
                  `).join('') : `
                    <tr>
                      <td colspan="9" style="text-align: center; padding: 30px;">
                        No matches found matching "${searchTerm}".
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Batting & Bowling Hall of Records -->
      <section class="page-section">
        <div class="container">
          <div class="section-header-block">
            <span class="mono-tag">Hall of Records</span>
            <h2>Individual Batting & Bowling Records</h2>
            <p>Milestones etched into Battle of the Maroons folklore.</p>
          </div>

          <div class="cherished-grid-3" style="margin-bottom: 48px;">
            <!-- Batting Milestone Card -->
            <div class="about-highlight-card">
              <span class="mono-tag">All-Time Highest Score</span>
              <h3 style="font-size: 2.2rem; color: var(--color-gold); margin: 8px 0;">149 Runs</h3>
              <h4 style="font-size: 1.2rem; margin-bottom: 6px;">Shantha Kalavitigoda (Nalanda College)</h4>
              <p style="font-size: 0.88rem; color: var(--color-wool-muted);">
                Hammered in the 1997 encounter at SSC, standing as the highest individual innings in the entire 100-year history of the series.
              </p>
            </div>

            <!-- Highest Opening Partnership Card -->
            <div class="about-highlight-card">
              <span class="mono-tag">Highest 1st Wicket Stand</span>
              <h3 style="font-size: 2.2rem; color: var(--color-gold); margin: 8px 0;">175 Runs</h3>
              <h4 style="font-size: 1.2rem; margin-bottom: 6px;">Tusira De Silva & Nilan De Silva</h4>
              <p style="font-size: 0.88rem; color: var(--color-wool-muted);">
                The record-breaking opening stand established by the two brothers for Nalanda College in the 1988 encounter.
              </p>
            </div>

            <!-- Best Bowling Spell Card -->
            <div class="about-highlight-card">
              <span class="mono-tag">Best Single Innings Bowling</span>
              <h3 style="font-size: 2.2rem; color: var(--color-gold); margin: 8px 0;">8 for 49</h3>
              <h4 style="font-size: 1.2rem; margin-bottom: 6px;">P.W. Perera (Ananda College)</h4>
              <p style="font-size: 0.88rem; color: var(--color-wool-muted);">
                Delivered in the 1930 encounter, followed by Y. Ratnayake's incredible match figures of 12 for 75 in 1946.
              </p>
            </div>
          </div>

          <!-- Centuries List Table -->
          <div class="match-card">
            <div class="match-card-header">
              <h3 style="font-size: 1.3rem;">Selected Big Match Centurions (30+ Centuries in Series History)</h3>
              <span class="mono-tag">Historic Century Honors</span>
            </div>
            <div class="table-responsive">
              <div class="mobile-table-hint">
                <span class="hint-icon">⇄</span>
                <span>Swipe horizontally to view full centurions list</span>
              </div>
              <table class="scorecard-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Player</th>
                    <th>School</th>
                    <th>Score</th>
                    <th>Balls / 4s</th>
                  </tr>
                </thead>
                <tbody>
                  ${historicalOverview.battingRecords.selectedCenturies.map(c => `
                    <tr>
                      <td style="font-family: var(--font-mono); font-weight: 700; color: var(--color-gold);">${c.year}</td>
                      <td class="player-highlight">${c.player}</td>
                      <td>${c.school}</td>
                      <td style="font-weight: 800; color: var(--color-gold-bright); font-size: 1.05rem;">${c.score}</td>
                      <td>${c.balls ? `${c.balls}b (${c.fours}x4)` : 'Historic Innings'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- The Famous 99 Club & Family Traditions -->
          <div class="cherished-grid-2" style="margin-top: 40px;">
            <div class="about-highlight-card">
              <span class="mono-tag">Agony & Ecstasy</span>
              <h4 style="font-size: 1.3rem; margin: 10px 0;">The 99 Club</h4>
              <p style="font-size: 0.9rem; line-height: 1.6; margin-bottom: 14px;">
                In the century-long history of the Big Match, only two cricketers have suffered the heartbreak of being dismissed on 99 runs:
              </p>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-gold);">
                <li>• Anura De Silva (Nalanda College) — 1966</li>
                <li>• Manuja Kariyapperuma (Ananda College) — 1984</li>
              </ul>
            </div>

            <div class="about-highlight-card">
              <span class="mono-tag">Generations of Cricket</span>
              <h4 style="font-size: 1.3rem; margin: 10px 0;">Family Heritage</h4>
              <p style="font-size: 0.9rem; line-height: 1.6; margin-bottom: 14px;">
                Proud traditions where fathers and sons both led their schools, and brothers wore the captain's blazer:
              </p>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-wool-muted);">
                <li>• <strong>Father & Son Captains:</strong> Bandula Warnapura (1971) & Madawa Warnapura (2006)</li>
                <li>• <strong>Father & Son Captains:</strong> W.W. Silva (1953) & Premasiri Silva (1975)</li>
                <li>• <strong>Brothers to Captain:</strong> Mithra (1970) & Sidath Wettimuni (1977)</li>
                <li>• <strong>Brothers to Captain:</strong> Arjuna (1982) & Sanjeeva Ranatunga (1988)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;

    // Decade select event
    container.querySelectorAll('[data-decade]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedDecade = btn.getAttribute('data-decade');
        render();
      });
    });

    // View Full Details Modal event
    container.querySelectorAll('.btn-match-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const year = parseInt(btn.getAttribute('data-match-year'), 10);
        let matchData = null;
        for (const dec of encountersDecades) {
          matchData = dec.encounters.find(m => m.year === year);
          if (matchData) break;
        }
        if (matchData) {
          openHistoryMatchModal(matchData);
        }
      });
    });

    // Search input event
    const searchInput = container.querySelector('#history-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        render();
        // re-focus search input at end of string
        const freshInput = container.querySelector('#history-search-input');
        if (freshInput) {
          freshInput.focus();
          freshInput.setSelectionRange(freshInput.value.length, freshInput.value.length);
        }
      });
    }
  }

  render();
}
