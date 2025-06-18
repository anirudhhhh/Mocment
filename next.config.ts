import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint build errors
  },
  // For railway deployment
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
  },
  // Webpack optimization
  webpack: (config) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      minimize: true,
    }
    return config
  },
  // Remove any env configuration that sets NODE_ENV
  // NODE_ENV is automatically handled by Next.js
};

export default nextConfig;