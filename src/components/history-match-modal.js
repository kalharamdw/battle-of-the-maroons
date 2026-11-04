/**
 * BATTLE OF THE MAROONS — HISTORIC ENCOUNTER ARCHIVE MODAL
 * 
 * Shows full match archives including rival captains, team squad photographs,
 * official rosters, and match summary for every encounter from 1924 to present.
 */

import { openLightbox } from './lightbox.js';
import { Icons } from './icons.js';

let modalElement = null;

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatRosterHtml(rosterText) {
  if (!rosterText || !rosterText.trim()) {
    return '<p class="match-modal-roster-empty">Official player roster not archived for this encounter.</p>';
  }

  const lines = rosterText
    .replace(/\r\n/g, '\n')
    .replace(/\t+/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  let html = '';
  let inGroup = false;

  for (const line of lines) {
    const isHeader = /^(seated|standing|absent|reserves?|officials?|row\s*\d|1st\s*row|2nd\s*row)/i.test(line);
    if (isHeader) {
      if (inGroup) html += '</div>';
      html += `
        <div class="roster-group">
          <div class="roster-group-title">
            <span class="roster-bullet">${Icons.sparkle()}</span> ${escapeHtml(line)}
          </div>
      `;
      inGroup = true;
    } else {
      if (!inGroup) {
        html += `<div class="roster-group">`;
        inGroup = true;
      }
      html += `<p class="roster-group-names">${escapeHtml(line)}</p>`;
    }
  }

  if (inGroup) html += '</div>';
  return html;
}

export function initHistoryMatchModal() {
  if (document.getElementById('history-match-modal')) {
    modalElement = document.getElementById('history-match-modal');
    return modalElement;
  }

  modalElement = document.createElement('div');
  modalElement.id = 'history-match-modal';
  modalElement.className = 'history-match-modal';
  modalElement.setAttribute('role', 'dialog');
  modalElement.setAttribute('aria-modal', 'true');
  modalElement.setAttribute('aria-label', 'Historic Match Archive');

  modalElement.innerHTML = `
    <div class="history-match-dialog" id="history-match-dialog">
      <!-- Dynamic content will be injected here -->
    </div>
  `;

  document.body.appendChild(modalElement);

  // Click outside dialog to close
  modalElement.addEventListener('click', (e) => {
    if (e.target === modalElement) {
      closeHistoryMatchModal();
    }
  });

  // ESC key to close
  window.addEventListener('keydown', (e) => {
    if (!modalElement || !modalElement.classList.contains('active')) return;
    // If the full-screen lightbox is active on top, let the lightbox close first
    const activeLb = document.querySelector('.lightbox-modal.active');
    if (activeLb) return;

    if (e.key === 'Escape') {
      closeHistoryMatchModal();
    }
  });

  return modalElement;
}

export function openHistoryMatchModal(encounter) {
  if (!modalElement) {
    initHistoryMatchModal();
  }

  const dialog = modalElement.querySelector('#history-match-dialog');
  if (!dialog) return;

  // Build lightbox items for all available photos in this encounter
  const lightboxItems = [];
  if (encounter.anandaCaptainImg) {
    lightboxItems.push({
      image: encounter.anandaCaptainImg,
      title: `${encounter.anandaCapt} — Ananda College Captain`,
      caption: `${encounter.match} Battle of the Maroons (${encounter.year}) • Ananda Captain's Portrait`,
      year: encounter.year
    });
  }
  if (encounter.nalandaCaptainImg) {
    lightboxItems.push({
      image: encounter.nalandaCaptainImg,
      title: `${encounter.nalandaCapt} — Nalanda College Captain`,
      caption: `${encounter.match} Battle of the Maroons (${encounter.year}) • Nalanda Captain's Portrait`,
      year: encounter.year
    });
  }
  if (encounter.anandaTeamImg) {
    lightboxItems.push({
      image: encounter.anandaTeamImg,
      title: `Ananda College Team Photograph (${encounter.year})`,
      caption: `${encounter.match} Battle of the Maroons • Ananda XI Squad & Officials`,
      year: encounter.year
    });
  }
  if (encounter.nalandaTeamImg) {
    lightboxItems.push({
      image: encounter.nalandaTeamImg,
      title: `Nalanda College Team Photograph (${encounter.year})`,
      caption: `${encounter.match} Battle of the Maroons • Nalanda XI Squad & Officials`,
      year: encounter.year
    });
  }

  // Result styling
  let resultBadgeClass = 'result-draw';
  let resultIcon = Icons.handshake();
  const lowerRes = (encounter.result || '').toLowerCase();
  if (lowerRes.includes('ananda won')) {
    resultBadgeClass = 'result-ananda';
    resultIcon = Icons.trophy();
  } else if (lowerRes.includes('nalanda won')) {
    resultBadgeClass = 'result-nalanda';
    resultIcon = Icons.trophy();
  }

  dialog.innerHTML = `
    <!-- Topbar Controls -->
    <div class="match-modal-header">
      <div class="match-modal-badge-group">
        <span class="mono-tag" style="color: var(--color-gold);">
          ${escapeHtml(encounter.match)} Battle of the Maroons
        </span>
        <span class="match-modal-result-pill ${resultBadgeClass}">
          ${resultIcon} ${escapeHtml(encounter.result)}
        </span>
      </div>
      <button type="button" class="match-modal-close-btn" id="modal-close-x" aria-label="Close modal">
        <span>Close</span>
        <span class="close-x">&times;</span>
      </button>
    </div>

    <!-- Match Title & Metadata -->
    <div class="match-modal-hero">
      <h2 class="match-modal-title">
        ${escapeHtml(encounter.title || `${encounter.match} Battle of the Maroons (${encounter.year})`)}
      </h2>
      <div class="match-modal-meta-grid">
        <div class="meta-item">
          <span class="meta-label">${Icons.calendar('gold-accent')} Year / Date</span>
          <span class="meta-val">${escapeHtml(encounter.date || encounter.year)}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">${Icons.mapPin('gold-accent')} Venue</span>
          <span class="meta-val">${escapeHtml(encounter.venue || 'Colombo, Sri Lanka')}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">${Icons.bolt('gold-accent')} Match Format</span>
          <span class="meta-val">${escapeHtml(encounter.format || 'Traditional 2-Day')}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">${Icons.trophy('gold-accent')} Result Verdict</span>
          <span class="meta-val" style="color: var(--color-gold);">${escapeHtml(encounter.result)}</span>
        </div>
      </div>
    </div>

    <!-- The Rival Captains Duel -->
    <div class="match-modal-section">
      <div class="match-modal-section-title">
        <span class="section-gold-line"></span>
        <h3>The Rival Captains</h3>
        <span class="section-gold-line"></span>
      </div>

      <div class="captains-duel-container">
        <!-- Ananda Captain -->
        <div class="captain-duel-card ananda-card">
          <div class="captain-portrait-frame ${encounter.anandaCaptainImg ? 'has-img' : 'no-img'}" 
               data-lb-src="${encounter.anandaCaptainImg || ''}">
            ${encounter.anandaCaptainImg ? `
              <img src="${encounter.anandaCaptainImg}" alt="${escapeHtml(encounter.anandaCapt)}" class="captain-img" />
              <div class="captain-img-zoom-hint">${Icons.search()} Expand</div>
            ` : `
              <div class="captain-fallback-avatar">
                <span class="crest-icon">${Icons.shield()}</span>
                <span class="crest-sub">Ananda</span>
              </div>
            `}
          </div>
          <div class="captain-info">
            <span class="captain-school-pill ananda-pill">Ananda College</span>
            <h4 class="captain-name">${escapeHtml(encounter.anandaCapt)}</h4>
            <span class="captain-role">Captain (${encounter.year})</span>
          </div>
        </div>

        <!-- Center VS Emblem -->
        <div class="captains-vs-emblem">
          <div class="vs-circle">VS</div>
          <span class="vs-year">${encounter.year}</span>
        </div>

        <!-- Nalanda Captain -->
        <div class="captain-duel-card nalanda-card">
          <div class="captain-portrait-frame ${encounter.nalandaCaptainImg ? 'has-img' : 'no-img'}"
               data-lb-src="${encounter.nalandaCaptainImg || ''}">
            ${encounter.nalandaCaptainImg ? `
              <img src="${encounter.nalandaCaptainImg}" alt="${escapeHtml(encounter.nalandaCapt)}" class="captain-img" />
              <div class="captain-img-zoom-hint">${Icons.search()} Expand</div>
            ` : `
              <div class="captain-fallback-avatar">
                <span class="crest-icon">${Icons.shield()}</span>
                <span class="crest-sub">Nalanda</span>
              </div>
            `}
          </div>
          <div class="captain-info">
            <span class="captain-school-pill nalanda-pill">Nalanda College</span>
            <h4 class="captain-name">${escapeHtml(encounter.nalandaCapt)}</h4>
            <span class="captain-role">Captain (${encounter.year})</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Squad Photographs & Rosters -->
    <div class="match-modal-section">
      <div class="match-modal-section-title">
        <span class="section-gold-line"></span>
        <h3>Team Squads & Official Rosters</h3>
        <span class="section-gold-line"></span>
      </div>

      <div class="match-teams-grid">
        <!-- Ananda College Team -->
        <div class="match-team-card ananda-team-card">
          <div class="team-card-header ananda-header">
            <div class="team-header-identity">
              <span class="team-badge-circle ananda-circle">A</span>
              <div>
                <h4 class="team-card-name">Ananda College Team</h4>
                <span class="team-card-sub">The Maroons XI & Support Staff • ${encounter.year}</span>
              </div>
            </div>
            ${encounter.anandaTeamImg ? `<span class="photo-available-tag">${Icons.camera()} Photo Archived</span>` : ''}
          </div>

          <div class="team-photo-container ${encounter.anandaTeamImg ? 'clickable' : ''}" 
               data-lb-src="${encounter.anandaTeamImg || ''}">
            ${encounter.anandaTeamImg ? `
              <img src="${encounter.anandaTeamImg}" alt="Ananda College Team ${encounter.year}" class="team-photo-img" />
              <div class="team-photo-overlay">
                <span class="overlay-zoom-btn">${Icons.search()} View High-Resolution Fullscreen</span>
              </div>
            ` : `
              <div class="team-photo-placeholder">
                <span class="placeholder-icon">${Icons.camera()}</span>
                <p>Team squad photograph not recorded in digital archive for ${encounter.year}.</p>
              </div>
            `}
          </div>

          <div class="team-roster-content">
            <h5 class="roster-heading">Official Squad Roster:</h5>
            ${formatRosterHtml(encounter.anandaPlayers)}
          </div>
        </div>

        <!-- Nalanda College Team -->
        <div class="match-team-card nalanda-team-card">
          <div class="team-card-header nalanda-header">
            <div class="team-header-identity">
              <span class="team-badge-circle nalanda-circle">N</span>
              <div>
                <h4 class="team-card-name">Nalanda College Team</h4>
                <span class="team-card-sub">The Silver & Maroon XI & Support Staff • ${encounter.year}</span>
              </div>
            </div>
            ${encounter.nalandaTeamImg ? `<span class="photo-available-tag">${Icons.camera()} Photo Archived</span>` : ''}
          </div>

          <div class="team-photo-container ${encounter.nalandaTeamImg ? 'clickable' : ''}"
               data-lb-src="${encounter.nalandaTeamImg || ''}">
            ${encounter.nalandaTeamImg ? `
              <img src="${encounter.nalandaTeamImg}" alt="Nalanda College Team ${encounter.year}" class="team-photo-img" />
              <div class="team-photo-overlay">
                <span class="overlay-zoom-btn">${Icons.search()} View High-Resolution Fullscreen</span>
              </div>
            ` : `
              <div class="team-photo-placeholder">
                <span class="placeholder-icon">${Icons.camera()}</span>
                <p>Team squad photograph not recorded in digital archive for ${encounter.year}.</p>
              </div>
            `}
          </div>

          <div class="team-roster-content">
            <h5 class="roster-heading">Official Squad Roster:</h5>
            ${formatRosterHtml(encounter.nalandaPlayers)}
          </div>
        </div>
      </div>
    </div>

    <!-- Match Highlights / Archival Details -->
    ${encounter.details ? `
      <div class="match-modal-section" style="margin-top: 32px;">
        <div class="match-modal-section-title">
          <span class="section-gold-line"></span>
          <h3>Encounter Annals & Highlights</h3>
          <span class="section-gold-line"></span>
        </div>
        <div class="match-highlights-box">
          <p class="highlights-text">${escapeHtml(encounter.details)}</p>
        </div>
      </div>
    ` : ''}

    <!-- Bottom Action Footer -->
    <div class="match-modal-footer">
      <div class="archive-citation-note" style="display: flex; align-items: center; gap: 8px;">
        <span>${Icons.stadium()} Official Archival Record — Battle of the Maroons Joint Committee</span>
      </div>
      <button type="button" class="btn-primary-cinematic" id="modal-bottom-close-btn" style="padding: 10px 24px; font-size: 0.9rem;">
        Done / Return to History
      </button>
    </div>
  `;

  // Hook up Lightbox triggers on any photo clicked inside the modal
  dialog.querySelectorAll('[data-lb-src]').forEach(container => {
    const src = container.getAttribute('data-lb-src');
    if (!src) return;

    container.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = lightboxItems.findIndex(item => item.image === src);
      if (idx !== -1) {
        openLightbox(lightboxItems, idx);
      } else {
        openLightbox([{
          image: src,
          title: `Archival Squad Photograph (${encounter.year})`,
          caption: `${encounter.match} Battle of the Maroons (${encounter.year})`,
          year: encounter.year
        }], 0);
      }
    });
  });

  // Hook up close buttons
  const closeBtn = dialog.querySelector('#modal-close-x');
  const bottomCloseBtn = dialog.querySelector('#modal-bottom-close-btn');

  if (closeBtn) closeBtn.addEventListener('click', closeHistoryMatchModal);
  if (bottomCloseBtn) bottomCloseBtn.addEventListener('click', closeHistoryMatchModal);

  // Activate modal
  modalElement.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeHistoryMatchModal() {
  if (modalElement) {
    modalElement.classList.remove('active');
    document.body.style.overflow = '';
  }
}
