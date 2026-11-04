/**
 * BATTLE OF THE MAROONS — STANDALONE ARTICLE READER MODAL
 * 
 * Appends directly to document.body so that fixed positioning is 100%
 * guaranteed against the browser viewport and never trapped by router transforms.
 */
import { Icons } from './icons.js';

function formatArticleContent(content, summary) {
  const raw = String(content || summary || '').trim();
  if (!raw) {
    return '<p>No further details available for this official bulletin.</p>';
  }
  // If it already contains HTML paragraph or block tags, return as HTML
  if (raw.includes('<p>') || raw.includes('<div>') || raw.includes('<ul>') || raw.includes('<br>')) {
    return raw;
  }
  // Format plain text with paragraphs
  const paragraphs = raw.split(/\n\s*\n|\n/);
  return paragraphs
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p>${p}</p>`)
    .join('');
}

export function getOrCreateModal() {
  let modal = document.getElementById('article-reader-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'article-reader-modal';
    modal.className = 'article-reader-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Full Article View');
    document.body.appendChild(modal);
  }

  // Ensure full dialog markup exists inside modal
  let dialog = modal.querySelector('#article-reader-dialog');
  if (!dialog) {
    modal.innerHTML = `
      <div class="article-reader-dialog" id="article-reader-dialog">
        <div class="article-reader-topbar">
          <div class="article-reader-badge-wrap">
            <span class="article-reader-cat-tag" id="modal-article-cat">Announcements</span>
            <span class="article-reader-verified">Verified Dispatch</span>
          </div>
          <button type="button" class="article-reader-close-btn" id="modal-close-article-btn" aria-label="Close article">
            <span>Close</span>
            <span style="font-size: 1.3rem; line-height: 1;">&times;</span>
          </button>
        </div>
        <div class="article-reader-content" id="article-modal-body">
          <!-- Injected dynamically -->
        </div>
      </div>
    `;

    // Backdrop click close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeArticleReader();
      }
    });

    const closeBtn = modal.querySelector('#modal-close-article-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeArticleReader();
      });
    }
  }

  return modal;
}

export function openArticleReader(article) {
  if (!article) return;
  const modal = getOrCreateModal();
  const modalBody = modal.querySelector('#article-modal-body');
  const catTag = modal.querySelector('#modal-article-cat');

  if (catTag) {
    catTag.textContent = article.category || 'PRESS BULLETIN';
  }

  const imageSrc = article.image || article.coverImage || '/assets/images/news/maroons_salutation_2025.jpeg';
  const formattedBody = formatArticleContent(article.content, article.summary || article.excerpt);

  if (modalBody) {
    modalBody.innerHTML = `
      <h1 class="article-reader-title" id="modal-article-title">${article.title || 'Official Announcement'}</h1>
      
      <div class="article-reader-meta-row">
        <span class="article-reader-meta-item" style="display: inline-flex; align-items: center; gap: 6px;">
          ${Icons.calendar('gold-accent')} <strong>${article.date || 'Recent'}</strong>
        </span>
        <span class="article-reader-meta-item" style="display: inline-flex; align-items: center; gap: 6px;">
          ${Icons.edit('gold-accent')} By <strong>${article.author || 'Joint Organising Committee'}</strong>
        </span>
        <span class="article-reader-meta-item" style="color: var(--color-gold); display: inline-flex; align-items: center; gap: 6px;">
          ${Icons.cricket('gold-accent')} Battle of the Maroons
        </span>
      </div>

      <div class="article-reader-cover-wrap">
        <img src="${imageSrc}" alt="${article.title || 'Article Cover'}" class="article-reader-cover-img" onerror="this.onerror=null; this.src='/assets/images/news/maroons_salutation_2025.jpeg';" />
      </div>

      ${(article.summary || article.excerpt) ? `
        <div class="article-reader-lead-summary">
          ${article.summary || article.excerpt}
        </div>
      ` : ''}

      <div class="article-reader-body-text">
        ${formattedBody}
      </div>

      <div class="article-reader-footer-actions">
        <button type="button" class="btn-secondary-cinematic" id="modal-bottom-close-btn">
          &larr; Back to All Bulletins
        </button>
        <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--color-wool-subtle);">
          Battle of the Maroons • Ananda vs Nalanda Official Press
        </span>
      </div>
    `;

    const bottomClose = modalBody.querySelector('#modal-bottom-close-btn');
    if (bottomClose) {
      bottomClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeArticleReader();
      });
    }
  }

  // Display modal with robust inline enforcement
  modal.style.display = 'flex';
  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  modal.style.zIndex = '2147483647';
  modal.classList.add('active');
  modal.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

export function closeArticleReader() {
  const modal = document.getElementById('article-reader-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
  document.body.style.overflow = '';
  if (window.location.hash.includes('article=')) {
    history.replaceState(null, '', '#/news');
  }
}

// Global Escape listener
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('article-reader-modal');
    if (modal && (modal.classList.contains('active') || modal.style.display === 'flex')) {
      closeArticleReader();
    }
  }
});

// Expose globally so inline onclick or external callers never fail
if (typeof window !== 'undefined') {
  window.openArticleReader = openArticleReader;
  window.closeArticleReader = closeArticleReader;
}
