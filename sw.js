const CACHE_NAME = 'china-travel-2026-v8';
const ASSETS = [
  './',
  './index.html',
  './images/lijiang_hero.jpg',
  './images/kunming_city.jpg',
  './images/tiger_leaping_gorge.jpg',
  './images/shangrila_night.jpg',
  './images/potatso_park.jpg',
  './images/songzanlin_temple.jpg',
  './images/zhongyi_market.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Network-First for HTML navigation so updates show instantly when online
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request).then(c => c || caches.match('./index.html')))
    );
    return;
  }
  // Cache-First for static assets
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
