"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { preconnect } from "react-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import OffscriptMask from "./OffscriptMask";
import HeroMedia from "./HeroMedia";
import { markIntroDone } from "./introState";
import { ASSETS } from "@/lib/assets";
import { heroFrames } from "@/lib/projects";
import { EASE_PUSH } from "@/lib/utils";

/** The letters start a little larger and settle to the hero's size by the end. */
const START_SCALE = 1.1;
const SETTLE_SECONDS = 2.3;
const HOLD_MS = 2400;
const HOLD_MS_REDUCED = 900;

/** The sites the opening photo and video come from, so connections open early. */
function originOf(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol.startsWith("http") ? parsed.origin : null;
  } catch {
    return null;
  }
}

const PRECONNECT_ORIGINS = Array.from(
  new Set(
    [heroFrames[0]?.src ?? "", ASSETS.hero.video.trim()]
      .map(originOf)
      .filter((origin): origin is string => origin !== null)
  )
);

/**
 * INTRO
 *
 * Mounted once in layout.tsx. Next.js keeps the layout alive during client-side
 * navigation, so this plays only on a genuine page load or reload, never when
 * moving between Home, Work, Services, About or Contact.
 *
 * Sequence: wait for the first image, letters arrive one by one with media
 * visible inside them while they settle from slightly larger to the hero's
 * size, a short hold, then the screen dissolves into the hero, which uses the
 * identical mask and media position.
 *
 * While it plays, nothing heavy runs behind it: when it starts to dissolve it
 * reports in (introState), and only then do the hero's own video, the camera
 * frame and the 3D camera start their work.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const reduceMotion = useReducedMotion();
  const settle = useMotionValue(START_SCALE);

  // Open connections to the photo and video hosts as early as possible
  PRECONNECT_ORIGINS.forEach((origin) => preconnect(origin));

  // Start at the top and lock scroll while the intro plays
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Begin once the first image is decoded, or after a short fallback
  useEffect(() => {
    if (imageRef.current?.complete) setReady(true);
    const fallback = window.setTimeout(() => setReady(true), 1400);
    return () => window.clearTimeout(fallback);
  }, []);

  // The letters settle from slightly larger to the hero's size
  useEffect(() => {
    if (!ready || reduceMotion) return;
    const controls = animate(settle, 1, { duration: SETTLE_SECONDS, ease: EASE_PUSH });
    return () => controls.stop();
  }, [ready, reduceMotion, settle]);

  // Hold, then release: tell the rest of the page, then dissolve
  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(
      () => {
        document.documentElement.style.overflow = "";
        markIntroDone();
        setVisible(false);
      },
      reduceMotion ? HOLD_MS_REDUCED : HOLD_MS
    );
    return () => window.clearTimeout(timer);
  }, [ready, reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading Offscript"
          data-lenis-prevent
          className="fixed inset-0 z-[100] h-svh bg-ink"
          style={{ willChange: "opacity" }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.4 : 1.1, ease: [0.4, 0, 0.2, 1] }}
        >
          <OffscriptMask
            sequence={!reduceMotion}
            play={ready}
            overlayScale={reduceMotion ? undefined : settle}
          >
            {/* Same structure and end position as the hero media */}
            <motion.div
              className="absolute inset-[-6%]"
              initial={{ scale: 1.18, x: "-1.5%" }}
              animate={{ scale: 1.12, x: "0%" }}
              transition={{ duration: 2.8, ease: "linear" }}
            >
              <Image
                ref={imageRef}
                src={heroFrames[0].src}
                alt=""
                fill
                sizes="100vw"
                priority
                onLoad={() => setReady(true)}
                className="object-cover"
              />
              <HeroMedia />
            </motion.div>
          </OffscriptMask>

          <div
            aria-hidden="true"
            className="absolute inset-x-[var(--gutter)] bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] z-10"
          >
            <div className="h-px w-full bg-paper/15">
              <motion.div
                className="h-full origin-left bg-paper/70"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: ready ? 1 : 0 }}
                transition={{ duration: reduceMotion ? 0.8 : 2.3, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}