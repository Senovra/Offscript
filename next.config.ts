import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * BASE PATH
 *   Project site (senovra.github.io/Offscript) : "/Offscript"  (the default in production)
 *   Custom domain (offscript.website)          : "" (empty)
 * Set NEXT_PUBLIC_BASE_PATH in the build environment to override. An empty
 * value means "serve from the root". In development it is always empty, so
 * `npm run dev` still runs at http://localhost:3000.
 *
 * assetPrefix is not set: Next derives it from basePath.
 */
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/Offscript" : "");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  output: "export",
  basePath,
  // Exports /about as about/index.html, which static hosts serve reliably
  trailingSlash: true,

  // Makes the base path available to the browser code (see assetPath in src/lib/utils.ts)
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  images: {
    // The image optimiser needs a server, which static hosting doesn't have.
    // Images are served as they are. Real media should be sized before upload.
    unoptimized: true,
    // Remote placeholder hosts, for development photography only.
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