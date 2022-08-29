// Service Worker Cache Name
var staticCacheName = "Duino-Coin PWA Companion";
// initiate call install event
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      // start caching the PWA
      return cache.addAll(["/"]);
    })
  );
});
// initiate call fetch event
self.addEventListener("fetch", function (event) {
  console.log(event.request.url);
  event.respondWith(
    // fetching
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});