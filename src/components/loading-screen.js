/**
 * BATTLE OF THE MAROONS — OFFICIAL VIDEO INTRO / LOADING SCREEN
 * 
 * Replaces the static flag cards with a fullscreen cinematic MP4 video player:
 * - Plays the official MP4 video (default: /assets/videos/loading.mp4 with /assets/videos/intro.mp4 fallback)
 * - Automatically advances to the website when video ends
 * - Provides sound toggle (Unmute / Mute) & Skip Intro button
 * - Graceful fallback timeout and error handling so visitors are never blocked
 */
import { Icons } from './icons.js';

export function initLoadingScreen() {
  const isReplay = window.location.hash.includes('intro');
  const alreadySeen = sessionStorage.getItem('bom_intro_seen') === 'true';

  if (alreadySeen && !isReplay) {
    return;
  }

  const loaderEl = document.createElement('div');
  loaderEl.id = 'bom-loading-screen';
  loaderEl.setAttribute('role', 'dialog');
  loaderEl.setAttribute('aria-label', 'Battle of the Maroons Official Video Introduction');
  loaderEl.setAttribute('aria-modal', 'true');

  loaderEl.innerHTML = `
    <div class="video-loader-container">
      
      <!-- Official Fullscreen Video Player -->
      <video 
        id="bom-loader-video" 
        class="loader-video-player"
        autoplay 
        muted 
        playsinline 
        preload="auto"
      >
        <source src="/assets/videos/loading.mp4" type="video/mp4" />
        <source src="/assets/videos/bowler and batter.mp4" type="video/mp4" />
        <source src="/assets/videos/intro.mp4" type="video/mp4" />
      </video>

      <!-- Vignette Gradients for Legibility -->
      <div class="loader-video-vignette"></div>

      <!-- Top Watermark Pill -->
      <div class="loader-watermark">
        <span class="watermark-pill">97TH BATTLE OF THE MAROONS</span>
      </div>

      <!-- Corner Controls: Sound Toggle & Skip Button -->
      <div class="loader-controls">
        <button type="button" class="loader-control-btn" id="loader-sound-toggle" aria-label="Toggle Sound" title="Toggle Sound">
          <span class="sound-icon-muted">${Icons.volumeX('', 16)}</span>
          <span class="sound-icon-unmuted" style="display:none;">${Icons.volume2('', 16)}</span>
          <span class="sound-btn-text">Unmute</span>
        </button>

        <button type="button" class="loader-control-btn loader-skip-btn" id="loader-skip-btn" aria-label="Skip to website">
          <span>Enter Site</span>
          <span class="skip-arrow">&rarr;</span>
        </button>
      </div>

      <!-- Buffering / Loading Indicator (subtle) -->
      <div class="loader-buffering-indicator" id="loader-buffering">
        <div class="loader-spinner"></div>
      </div>

    </div>
  `;

  document.body.prepend(loaderEl);

  const videoEl = loaderEl.querySelector('#bom-loader-video');
  const soundBtn = loaderEl.querySelector('#loader-sound-toggle');
  const soundMuted = loaderEl.querySelector('.sound-icon-muted');
  const soundUnmuted = loaderEl.querySelector('.sound-icon-unmuted');
  const soundText = loaderEl.querySelector('.sound-btn-text');
  const skipBtn = loaderEl.querySelector('#loader-skip-btn');
  const bufferingEl = loaderEl.querySelector('#loader-buffering');

  let isDone = false;

  const dismissLoader = () => {
    if (isDone) return;
    isDone = true;
    sessionStorage.setItem('bom_intro_seen', 'true');
    loaderEl.classList.add('fade-out');

    if (videoEl) {
      try {
        videoEl.pause();
      } catch (e) {}
    }

    setTimeout(() => {
      if (loaderEl && loaderEl.parentNode) {
        loaderEl.parentNode.removeChild(loaderEl);
      }
    }, 450);
  };

  // Video event listeners
  if (videoEl) {
    // When video ends, smoothly dismiss and enter the website
    videoEl.addEventListener('ended', dismissLoader);

    // Hide buffering spinner once video starts playing
    videoEl.addEventListener('playing', () => {
      if (bufferingEl) bufferingEl.style.opacity = '0';
    });

    videoEl.addEventListener('waiting', () => {
      if (bufferingEl && !isDone) bufferingEl.style.opacity = '1';
    });

    // If video file does not exist yet or fails to load, gracefully dismiss after brief pause
    videoEl.addEventListener('error', () => {
      console.warn('Loading screen video could not be loaded. Please ensure loading.mp4 is placed in public/assets/videos/. Auto-advancing...');
      setTimeout(dismissLoader, 1500);
    });

    // Auto-play the video
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay may be restricted on some devices; show skip button
        if (bufferingEl) bufferingEl.style.opacity = '0';
      });
    }

    // Safety fallback: if video is exceptionally long or stalled, advance after loaded duration + 1s, or 25s max
    videoEl.addEventListener('loadedmetadata', () => {
      if (videoEl.duration && !isNaN(videoEl.duration) && isFinite(videoEl.duration)) {
        setTimeout(dismissLoader, (videoEl.duration + 1) * 1000);
      }
    });
  }

  // Fallback safety timer if no metadata loads (e.g. missing file)
  setTimeout(() => {
    if (!isDone && (!videoEl || videoEl.readyState === 0)) {
      dismissLoader();
    }
  }, 4000);

  // Sound toggle button
  if (soundBtn && videoEl) {
    soundBtn.addEventListener('click', () => {
      videoEl.muted = !videoEl.muted;
      if (videoEl.muted) {
        if (soundMuted) soundMuted.style.display = 'inline-flex';
        if (soundUnmuted) soundUnmuted.style.display = 'none';
        if (soundText) soundText.textContent = 'Unmute';
      } else {
        if (soundMuted) soundMuted.style.display = 'none';
        if (soundUnmuted) soundUnmuted.style.display = 'inline-flex';
        if (soundText) soundText.textContent = 'Mute';
      }
    });
  }

  // Skip button
  if (skipBtn) {
    skipBtn.addEventListener('click', dismissLoader);
  }

  // Keyboard shortcut to skip immediately
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dismissLoader();
    }
  }, { once: true });
}
