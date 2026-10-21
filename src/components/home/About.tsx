"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import FitImage from "@/components/ui/FitImage";
import Eyebrow from "@/components/ui/Eyebrow";
import { aboutCopy, aboutImages } from "@/lib/projects";
import { EASE_CUT } from "@/lib/utils";

const HIDDEN = "inset(0% 0% 100% 0%)";
const SHOWN = "inset(0% 0% 0% 0%)";

/**
 * ABOUT
 * Visually led: two photos composed around Offscript's own introduction (the
 * opening of the About page). Each photo keeps its own proportions.
 */
export default function About() {
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { clipPath: HIDDEN },
    whileInView: { clipPath: SHOWN },
    viewport: { once: true, margin: "-10% 0px" },
    transition: { duration: 1.1, ease: EASE_CUT, delay },
  });

  return (
    <section aria-label="About" className="bg-ink pb-28 pt-24 md:pb-44 md:pt-36">
      <div className="page-gutter">
        <Eyebrow index="03">About</Eyebrow>

        <div className="mt-12 grid items-start gap-10 md:mt-20 md:grid-cols-12 md:gap-8">
          <motion.div
            {...reveal()}
            className="overflow-hidden bg-graphite md:col-span-5"
          >
            <FitImage
              natural
              defaultRatio={4 / 5}
              src={aboutImages[0].src}
              alt={aboutImages[0].alt}
              sizes="(min-width: 768px) 42vw, 100vw"
            />
          </motion.div>

          <div className="flex flex-col justify-between gap-12 md:col-span-7 md:pl-[8%]">
            <div className="space-y-8">
              <h2 className="type-editorial text-[clamp(2.25rem,4.4vw,4.25rem)] tracking-[-0.04em]">
                About <span className="type-serif">Offscript</span>
              </h2>

              <p className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-fog md:text-lg">
                {aboutCopy.teaser}
              </p>

              <Link
                href="/about"
                className="type-mono inline-flex h-11 items-center gap-3 border-b border-current"
              >
                More about Offscript <span aria-hidden="true">→</span>
              </Link>
            </div>

            <motion.div
              {...reveal(0.15)}
              className="w-[78%] self-end overflow-hidden bg-graphite"
            >
              <FitImage
                natural
                defaultRatio={16 / 10}
                src={aboutImages[1].src}
                alt={aboutImages[1].alt}
                sizes="(min-width: 768px) 36vw, 78vw"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}