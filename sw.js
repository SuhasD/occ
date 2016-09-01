var dataCacheName = 'weatherData-v2';
var cacheName = 'weatherPWA-step-6-2';
var filesToCache = [
  '/',
  'index.html',
  'build/css/app.ios.css',
  'build/css/app.md.css',
  'build/css/app.wp.css',
  'build/fonts/ionicons.ttf',
  'build/fonts/ionicons.woff',
  'build/fonts/ionicons.woff2',
  'build/fonts/noto-sans-regular.ttf',
  'build/fonts/noto-sans-bold.ttf',
  'build/fonts/roboto-bold.woff',
  'build/fonts/roboto-bold.ttf',
  'build/fonts/roboto-light.ttf',
  'build/fonts/roboto-light.woff',
  'build/fonts/roboto-regular.woff',
  'build/fonts/roboto-regular.ttf',
  'build/js/app.bundle.js',
  'build/js/app.bundle.js.map',
  'build/js/es6-shim.min.js',
  'build/js/es6-shim.map',
  'build/js/Reflect.js',
  'build/js/Reflect.js.map',
  'build/js/zone.js',
  'build/app.html',
  'build/pages/hello-ionic/hello-ionic.html',
  'build/pages/item-details/item-details.html',
  'build/pages/list/list.html',
  'images/icons/icon-128x128.png',
  'images/icons/icon-144x144.png',
  'images/icons/icon-152x152.png',
  'images/icons/icon-192x192.png',
  'images/icons/icon-256x256.png',
  'images/icons/icon-32x32.png',
  'img/appicon.png'
];

self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Install');
  // e.waitUntil(
  //   caches.open(cacheName).then(function(cache) {
  //     console.log('[ServiceWorker] Caching app shell');
  //     return cache.addAll(filesToCache);
  //   })
  // );

  event.waitUntil(
    caches.open('v2').then(function(cache) {
      return cache.addAll([
        '/',
        'index.html',
        'build/css/app.ios.css',
        'build/css/app.md.css',
        'build/css/app.wp.css',
        'build/fonts/ionicons.ttf',
        'build/fonts/ionicons.woff',
        'build/fonts/ionicons.woff2',
        'build/fonts/noto-sans-regular.ttf',
        'build/fonts/noto-sans-bold.ttf',
        'build/fonts/roboto-bold.woff',
        'build/fonts/roboto-bold.ttf',
        'build/fonts/roboto-light.ttf',
        'build/fonts/roboto-light.woff',
        'build/fonts/roboto-regular.woff',
        'build/fonts/roboto-regular.ttf',
        'build/js/app.bundle.js',
        'build/js/app.bundle.js.map',
        'build/js/es6-shim.min.js',
        'build/js/es6-shim.map',
        'build/js/Reflect.js',
        'build/js/Reflect.js.map',
        'build/js/zone.js',
        'build/app.html',
        'build/pages/hello-ionic/hello-ionic.html',
        'build/pages/item-details/item-details.html',
        'build/pages/list/list.html',
        'images/icons/icon-128x128.png',
        'images/icons/icon-144x144.png',
        'images/icons/icon-152x152.png',
        'images/icons/icon-192x192.png',
        'images/icons/icon-256x256.png',
        'images/icons/icon-32x32.png',
        'img/appicon.png'
      ]);
    })
  );

});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  // e.waitUntil(
  //   caches.keys().then(function(keyList) {
  //     return Promise.all(keyList.map(function(key) {
  //       if (key !== cacheName) {
  //         console.log('[ServiceWorker] Removing old cache', key);
  //         return caches.delete(key);
  //       }
  //     }));
  //   })
  // );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);

  //   event.respondWith(
  //   caches.match(event.request).then(function(resp) {
  //     return resp || fetch(event.request).then(function(response) {
  //       return caches.open('v1').then(function(cache) {
  //         cache.put(event.request, response.clone());
  //         return response;
  //       });  
  //     });
  //   });
  // );

  // var dataUrl = 'https://publicdata-weather.firebaseio.com/';
  // if (e.request.url.indexOf(dataUrl) === 0) {
  //   e.respondWith(
  //     fetch(e.request)
  //       .then(function(response) {
  //         return caches.open(dataCacheName).then(function(cache) {
  //           cache.put(e.request.url, response.clone());
  //           console.log('[ServiceWorker] Fetched&Cached Data');
  //           return response;
  //         });
  //       })
  //   );
  // } else {
  //   e.respondWith(
  //     caches.match(e.request).then(function(response) {
  //       return response || fetch(e.request);
  //     })
  //   );
  // }
});

self.addEventListener('push', function (event) {
    console.log('Received a push messssage', event);

    var title = 'Yay a message.';
    var body = 'We have received a push message.';
    var icon = 'images/icons/icon-144x144.png';
    var tag = 'simple-push-demo-notification-tag';

    event.waitUntil(
      self.registration.showNotification(title, {
          body: body,
          icon: icon,
          tag: tag
      })
    );
});

self.addEventListener('notificationclick', function (event) {
    console.log('On notification click: ', event.notification.tag);
    // Android doesn’t close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == '/' && 'focus' in client)
                return client.focus();
        }
        if (clients.openWindow)
            return clients.openWindow('/');
    }));

});

