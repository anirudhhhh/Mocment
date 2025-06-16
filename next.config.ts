import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint build errors
  },
  //for railway deployment
  compress: true,
  poweredByHeader: false,
  // Increase the memory limit for the build
  webpack: (config) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      minimize: true,
    }
    return config
  },
};

export default nextConfig;
