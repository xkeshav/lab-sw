/*
Copyright 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
(function() {
  'use strict';
  const CACHE_VERSION = 1;
  const CACHE_NAME = `offline-v${CACHE_VERSION}`;
  self.addEventListener('install', function(event) {
    console.log('Service worker installing...');
    console.log('event skip waiting', event);
    self.skipWaiting();
  });

  self.addEventListener('activate', function(event) {
    console.log('Service worker activating...');
    console.log('event', event);
  });

  // I'm a new service worker

  // TODO - 4: Add fetch listener
  // network only
  self.addEventListener('fetch', (event) => {
    console.log(`%cfetch url=>%c${event.request.url}`, `color:#F74C2F`, `color:green`);
    // event.respondWith(fetch(event.request));
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch((err) => {
        console.log('in catch block', err);
        return caches.match('offline.html');
      })
    );
  });

  self.addEventListener('notificationclose', function(e) {
    console.log("notificationclose", e);
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;

    console.log('Closed notification: ' + primaryKey);
  });

  self.addEventListener('notificationclick', function(e) {
      console.log("notificationclick", e);
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;
  console.log("action", action);
  if (action === 'close') {
    notification.close();
  } else {
    console.log('inside else');
    clients.openWindow('http://www.zymr.com');
    notification.close();
  }
});

self.addEventListener('push', function(e) {
  var options = {
    body: 'This notification was generated from a push!',
    icon: 'images/push.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {action: 'explore', title: 'Explore this new world',
        icon: 'images/gift_in.png'},
      {action: 'close', title: 'Close',
        icon: 'images/gift_out.png'},
    ]
  };
  e.waitUntil(
    self.registration.showNotification('Hello world!', options)
  );
});

})();
