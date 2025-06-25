## 离线缓存

1. 访问 https://chenqiuling.github.io/service-worker-demo

2. 断开网络刷新页面，加载缓存在service worker里的资源。

3. F12，打开控制台-应用-Service Workers 查看

4. 如需更新缓存，修改sw.js的CACHE_NAME

5. 本地预览，`npm i`下载http模块，执行`node server.js`，打开`http://localhost:90/`，Service Workers支持https和localhost