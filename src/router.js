/**
 * BATTLE OF THE MAROONS — CLIENT-SIDE ROUTER
 * 
 * Supports hash-based client routing for reliable multi-page navigation
 * across local Vite dev server and static deployment environments.
 */

import { renderHomePage } from './pages/home.js';
import { renderAboutPage } from './pages/about.js';
import { renderMatchCentrePage } from './pages/match-centre.js';
import { renderHistoryPage } from './pages/history.js';
import { renderTeamsPage } from './pages/teams.js';
import { renderNewsPage } from './pages/news.js';
import { renderGalleryPage } from './pages/gallery.js';
import { renderSponsorsPage } from './pages/sponsors.js';
import { renderTicketingPage } from './pages/ticketing.js';
import { renderContactPage } from './pages/contact.js';
import { renderCherishedMomentsPage } from './pages/cherished-moments.js';
import { renderAdminPage } from './pages/admin/index.js';
import { updateNavActiveRoute } from './components/navigation.js';
import { initScrollAnimations } from './utils/scroll-animations.js';

const routes = {
  '/': renderHomePage,
  '/about': renderAboutPage,
  '/match-centre': renderMatchCentrePage,
  '/history': renderHistoryPage,
  '/cherished-moments': renderCherishedMomentsPage,
  '/cherishing-memories': renderCherishedMomentsPage,
  '/memories': renderCherishedMomentsPage,
  '/teams': renderTeamsPage,
  '/news': renderNewsPage,
  '/gallery': renderGalleryPage,
  '/sponsors': (appRoot) => {
    renderHomePage(appRoot);
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById('home-sponsors');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    });
  },
  '/ticketing': renderTicketingPage,
  '/contact': renderContactPage,
  '/admin': renderAdminPage
};

// Top Progress Beam controller
function triggerPageProgressBeam() {
  let beam = document.getElementById('page-progress-beam');
  if (!beam) {
    beam = document.createElement('div');
    beam.id = 'page-progress-beam';
    beam.className = 'page-progress-beam';
    document.body.appendChild(beam);
  }

  beam.classList.remove('animating', 'fade-out');
  // force reflow
  void beam.offsetWidth;
  beam.classList.add('animating');

  setTimeout(() => {
    beam.classList.add('fade-out');
    setTimeout(() => {
      beam.classList.remove('animating', 'fade-out');
    }, 280);
  }, 360);
}

export function initRouter(appRoot) {
  let activePath = null;
  let isNavigating = false;

  async function handleRoute() {
    let hash = window.location.hash.slice(1);
    if (!hash || hash === '') {
      hash = '/';
    }

    // If hash is an in-page element anchor (e.g. "world-cup-1975" without leading slash)
    if (!hash.startsWith('/')) {
      const targetEl = document.getElementById(hash);
      if (targetEl) {
        const navHeight = 120;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
        return;
      }
      return;
    }

    // Strip query parameters if any
    const cleanPath = hash.split('?')[0];
    const renderFn = routes[cleanPath] || routes['/'];

    // Toggle administrative mode on document.body to isolate back-office console
    const isAdmin = cleanPath.startsWith('/admin');
    document.body.classList.toggle('is-admin-route', isAdmin);

    // If user clicked link of currently active route and page has children
    if (cleanPath === activePath && appRoot.children.length > 0) {
      if (hash.includes('?')) {
        renderFn(appRoot);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    activePath = cleanPath;
    isNavigating = true;

    // Trigger visual progress beam across top of viewport
    triggerPageProgressBeam();

    // Update navigation active states immediately
    updateNavActiveRoute(cleanPath);

    // Render with transition
    const renderNewPage = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      appRoot.innerHTML = '';
      appRoot.classList.remove('page-transition-exit');
      
      // Render route component
      renderFn(appRoot);

      // Initialize Universal Scroll Animations for this tab
      requestAnimationFrame(() => {
        initScrollAnimations(appRoot);
      });

      // Re-trigger enter animation class
      appRoot.classList.remove('page-transition-wrapper');
      void appRoot.offsetWidth; // Force reflow
      appRoot.classList.add('page-transition-wrapper');

      isNavigating = false;
    };

    // If native document.startViewTransition is available (Chrome 111+, Safari 18+)
    if (document.startViewTransition) {
      try {
        document.startViewTransition(() => {
          renderNewPage();
        });
        return;
      } catch (err) {
        // Fallback to CSS transition if startViewTransition throws
      }
    }

    // High performance CSS Transition Fallback
    if (appRoot.firstElementChild) {
      appRoot.classList.add('page-transition-exit');
      setTimeout(() => {
        renderNewPage();
      }, 100);
    } else {
      renderNewPage();
    }
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

