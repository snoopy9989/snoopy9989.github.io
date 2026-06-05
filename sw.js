const CACHE_NAME = 'gooblet-forest-v1';
const ASSETS = [
    './Forest_Ambience.mp3',
    './favicon.png',
    './index.html',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&display=swap'
];

// Install and save assets into the browser cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

// Serve assets from cache if offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
});
