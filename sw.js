importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDPpcFaEjaoQPmleScgK1y39U2Ck905Jjg",
  authDomain: "oficina-ping.firebaseapp.com",
  databaseURL: "https://oficina-ping-default-rtdb.firebaseio.com",
  projectId: "oficina-ping",
  storageBucket: "oficina-ping.firebasestorage.app",
  messagingSenderId: "193975134205",
  appId: "1:193975134205:web:1413b8863fd81a83c21b94"
});

var messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  var title = payload.notification ? payload.notification.title : '📨 Ping Oficina';
  var body  = payload.notification ? payload.notification.body  : 'Tienes un mensaje nuevo';
  var icon  = '/oficina-ping.html';

  return self.registration.showNotification(title, {
    body: body,
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="40" fill="%23a855f7"/><path d="M38 58h116v74a12 12 0 01-12 12H50a12 12 0 01-12-12V58z" stroke="white" stroke-width="10" fill="none"/><path d="M38 58l58 52 58-52" stroke="white" stroke-width="10" fill="none"/></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle cx="48" cy="48" r="48" fill="%23f15bb5"/></svg>',
    requireInteraction: true,
    tag: 'ping-msg',
    data: payload.data || {}
  });
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf('oficina-ping') !== -1 && 'focus' in list[i]) {
          return list[i].focus();
        }
      }
      return clients.openWindow('/oficina-ping.html');
    })
  );
});

// Cache offline
var CACHE = 'ping-v3';
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(cache) {
    return cache.addAll(['/oficina-ping.html']);
  }));
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  e.respondWith(fetch(e.request).catch(function(){ return caches.match(e.request); }));
});
