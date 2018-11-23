importScripts('serviceworker-cache-polyfill.js');
// 相对于 origin的路径
var urlsToCache = [
  '/service-worker-demo/index.html',
];
var CACHE_NAME = 'demo-cache-v17:19';

// 安装service worker
self.addEventListener('install', function (event) {
  // 跳过等待阶段，直接到激活阶段
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// 捕获请求并返回缓存数据
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // 将请求和缓存中的资源进行匹配
    caches.match(event.request).then(function (res) {
      // 如果 service worker 有返回，就直接返回，减少一次 http 请求
      if (res) {
        return res;
      }

      // 如果 service worker 没有返回，就直接请求真实远程服务
      return fetch(event.request).then(function (response) {

        // 请求失败，直接返回失败的结果
        if (!response || response.status !== 200) {
          return response;
        }

        // 请求成功，将请求缓存起来
        return caches.open(CACHE_NAME).then(function (cache) {
          // 调用clone()，因为请求和响应流只能被读取一次，所以需要克隆一份，原始的会返回给浏览器，克隆的会发送到缓存中
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(function () {
      // 匹配失败或者网络不可用时，返回存在的某个缓存资源
      return caches.match('/service-worker-demo/index.html');
    })
  );
});

// 缓存更新
self.addEventListener('activate', function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          // 如果当前版本和缓存版本不一致，则删除缓存版本
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
