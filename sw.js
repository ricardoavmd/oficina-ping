var CACHE = 'ping-v2';
var ASSETS = ['/oficina-ping.html'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(cache) { return cache.addAll(ASSETS); }));
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  e.respondWith(fetch(e.request).catch(function(){ return caches.match(e.request); }));
});
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/oficina-ping.html'));
});
