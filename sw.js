const CACHE_NAME = 'gooblet-forest-cache-v1';
const ASSETS = [
    './',
    './game.html', // Change this to your actual HTML filename if it's different (e.g., index.html)
    './Forest_Ambiance.mp3',
    './favicon.png',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&display=swap'
];

// Install Service Worker and cache all assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

// Intercept network requests and serve from cache if offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
});
