"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Eyebrow from "@/components/ui/Eyebrow";
import Note from "@/components/ui/Note";
import { aboutImages } from "@/lib/projects";
import { EASE_CUT } from "@/lib/utils";

const HIDDEN = "inset(0% 0% 100% 0%)";
const SHOWN = "inset(0% 0% 0% 0%)";

/**
 * ABOUT
 * Visually led: two placeholder images composed around the heading.
 * The real introduction comes from Offscript.
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

        <div className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-8">
          <motion.div
            {...reveal()}
            className="relative aspect-[4/5] overflow-hidden bg-graphite md:col-span-5"
          >
            <Image
              src={aboutImages[0].src}
              alt={aboutImages[0].alt}
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          <div className="flex flex-col justify-between gap-12 md:col-span-7 md:pl-[8%]">
            <div className="space-y-8">
              <h2 className="type-editorial text-[clamp(2.25rem,4.4vw,4.25rem)] tracking-[-0.04em]">
                About <span className="type-serif">Offscript</span>
              </h2>

              <Note>
                <p>
                  The introduction goes here. A couple of
                  sentences in your own words is plenty.
                </p>
              </Note>

              <Link
                href="/about"
                className="type-mono inline-flex h-11 items-center gap-3 border-b border-current"
              >
                More about Offscript <span aria-hidden="true">→</span>
              </Link>
            </div>

            <motion.div
              {...reveal(0.15)}
              className="relative aspect-[16/10] w-[78%] self-end overflow-hidden bg-graphite"
            >
              <Image
                src={aboutImages[1].src}
                alt={aboutImages[1].alt}
                fill
                sizes="(min-width: 768px) 36vw, 78vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}