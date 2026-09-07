// KCESAR TrailSafe — service worker
// Strategy: cache-first for the app shell, runtime cache for everything else
// (including cross-origin font requests), with an offline fallback to index.html
// for navigations. Bump CACHE_NAME on every release to invalidate old caches.

const CACHE_NAME = 'trailsafe-cache-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/icon-180.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache){ return cache.addAll(APP_SHELL); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event){
  const req = event.request;
  if(req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(function(cached){
      if(cached) return cached;

      return fetch(req).then(function(networkRes){
        // Only cache successful, cacheable responses (including opaque cross-origin ones).
        if(networkRes && (networkRes.ok || networkRes.type === 'opaque')){
          const copy = networkRes.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(req, copy); });
        }
        return networkRes;
      }).catch(function(){
        // Offline and not cached: fall back to the app shell for page navigations.
        if(req.mode === 'navigate'){
          return caches.match('./index.html');
        }
        return new Response('', {status: 408, statusText: 'Offline'});
      });
    })
  );
});
