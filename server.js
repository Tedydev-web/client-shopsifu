const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// Cấu hình API Proxy
const API_URL = 'http://localhost:3000'

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, './certs/localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './certs/localhost.pem'))
}

const port = process.env.PORT || 8000

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)

    // Chuyển tiếp tất cả các yêu cầu /api đến API server
    if (parsedUrl.pathname.startsWith('/api')) {
      const apiProxy = createProxyMiddleware({
        target: API_URL,
        changeOrigin: true,
        secure: false,
        onProxyRes: function (proxyRes) {
          // Đảm bảo Access-Control-Allow-Credentials được đặt đúng
          proxyRes.headers['access-control-allow-origin'] = `https://localhost:${port}`
          proxyRes.headers['access-control-allow-credentials'] = 'true'
        }
      })

      return apiProxy(req, res)
    }

    handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Server sẵn sàng trên https://localhost:${port}`)
    console.log(`> API đã được proxy từ ${API_URL}`)
  })
})
