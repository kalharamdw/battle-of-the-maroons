/**
 * BATTLE OF THE MAROONS — NAVIGATION COMPONENT
 * 
 * Masthead, school flags, live mini-countdown, ticket CTA, and responsive mobile drawer.
 */

import { eventConfig } from '../data/event.config.js';
import { api } from '../services/api.js';

export function createNavigation() {
  const navElement = document.createElement('header');
  navElement.className = 'site-header';
  navElement.id = 'site-header';

  navElement.innerHTML = `
    <div class="nav-container">
      <!-- Brand & Official Tournament Logo -->
      <a href="#/" class="nav-brand-group" id="nav-brand" title="Battle of the Maroons - Home">
        <div class="nav-brand-emblem-wrap">
          <img src="/assets/images/branding/bom_logo.png" alt="Battle of the Maroons Official Logo" class="nav-brand-emblem-img" />
        </div>
        <div class="nav-logo-text">
          <span class="nav-logo-title">Battle of the Maroons</span>
          <span class="nav-logo-sub">Ananda vs Nalanda</span>
        </div>
      </a>

      <!-- Desktop Nav Links -->
      <nav class="nav-menu-desktop" aria-label="Main Navigation">
        <a href="#/" class="nav-link" data-route="/">Home</a>
        <a href="#/about" class="nav-link" data-route="/about">The Battle</a>
        <a href="#/match-centre" class="nav-link" data-route="/match-centre">Match Centre</a>
        <a href="#/history" class="nav-link" data-route="/history">History</a>
        <a href="#/cherished-moments" class="nav-link" data-route="/cherished-moments">Memories</a>
        <a href="#/teams" class="nav-link" data-route="/teams">Teams</a>
        <a href="#/news" class="nav-link" data-route="/news">News</a>
        <a href="#/gallery" class="nav-link" data-route="/gallery">Gallery</a>
        <a href="#/contact" class="nav-link" data-route="/contact">Contact</a>
      </nav>

      <!-- Nav Actions -->
      <div class="nav-actions">
        <!-- Compact Countdown Bar (Desktop) -->
        <div class="nav-countdown-pill" id="nav-countdown-pill" title="Next Match Countdown">
          <div class="nav-countdown-pulse"></div>
          <span class="nav-countdown-label">Next Match:</span>
          <span class="nav-countdown-timer" id="nav-countdown-display">Awaiting Dates</span>
        </div>

        <!-- Ticket CTA -->
        <a href="#/ticketing" class="btn-nav-ticket" id="nav-ticket-btn">
          <span class="btn-label-full">Match</span> Tickets
        </a>

        <!-- Mobile Menu Toggle Button -->
        <button type="button" class="nav-toggle-btn" id="nav-toggle-btn" aria-label="Toggle navigation menu" aria-expanded="false">
          <span class="nav-toggle-bar"></span>
          <span class="nav-toggle-bar"></span>
          <span class="nav-toggle-bar"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Overlay -->
    <div class="mobile-nav-drawer" id="mobile-nav-drawer" aria-hidden="true">
      <div class="mobile-nav-header">
        <!-- Battle of the Maroons Official Tournament Brand -->
        <a href="#/" class="drawer-brand-showcase" id="drawer-brand-link" title="Battle of the Maroons - Official">
          <div class="drawer-brand-logo-wrap">
            <img src="/assets/images/branding/bom_logo.png" alt="Battle of the Maroons Official Shield Logo" class="drawer-brand-logo-img" />
          </div>
          <div class="drawer-brand-text">
            <span class="drawer-brand-title">BATTLE OF THE MAROONS</span>
            <span class="drawer-brand-sub">Ananda vs Nalanda • Official</span>
          </div>
        </a>

        <button type="button" class="mobile-nav-close" id="mobile-nav-close" aria-label="Close menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Encounter Meta Sub-Bar -->
      <div class="drawer-encounter-meta">
        <span class="drawer-meta-edition">97TH BATTLE OF THE MAROONS</span>
        <span class="drawer-meta-dot">•</span>
        <span class="drawer-meta-sub">THE CENTURY BROTHERHOOD</span>
      </div>

      <ul class="mobile-nav-list">
        <li>
          <a href="#/" class="mobile-nav-link" data-route="/">
            <span class="nav-link-num">01</span>
            <span class="nav-link-title">Home</span>
            <span class="nav-link-arrow">›</span>
          </a>
        </li>
        <li>
          <a href="#/about" class="mobile-nav-link" data-route="/about">
            <span class="nav-link-num">02</span>
            <span class="nav-link-title">The Battle & Origins</span>
            <span class="nav-link-arrow">›</span>
          </a>
        </li>
        <li>
          <a href="#/match-centre" class="mobile-nav-link" data-route="/match-centre">
            <span class="nav-link-num">03</span>
            <div class="nav-link-title-group">
              <span class="nav-link-title">Match Centre & Scores</span>
              <span class="drawer-chip-badge live">LIVE HUB</span>
            </div>
            <span class="nav-link-arrow">›</span>
          </a>
        </li>
        <li>
          <a href="#/history" class="mobile-nav-link" data-route="/history">
            <span class="nav-link-num">04</span>
            <span class="nav-link-title">Historical Archive</span>
            <span class="nav-link-arrow">›</span>
          </a>
        </li>
        <li>
          <a href="#/cherished-moments" class="mobile-nav-link" data-route="/cherished-moments">
            <span class="nav-link-num">05</span>
            <span class="nav-link-title">Cherished Moments</span>
            <span class="nav-link-arrow">›</span>
          </a>
        </li>
        <li>
          <a href="#/teams" class="mobile-nav-link" data-route="/teams">
            <span class="nav-link-num">06</span>
            <span class="nav-link-title">College Squads</span>
            <span class="nav-link-arrow">›</span>
          </a>
        </li>
        <li>
          <a href="#/news" class="mobile-nav-link" data-route="/news">
            <span class="nav-link-num">07</span>
            <span class="nav-link-title">News & Notices</span>
            <span class="nav-link-arrow">›</span>
          </a>
        </li>
        <li>
          <a href="#/gallery" class="mobile-nav-link" data-route="/gallery">
            <span class="nav-link-num">08</span>
            <span class="nav-link-title">Photo Gallery</span>
            <span class="nav-link-arrow">›</span>
          </a>
        </li>
        <li>
          <a href="#/ticketing" class="mobile-nav-link drawer-highlight-ticket" data-route="/ticketing">
            <span class="nav-link-num">09</span>
            <div class="nav-link-title-group">
              <span class="nav-link-title">Match Tickets</span>
              <span class="drawer-chip-badge gold">PASSES</span>
            </div>
            <span class="nav-link-arrow">›</span>
          </a>
        </li>
        <li>
          <a href="#/contact" class="mobile-nav-link" data-route="/contact">
            <span class="nav-link-num">10</span>
            <span class="nav-link-title">Contact Committee</span>
            <span class="nav-link-arrow">›</span>
          </a>
        </li>
      </ul>

      <div class="mobile-nav-actions">
        <a href="#/ticketing" class="btn-primary-cinematic drawer-reserve-btn">
          <span>Reserve Match Tickets</span>
        </a>
        <div class="drawer-footer-note">
          <span>SSC Grounds, Colombo • Sri Lanka</span>
        </div>
      </div>
    </div>

    <!-- Backdrop Dimmer -->
    <div class="nav-backdrop" id="nav-backdrop"></div>
  `;

  // Attach interactive behaviors
  initNavEvents(navElement);

  return navElement;
}

