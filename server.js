const http = require('http');
const fs = require('fs');
const path = require('path');

// 创建 HTTP 服务器重定向到 HTTPS
http.createServer((req, res) => {
  // 3. 处理静态资源请求
  const filePath = path.join(
    __dirname,
    'public',
    req.url === '/' ? 'index.html' : req.url
  );

  // 4. 检查文件是否存在
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // 文件不存在
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // 5. 根据扩展名设置 Content-Type
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.mp4': 'video/mp4'
    }[ext] || 'application/octet-stream';

    // 6. 读取并发送文件
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading ${filePath}`);
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
}).listen(90, () => {
  console.log('HTTP redirect server running on port 90');
    "http": "^0.0.1-security"
});