// Name of cache to be used by the application
const CACHE_KEY = 'v1';

// Enable this option if complete website needs to be cached
const CACHE_WEBSITE_REQUIRED = false;

// Include the assets to be cached in below array
const cacheAssets = [
	'index.html',
	'settings.html',
	'/css/style.css',
	'/js/main.js'
];

// On Service Worker Install event
self.addEventListener('install', event => {
	console.log('Service Worker: Installed');
	if (!CACHE_WEBSITE_REQUIRED) {
		event.waitUntil(
			caches
				.open(CACHE_KEY)
				.then(cache => {
					console.log('Service Worker: Caching files');
					// Add the assets to be cached in app cache
					cache.addAll(cacheAssets);
				})
				.then(() => self.skipWaiting()));
	}
});

// On Service Worker Activate event
self.addEventListener('activate', event => {
	console.log('Service Worker: Activated');
	event.waitUntil(
		caches.keys().then(cacheList => {
			return Promise.all(
				cacheList.map(cache => {
					if (cache !== CACHE_KEY) {
						console.log('Service Worker: Clearing Old Cache');
						// Delete the older cache version
						caches.delete(cache);
					}
				}));
		})
	)
});

// On Service Worker Fetch event
self.addEventListener('fetch', event => {
	console.log('Service Worker: Fetching');
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (CACHE_WEBSITE_REQUIRED) {
            // Clone the response object
            const resClone = response.clone();
            caches
              .open(CACHE_KEY)
              .then(cache => {
                // Add the current response to app cache
                cache.put(event.request, resClone);
              });
          }
          return response;
        })
        // Handling offline requests
        .catch(() => caches.match(event.request).then(res => res)));
});