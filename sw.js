const CACHE_NAME = 'china-travel-2026-v55';
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
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url).catch(err => console.warn('Cache add failed for:', url, err)))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// Network-First: Always fetch freshest page from GitHub, fall back to offline cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
