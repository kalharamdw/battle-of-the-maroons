/**
 * BATTLE OF THE MAROONS — VIDEO SCENE COMPONENT
 * 
 * Renders full-screen cinematic video layers with poster fallbacks,
 * stepped captions, sound controls, and smooth media loading resilience.
 */
import { Icons } from './icons.js';

export function createVideoScene(sceneConfig, index, totalScenes) {
  const sceneEl = document.createElement('section');
  sceneEl.className = 'cinematic-scene';
  sceneEl.id = sceneConfig.id;
  sceneEl.setAttribute('data-scene-index', index);

  // Build stepped captions HTML
  const steppedCaptionsHTML = sceneConfig.steppedCaptions && sceneConfig.steppedCaptions.length > 0
    ? `
      <div class="stepped-captions-box" data-captions-box>
        ${sceneConfig.steppedCaptions.map((caption, i) => `
          <span class="stepped-caption ${i === 0 ? 'highlight' : ''}" data-caption-idx="${i}">
            ${caption}
          </span>
        `).join('')}
      </div>
    `
    : '';

  // Dedicated corner school pillars on hero scene
  const heroSchoolsHTML = index === 0
    ? `
      <div class="hero-school-pillar ananda-pillar">
        <div class="pillar-crest-white-circle">
          <img src="/assets/images/schools/ananda_crest.svg" alt="Ananda College Crest" class="pillar-crest-img" />
        </div>
        <span class="pillar-school-title">ANANDA COLLEGE</span>
      </div>

      <div class="hero-school-pillar nalanda-pillar">
        <div class="pillar-crest-white-circle">
          <img src="/assets/images/schools/nalanda_crest.png" alt="Nalanda College Crest" class="pillar-crest-img" />
        </div>
        <span class="pillar-school-title">NALANDA COLLEGE</span>
      </div>
    `
    : '';

  // Bottom Center Action Cluster on hero scene (Direct child of sceneEl for rock-solid bottom alignment)
  const heroActionClusterHTML = index === 0
    ? `
      <div class="hero-center-action-cluster">
        <div class="scene-badge-group hero-scene-badge">
          <span class="scene-index-num">01</span>
          <span class="scene-eyebrow">A CENTURY OF BROTHERHOOD & PASSION</span>
        </div>
        <div class="hero-encounter-meta">
          <span class="meta-star">${Icons.star('fill-gold', 13)}</span>
          <span>THE HISTORIC CENTURY ENCOUNTER • SSC GROUNDS, COLOMBO</span>
          <span class="meta-star">${Icons.star('fill-gold', 13)}</span>
        </div>
        <div class="scene-01-ctas">
          <a href="#/ticketing" class="btn-primary-cinematic">
            Match Day Passes
          </a>
          <a href="#/match-centre" class="btn-secondary-cinematic">
            Explore Match Centre
          </a>
        </div>
      </div>
    `
    : '';

  // Sound toggle (primarily for opening hero)
  const soundToggleHTML = sceneConfig.soundAvailable
    ? `
      <button type="button" class="hero-sound-toggle" data-sound-toggle aria-label="Toggle ambient stadium audio">
        <span class="sound-icon">${Icons.volumeX()}</span>
        <span class="sound-status">Sound Off</span>
      </button>
    `
    : '';

  // Scroll indicator on hero scene
  const scrollIndicatorHTML = index === 0
    ? `
      <a href="#scene-02" class="hero-scroll-indicator" aria-label="Scroll to discover the rivalry">
        <div class="scroll-pill">
          <div class="scroll-pip"></div>
        </div>
        <span class="scroll-text">Scroll To Explore</span>
      </a>
    `
    : '';

  const videoUrl = sceneConfig.videoSrc ? `${sceneConfig.videoSrc}?t=bom_v2` : '';
  const isHeroScene = index === 0;

  sceneEl.innerHTML = `
    <!-- Media Layer -->
    <div class="scene-media-layer ${sceneConfig.customMediaHTML ? 'scene-custom-atmosphere' : ''}">
      ${sceneConfig.customMediaHTML ? sceneConfig.customMediaHTML : `
        <!-- Branded Poster Fallback (High-res instant base, zero waiting on low connections) -->
        <img 
          src="${sceneConfig.posterSrc || ''}" 
          alt="${sceneConfig.name} - Battle of the Maroons" 
          class="scene-poster"
          loading="${isHeroScene ? 'eager' : 'lazy'}"
        />

        <!-- HTML5 Video Element (Adaptive & Lazy: Hero loads metadata; subsequent scenes lazy-load on scroll) -->
        <video 
          class="scene-video"
          ${isHeroScene && videoUrl ? `src="${videoUrl}" preload="metadata"` : (videoUrl ? `data-src="${videoUrl}" preload="none"` : '')}
          playsinline
          webkit-playsinline
          muted
          loop
        ></video>
      `}
    </div>

    <!-- Atmospheric Gradient Overlay -->
    <div class="scene-overlay" style="opacity: ${sceneConfig.overlayOpacity || 0.75};"></div>

    <!-- Foreground Content -->
    ${sceneConfig.id !== 'scene-01' ? `
      <div class="scene-content">
        <div class="scene-text-scrim">
          <div class="scene-badge-group">
            <span class="scene-index-num">${sceneConfig.sceneNumber}</span>
            <span class="scene-eyebrow">${sceneConfig.tagline}</span>
          </div>

          ${sceneConfig.titleHTML !== undefined ? sceneConfig.titleHTML : (sceneConfig.title ? `
            <h2 class="scene-title-heading">
              ${sceneConfig.title}
            </h2>
          ` : '')}

          ${sceneConfig.subheadingHTML !== undefined ? sceneConfig.subheadingHTML : (sceneConfig.subheading ? `
            <p class="scene-sub-text">
              ${sceneConfig.subheading}
            </p>
          ` : '')}

          ${sceneConfig.steppedCaptionsHTML !== undefined ? sceneConfig.steppedCaptionsHTML : steppedCaptionsHTML}
        </div>

        <!-- Custom Injected Scene Content Placeholder (populated by home.js) -->
        <div class="scene-custom-content-slot" data-slot="${sceneConfig.id}"></div>
      </div>
    ` : `
      <div class="scene-custom-content-slot" data-slot="${sceneConfig.id}" style="display: none;"></div>
    `}

    ${heroSchoolsHTML}
    ${heroActionClusterHTML}
    ${soundToggleHTML}
    ${scrollIndicatorHTML}
  `;

  // Attach Video & Audio resilience handlers
  initSceneMediaEvents(sceneEl, sceneConfig);

  return sceneEl;
}

