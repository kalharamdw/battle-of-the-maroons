/**
 * BATTLE OF THE MAROONS — 100+ YEARS CRICKET HERITAGE SECTION
 * 
 * 3D Spherical Video Objects & Archival Cricket Museum Experience
 * Preserves all historical facts, headings, captions, quotes, and school identities
 * while transforming the section into a world-class cinematic 3D tribute.
 */

import { heritageVideosConfig } from '../data/videos.config.js';
import { Icons } from './icons.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Creates the complete HTML and interactivity for the Heritage Spheres section
 */
export function createHeritageSpheresSection(sceneConfig) {
  const container = document.createElement('div');
  container.className = 'heritage-museum-experience';
  container.id = 'heritage-museum-experience';

  const sphereItems = [
    heritageVideosConfig.heritageVideo1,
    heritageVideosConfig.heritageVideo2,
    heritageVideosConfig.heritageVideo3
  ];

  container.innerHTML = `
    <!-- Atmospheric Museum Canvas & Lighting -->
    <div class="heritage-atmosphere">
      <div class="heritage-spotlight spotlight-left"></div>
      <div class="heritage-spotlight spotlight-center"></div>
      <div class="heritage-spotlight spotlight-right"></div>
      <div class="heritage-vintage-dust"></div>
    </div>

    <!-- Section Header & Preserved Historical Text -->
    <div class="heritage-editorial-header">
      <div class="heritage-badge-row">
        <span class="heritage-century-pill">
          <span class="pill-spark">${Icons.cricket()}</span>
          <span>${sceneConfig.sceneNumber || '04'} • ${sceneConfig.tagline || 'INCEPTION 1924'}</span>
        </span>
        <span class="heritage-centenary-tag">A CENTURY OF BROTHERHOOD & PASSION</span>
      </div>

      <h2 class="heritage-main-title">
        ${sceneConfig.title || 'OVER 100 YEARS OF CRICKETING HERITAGE'}
      </h2>

      <p class="heritage-sub-heading">
        ${sceneConfig.subheading || 'From Dr. N.M. Perera and P. de S. Kularatne to Modern Era Titans'}
      </p>

      <!-- Preserved Historical Stepped Captions -->
      <div class="heritage-stepped-ribbon">
        ${(sceneConfig.steppedCaptions || [
          "First played in 1924 on the grounds of Colombo.",
          "Cradle of Sri Lankan test and world cricket.",
          "Where leaders, champions, and legends are forged."
        ]).map((caption, i) => `
          <div class="heritage-ribbon-item">
            <span class="ribbon-marker">0${i + 1}</span>
            <span class="ribbon-text">${caption}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- The Three 3D Archival Video Spheres Stage -->
    <div class="heritage-spheres-stage" aria-label="Historical Cricket Spheres">
      <div class="heritage-spheres-grid">
        ${sphereItems.map((item, idx) => `
          <div class="heritage-sphere-wrapper" data-sphere-idx="${idx}" data-sphere-id="${item.id}">
            <!-- 3D Orb Structure -->
            <div class="heritage-3d-orb" tabindex="0" role="button" aria-label="Play historical video: ${item.title}">
              
              <!-- Video / Media Layer with Black & White Vintage Filter -->
              <div class="orb-media-layer">
                <img 
                  src="${item.posterSrc}" 
                  alt="${item.title} - Archival Photo" 
                  class="orb-poster"
                  loading="lazy"
                />
                <video 
                  class="orb-video"
                  src="${item.videoSrc}?t=bom_v2"
                  data-src="${item.videoSrc}?t=bom_v2"
                  loop
                  muted
                  playsinline
                  webkit-playsinline
                  preload="metadata"
                ></video>
              </div>

              <!-- Archival Vintage Film Grain & Vignette Overlay -->
              <div class="orb-film-grain"></div>

              <!-- Internal Concave Depth & Spherical Volumetric Shadow -->
              <div class="orb-inner-volume"></div>

              <!-- Chapter Specific School Identity Rim Glow -->
              <div class="orb-rim-glow orb-rim-${item.id}"></div>

              <!-- Optical Curved Glass Specular Reflections -->
              <div class="orb-specular-crescent"></div>
              <div class="orb-bounce-light"></div>
              
              <!-- Dynamic Mouse-Tracking Glare -->
              <div class="orb-dynamic-glare"></div>

              <!-- Sphere On-Glass HUD Overlay -->
              <div class="orb-glass-hud">
                <span class="orb-chapter-tag">${item.chapter.split('•')[0].trim()}</span>
                <div class="orb-controls-badge">
                  <button type="button" class="orb-play-btn" aria-label="Toggle playback for ${item.title}">
                    <span class="play-icon">▶</span>
                  </button>
                  <button type="button" class="orb-expand-btn" title="Expand to Theater View" aria-label="Open Theater View">
                    <span>⤢</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Soft Floating Contact Shadow on Floor Plane -->
            <div class="sphere-ground-shadow"></div>

            <!-- Archival Caption Card Below Sphere -->
            <div class="sphere-caption-card">
              <div class="sphere-era-pill">
                <span class="era-dot" style="background: ${item.accentColor};"></span>
                <span>${item.era}</span>
              </div>
              <h3 class="sphere-chapter-title">${item.title}</h3>
              <div class="sphere-chapter-subtitle">${item.subtitle}</div>
              <p class="sphere-chapter-desc">${item.description}</p>
              <div class="sphere-stat-pill">
                <span class="stat-icon" style="display: flex; align-items: center;">${Icons.star('fill-gold', 12)}</span>
                <span>${item.stat}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Preserved Historical Inauguration Quote Card & Founders Tribute -->
    <div class="heritage-inaugural-footer">
      <div class="legacy-quote-card">
        <div class="legacy-year-badge">1924 • INAUGURATION</div>
        <p class="legacy-quote-text">
          "Initiated between the two brotherly schools with the aim of building relations between students of the two institutions and developing their cricket in the sporting arena."
        </p>
        <div class="legacy-author">— The Founders of the Battle of the Maroons</div>
        
        <!-- Historical Provenance Markers -->
        <div class="heritage-provenance-row">
          <div class="provenance-item">
            <span class="prov-num">1924</span>
            <span class="prov-lbl">Campbell Park Inaugural</span>
          </div>
          <div class="provenance-divider"></div>
          <div class="provenance-item">
            <span class="prov-num">100+</span>
            <span class="prov-lbl">Years of Brotherhood</span>
          </div>
          <div class="provenance-divider"></div>
          <div class="provenance-item">
            <span class="prov-num">55+</span>
            <span class="prov-lbl">International Stars</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize interactive 3D physics, pointer reflections, and video controls
  initSphereInteractions(container, sphereItems);

  return container;
}

/**
 * Attaches pointer tracking, 3D tilt, floating physics, video resilience, and theater modal
 */
function initSphereInteractions(container, sphereItems) {
  const wrappers = container.querySelectorAll('.heritage-sphere-wrapper');

  wrappers.forEach((wrapper, idx) => {
    const orb = wrapper.querySelector('.heritage-3d-orb');
    const glare = wrapper.querySelector('.orb-dynamic-glare');
    const shadow = wrapper.querySelector('.sphere-ground-shadow');
    const video = wrapper.querySelector('.orb-video');
    const poster = wrapper.querySelector('.orb-poster');
    const playBtn = wrapper.querySelector('.orb-play-btn');
    const expandBtn = wrapper.querySelector('.orb-expand-btn');
    const itemData = sphereItems[idx];

    // 1. Video Resilience, Adaptive Streaming & Mobile Viewport Handling
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      const markLoaded = () => {
        orb.classList.add('video-active');
        if (poster) poster.style.opacity = '0';
      };

      video.addEventListener('canplay', markLoaded);
      video.addEventListener('canplaythrough', markLoaded);
      video.addEventListener('loadeddata', markLoaded);
      video.addEventListener('playing', markLoaded);
      video.addEventListener('timeupdate', () => {
        if (video.currentTime > 0.02) markLoaded();
      });

      // Graceful fallback if video file has network delay
      video.addEventListener('error', () => {
        orb.classList.remove('video-active');
        if (poster) {
          poster.style.opacity = '1';
        }
      });

      const playSafely = () => {
        video.muted = true;
        video.defaultMuted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            markLoaded();
            if (playBtn) {
              const icon = playBtn.querySelector('.play-icon');
              if (icon) icon.textContent = '⏸';
            }
          }).catch(() => {
            // Autoplay policy waiting on user touch
          });
        }
      };

      // Ensure elements are connected in DOM before attaching observer
      setTimeout(() => {
        if (typeof IntersectionObserver !== 'undefined' && wrapper.isConnected) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                playSafely();
              } else {
                if (!video.paused) {
                  video.pause();
                  if (playBtn) {
                    const icon = playBtn.querySelector('.play-icon');
                    if (icon) icon.textContent = '▶';
                  }
                }
              }
            });
          }, { rootMargin: '250px 0px 250px 0px' });
          observer.observe(wrapper);
        }
      }, 80);

      // Scroll and viewport check fallback
      const checkInViewport = () => {
        const rect = wrapper.getBoundingClientRect();
        if (rect.top < window.innerHeight + 250 && rect.bottom > -250) {
          playSafely();
        } else if (!video.paused) {
          video.pause();
        }
      };
      window.addEventListener('scroll', checkInViewport, { passive: true });
      window.addEventListener('resize', checkInViewport, { passive: true });

      // Mobile user gesture unlock (allows autoplay across iOS Safari and Chrome)
      const unlockOnTouch = () => {
        const rect = wrapper.getBoundingClientRect();
        if (rect.top < window.innerHeight + 300 && rect.bottom > -300) {
          playSafely();
        }
      };
      window.addEventListener('touchstart', unlockOnTouch, { once: true, passive: true });
      window.addEventListener('pointerdown', unlockOnTouch, { once: true, passive: true });
      window.addEventListener('click', unlockOnTouch, { once: true, passive: true });

      // Play/Pause button toggle
      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (video.paused) {
            playSafely();
          } else {
            video.pause();
            const icon = playBtn.querySelector('.play-icon');
            if (icon) icon.textContent = '▶';
          }
        });
      }
    }

    // 2. 3D Pointer Tracking & Specular Glare Movement
    if (orb) {
      let rafId = null;

      const onPointerMove = (e) => {
        const rect = orb.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const normX = (e.clientX - centerX) / (rect.width / 2);
        const normY = (e.clientY - centerY) / (rect.height / 2);

        // Constrain to sphere bounds
        const clampedX = Math.max(-1, Math.min(1, normX));
        const clampedY = Math.max(-1, Math.min(1, normY));

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          // Subtle 3D tilt
          const tiltX = clampedY * -12;
          const tiltY = clampedX * 12;
          orb.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;

          // Glare reflection shifts smoothly across the glass surface
          if (glare) {
            const glareX = 50 + clampedX * 32;
            const glareY = 40 + clampedY * 32;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.1) 25%, transparent 60%)`;
            glare.style.opacity = '1';
          }

          // Contact shadow reacts subtly to tilt
          if (shadow) {
            shadow.style.transform = `translateX(${clampedX * 10}px) scale(${1 - Math.abs(clampedY) * 0.08})`;
          }
        });
      };

      const onPointerLeave = () => {
        if (rafId) cancelAnimationFrame(rafId);
        orb.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        if (glare) {
          glare.style.opacity = '0.6';
          glare.style.background = `radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.35) 0%, transparent 60%)`;
        }
        if (shadow) {
          shadow.style.transform = `translateX(0) scale(1)`;
        }
      };

      wrapper.addEventListener('pointermove', onPointerMove);
      wrapper.addEventListener('pointerleave', onPointerLeave);

      // 3. Click to open Fullscreen Archival Theater
      const triggerTheater = (e) => {
        e.preventDefault();
        openHeritageTheaterModal(itemData);
      };

      orb.addEventListener('click', triggerTheater);
      if (expandBtn) expandBtn.addEventListener('click', triggerTheater);

      orb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerTheater(e);
        }
      });
    }

    // 4. Floating Idle Oscillation (Out-of-phase organic floating)
    const floatDurations = [3.6, 4.2, 3.9];
    const floatDistances = [-12, -16, -10];
    gsap.to(orb, {
      y: floatDistances[idx],
      duration: floatDurations[idx],
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: idx * 0.4
    });

    gsap.to(shadow, {
      scaleX: 0.92,
      opacity: 0.55,
      duration: floatDurations[idx],
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: idx * 0.4
    });
  });
}

