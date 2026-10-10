"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import OffscriptMask from "./OffscriptMask";
import HeroMedia from "./HeroMedia";
import { heroFrames } from "@/lib/projects";

/**
 * INTRO
 *
 * Mounted once in layout.tsx. Next.js keeps the layout alive during client-side
 * navigation, so this plays only on a genuine page load or reload, never when
 * moving between Home, Work, Services, About or Contact.
 *
 * Sequence: wait for the first image, letters arrive one by one with media
 * visible inside them, a short hold, then the screen dissolves into the hero,
 * which uses the identical mask and media position.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const reduceMotion = useReducedMotion();

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

  // Hold, then release
  useEffect(() => {
    if (!ready) return;
    const hold = reduceMotion ? 900 : 2400;
    const timer = window.setTimeout(() => {
      document.documentElement.style.overflow = "";
      setVisible(false);
    }, hold);
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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <OffscriptMask sequence={!reduceMotion} play={ready}>
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