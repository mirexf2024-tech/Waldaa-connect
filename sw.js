/* Waldaa Connect Global — offline cache v5 */
const CACHE_NAME = 'waldaa-connect-global-v5';
const APP_ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png',
  './icon-maskable-192.png', './icon-maskable-512.png', './apple-touch-icon.png', './favicon-32.png', './chat.js', './chat.css'];
const isFirebaseSdk = url => url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/');

self.addEventListener('install', event => {
  // Cache each asset separately: one missing file must not break the whole install.
  event.waitUntil(caches.open(CACHE_NAME)
    .then(cache => Promise.all(APP_ASSETS.map(a => cache.add(a).catch(() => null))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Firebase SDK scripts: cache so the app can start offline.
  if (isFirebaseSdk(url)) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE_NAME).then(c => c.put(request, copy)); }
      return res;
    })));
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(res => {
      const copy = res.clone(); caches.open(CACHE_NAME).then(c => c.put('./index.html', copy)); return res;
    }).catch(() => caches.match('./index.html').then(r => r || caches.match('./'))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(res => {
    if (res && res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then(c => c.put(request, copy)); }
    return res;
  })));
});
