import { imageUrl } from "@/lib/cloudinary";

const SENOVRA_URL = "https://www.senovra.com/";
const SENOVRA_LOGO =
  "https://res.cloudinary.com/css2xcvk/image/upload/v1792555517/Senovra_Official_Logo_Transparent_Background.png";

/**
 * A small, quiet developer credit: "Made and developed by" and the square
 * Senovra logo, which links to Senovra's website in a new tab.
 */
export default function SenovraCredit({ className = "" }: { className?: string }) {
  return (
    <p className={`type-mono inline-flex items-center gap-2.5 text-ash ${className}`}>
      <span>Made and developed by</span>
      <a
        href={SENOVRA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Senovra (opens in a new tab)"
        className="-m-1.5 inline-flex items-center justify-center p-1.5 opacity-90 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 active:opacity-100"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl(SENOVRA_LOGO, 160)}
          alt="Senovra"
          width={28}
          height={28}
          loading="lazy"
          decoding="async"
          className="h-10 w-10 object-contain"
        />
      </a>
    </p>
  );
}