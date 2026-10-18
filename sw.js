const CACHE_NAME = 'china-travel-2026-v23';
const ASSETS = [
  './',
  './index.html',
  './images/lijiang_hero.jpg',
  './images/kunming_city.jpg',
  './images/tiger_leaping_gorge.jpg',
  './images/shangrila_night.jpg',
  './images/potatso_park.jpg',
  './images/songzanlin_temple.jpg',
  './images/zhongyi_market.jpg',
  './docs/FLIGHT%231-Nattpat%20Saripat-BKK-QXC4PT-LJG-FLIGHT_ORIGINATING.pdf',
  './docs/FLIGHT%232-Nattpat%20Saripat-BKK-QXC4PT-LJG-FLIGHT_RETURNING.pdf',
  './docs/%E8%85%BE%E8%88%AA%E5%A4%A7%E9%85%92%E5%BA%97(%E6%98%86%E6%98%8E%E9%95%BF%E6%B0%B4%E5%9B%BD%E9%99%85%E6%9C%BA%E5%9C%BA%E5%BA%97).pdf',
  './docs/%E4%B8%BD%E6%B1%9F%E9%BE%99%E8%90%BD%E6%B2%B3%E6%B0%91%E5%AE%BF(%E4%B8%89%E4%B9%89%E5%9B%BD%E9%99%85%E6%9C%BA%E5%9C%BA%E5%BA%97).pdf',
  './docs/%E6%A0%96%E6%82%A6%E6%9E%97%E9%9A%90%E5%88%AB%E9%99%A2(%E4%B8%BD%E6%B1%9F%E5%8F%A4%E5%9F%8E%E5%BF%A0%E4%B9%89%E5%B8%82%E5%9C%BA%E5%BA%97)%201.pdf',
  './docs/%E8%99%8E%E8%B7%B3%E5%B3%A1%E5%B1%B1%E7%BE%8E%E5%AE%A2%E6%A0%88(%E8%99%8E%E8%B7%B3%E5%B3%A1%E6%99%AF%E5%8C%BA%E5%BA%97).pdf',
  './docs/%E9%A6%99%E6%A0%BC%E9%87%8C%E6%8B%89%E6%9C%9B%E5%B1%B1%E5%B0%8F%E9%99%A2%E5%AE%A2%E6%A0%88(%E7%8B%AC%E5%85%8B%E5%AE%97%E5%8F%A4%E5%9F%8E%E5%BA%97).pdf',
  './docs/%E6%A0%96%E6%82%A6%E6%9E%97%E9%9A%90%E5%88%AB%E9%99%A2(%E4%B8%BD%E6%B1%9F%E5%8F%A4%E5%9F%8E%E5%BF%A0%E4%B9%89%E5%B8%82%E5%9C%BA%E5%BA%97)%202.pdf'
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
  // Cache-First for static assets (images, pdfs, etc.)
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
