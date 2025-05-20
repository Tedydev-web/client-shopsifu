import type { NextConfig } from 'next'
import { readFileSync } from 'fs'
import { join } from 'path'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true // ✅ Tắt eslint khi build
  },
  reactStrictMode: false,
  // Cấu hình server với chứng chỉ SSL cho HTTPS
  serverOptions: {
    https: {
      key: readFileSync(join(process.cwd(), 'certs/localhost-key.pem')),
      cert: readFileSync(join(process.cwd(), 'certs/localhost.pem'))
    }
  }
}

export default nextConfig
