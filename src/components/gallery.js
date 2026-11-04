/**
 * BATTLE OF THE MAROONS — GALLERY COMPONENT
 * 
 * Interactive filtered photo grid connected to the full-screen lightbox.
 */

import { galleryItems } from '../data/gallery.js';
import { openLightbox } from './lightbox.js';
import { api } from '../services/api.js';
import { refreshScrollAnimations } from '../utils/scroll-animations.js';

/**
 * Sorts gallery photos chronologically with recent activities at the top
 * and older/archival items at the bottom.
 */
export function sortGalleryByRecent(list) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const getYearWeight = (item) => {
      if (!item) return 0;
      const str = String(item.year || '');
      const match = str.match(/\d{4}/);
      if (match) return parseInt(match[0], 10);
      
      const titleMatch = (item.title || '').match(/\d{4}/);
      if (titleMatch) return parseInt(titleMatch[0], 10);
      const captionMatch = (item.caption || '').match(/\d{4}/);
      if (captionMatch) return parseInt(captionMatch[0], 10);

      if (/archival|vintage|historic|heritage/i.test(str)) return 1900;
      return 0;
    };

    const yA = getYearWeight(a);
    const yB = getYearWeight(b);
    if (yB !== yA) return yB - yA;

    const tA = a.createdAt ? new Date(a.createdAt).getTime() : (a.updatedAt ? new Date(a.updatedAt).getTime() : 0);
    const tB = b.createdAt ? new Date(b.createdAt).getTime() : (b.updatedAt ? new Date(b.updatedAt).getTime() : 0);
    if (tB !== tA) return tB - tA;

    return 0;
  });
}

export function createGalleryComponent(customItems = null) {
  let items = sortGalleryByRecent(normalizeGalleryItems(customItems || galleryItems));
  const wrapper = document.createElement('div');
  wrapper.className = 'gallery-component-root';

  let currentCategory = 'all';

  function normalizeGalleryItems(list) {
    if (!Array.isArray(list)) return [];
    const normalized = list.filter(i => i.isActive !== false).map((item, idx) => {
      const staticMatch = galleryItems.find(g => g.id === item.id || g.title === item.title) || galleryItems[idx % galleryItems.length] || {};
      const image = item.image || item.imageUrl || item.src || staticMatch.image || '/assets/images/gallery/crowd_atmosphere_1.jpg';
      const categoryLabel = item.categoryLabel || staticMatch.categoryLabel || (
        item.category === 'atmosphere' ? 'Crowd & Atmosphere' :
        item.category === 'ceremonies' ? 'Ceremonies' :
        item.category === 'legends' ? 'Legends & Heritage' : 'Match Action'
      );
      const year = item.year || staticMatch.year || '2025';
      return {
        ...staticMatch,
        ...item,
        image,
        imageUrl: image,
        categoryLabel,
        year
      };
    });
    return sortGalleryByRecent(normalized);
  }

  // If no custom items explicitly passed, fetch dynamically from MongoDB / API
  if (!customItems) {
    api.getGallery().then(liveItems => {
      if (Array.isArray(liveItems) && liveItems.length > 0) {
        items = normalizeGalleryItems(liveItems);
        render();
      }
    }).catch(() => {});

    window.addEventListener('bom-gallery-updated', (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        items = normalizeGalleryItems(e.detail);
        render();
      } else {
        api.getGallery().then(liveItems => {
          if (Array.isArray(liveItems)) {
            items = normalizeGalleryItems(liveItems);
            render();
          }
        });
      }
    });
  }

  const filterCategories = [
    { id: 'all', label: 'All Photographs' },
    { id: 'matches', label: 'Match Action' },
    { id: 'atmosphere', label: 'Crowd & Carnival' },
    { id: 'ceremonies', label: 'Ceremonies' },
    { id: 'legends', label: 'Legends & Heritage' }
  ];

  function render() {
    const filtered = currentCategory === 'all'
      ? items
      : items.filter(item => item.category === currentCategory);

    wrapper.innerHTML = `
      <!-- Category Filter Tabs -->
      <div class="gallery-filter-bar">
        ${filterCategories.map(cat => `
          <button 
            type="button" 
            class="gallery-filter-btn ${cat.id === currentCategory ? 'active' : ''}" 
            data-cat="${cat.id}"
          >
            ${cat.label}
          </button>
        `).join('')}
      </div>

      <!-- Image Grid -->
      <div class="gallery-grid">
        ${filtered.map((item, idx) => {
          const imgSrc = item.image || item.imageUrl || item.src || '/assets/images/gallery/crowd_atmosphere_1.jpg';
          const catLabel = item.categoryLabel || (item.category ? item.category.toUpperCase() : 'MATCH ACTION');
          const itemYear = item.year || '2025';
          return `
          <div class="gallery-card" data-index="${idx}" tabindex="0" role="button" aria-label="View photo: ${item.title || 'Photo'}">
            <img src="${imgSrc}" alt="${item.title || 'Battle of the Maroons'}" loading="lazy" onerror="this.onerror=null; this.src='/assets/images/gallery/crowd_atmosphere_1.jpg';" />
            <div class="gallery-card-overlay">
              <span class="gallery-item-cat">${catLabel} • ${itemYear}</span>
              <h4 class="gallery-item-title">${item.title || 'Battle of the Maroons'}</h4>
            </div>
          </div>
        `;}).join('')}
      </div>
    `;

    // Filter clicks
    wrapper.querySelectorAll('.gallery-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.getAttribute('data-cat');
        render();
      });
    });

    // Lightbox clicks
    wrapper.querySelectorAll('.gallery-card').forEach((card, idx) => {
      const openCurrent = () => openLightbox(filtered, idx);
      card.addEventListener('click', openCurrent);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCurrent();
        }
      });
    });

    refreshScrollAnimations(wrapper);
  }

  render();
  return wrapper;
}
