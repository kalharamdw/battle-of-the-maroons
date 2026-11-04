/**
 * BATTLE OF THE MAROONS — EVENT COUNTDOWN COMPONENT
 * 
 * Dynamic, live countdown synchronised with backend database settings.
 * - Supports admin-configured dates, encounter edition, venue, and live countdown target.
 * - Gracefully handles awaiting state when dates are unconfirmed.
 * - Unhides full live ticking countdown when admin marks dates as confirmed.
 * - Features simulation preview toggle and responsive mobile typography.
 */

import { eventConfig as localEventConfig } from '../data/event.config.js';
import { api } from '../services/api.js';
import { Icons } from './icons.js';

let countdownTimerInterval = null;
let simulationModeActive = false;
let currentEventConfig = { ...localEventConfig };

export function renderCountdownComponent(containerId = 'countdown-root', options = {}) {
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return;

  // Listen for real-time admin updates
  const updateHandler = (e) => {
    if (e.detail) {
      currentEventConfig = { ...currentEventConfig, ...e.detail };
      renderInner(container, options);
    }
  };
  window.addEventListener('bom-event-updated', updateHandler);

  // Asynchronously fetch live config from server
  api.getEventConfig().then(liveConfig => {
    if (liveConfig) {
      currentEventConfig = { ...currentEventConfig, ...liveConfig };
      renderInner(container, options);
    }
  }).catch(() => {});

  renderInner(container, options);
}

function renderInner(container, options) {
  const isConfirmed = Boolean(
    (currentEventConfig.isConfirmed !== undefined ? currentEventConfig.isConfirmed : currentEventConfig.isDateConfirmed) 
    || simulationModeActive
  );

  const targetDateString = currentEventConfig.countdownTarget 
    || currentEventConfig.confirmedStartDate 
    || currentEventConfig.tentativeMatchDate 
    || currentEventConfig.targetDate 
    || "2027-03-05T09:30:00+05:30";

  const seriesTitle = currentEventConfig.seriesTitle 
    || (currentEventConfig.edition ? `${currentEventConfig.edition}th Battle of the Maroons` : "97th Battle of the Maroons");

  const seasonYear = currentEventConfig.year || currentEventConfig.season || "2027";
  const displayDates = currentEventConfig.matchDates || (simulationModeActive ? "Tentative Target: March 2027" : "March 2027 • SSC Colombo");
  const matchVenue = currentEventConfig.venue || currentEventConfig.venueName || "Sinhalese Sports Club (SSC) Grounds, Colombo";

  if (!isConfirmed) {
    // Elegant Awaiting State
    container.innerHTML = `
      <div class="countdown-container countdown-showcase-card countdown-awaiting-card">
        <div class="countdown-beacon-tag">
          <span class="beacon-pulsing-dot dot-amber"></span>
          <span>Official Schedule Notice</span>
        </div>
        <h3 class="awaiting-title">THE NEXT CHAPTER AWAITS</h3>
        <p class="awaiting-desc">
          Official match dates for the <strong>${seriesTitle} (${seasonYear})</strong> will be published here upon release by the Joint Organising Committee.
        </p>
        <div class="countdown-meta-strip" style="margin: 8px 0 16px;">
          <div class="countdown-meta-chip">
            <span class="chip-icon">${Icons.calendar('gold-accent')}</span>
            <span class="chip-text">Expected Window: <strong>${displayDates}</strong></span>
          </div>
          <div class="countdown-meta-chip">
            <span class="chip-icon">${Icons.mapPin('maroon-accent')}</span>
            <span class="chip-text">${matchVenue}</span>
          </div>
        </div>
        <button type="button" class="countdown-demo-toggle" id="btn-toggle-countdown-sim">
          <span>${Icons.calendar()} Preview Live Countdown Simulation (${displayDates})</span>
        </button>
      </div>
    `;

    const toggleBtn = container.querySelector('#btn-toggle-countdown-sim');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        simulationModeActive = true;
        renderInner(container, options);
      });
    }

    // Update nav mini badge
    updateNavDisplay("Dates Awaited");
    return;
  }

  // Active Live Countdown Display
  container.innerHTML = `
    <div class="countdown-container countdown-showcase-card">
      <div class="countdown-showcase-header">
        <div class="countdown-beacon-tag">
          <span class="beacon-pulsing-dot"></span>
          <span>${simulationModeActive ? 'SIMULATION PREVIEW' : 'OFFICIAL MATCH COUNTDOWN'}</span>
        </div>
        <h3 class="countdown-series-title">${seriesTitle}</h3>
      </div>

      <div class="countdown-digits-grid">
        <div class="countdown-unit-box" data-unit="days">
          <div class="countdown-value" id="cd-days">00</div>
          <div class="countdown-label">Days</div>
        </div>
        <div class="countdown-unit-box" data-unit="hours">
          <div class="countdown-value" id="cd-hours">00</div>
          <div class="countdown-label">Hours</div>
        </div>
        <div class="countdown-unit-box" data-unit="minutes">
          <div class="countdown-value" id="cd-minutes">00</div>
          <div class="countdown-label">Minutes</div>
        </div>
        <div class="countdown-unit-box" data-unit="seconds">
          <div class="countdown-value" id="cd-seconds">00</div>
          <div class="countdown-label">Seconds</div>
        </div>
      </div>

      <div class="countdown-meta-strip">
        <div class="countdown-meta-chip">
          <span class="chip-icon">${Icons.calendar('gold-accent')}</span>
          <span class="chip-text">${displayDates}</span>
        </div>
        <div class="countdown-meta-chip">
          <span class="chip-icon">${Icons.mapPin('maroon-accent')}</span>
          <span class="chip-text">${matchVenue}</span>
        </div>
        ${simulationModeActive ? `
          <button type="button" class="countdown-demo-toggle" id="btn-reset-countdown-state">
            <span>Reset to Official Notice</span>
          </button>
        ` : ''}
      </div>
    </div>
  `;

  const resetBtn = container.querySelector('#btn-reset-countdown-state');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      simulationModeActive = false;
      if (countdownTimerInterval) clearInterval(countdownTimerInterval);
      renderInner(container, options);
    });
  }

  // Start 1-second interval ticker
  startCountdownTicker(new Date(targetDateString).getTime(), container, displayDates, matchVenue);
}