/**
 * Initializes the 6-stage GSAP ScrollTrigger timeline for Scene 04
 */
export function initHeritageScrollAnimations(sceneEl) {
  const container = sceneEl.querySelector('.heritage-museum-experience');
  if (!container) return;

  const header = container.querySelector('.heritage-editorial-header');
  const ribbonItems = container.querySelectorAll('.heritage-ribbon-item');
  const sphereWrappers = container.querySelectorAll('.heritage-sphere-wrapper');
  const footer = container.querySelector('.heritage-inaugural-footer');
  const spotlights = container.querySelectorAll('.heritage-spotlight');

  // Stage 1 — Editorial Header reveals with scroll
  if (header) {
    gsap.fromTo(header,
      { opacity: 0, y: 45 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sceneEl,
          start: 'top 92%',
          end: 'top 45%',
          scrub: 0.6
        }
      }
    );
  }

  // Stepped ribbon items reveal with scroll
  if (ribbonItems.length > 0) {
    gsap.fromTo(ribbonItems,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sceneEl,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 0.6
        }
      }
    );
  }

  // Stage 2 & 3 — The Three 3D Archival Video Spheres rise dynamically up with the scroll
  if (sphereWrappers.length > 0) {
    gsap.fromTo(sphereWrappers,
      {
        y: 130,
        opacity: 0.15,
        scale: 0.84,
        filter: 'brightness(0.6)'
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: 'brightness(1)',
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sceneEl,
          start: 'top 90%',
          end: 'top 20%',
          scrub: 0.8
        }
      }
    );
  }

  // Stage 4 — Museum Spotlights power up with scroll
  if (spotlights.length > 0) {
    gsap.fromTo(spotlights,
      { opacity: 0, scale: 0.75 },
      {
        opacity: 0.65,
        scale: 1,
        stagger: 0.15,
        ease: 'sine.out',
        scrollTrigger: {
          trigger: sceneEl,
          start: 'top 85%',
          end: 'top 25%',
          scrub: 0.8
        }
      }
    );
  }

  // Stage 5 & Inauguration Footer reveal
  if (footer) {
    gsap.fromTo(footer,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footer,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Parallax subtle depth scrubbing on the 3 spheres while scrolling through
  if (sphereWrappers.length === 3) {
    gsap.fromTo(sphereWrappers[0], 
      { yPercent: -4 },
      {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: sceneEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      }
    );
    gsap.fromTo(sphereWrappers[1], 
      { yPercent: 3 },
      {
        yPercent: -3,
        ease: 'none',
        scrollTrigger: {
          trigger: sceneEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8
        }
      }
    );
    gsap.fromTo(sphereWrappers[2], 
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: sceneEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6
        }
      }
    );
  }
}

