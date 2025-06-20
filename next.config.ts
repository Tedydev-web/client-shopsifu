import type { NextConfig } from "next";
import BundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Tắt eslint khi build
  },
  reactStrictMode: false,
};

const config = BundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default config(nextConfig);