function initSceneMediaEvents(sceneEl, sceneConfig) {
  const video = sceneEl.querySelector('.scene-video');
  const poster = sceneEl.querySelector('.scene-poster');
  const soundBtn = sceneEl.querySelector('[data-sound-toggle]');
  const mediaLayer = sceneEl.querySelector('.scene-media-layer');

  if (video) {
    // Force muted flags so browsers never block autoplay
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    let isSourceAttached = Boolean(video.src && video.src !== '' && !video.src.endsWith('#'));
    let isPlaying = false;

    // Detect network speed
    const isLowConnection = () => {
      if (typeof navigator !== 'undefined' && navigator.connection) {
        const conn = navigator.connection;
        if (conn.saveData) return true;
        if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') return true;
      }
      return false;
    };

    // Lazily attach video source on-demand
    const attachVideoSource = () => {
      if (isSourceAttached) return;
      const dataSrc = video.getAttribute('data-src');
      if (dataSrc) {
        isSourceAttached = true;
        video.src = dataSrc;
        video.load();
      }
    };

    const markVideoLoaded = () => {
      if (video.readyState >= 2 || video.currentTime > 0) {
        video.style.display = 'block';
        video.classList.add('loaded');
        if (mediaLayer) mediaLayer.classList.add('video-active');
        if (poster) poster.style.opacity = '0';
      }
    };

    // When video data is ready or starts playing, fade in video smoothly over poster
    video.addEventListener('canplay', markVideoLoaded);
    video.addEventListener('canplaythrough', markVideoLoaded);
    video.addEventListener('loadeddata', markVideoLoaded);
    video.addEventListener('playing', () => {
      isPlaying = true;
      markVideoLoaded();
    });
    video.addEventListener('timeupdate', () => {
      if (video.currentTime > 0.05) markVideoLoaded();
    });

    // While buffering on low connections, keep high-resolution poster visible (no black screen)
    video.addEventListener('waiting', () => {
      if (poster && video.readyState < 3) {
        poster.style.opacity = '1';
      }
    });

    video.addEventListener('stalled', () => {
      if (poster && video.readyState < 2) {
        poster.style.opacity = '1';
      }
    });

    // Handle missing or 404 video files gracefully
    const handleVideoMissing = () => {
      video.classList.remove('loaded');
      video.style.display = 'none';
      if (mediaLayer) mediaLayer.classList.remove('video-active');
      if (poster) {
        poster.style.opacity = '1';
        poster.style.transform = 'scale(1.01)';
      }
    };

    video.addEventListener('error', () => {
      if (video.error && video.readyState === 0) {
        handleVideoMissing();
      }
    });

    // Helper to start playback safely
    const playSafely = () => {
      attachVideoSource();
      video.muted = true;
      const p = video.play();
      if (p !== undefined) {
        p.then(() => {
          isPlaying = true;
          markVideoLoaded();
        }).catch(() => { });
      }
    };

    // Immediate attempt for hero scene
    if (isSourceAttached && !isLowConnection()) {
      playSafely();
    }

    // Viewport check helper
    const checkInViewport = () => {
      const rect = sceneEl.getBoundingClientRect();
      const inView = rect.top < window.innerHeight + 250 && rect.bottom > -250;
      if (inView) {
        attachVideoSource();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          playSafely();
        }
      } else {
        if (!video.paused) {
          video.pause();
          isPlaying = false;
        }
      }
    };

    // Scroll-triggered viewport playback controller & lazy-loader
    if (typeof IntersectionObserver !== 'undefined') {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            attachVideoSource();
            playSafely();
          } else {
            if (!video.paused) {
              video.pause();
              isPlaying = false;
            }
          }
        });
      }, {
        threshold: [0, 0.15, 0.5],
        rootMargin: '250px 0px 250px 0px'
      });

      videoObserver.observe(sceneEl);
    }

    // Scroll and user interaction listener fallbacks
    window.addEventListener('scroll', checkInViewport, { passive: true });
    window.addEventListener('resize', checkInViewport, { passive: true });
    document.addEventListener('click', playSafely, { once: true, passive: true });
    document.addEventListener('touchstart', playSafely, { once: true, passive: true });

    // Sound toggle handling
    if (soundBtn) {
      let isMuted = true;
      soundBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isMuted = !isMuted;
        video.muted = isMuted;

        const icon = soundBtn.querySelector('.sound-icon');
        const text = soundBtn.querySelector('.sound-status');
        if (icon) icon.innerHTML = isMuted ? Icons.volumeX() : Icons.volume2();
        if (text) text.textContent = isMuted ? 'Sound Off' : 'Sound On';
      });
    }
  }
}
