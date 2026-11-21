// Bump this when you ship changes so old caches get cleaned up.
const CACHE = 'gooblet-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      // Add files one by one so a single missing file doesn't break the install.
      Promise.all(SHELL.map(url => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first so updates show up straight away; fall back to the cache when offline.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || req.headers.has('range')) return; // skip audio/video range requests

  event.respondWith(
    fetch(req)
      .then(res => {
        // Keep good same-origin responses, plus opaque cross-origin ones (e.g. a script from a CDN).
        if (res.status === 200 || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined))
      )
  );
});
