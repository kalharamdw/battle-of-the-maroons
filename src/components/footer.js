/**
 * BATTLE OF THE MAROONS — FOOTER COMPONENT
 * 
 * Official footer containing school emblems, links, organizing committee credits, and social destinations.
 */
import { Icons } from './icons.js';

export function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.id = 'site-footer';

  footer.innerHTML = `
    <div class="container">
      <div class="footer-top-grid">
        <!-- Brand & Official Tournament Logo -->
        <div class="footer-brand">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
            <div class="footer-logo-wrap" style="display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <img src="/assets/images/branding/bom_logo.png" alt="Battle of the Maroons Official Logo" style="height: 54px; width: auto; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.6));" />
            </div>
            <div>
              <h4 style="margin: 0; line-height: 1.1;">Battle of the Maroons</h4>
              <span class="mono-tag" style="font-size: 0.68rem;">Ananda vs Nalanda • Colombo, Sri Lanka</span>
            </div>
          </div>
          <p>
            The legendary annual cricket encounter between Ananda College and Nalanda College. 
            Initiated in 1924, celebrating a century of camaraderie, sporting excellence, and brotherly heritage.
          </p>
          <div style="display: flex; gap: 14px; align-items: center;">
            <a href="https://www.facebook.com/battleofthemaroons/" target="_blank" rel="noopener" style="color: var(--color-gold); font-size: 1.1rem;" aria-label="Facebook">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://battleofthemaroons.lk/" target="_blank" rel="noopener" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-wool-muted);">
              battleofthemaroons.lk
            </a>
          </div>
        </div>

        <!-- Navigation Links -->
        <div>
          <h5 class="footer-col-title">The Encounter</h5>
          <ul class="footer-links-list">
            <li><a href="#/" class="footer-link">Cinematic Home</a></li>
            <li><a href="#/about" class="footer-link">Origins & Brotherhood</a></li>
            <li><a href="#/match-centre" class="footer-link">Match Centre</a></li>
            <li><a href="#/history" class="footer-link">Historical Records</a></li>
            <li><a href="#/teams" class="footer-link">Ananda & Nalanda Squads</a></li>
          </ul>
        </div>

        <!-- Media & Archives -->
        <div>
          <h5 class="footer-col-title">Archives & Event</h5>
          <ul class="footer-links-list">
            <li><a href="#/cherished-moments" class="footer-link">Cherished Moments & Memories</a></li>
            <li><a href="#/news" class="footer-link">News & Notices</a></li>
            <li><a href="#/gallery" class="footer-link">Photo Gallery</a></li>
            <li><a href="#/ticketing" class="footer-link">Match Tickets</a></li>
            <li><a href="#/contact" class="footer-link">Joint Organising Committee</a></li>
          </ul>
        </div>

        <!-- Official Grounds & Schools -->
        <div>
          <h5 class="footer-col-title">Venues & Schools</h5>
          <p style="font-size: 0.85rem; margin-bottom: 8px;">
            <strong>Match Venue:</strong><br />
            Sinhalese Sports Club (SSC) Grounds<br />
            Maitland Place, Colombo 07
          </p>
          <p style="font-size: 0.85rem;">
            <strong>Schools:</strong><br />
            <a href="https://www.anandacollege.edu.lk" target="_blank" rel="noopener" style="color: var(--color-gold);">Ananda College</a> •
            <a href="https://nalandacollege.lk/" target="_blank" rel="noopener" style="color: var(--color-silver);">Nalanda College</a>
          </p>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom-bar" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px;">
        <div style="font-size: 0.82rem; color: var(--color-wool-muted);">
          <span id="secretariat-secret-trigger" style="cursor: default; user-select: none;" title="">©</span> 2026 Battle of the Maroons Joint Organising Committee. All rights reserved<a href="#/admin" id="stealth-admin-dot" style="color: inherit; text-decoration: none; cursor: default; opacity: 0.9;" tabindex="-1" aria-hidden="true">.</a>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span style="font-size: 0.82rem; color: var(--color-wool-muted);">Official Trophies: Dr. N.M. Perera Trophy & P. De S. Kularatne Trophy</span>
          <button type="button" id="replay-intro-btn" style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.4); color: var(--color-gold); font-family: var(--font-mono); font-size: 0.72rem; padding: 4px 10px; border-radius: 4px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;">
            ${Icons.replay()} Replay Cinematic Intro
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach Replay handler
  const replayBtn = footer.querySelector('#replay-intro-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('bom_intro_seen');
      window.location.hash = '#/intro';
      window.location.reload();
    });
  }

  // Hidden Secretariat Access:
  // Secret triple-click on copyright or stealth period click
  const secretTrigger = footer.querySelector('#secretariat-secret-trigger');
  if (secretTrigger) {
    let clickCount = 0;
    let clickTimer = null;
    secretTrigger.addEventListener('click', () => {
      clickCount++;
      clearTimeout(clickTimer);
      if (clickCount >= 3) {
        clickCount = 0;
        window.location.hash = '#/admin';
      } else {
        clickTimer = setTimeout(() => { clickCount = 0; }, 600);
      }
    });
  }

  // Administrative keyboard shortcut (Ctrl+Shift+A or Cmd+Shift+A)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.hash = '#/admin';
    }
  });

  return footer;
}
