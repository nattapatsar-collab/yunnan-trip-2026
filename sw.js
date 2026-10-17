const CACHE_NAME = 'china-travel-2026-v1';
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

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
