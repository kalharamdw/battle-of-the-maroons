/**
 * BATTLE OF THE MAROONS — MAIN APPLICATION ENTRY POINT
 */

// Stylesheets
import './styles/base.css';
import './styles/navigation.css';
import './styles/home.css';
import './styles/scenes.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/animations.css';
import './styles/responsive.css';
import './styles/loading-screen.css';
import './styles/heritage-spheres.css';

// Components
import { initLoadingScreen } from './components/loading-screen.js';
import { createNavigation } from './components/navigation.js';
import { createFooter } from './components/footer.js';
import { initLightbox } from './components/lightbox.js';
import { initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Cinematic Loading Screen
  initLoadingScreen();

  const headerMount = document.getElementById('header-mount');
  const appMount = document.getElementById('app');
  const footerMount = document.getElementById('footer-mount');

  // Mount Header Navigation
  if (headerMount) {
    headerMount.appendChild(createNavigation());
  }

  // Mount Footer
  if (footerMount) {
    footerMount.appendChild(createFooter());
  }

  // Initialize Lightbox container
  initLightbox();

  // Initialize Router
  if (appMount) {
    initRouter(appMount);
  }

  // Register Media Cache Service Worker for seamless video streaming on low connections
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('⚡ Battle of the Maroons Media Cache ready:', reg.scope);
      }).catch((err) => {
        console.warn('Media Cache Service Worker fallback:', err.message);
      });
    });
  }

  console.log('%c★ BATTLE OF THE MAROONS — Ananda vs Nalanda ★', 'color: #d4af37; font-size: 16px; font-weight: bold; background: #540c1a; padding: 6px 12px; border-radius: 4px;');
});