function initNavEvents(header) {
  // Scroll header styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Brand Logo Click: Scroll smoothly to top of home page
  const navBrand = header.querySelector('#nav-brand');
  if (navBrand) {
    navBrand.addEventListener('click', (e) => {
      e.preventDefault();
      const rawHash = window.location.hash || '#/';
      const cleanRoute = rawHash.slice(1).split('?')[0] || '/';
      
      if (cleanRoute === '/' || cleanRoute === '') {
        // Already on home page -> Smoothly scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // On another page -> Navigate to home and ensure top scroll
        window.location.hash = '#/';
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      }
    });
  }

  const toggleBtn = header.querySelector('#nav-toggle-btn');
  const drawer = header.querySelector('#mobile-nav-drawer');
  const backdrop = header.querySelector('#nav-backdrop');
  const closeBtn = header.querySelector('#mobile-nav-close');
  const mobileLinks = header.querySelectorAll('.mobile-nav-link');

  const openDrawer = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('active');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('active');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  const drawerBrand = header.querySelector('#drawer-brand-link');
  if (drawerBrand) {
    drawerBrand.addEventListener('click', closeDrawer);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Escape key closes mobile menu
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Dynamic Header Countdown Ticker
  let navInterval = null;
  const updateNavTicker = (cfg) => {
    const display = header.querySelector('#nav-countdown-display');
    if (!display) return;
    if (navInterval) clearInterval(navInterval);

    const isConfirmed = Boolean(cfg.isConfirmed || cfg.isDateConfirmed);
    if (!isConfirmed) {
      display.textContent = 'Dates Awaited';
      return;
    }

    const targetTime = new Date(cfg.countdownTarget || cfg.confirmedStartDate || cfg.tentativeMatchDate).getTime();
    if (isNaN(targetTime)) {
      display.textContent = 'Dates Awaited';
      return;
    }

    const tick = () => {
      const diff = targetTime - Date.now();
      if (diff <= 0) {
        display.textContent = 'MATCH LIVE';
        clearInterval(navInterval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      const pad = (n) => String(n).padStart(2, '0');
      display.textContent = `${days}D ${pad(hours)}H ${pad(mins)}M ${pad(secs)}S`;
    };

    tick();
    navInterval = setInterval(tick, 1000);
  };

  api.getEventConfig().then(cfg => {
    if (cfg) updateNavTicker(cfg);
  }).catch(() => {});

  window.addEventListener('bom-event-updated', (e) => {
    if (e.detail) updateNavTicker(e.detail);
  });
}

export function updateNavActiveRoute(currentRoute) {
  const allLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  allLinks.forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === currentRoute || (route !== '/' && currentRoute.startsWith(route))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
