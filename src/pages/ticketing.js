/**
 * BATTLE OF THE MAROONS — TICKETING PAGE
 * 
 * Non-transactional frontend prototype for match-day enclosure passes,
 * seating layout guide, and ticket builder.
 */

import { createTicketWidget } from '../components/ticket-widget.js';
import { renderCountdownComponent } from '../components/countdown.js';

export function renderTicketingPage(container) {
  container.innerHTML = `
    <div class="page-hero">
      <div class="container">
        <span class="page-hero-eyebrow">Match Day Access</span>
        <h1 class="page-hero-title">Match Tickets & Enclosures</h1>
        <p class="page-hero-subtitle">
          Plan your match day experience at the Sinhalese Sports Club (SSC) Grounds for the 3-day encounter and historic day-night match.
        </p>
      </div>
    </div>

    <!-- Countdown & Schedule Notice -->
    <section class="page-section" style="padding-bottom: 20px;">
      <div class="container">
        <div id="ticketing-countdown-mount"></div>
      </div>
    </section>

    <!-- Interactive Ticket Builder Widget Section -->
    <section class="page-section" style="padding-top: 20px;">
      <div class="container">
        <div class="section-header-block">
          <span class="mono-tag">Interactive Planner</span>
          <h2>Select Enclosure & Estimate Allocation</h2>
          <p>Choose your preferred stand and review estimated ticket cost in LKR.</p>
        </div>

        <div id="ticketing-builder-mount"></div>
      </div>
    </section>

    <!-- Enclosures Information & Grounds Guide -->
    <section class="page-section darker">
      <div class="container">
        <div class="section-header-block">
          <span class="mono-tag">SSC Colombo</span>
          <h2>Grounds & Stand Directory</h2>
          <p>Everything you need to know about spectator facilities at Maitland Place.</p>
        </div>

        <div class="cherished-grid-2" style="gap: 20px;">
          <div class="about-highlight-card">
            <span class="mono-tag">Tier 1</span>
            <h4 style="font-size: 1.25rem; color: var(--color-wool); margin: 8px 0;">Grandstand Upper Tier</h4>
            <p style="font-size: 0.9rem; line-height: 1.6; color: var(--color-wool-muted);">
              Full roof coverage offering protection from the sun, prime central alignment behind the bowler's arm, and reserved family seating.
            </p>
          </div>

          <div class="about-highlight-card">
            <span class="mono-tag">Tier 2</span>
            <h4 style="font-size: 1.25rem; color: var(--color-wool); margin: 8px 0;">Members' Pavilion</h4>
            <p style="font-size: 0.9rem; line-height: 1.6; color: var(--color-wool-muted);">
              Prestigious clubhouse access reserved for past committee members, life members, and special invitees. Formal dress code applies.
            </p>
          </div>

          <div class="about-highlight-card">
            <span class="mono-tag">Tier 3</span>
            <h4 style="font-size: 1.25rem; color: var(--color-wool); margin: 8px 0;">Old Boys Marquee</h4>
            <p style="font-size: 0.9rem; line-height: 1.6; color: var(--color-wool-muted);">
              The meeting hub for alumni flying in from the UK, Australia, North America, and across Sri Lanka. Includes commemorative badge.
            </p>
          </div>

          <div class="about-highlight-card">
            <span class="mono-tag">Tier 4</span>
            <h4 style="font-size: 1.25rem; color: var(--color-wool); margin: 8px 0;">Party Tent & Papare Area</h4>
            <p style="font-size: 0.9rem; line-height: 1.6; color: var(--color-wool-muted);">
              Where the brass ensembles, percussionists, and student cheering squads keep the tempo alive from morning until night under lights.
            </p>
          </div>
        </div>

        <!-- FAQs Section -->
        <div style="margin-top: 60px; max-width: 800px; margin-left: auto; margin-right: auto;">
          <h3 style="font-size: 1.8rem; text-align: center; margin-bottom: 30px;">Ticketing & Access FAQs</h3>
          
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 20px;">
              <h5 style="font-size: 1.05rem; color: var(--color-gold); margin-bottom: 6px;">When do official ticket sales open?</h5>
              <p style="font-size: 0.9rem; color: var(--color-wool-muted);">
                Official physical and online ticket sales open approximately 3 to 4 weeks prior to the scheduled encounter, following the Joint Committee's official announcement.
              </p>
            </div>

            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 20px;">
              <h5 style="font-size: 1.05rem; color: var(--color-gold); margin-bottom: 6px;">Are tickets required for school students in uniform?</h5>
              <p style="font-size: 0.9rem; color: var(--color-wool-muted);">
                Current students of Ananda College and Nalanda College in school uniform are traditionally granted admission through designated student gates.
              </p>
            </div>

            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 20px;">
              <h5 style="font-size: 1.05rem; color: var(--color-gold); margin-bottom: 6px;">Is parking available at the SSC grounds?</h5>
              <p style="font-size: 0.9rem; color: var(--color-wool-muted);">
                Designated vehicle passes are issued with Pavilion and Marquee packages. Public parking is available at surrounding Colombo 07 municipal grounds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Mount components
  const cdMount = container.querySelector('#ticketing-countdown-mount');
  if (cdMount) {
    renderCountdownComponent(cdMount);
  }

  const builderMount = container.querySelector('#ticketing-builder-mount');
  if (builderMount) {
    builderMount.appendChild(createTicketWidget());
  }
}