/**
 * Fullscreen Cinematic Archival Theater Modal
 */
function openHeritageTheaterModal(itemData) {
  // Remove any existing modal
  const existing = document.getElementById('heritage-theater-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'heritage-theater-modal';
  modal.className = `heritage-theater-overlay theater-chapter-${itemData.id || 'legends'}`;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', `${itemData.title} - Archival Footage`);

  modal.innerHTML = `
    <div class="theater-backdrop"></div>
    <div class="theater-content-box">
      <button type="button" class="theater-close-btn" aria-label="Close Archival Theater">${Icons.close()}</button>
      
      <div class="theater-media-frame">
        <video 
          class="theater-video"
          src="${itemData.videoSrc}?t=bom_v2"
          poster="${itemData.posterSrc}"
          autoplay
          controls
          playsinline
          webkit-playsinline
          preload="auto"
        ></video>
      </div>

      <div class="theater-editorial-bar">
        <div class="theater-title-group">
          <span class="theater-chapter-pill" style="border-color: ${itemData.accentColor}; color: ${itemData.accentColor};">
            ${itemData.chapter}
          </span>
          <h2 class="theater-title">${itemData.title}</h2>
          <p class="theater-sub">${itemData.subtitle}</p>
        </div>
        <div class="theater-desc-group">
          <p class="theater-desc">${itemData.description}</p>
          <div class="theater-meta-row">
            <span class="theater-stat-badge" style="display: inline-flex; align-items: center; gap: 4px;">${Icons.star('fill-gold', 12)} ${itemData.stat}</span>
            <span class="theater-provenance-tag">ARCHIVAL FOOTAGE • BATTLE OF THE MAROONS ARCHIVE</span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Animate Entrance
  gsap.fromTo(modal.querySelector('.theater-content-box'),
    { opacity: 0, scale: 0.92, y: 30 },
    { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out' }
  );

  const closeModal = () => {
    const video = modal.querySelector('video');
    if (video) video.pause();
    gsap.to(modal.querySelector('.theater-content-box'), {
      opacity: 0,
      scale: 0.94,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        modal.remove();
        document.body.style.overflow = '';
      }
    });
  };

  modal.querySelector('.theater-close-btn').addEventListener('click', closeModal);
  modal.querySelector('.theater-backdrop').addEventListener('click', closeModal);

  const onKey = (e) => {
    if (e.key === 'Escape') {
      window.removeEventListener('keydown', onKey);
      closeModal();
    }
  };
  window.addEventListener('keydown', onKey);
}
