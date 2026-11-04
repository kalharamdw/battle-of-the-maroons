/**
 * BATTLE OF THE MAROONS — PHOTO GALLERY PAGE
 * 
 * Full-screen interactive gallery categorized by Match Action, Crowd & Atmosphere,
 * Ceremonies, and Legends.
 */

import { createGalleryComponent } from '../components/gallery.js';

export function renderGalleryPage(container) {
  container.innerHTML = `
    <div class="page-hero">
      <div class="container">
        <span class="page-hero-eyebrow">Visual Chronicle</span>
        <h1 class="page-hero-title">Official Photo Gallery</h1>
        <p class="page-hero-subtitle">
          Capturing the drama on the turf, the thunder of papare drums, the pride of the crests, and generations of Anandians and Nalandians.
        </p>
      </div>
    </div>

    <section class="page-section">
      <div class="container">
        <div id="gallery-page-mount"></div>
      </div>
    </section>
  `;

  const mount = container.querySelector('#gallery-page-mount');
  if (mount) {
    mount.appendChild(createGalleryComponent());
  }
}
