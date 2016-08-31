/*
 Copyright 2016 Google Inc. All Rights Reserved.
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

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
// const PRECACHE = 'precache-v2';
// const RUNTIME = 'runtime';

// // A list of local resources we always want to be cached.
// const PRECACHE_URLS = [
//   'index.html',
//   'favicon.ico',
//   './', // Alias for index.html
//   'build/css/app.ios.css',
//   'build/css/app.md.css',
//   'build/css/app.wp.css',
//   'build/js/app.bundle.js',
//   'build/fonts/ionicons.ttf',
//   'build/pages/hello-ionic/hello-ionic.html',
//   'build/pages/item-details/item-details.html',
//   'build/pages/list/list.html',
//   'build/pages/app.html',
//   'images/icons/icon-128x128.png',
//   'images/icons/icon-144x144.png',
//   'images/icons/icon-152x152.png',
//   'images/icons/icon-192x192.png',
//   'images/icons/icon-32x32.png'
// ];

// // The install handler takes care of precaching the resources we always need.
// // self.addEventListener('install', event => {
// //   event.waitUntil(
// //     caches.open(PRECACHE)
// //       .then(cache => cache.addAll(PRECACHE_URLS))
// //       .then(self.skipWaiting())
// //   );
// // });

// self.addEventListener('install', function(e) {
//   console.log('[ServiceWorker] Install');
//   e.waitUntil(
//     caches.open(PRECACHE).then(function(cache) {
//       console.log('[ServiceWorker] Caching app shell');
//       return cache.addAll(PRECACHE_URLS);
//     })
//   );
// });

// // The activate handler takes care of cleaning up old caches.
// self.addEventListener('activate', event => {
//   const currentCaches = [PRECACHE, RUNTIME];
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
//       console.log(cacheNames.filter(cacheName => !currentCaches.includes(cacheName)));
//     }).then(cachesToDelete => {
//       return Promise.all(cachesToDelete.map(cacheToDelete => {
//         return caches.delete(cacheToDelete);
//         console.log(caches.delete(cacheToDelete));
//       }));
//     }).then(() => self.clients.claim())
//   );
// });

// // The fetch handler serves responses for same-origin resources from a cache.
// // If no response is found, it populates the runtime cache with the response
// // from the network before returning it to the page.
// self.addEventListener('fetch', event => {
//   // Skip cross-origin requests, like those for Google Analytics.
//   if (event.request.url.startsWith(self.location.origin)) {
//     event.respondWith(
//       caches.match(event.request).then(cachedResponse => {
//         if (cachedResponse) {
//           return cachedResponse;
//         }

//         return caches.open(RUNTIME).then(cache => {
//           return fetch(event.request).then(response => {
//             // Put a copy of the response in the runtime cache.
//             return cache.put(event.request, response.clone()).then(() => {
//               return response;
//             });
//           });
//         });
//       })
//     );
//   }
// });




var dataCacheName = 'weatherData-v1';
var cacheName = 'weatherPWA-step-6-1';
var filesToCache = [
  'index.html',
  './', // Alias for index.html
  'build/css/app.ios.css',
  'build/css/app.md.css',
  'build/css/app.wp.css',
  'build/js/app.bundle.js',
  'build/fonts/ionicons.ttf',
  'build/pages/hello-ionic/hello-ionic.html',
  'build/pages/item-details/item-details.html',
  'build/pages/list/list.html',
  'build/pages/app.html',
  'images/icons/icon-128x128.png',
  'images/icons/icon-144x144.png',
  'images/icons/icon-152x152.png',
  'images/icons/icon-192x192.png',
  'images/icons/icon-32x32.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  var dataUrl = 'https://publicdata-weather.firebaseio.com/';
  if (e.request.url.indexOf(dataUrl) === 0) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          return caches.open(dataCacheName).then(function(cache) {
            cache.put(e.request.url, response.clone());
            console.log('[ServiceWorker] Fetched&Cached Data');
            return response;
          });
        })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
