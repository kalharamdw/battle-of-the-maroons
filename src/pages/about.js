/**
 * BATTLE OF THE MAROONS — THE BATTLE / ABOUT PAGE
 * 
 * Origins, brotherhood, founding visionaries, trophies, and historical timeline.
 */

import { historicalOverview } from '../data/history.js';

export function renderAboutPage(container) {
  container.innerHTML = `
    <!-- Page Hero Banner -->
    <div class="page-hero">
      <div class="container">
        <span class="page-hero-eyebrow">Centenary Legacy (1924 – Present)</span>
        <h1 class="page-hero-title">The Battle & The Brotherhood</h1>
        <p class="page-hero-subtitle">
          The story of two premier Buddhist institutions, bound by shared heritage and celebrated through legendary cricket.
        </p>
      </div>
    </div>

    <!-- Section: The Origins & Founding Vision -->
    <section class="page-section">
      <div class="container">
        <div class="about-origins-grid">
          <div class="about-text-content">
            <span class="mono-tag">A Sacred Bond</span>
            <h3>Born from the Same Soil in 1924</h3>
            <p>
              Welcome to the history of the "Battle of the Maroons", an encounter woven into the very fabric of Sri Lankan sporting culture. Nalanda College having come into existence as an offshoot of Ananda College in 1924, a "Big Match" was initiated between the two brotherly schools with the noble aim of building enduring relations between students of both institutions and developing their cricket in the sporting arena.
            </p>
            <p>
              Thus, the inaugural Battle of the Maroons was played between Ananda and Nalanda in 1924. Soon the Big Match began to be played with immense pride and fanfare, quickly transforming into the most awaited and cherished event of the year for all those connected with both schools.
            </p>
            <p>
              A fine tradition was built over the decades while the cricketing abilities of both schools grew, surpassing many other cricket-playing schools on the island. The Battle of the Maroons gradually became an internationally celebrated symbol of brotherhood between Ananda and Nalanda that remains unique in a country where many school rivalries turn bitter.
            </p>
          </div>

          <div class="about-highlight-card">
            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 24px;">
              <div style="width: 72px; height: 80px; border-radius: 12px; background: #ffffff; display: flex; align-items: center; justify-content: center; padding: 5px 6px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5); border: 1.5px solid rgba(212, 175, 55, 0.4); overflow: hidden;">
                <img src="/assets/images/schools/ananda_crest.svg" alt="Ananda Crest" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
              <div style="width: 72px; height: 80px; border-radius: 12px; background: #ffffff; display: flex; align-items: center; justify-content: center; padding: 5px 6px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5); border: 1.5px solid rgba(220, 230, 255, 0.4); overflow: hidden;">
                <img src="/assets/images/schools/nalanda_crest.png" alt="Nalanda Crest" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
            </div>
            <h4 style="font-size: 1.3rem; margin-bottom: 12px; text-align: center; color: var(--color-wool);">
              The Two Perpetual Trophies
            </h4>
            <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-bottom: 16px;">
              <span class="mono-tag" style="font-size: 0.72rem;">Traditional 3-Day Match</span>
              <h5 style="font-size: 1.1rem; color: var(--color-gold); margin: 4px 0;">
                Dr. N. M. Perera Memorial Challenge Trophy
              </h5>
              <p style="font-size: 0.88rem; color: var(--color-wool-muted);">
                Dedicated to Dr. N.M. Perera, captain of Ananda in the 1925 encounter who later became Sri Lanka's esteemed Finance Minister.
              </p>
            </div>
            <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px;">
              <span class="mono-tag" style="font-size: 0.72rem;">Limited Overs Match</span>
              <h5 style="font-size: 1.1rem; color: var(--color-gold); margin: 4px 0;">
                P. De S. Kularatne Memorial Trophy
              </h5>
              <p style="font-size: 0.88rem; color: var(--color-wool-muted);">
                Named in memory of the visionary educationist Mr. P. de S. Kularatne who served as principal of Ananda and established Nalanda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section: Archival Heritage Spotlight -->
    <section class="page-section darker">
      <div class="container">
        <div class="section-header-block">
          <span class="mono-tag">Chronicle of Centuries</span>
          <h2>The Century Timeline (1924 – 2026)</h2>
          <p>Key moments that shaped Sri Lanka's national cricketing identity.</p>
        </div>

        <div class="heritage-timeline">
          ${historicalOverview.milestones.map(m => `
            <div class="timeline-milestone-item">
              <div class="timeline-year-tag">${m.year}</div>
              <h4 class="timeline-event-name">${m.event}</h4>
              <p class="timeline-event-desc">${m.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Section: CTA to Match Centre & Records -->
    <section class="page-section" style="text-align: center;">
      <div class="container">
        <h3 style="font-size: 2.2rem; margin-bottom: 16px;">Explore the Match Archive</h3>
        <p style="max-width: 600px; margin: 0 auto 30px;">
          Dive deep into verified scorecards, bowling figures, and decade records from 1924 to the modern era.
        </p>
        <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
          <a href="#/match-centre" class="btn-primary-cinematic">
            View Match Centre
          </a>
          <a href="#/history" class="btn-secondary-cinematic">
            Historical Records Database
          </a>
          <a href="#/cherished-moments" class="btn-secondary-cinematic" style="border-color: var(--color-gold); color: var(--color-gold);">
            Cherished Archival Memories &rarr;
          </a>
        </div>
      </div>
    </section>
  `;
}
