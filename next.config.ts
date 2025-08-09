import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Tắt eslint khi build
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ✅ Cho phép tất cả hostname với HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // ✅ Cho phép tất cả hostname với HTTP
      },
    ],
  },
};

export default withNextIntl(nextConfig);