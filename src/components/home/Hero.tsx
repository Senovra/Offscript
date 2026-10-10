"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import OffscriptMask from "./OffscriptMask";
import HeroMedia from "./HeroMedia";
import { heroFrames } from "@/lib/projects";
import { clamp } from "@/lib/utils";

const HIDDEN = "inset(100% 0% 0% 0%)";
const SHOWN = "inset(0% 0% 0% 0%)";

/**
 * HERO
 *
 * One pinned stage in a 240svh track. Scroll drives it and scrolling back
 * reverses it:
 *
 *   0.20 to 0.30  CUT   second photograph wipes in inside the letters
 *   0.42 to 0.52  CUT   third photograph wipes in inside the letters
 *   0.55 to 0.90  PUSH  the letters grow until the media fills the screen
 *   0.88 to 1.00  the frame settles into the dark studio of the camera scene
 *
 * It starts in exactly the state the loader ends in, so the intro and the
 * hero read as one shot. No copy: the media and the letters carry it.
 */
export default function Hero() {
  const trackRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const mediaScale = useTransform(scrollYProgress, [0, 0.55, 1], [1.12, 1.04, 1]);
  const mediaX = useTransform(scrollYProgress, [0, 0.7], ["0%", "3%"]);

  const wipeTwo = useTransform(scrollYProgress, [0.2, 0.3], [HIDDEN, SHOWN]);
  const wipeThree = useTransform(scrollYProgress, [0.42, 0.52], [HIDDEN, SHOWN]);

  const overlayScale = useTransform(scrollYProgress, (value) =>
    Math.pow(10, clamp((value - 0.55) / 0.35, 0, 1))
  );
  const overlayOpacity = useTransform(scrollYProgress, [0.78, 0.9], [1, 0]);

  const settle = useTransform(scrollYProgress, [0.88, 1], [0, 1]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const frameStyles = [
    undefined,
    { clipPath: reduceMotion ? HIDDEN : wipeTwo },
    { clipPath: reduceMotion ? HIDDEN : wipeThree },
  ];

  return (
    <section
      ref={trackRef}
      aria-label="Introduction"
      className={reduceMotion ? "relative h-svh" : "relative h-[240svh]"}
    >
      <div className="stage-sticky">
        <h1 className="sr-only">Offscript</h1>

        <OffscriptMask
          overlayScale={reduceMotion ? undefined : overlayScale}
          overlayOpacity={reduceMotion ? undefined : overlayOpacity}
        >
          <motion.div
            className="absolute inset-[-6%] will-change-transform"
            style={
              reduceMotion
                ? { scale: 1.12 }
                : { scale: mediaScale, x: mediaX }
            }
          >
            {heroFrames.map((frame, index) => (
              <motion.div
                key={frame.src}
                className="absolute inset-0"
                style={frameStyles[index]}
              >
                <Image
                  src={frame.src}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover"
                />
              </motion.div>
            ))}
            <HeroMedia />
          </motion.div>
        </OffscriptMask>

        {/* Settles into the camera scene's studio tone */}
        {!reduceMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-ink"
            style={{ opacity: settle }}
          />
        )}

        {/* Scroll cue: a single quiet utility element */}
        <motion.div
          aria-hidden="true"
          className="type-mono pointer-events-none absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] z-20 flex flex-col items-center gap-3 text-paper"
          style={reduceMotion ? undefined : { opacity: cueOpacity }}
        >
          <span>Scroll</span>
          <span className="scroll-cue-line" />
        </motion.div>
      </div>
    </section>
  );
}