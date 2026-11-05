/**
 * BATTLE OF THE MAROONS — FULL-SCREEN LIGHTBOX COMPONENT
 * 
 * Accessible, touch-enabled full-screen image lightbox with swipe gestures,
 * keyboard navigation, zoom capability, and Next/Prev controls.
 */

let activeLightboxItems = [];
let currentImageIndex = 0;
let lightboxElement = null;
let touchStartX = 0;
let touchStartY = 0;
let isZoomed = false;

export function initLightbox() {
  if (document.getElementById('bom-lightbox-modal')) {
    lightboxElement = document.getElementById('bom-lightbox-modal');
    return;
  }

  lightboxElement = document.createElement('div');
  lightboxElement.id = 'bom-lightbox-modal';
  lightboxElement.className = 'lightbox-modal';
  lightboxElement.setAttribute('role', 'dialog');
  lightboxElement.setAttribute('aria-modal', 'true');
  lightboxElement.setAttribute('aria-label', 'Full-screen image preview');

  lightboxElement.innerHTML = `
    <!-- Top Bar Controls -->
    <div class="lightbox-top-bar">
      <div class="lightbox-counter" id="lb-counter"></div>
      <div class="lightbox-actions">
        <button type="button" class="lightbox-tool-btn" id="lb-zoom-btn" title="Toggle Zoom" aria-label="Toggle zoom">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
        <button type="button" class="lightbox-close-btn" id="lb-close" title="Close (Esc)" aria-label="Close image preview">&times;</button>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button type="button" class="lightbox-nav-btn lightbox-nav-prev" id="lb-prev" title="Previous (Left Arrow)" aria-label="Previous image">&#10094;</button>
    <button type="button" class="lightbox-nav-btn lightbox-nav-next" id="lb-next" title="Next (Right Arrow)" aria-label="Next image">&#10095;</button>

    <!-- Main Content Stage -->
    <div class="lightbox-content-wrap" id="lb-content-wrap">
      <div class="lightbox-img-box" id="lb-img-box">
        <img src="" alt="" class="lightbox-img" id="lb-image" />
      </div>
      <div class="lightbox-caption-box" id="lb-caption-box">
        <h4 class="lightbox-caption-title" id="lb-title"></h4>
        <p class="lightbox-caption-text" id="lb-desc"></p>
        <span class="lightbox-hint-tag">Tap backdrop to exit full screen</span>
      </div>
    </div>
  `;

  document.body.appendChild(lightboxElement);

  // Attach controls
  const closeBtn = lightboxElement.querySelector('#lb-close');
  const prevBtn = lightboxElement.querySelector('#lb-prev');
  const nextBtn = lightboxElement.querySelector('#lb-next');
  const zoomBtn = lightboxElement.querySelector('#lb-zoom-btn');
  const imgEl = lightboxElement.querySelector('#lb-image');

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPreviousImage();
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
  });

  if (zoomBtn) {
    zoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleZoom();
    });
  }

  // Click image to toggle zoom or double click
  if (imgEl) {
    imgEl.addEventListener('click', (e) => {
      e.stopPropagation();
      // On mobile tap or desktop click, can toggle zoom
      toggleZoom();
    });
  }

  // Click outside image closes modal
  lightboxElement.addEventListener('click', (e) => {
    // If clicked on backdrop or outside the image container
    if (e.target === lightboxElement || e.target.id === 'lb-content-wrap') {
      closeLightbox();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxElement || !lightboxElement.classList.contains('active')) return;
    if (e.key === 'Escape') {
      e.stopPropagation();
      e.preventDefault();
      closeLightbox();
    }
    if (e.key === 'ArrowLeft') showPreviousImage();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'z' || e.key === 'Z') toggleZoom();
  });

  // Touch Swipe gestures for Mobile
  lightboxElement.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  lightboxElement.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;
    if (e.changedTouches && e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Ensure horizontal swipe is dominant and exceeds threshold (45px)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
        if (diffX < 0) {
          // Swiped Left -> Next image
          showNextImage();
        } else {
          // Swiped Right -> Previous image
          showPreviousImage();
        }
      } else if (diffY > 80 && Math.abs(diffX) < 50) {
        // Swipe Down -> dismiss modal
        closeLightbox();
      }
    }
    touchStartX = 0;
    touchStartY = 0;
  }, { passive: true });
}

