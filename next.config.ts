import type { NextConfig } from "next";

/**
 * Next.js configuration for the Offscript website.
 *
 * Remote image hosts below are allowed for DEVELOPMENT PLACEHOLDER photography only.
 * Once real Offscript media is stored in /public/images or a production media host,
 * these entries can be removed or replaced.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    // Modern formats first; Next picks the best one the browser supports.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;