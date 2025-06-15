import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    optimizeCss: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint build errors
  },
  // Increase the memory limit for the build
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      minimize: true,
    }
    return config
  },
  // Ensure proper handling of environment variables
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },
};

export default nextConfig;
