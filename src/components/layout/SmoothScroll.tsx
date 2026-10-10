"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling.
 *
 * Only enabled for mouse/trackpad devices (hover + fine pointer) and only when
 * the visitor has NOT asked for reduced motion. Phones and tablets keep their
 * native momentum scrolling, which is smoother and cheaper on touch.
 *
 * Framer Motion's useScroll reads the normal window scroll position, so
 * scroll-linked animations work unchanged.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const fineMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!fineMouse || reduceMotion) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}