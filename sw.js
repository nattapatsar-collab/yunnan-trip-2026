const CACHE_NAME = 'china-travel-2026-v97';
const ASSETS = [
  './',
  './index.html',
  './images/lijiang_hero.jpg',
  './images/kunming_city.jpg',
  './images/tiger_leaping_gorge.jpg',
  './images/shangrila_night.jpg',
  './images/potatso_park.jpg',
  './images/songzanlin_temple.jpg',
  './images/meili_snow_mountain.jpg',
  './images/zhongyi_market.jpg',
  './images/jinma_arch.jpg',
  './images/black_dragon_pool.jpg',
  './images/28_bends.jpg',
  './images/halfway_terrace.jpg',
  './images/guishan_prayer_wheel.jpg',
  './images/cuihu_park.jpg',
  './images/jianxinyuan_noodles.jpg',
  './images/bus_ticket_tlg_1.jpg',
  './images/bus_ticket_tlg_2.jpg',
  './images/bus_ticket_shangrila_1.jpg',
  './images/bus_ticket_shangrila_2.jpg',
  './images/bus_ticket_meili_go.jpg',
  './images/bus_ticket_meili_return.jpg',
  './images/train_ticket_lijiang.jpg',
  './images/flight_ticket_departure-1.jpg',
  './images/flight_ticket_return-1.jpg',
  './images/hotel_booking_baqin-1.jpg',
  './images/hotel_booking_tenghang-1.jpg',
  './images/hotel_booking_longluohe-1.jpg',
  './images/hotel_booking_qiyue_1-1.jpg',
  './images/hotel_booking_summit-1.jpg',
  './images/hotel_booking_wangshan-1.jpg',
  './images/hotel_booking_qiyue_2-1.jpg'
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

// Network-First: Always fetch freshest page from network, fall back to offline cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/docs/')) return;
  const isNavigate = e.request.mode === 'navigate';
  const fetchPromise = isNavigate ? fetch(e.request, { cache: 'reload' }) : fetch(e.request);

  e.respondWith(
    fetchPromise
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request).then(cached => cached || (isNavigate ? caches.match('./index.html') : null)))
  );
});
