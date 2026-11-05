/**
 * BATTLE OF THE MAROONS — GLOBAL IMAGE FULL-SCREEN VIEWER
 * 
 * Automatically enables tap-to-fullscreen for all content images, Hall of Fame cards,
 * historical match photos, memories, and news imagery across the website.
 */

import { openLightbox, openSingleImage } from '../components/lightbox.js';

export function initGlobalImageFullscreen() {
  // Delegate clicks on document body
  document.addEventListener('click', handleImageClick, false);

  // Keyboard accessibility: Enter or Space on focused image containers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.matches('.hof-photo-wrap, .cherished-img-frame, .img-fullscreen-trigger'))) {
        e.preventDefault();
        activeEl.click();
      }
    }
  });
}

function handleImageClick(e) {
  // 1. Skip if click is inside the lightbox itself or admin navigation
  if (e.target.closest('#bom-lightbox-modal') || e.target.closest('.lightbox-modal')) return;
  if (e.target.closest('.site-header') || e.target.closest('.mobile-nav-drawer') || e.target.closest('.site-footer')) return;

  // 2. Check for Hall of Fame Card Click
  const hofCard = e.target.closest('.hof-card, .hof-photo-wrap');
  if (hofCard) {
    e.preventDefault();
    e.stopPropagation();
    openHallOfFameLightbox(hofCard);
    return;
  }

  // 3. Check for Cherished Moments Photo Click
  const cherishedCard = e.target.closest('.cherished-img-frame, .cherished-sub-card, .cherished-entry-card');
  if (cherishedCard) {
    const clickedImg = cherishedCard.querySelector('img');
    if (clickedImg && (e.target === clickedImg || e.target.closest('.cherished-img-frame') || e.target.tagName === 'IMG' || e.target.closest('.img-expand-pill'))) {
      e.preventDefault();
      e.stopPropagation();
      openCherishedLightbox(cherishedCard, clickedImg);
      return;
    }
  }

  // 4. Check for History Match Modal photos (Captains / Team photos)
  const historyModalImg = e.target.closest('.captain-photo-card, .history-team-photo, .team-photo-img, .captain-img');
  if (historyModalImg) {
    const img = historyModalImg.tagName === 'IMG' ? historyModalImg : historyModalImg.querySelector('img');
    if (img && img.src) {
      e.preventDefault();
      e.stopPropagation();
      const title = img.alt || 'Historic Encounter Photo';
      const caption = historyModalImg.querySelector('figcaption, .photo-caption, h4, p')?.textContent || '';
      openSingleImage(img.currentSrc || img.src, title, caption, '');
      return;
    }
  }

  // 5. Check for News / Article Reader cover photos
  const articleImg = e.target.closest('.article-reader-cover, .news-card-thumb, .news-card');
  if (articleImg) {
    // Only trigger if user clicked on or near the thumbnail/cover image
    const img = articleImg.querySelector('img');
    if (img && (e.target === img || e.target.closest('.news-card-thumb') || e.target.closest('.article-reader-cover'))) {
      e.preventDefault();
      e.stopPropagation();
      const title = img.alt || articleImg.querySelector('h3, h2, .news-card-title')?.textContent || 'Tournament News';
      const caption = articleImg.querySelector('.news-card-excerpt, p')?.textContent || '';
      openSingleImage(img.currentSrc || img.src, title, caption, '');
      return;
    }
  }

  // 6. Generic Content Image Click (e.g. Any photo inside article content or main content)
  const clickedImg = e.target.closest('img');
  if (clickedImg) {
    // Check if this image qualifies as a content photo
    if (isEligibleContentImage(clickedImg)) {
      e.preventDefault();
      e.stopPropagation();
      const title = clickedImg.alt || 'Battle of the Maroons';
      const caption = clickedImg.getAttribute('data-caption') || clickedImg.title || '';
      openSingleImage(clickedImg.currentSrc || clickedImg.src, title, caption, '');
    }
  }
}

/**
 * Collect all Hall of Fame cards in the active section and open full-screen lightbox
 */
