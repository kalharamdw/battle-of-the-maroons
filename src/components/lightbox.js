/**
 * BATTLE OF THE MAROONS — FULL-SCREEN LIGHTBOX COMPONENT
 * 
 * Accessible, keyboard-friendly image lightbox with Next/Prev navigation.
 */

let activeLightboxItems = [];
let currentImageIndex = 0;
let lightboxElement = null;

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
  lightboxElement.setAttribute('aria-label', 'Image preview');

  lightboxElement.innerHTML = `
    <button type="button" class="lightbox-close-btn" id="lb-close" aria-label="Close image preview">&times;</button>
    <button type="button" class="lightbox-nav-btn lightbox-nav-prev" id="lb-prev" aria-label="Previous image">&#10094;</button>
    <button type="button" class="lightbox-nav-btn lightbox-nav-next" id="lb-next" aria-label="Next image">&#10095;</button>

    <div class="lightbox-content-wrap">
      <img src="" alt="" class="lightbox-img" id="lb-image" />
      <div class="lightbox-caption-box">
        <h4 class="lightbox-caption-title" id="lb-title"></h4>
        <p class="lightbox-caption-text" id="lb-desc"></p>
        <div class="lightbox-counter" id="lb-counter"></div>
      </div>
    </div>
  `;

  document.body.appendChild(lightboxElement);

  // Attach controls
  const closeBtn = lightboxElement.querySelector('#lb-close');
  const prevBtn = lightboxElement.querySelector('#lb-prev');
  const nextBtn = lightboxElement.querySelector('#lb-next');

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPreviousImage);
  nextBtn.addEventListener('click', showNextImage);

  // Click outside image closes modal
  lightboxElement.addEventListener('click', (e) => {
    if (e.target === lightboxElement) {
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
  });
}

export function openLightbox(items, startIndex = 0) {
  activeLightboxItems = items;
  currentImageIndex = startIndex;
  initLightbox();
  updateLightboxView();
  lightboxElement.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeLightbox() {
  if (lightboxElement) {
    lightboxElement.classList.remove('active');
    const activeModal = document.querySelector('.history-match-modal.active, .article-reader-modal.active');
    if (!activeModal) {
      document.body.style.overflow = '';
    }
  }
}

function showPreviousImage() {
  if (activeLightboxItems.length === 0) return;
  currentImageIndex = (currentImageIndex - 1 + activeLightboxItems.length) % activeLightboxItems.length;
  updateLightboxView();
}

function showNextImage() {
  if (activeLightboxItems.length === 0) return;
  currentImageIndex = (currentImageIndex + 1) % activeLightboxItems.length;
  updateLightboxView();
}

function updateLightboxView() {
  if (!lightboxElement || activeLightboxItems.length === 0) return;
  const currentItem = activeLightboxItems[currentImageIndex];

  const img = lightboxElement.querySelector('#lb-image');
  const title = lightboxElement.querySelector('#lb-title');
  const desc = lightboxElement.querySelector('#lb-desc');
  const counter = lightboxElement.querySelector('#lb-counter');

  const imgSrc = currentItem.image || currentItem.imageUrl || currentItem.src || '/assets/images/gallery/crowd_atmosphere_1.jpg';
  img.src = imgSrc;
  img.alt = currentItem.title || 'Battle of the Maroons Photo';
  img.onerror = function() {
    this.onerror = null;
    this.src = '/assets/images/gallery/crowd_atmosphere_1.jpg';
  };
  title.textContent = currentItem.title || '';
  desc.textContent = currentItem.caption || currentItem.location || '';
  counter.textContent = `${currentImageIndex + 1} of ${activeLightboxItems.length} (${currentItem.year || ''})`;
}
