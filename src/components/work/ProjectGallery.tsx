"use client";

import { motion, useReducedMotion } from "framer-motion";
import { imageUrl } from "@/lib/cloudinary";
import type { GalleryImage } from "@/lib/projects";
import { EASE_CUT } from "@/lib/utils";

const WIDTHS = [640, 960, 1440, 2000];

/** A responsive srcset, or nothing when the address cannot be resized. */
function srcSetFor(src: string): string | undefined {
  const urls = WIDTHS.map((width) => imageUrl(src, width));
  if (new Set(urls).size < 2) return undefined;
  return urls.map((url, index) => `${url} ${WIDTHS[index]}w`).join(", ");
}

/**
 * Extra photos on a project page. Each photo keeps its own proportions (never
 * cropped or stretched) and the photos flow into one column on phones and two
 * on larger screens. Each opens with the same wipe the rest of the site uses.
 * Add photos in src/lib/assets.ts (see the guide). With none, nothing shows.
 */
export default function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const reduceMotion = useReducedMotion();
  if (images.length === 0) return null;

  return (
    <section aria-label="Project gallery" className="page-gutter pb-16 md:pb-24">
      <p className="type-mono mb-6 text-ash">Gallery</p>

      <div className="columns-1 gap-4 md:columns-2 md:gap-6">
        {images.map((image) => (
          <motion.figure
            key={image.src}
            className="mb-4 break-inside-avoid overflow-hidden bg-graphite md:mb-6"
            initial={reduceMotion ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 1, ease: EASE_CUT }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(image.src, 1440)}
              srcSet={srcSetFor(image.src)}
              sizes="(min-width: 768px) 46vw, 100vw"
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </motion.figure>
        ))}
      </div>
    </section>
  );
}