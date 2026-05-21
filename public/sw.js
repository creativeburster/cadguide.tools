const CACHE_NAME = 'cadguide-cache-v4';
const STATIC_CACHE = 'cadguide-static-v4';
const IMAGE_CACHE = 'cadguide-images-v4';
const PAGES_CACHE = 'cadguide-pages-v4';

const PRECACHE_ASSETS = [
  '/',
  '/about',
  '/contact',
  '/sponsor',
  '/privacy',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.svg',
];

// Cache strategies
const CACHE_STRATEGIES = [
  // Next.js static chunks (CSS/JS) - Cache First, revalidate in background
  {
    urlPattern: /\/_next\/static\//,
    cacheName: STATIC_CACHE,
    strategy: 'cache-first',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  // Images (tool logos, etc.) - Cache First
  {
    urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
    cacheName: IMAGE_CACHE,
    strategy: 'cache-first',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  // Fonts - Cache First, long-lived
  {
    urlPattern: /\.(woff2?|ttf|otf)$/,
    cacheName: STATIC_CACHE,
    strategy: 'cache-first',
    maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
  },
  // HTML pages - Network First, fallback to cache
  {
    urlPattern: /\/.*$/,
    cacheName: PAGES_CACHE,
    strategy: 'network-first',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    types: ['document'],
  },
];

// Helper: open cache and return response
async function cacheResponse(request, response, cacheName) {
  if (response && response.status === 200 && response.type === 'basic') {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

// Install: precache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.log('[SW] Precache error:', err);
      });
    })
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (![CACHE_NAME, STATIC_CACHE, IMAGE_CACHE, PAGES_CACHE].includes(name)) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: apply strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // Find matching strategy
  const strategy = CACHE_STRATEGIES.find(s =>
    s.urlPattern.test(request.url) &&
    (!s.types || s.types.includes(request.destination))
  );

  if (!strategy) return;

  if (strategy.strategy === 'cache-first') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Revalidate in background if old
          fetch(request).then(response => {
            cacheResponse(request, response, strategy.cacheName);
          }).catch(() => {});
          return cached;
        }
        return fetch(request).then(response => {
          return cacheResponse(request, response, strategy.cacheName);
        }).catch(err => {
          console.log('[SW] Fetch failed:', err);
          return cached;
        });
      })
    );
  } else if (strategy.strategy === 'network-first') {
    event.respondWith(
      fetch(request).then((response) => {
        return cacheResponse(request, response, strategy.cacheName);
      }).catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          // Fallback to home page for navigation
          if (request.destination === 'document') {
            return caches.match('/');
          }
          throw new Error('No cache available');
        });
      })
    );
  }
});

// Background sync for offline form submissions (future use)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
});

// Push notifications (future use)
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
});
