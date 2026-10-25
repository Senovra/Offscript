import { ASSETS } from "@/lib/assets";
import { imageUrl } from "@/lib/cloudinary";

interface LogoProps {
  /**
   * "black" is the square logo with its solid black background and white
   * artwork (used in the header and footer). "white" is the white version.
   */
  variant?: "white" | "black";
  /** Size classes for the logo, e.g. "h-10 w-10". Keep it square. */
  className?: string;
  /** Classes for the text wordmark shown if no logo URL is set. */
  fallbackClassName?: string;
  /** Description for screen readers; use "" when the surrounding link is already labelled. */
  alt?: string;
}

/**
 * The Offscript logo, taken from src/lib/assets.ts. It is a 1024 x 1024 square
 * and is shown exactly as supplied: never recoloured, stretched or redrawn.
 * SVG files are delivered untouched. If no URL is set, the text wordmark shows.
 */
export default function Logo({
  variant = "black",
  className = "h-10 w-10",
  fallbackClassName = "type-display-wide",
  alt = "Offscript",
}: LogoProps) {
  const url = (
    variant === "white" ? ASSETS.logo.horizontalWhite : ASSETS.logo.horizontalBlack
  ).trim();

  if (!url) {
    return <span className={fallbackClassName}>Offscript</span>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl(url, 320)}
      alt={alt}
      width={1024}
      height={1024}
      decoding="async"
      className={`block aspect-square object-contain ${className}`}
    />
  );
}