export function openLightbox(items, startIndex = 0) {
  if (!items || items.length === 0) return;
  activeLightboxItems = items;
  currentImageIndex = Math.max(0, Math.min(startIndex, items.length - 1));
  initLightbox();
  resetZoom();
  updateLightboxView();
  lightboxElement.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function openSingleImage(src, title = '', caption = '', year = '') {
  if (!src) return;
  openLightbox([{
    image: src,
    title: title,
    caption: caption,
    year: year
  }], 0);
}

export function closeLightbox() {
  if (lightboxElement) {
    lightboxElement.classList.remove('active');
    resetZoom();
    const activeModal = document.querySelector('.history-match-modal.active, .article-reader-modal.active');
    if (!activeModal) {
      document.body.style.overflow = '';
    }
  }
}

function showPreviousImage() {
  if (activeLightboxItems.length <= 1) return;
  resetZoom();
  currentImageIndex = (currentImageIndex - 1 + activeLightboxItems.length) % activeLightboxItems.length;
  updateLightboxView();
}

function showNextImage() {
  if (activeLightboxItems.length <= 1) return;
  resetZoom();
  currentImageIndex = (currentImageIndex + 1) % activeLightboxItems.length;
  updateLightboxView();
}

function toggleZoom() {
  if (!lightboxElement) return;
  const img = lightboxElement.querySelector('#lb-image');
  const zoomBtn = lightboxElement.querySelector('#lb-zoom-btn');
  if (!img) return;

  isZoomed = !isZoomed;
  if (isZoomed) {
    img.classList.add('is-zoomed');
    if (zoomBtn) zoomBtn.classList.add('active');
  } else {
    img.classList.remove('is-zoomed');
    if (zoomBtn) zoomBtn.classList.remove('active');
  }
}

function resetZoom() {
  isZoomed = false;
  if (!lightboxElement) return;
  const img = lightboxElement.querySelector('#lb-image');
  const zoomBtn = lightboxElement.querySelector('#lb-zoom-btn');
  if (img) img.classList.remove('is-zoomed');
  if (zoomBtn) zoomBtn.classList.remove('active');
}

function updateLightboxView() {
  if (!lightboxElement || activeLightboxItems.length === 0) return;
  const currentItem = activeLightboxItems[currentImageIndex];

  const img = lightboxElement.querySelector('#lb-image');
  const title = lightboxElement.querySelector('#lb-title');
  const desc = lightboxElement.querySelector('#lb-desc');
  const counter = lightboxElement.querySelector('#lb-counter');
  const prevBtn = lightboxElement.querySelector('#lb-prev');
  const nextBtn = lightboxElement.querySelector('#lb-next');

  const imgSrc = currentItem.image || currentItem.imageUrl || currentItem.src || '/assets/images/gallery/crowd_atmosphere_1.jpg';
  img.src = imgSrc;
  img.alt = currentItem.title || 'Battle of the Maroons Official Photo';
  img.onerror = function() {
    this.onerror = null;
    this.src = '/assets/images/gallery/crowd_atmosphere_1.jpg';
  };

  if (currentItem.title) {
    title.textContent = currentItem.title;
    title.style.display = 'block';
  } else {
    title.style.display = 'none';
  }

  const captionText = currentItem.caption || currentItem.feat || currentItem.location || '';
  if (captionText) {
    desc.textContent = captionText;
    desc.style.display = 'block';
  } else {
    desc.style.display = 'none';
  }

  // Handle single item vs playlist controls
  if (activeLightboxItems.length > 1) {
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
    if (counter) {
      counter.style.display = 'inline-block';
      const yearPart = currentItem.year ? ` • ${currentItem.year}` : '';
      counter.textContent = `${currentImageIndex + 1} / ${activeLightboxItems.length}${yearPart}`;
    }
  } else {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (counter) {
      if (currentItem.year) {
        counter.style.display = 'inline-block';
        counter.textContent = currentItem.year;
      } else {
        counter.style.display = 'none';
      }
    }
  }
}
