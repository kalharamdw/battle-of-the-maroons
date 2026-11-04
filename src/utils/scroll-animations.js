/**
 * BATTLE OF THE MAROONS — UNIVERSAL SCROLL REVEAL ENGINE
 * 
 * Provides smooth, cinematic scroll-triggered animations for all tabs and pages.
 * Handles cards, headers, grids, timelines, and dynamic content.
 */

let activeObserver = null;
let progressBarInitialized = false;

function initGlobalScrollProgressBar() {
  if (typeof document === 'undefined' || progressBarInitialized) return;
  progressBarInitialized = true;

  let bar = document.getElementById('global-scroll-progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'global-scroll-progress-bar';
    document.body.appendChild(bar);
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    bar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

export function initScrollAnimations(container = document) {
  // Ensure the top progress bar is running
  initGlobalScrollProgressBar();

  // If IntersectionObserver is not supported, reveal all immediately
  if (typeof IntersectionObserver === 'undefined') {
    const all = container.querySelectorAll('.scroll-reveal');
    all.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  // Cleanup old observer if re-initializing
  if (activeObserver) {
    try {
      activeObserver.disconnect();
    } catch (e) {}
  }

  activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        activeObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -30px 0px',
    threshold: 0.05
  });

  // Selectors for elements that should animate into view across ALL tabs & pages
  const selectors = [
    // Headers, Banners & Titles
    '.page-hero .container > *',
    '.section-header-block',
    '.page-section-header',
    '.page-hero-eyebrow',
    '.page-hero-title',
    '.page-hero-subtitle',
    '.scene-badge-group',
    '.scene-title-heading',
    '.scene-sub-text',
    
    // Cards across all tabs
    '.news-card',
    '.news-featured-card',
    '.gallery-card',
    '.team-card',
    '.player-card',
    '.player-hero-card',
    '.hof-card',
    '.sponsor-card',
    '.sponsor-tier-card',
    '.partner-tier-card',
    '.sponsor-logo-card',
    '.sponsors-tier-section',
    '.support-sponsor-badge',
    '.enclosure-card-option',
    '.ticket-widget-box',
    '.contact-card',
    '.contact-form-wrap',
    '.about-highlight-card',
    '.about-origins-grid > *',
    '.timeline-milestone-item',
    '.timeline-event-card',
    '.cherished-entry-card',
    '.cherished-sub-card',
    '.cherished-header',
    '.cherished-img-frame',
    '.cherished-details-box',
    '.match-card',
    '.scorecard-box',
    '.innings-tabs',
    '.stat-card',
    '.stat-box',
    '.summary-stat-box',
    '.number-stat-card',
    '.numbers-stats-grid > *',
    '.match-format-box',
    '.community-mini-card',
    '.school-card-duel',
    '.next-chapter-box',
    '.contact-grid-2 > *',
    '.cherished-grid-2 > *',
    '.cherished-grid-3 > *',
    '.about-text-content',
    '.table-responsive',
    '.cta-banner',
    '.historical-summary-card',
    '.countdown-section-card'
  ];

  // Grid containers that should stagger their direct children
  const gridContainers = container.querySelectorAll(`
    .news-articles-grid,
    .gallery-grid,
    .sponsors-grid,
    .teams-grid,
    .stats-grid,
    .enclosures-grid,
    .gallery-filter-bar,
    .about-origins-grid,
    .heritage-timeline,
    .cherished-grid-3,
    .cherished-grid-2,
    .hof-cards-grid,
    .sponsors-logos-grid,
    .numbers-stats-grid,
    .unified-formats-grid,
    .unified-community-strip
  `);

  gridContainers.forEach(grid => {
    if (!grid.classList.contains('scroll-stagger')) {
      grid.classList.add('scroll-stagger');
    }
  });

  // Query all target elements inside container
  const elements = container.querySelectorAll(selectors.join(', '));
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  elements.forEach((el, index) => {
    // Never attach scroll animations to modal contents
    if (el.closest('.article-reader-modal') || el.closest('#article-reader-modal') || el.closest('.lightbox-modal') || el.closest('.history-match-modal')) {
      return;
    }

    // Avoid double attaching if already marked
    if (!el.classList.contains('scroll-reveal')) {
      el.classList.add('scroll-reveal');
    }

    // Check if element is already inside the initial viewport
    const rect = el.getBoundingClientRect();
    if (rect.top <= windowHeight * 0.92) {
      // In view - reveal smoothly without scroll delay
      requestAnimationFrame(() => {
        el.classList.add('is-revealed');
      });
    } else {
      activeObserver.observe(el);
    }
  });
}

/**
 * Re-scans container for newly inserted dynamic content (e.g. from API calls)
 */
export function refreshScrollAnimations(container = document) {
  setTimeout(() => {
    initScrollAnimations(container);
  }, 60);
}
