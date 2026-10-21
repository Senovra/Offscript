import { ASSETS } from "@/lib/assets";
import { imageUrl } from "@/lib/cloudinary";

interface LogoProps {
  /** "white" for dark backgrounds (header, footer), "black" for light ones. */
  variant?: "white" | "black";
  /** Size classes for the logo image, e.g. "h-6 w-auto". */
  className?: string;
  /** Classes for the text wordmark shown until a logo URL is added. */
  fallbackClassName?: string;
}

/**
 * The Offscript logo. Uses the Cloudinary logo from src/lib/assets.ts once its
 * URL is pasted in, and the text wordmark until then. SVG logos are delivered
 * exactly as uploaded; PNG logos are resized.
 */
export default function Logo({
  variant = "white",
  className = "h-6 w-auto",
  fallbackClassName = "type-display-wide",
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
      src={imageUrl(url, 640)}
      alt=""
      decoding="async"
      className={`block ${className}`}
    />
  );
}