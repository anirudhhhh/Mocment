import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    ignoreDuringBuilds: true, // ⛔ Disables ESLint build errors
  },
};

export default nextConfig;
