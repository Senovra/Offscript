import { imageUrl } from "./cloudinary";

/**
 * Custom loader for next/image (registered in next.config.ts).
 * Static hosting has no image server, so this builds the right-sized URL
 * directly. next/image calls it once per width to create the responsive srcset.
 */
export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}): string {
  return imageUrl(src, width);
}