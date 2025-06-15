/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    optimizeCss: true,
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
}

module.exports = nextConfig 