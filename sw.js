// Lưu sẵn giao diện để app mở ngay, kể cả khi mạng yếu
const CACHE = 'chitieu-v2';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'favicon.png',
  'fonts/bvp-latin-500.woff2', 'fonts/bvp-vietnamese-500.woff2', 'fonts/bvp-latin-600.woff2', 'fonts/bvp-vietnamese-600.woff2',
  'fonts/bvp-latin-700.woff2', 'fonts/bvp-vietnamese-700.woff2', 'fonts/bvp-latin-800.woff2', 'fonts/bvp-vietnamese-800.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;   // dữ liệu Google Sheets luôn lấy mới
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
