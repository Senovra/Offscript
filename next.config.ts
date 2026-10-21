import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages, served from the root of offscript.website.
 *
 * BASE PATH
 *   Production (offscript.website) : "" (empty). The site lives at the root.
 *   The workflow sets NEXT_PUBLIC_BASE_PATH to "" and this file now defaults to
 *   "" as well, so a build made without the variable can no longer produce
 *   /Offscript paths by accident. Only set it for a project-site URL such as
 *   senovra.github.io/Offscript.
 *
 * IMAGES
 *   The default image optimiser needs a server, which static hosting does not
 *   have. Instead a small custom loader (src/lib/imageLoader.ts) builds the
 *   right-sized URL itself: Cloudinary files are resized and converted by
 *   Cloudinary, Unsplash placeholders by Unsplash. No remote host list is
 *   needed because nothing is fetched through Next.js.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  output: "export",
  basePath,
  trailingSlash: true,

  // Makes the base path available to browser code (see assetPath in src/lib/utils.ts)
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  images: {
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
  },
};

export default nextConfig;