function openHallOfFameLightbox(clickedElement) {
  const card = clickedElement.closest('.hof-card') || clickedElement;
  const grid = card.closest('.hof-cards-grid') || document;
  const allCards = Array.from(grid.querySelectorAll('.hof-card'));

  const items = allCards.map(c => {
    const img = c.querySelector('img');
    const nameEl = c.querySelector('.hof-player-name');
    const featEl = c.querySelector('.hof-player-feat');

    return {
      image: img ? (img.currentSrc || img.src) : '',
      title: nameEl ? nameEl.textContent.trim() : (img?.alt || 'Cricket Legend'),
      caption: featEl ? featEl.textContent.trim() : '',
      year: 'Cricket Hall of Fame'
    };
  }).filter(item => Boolean(item.image));

  const clickedImg = card.querySelector('img');
  const clickedSrc = clickedImg ? (clickedImg.currentSrc || clickedImg.src) : '';
  const startIndex = Math.max(0, items.findIndex(item => item.image === clickedSrc));

  if (items.length > 0) {
    openLightbox(items, startIndex);
  }
}

/**
 * Collect Cherished Moments photos in the active section and open full-screen lightbox
 */
function openCherishedLightbox(container, clickedImg) {
  const parentGrid = container.closest('.cherished-grid-3') || container.closest('.cherished-entry-card');
  const allImgs = parentGrid ? Array.from(parentGrid.querySelectorAll('.cherished-img-frame img, .cherished-sub-card img')) : [clickedImg];

  const items = allImgs.map(img => {
    const subCard = img.closest('.cherished-sub-card') || img.closest('.cherished-entry-card');
    const captionEl = subCard ? subCard.querySelector('.cherished-caption, .cherished-sub, .roster-meta-grid') : null;
    const titleEl = subCard ? subCard.querySelector('h2, h3, .cherished-header h2') : null;

    return {
      image: img.currentSrc || img.src,
      title: titleEl ? titleEl.textContent.trim() : (img.alt || 'Cherished Moment'),
      caption: captionEl ? captionEl.textContent.trim() : (img.alt || ''),
      year: 'Historic Archival Photo'
    };
  }).filter(item => Boolean(item.image));

  const targetSrc = clickedImg.currentSrc || clickedImg.src;
  const startIndex = Math.max(0, items.findIndex(item => item.image === targetSrc));

  if (items.length > 0) {
    openLightbox(items, startIndex);
  } else {
    openSingleImage(targetSrc, clickedImg.alt || 'Cherished Moment', '', '');
  }
}

/**
 * Filter out non-content images like UI icons, logos, crests, flags, and sponsors
 */
function isEligibleContentImage(img) {
  // Exclude hidden or 1x1 tracking pixels
  if (img.naturalWidth > 0 && img.naturalWidth < 40 && img.naturalHeight < 40) return false;

  // Exclude UI controls, buttons, icons
  if (img.closest('button, .nav-toggle-btn, .mobile-nav-close, .lightbox-tool-btn, .lightbox-close-btn')) return false;

  // Exclude brand crests and logos
  if (img.matches('.nav-brand-emblem-img, .site-footer-logo-img, .drawer-brand-logo-img, .school-crest-img, .pillar-crest-img, .chip-crest-img')) return false;
  const src = (img.src || '').toLowerCase();
  if (src.includes('/schools/') || src.includes('crest') || src.includes('/ui/') || src.includes('ground_plan')) return false;

  // Exclude flags
  if (img.matches('.team-tab-flag, .chip-flag-img') || src.includes('flag')) return false;

  // Exclude sponsors
  if (img.matches('.sponsor-logo-img, .partner-logo') || src.includes('/sponsors/')) return false;

  // Exclude QR codes
  if (src.includes('qr') || src.startsWith('data:image/svg') || src.startsWith('data:image/png')) return false;

  // Only match images in main content or modal bodies
  return Boolean(img.closest('#main-content, #app, .history-match-modal, .article-reader-modal'));
}
