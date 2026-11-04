/**
 * BATTLE OF THE MAROONS — MEDIA CACHE SERVICE WORKER
 * 
 * Provides progressive caching and byte-range request streaming for static
 * video and poster media so users with low or unstable connections experience
 * fast, stutter-free playback without re-downloading videos.
 */

const CACHE_NAME = 'bom-media-v3';
const STATIC_MEDIA_PATTERNS = [
  /\/assets\/images\//,
  /\/assets\/videos\/posters\//
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Range requests (video streaming) MUST pass directly through to native browser streaming
  // This allows the browser to request small 64KB-256KB chunks via HTTP 206 without crashing Service Worker memory
  const rangeHeader = request.headers.get('range');
  if (rangeHeader || request.url.includes('.mp4')) {
    return; // Pass through to browser default native streaming
  }

  // Check if request is for static image/poster media
  const isMedia = STATIC_MEDIA_PATTERNS.some((pattern) => pattern.test(url.pathname));

  if (!isMedia || request.method !== 'GET') {
    return; // Pass through to browser default
  }

  // Cache-first strategy for posters and images
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch (err) {
        return cached || new Response('Offline media unavailable', { status: 503 });
      }
    })
  );
});