function startCountdownTicker(targetTimestamp, container, displayDates, matchVenue) {
  if (countdownTimerInterval) clearInterval(countdownTimerInterval);

  const updateTick = () => {
    const now = new Date().getTime();
    const difference = targetTimestamp - now;

    if (isNaN(targetTimestamp)) {
      updateNavDisplay("Dates Awaited");
      return;
    }

    if (difference <= 0) {
      clearInterval(countdownTimerInterval);
      const digitsGrid = container.querySelector('.countdown-digits-grid');
      if (digitsGrid) {
        container.innerHTML = `
          <div class="countdown-awaiting-card" style="border-color: var(--color-crimson); background: rgba(138, 17, 36, 0.2);">
            <span class="awaiting-badge" style="background: var(--color-crimson); color: white;">MATCH DAY LIVE</span>
            <h3 class="awaiting-title" style="color: var(--color-wool); margin: 8px 0;">THE BATTLE IS NOW UNDERWAY!</h3>
            <p class="awaiting-desc">Follow live ball-by-ball updates at ${matchVenue}.</p>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--color-gold); margin-top: 8px;">
              ${displayDates}
            </div>
          </div>
        `;
      }
      updateNavDisplay("MATCH LIVE");
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    const daysEl = container.querySelector('#cd-days');
    const hoursEl = container.querySelector('#cd-hours');
    const minsEl = container.querySelector('#cd-minutes');
    const secsEl = container.querySelector('#cd-seconds');

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(minutes);
    if (secsEl) secsEl.textContent = pad(seconds);

    // Update navigation compact ticker
    updateNavDisplay(`${days}D ${pad(hours)}H ${pad(minutes)}M ${pad(seconds)}S`);
  };

  updateTick();
  countdownTimerInterval = setInterval(updateTick, 1000);
}

function updateNavDisplay(text) {
  const navDisplay = document.getElementById('nav-countdown-display');
  if (navDisplay) {
    navDisplay.textContent = text;
  }
}
