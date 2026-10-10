"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import type { WordmarkBounds } from "./OffscriptMask";
import { clamp } from "@/lib/utils";

/** Keeps the starting frame clear of the fixed navbar. */
const TOP_LIMIT = 76;
/** Keeps the starting frame clear of the scroll cue. */
const BOTTOM_LIMIT = 56;
/** Minimum distance of the starting frame from the screen sides. */
const SIDE_LIMIT = 10;

/** The frame opens out between these points of the hero's scroll (0 to 1). */
const OPEN_START = 0.03;
const OPEN_END = 0.4;

const FPS = 24;
const LINE = "rgba(242, 241, 237, 0.55)";
const TICK = "rgba(242, 241, 237, 0.32)";

/**
 * The frame is removed once the visitor scrolls past this section. It is found
 * by its aria-label (see src/components/home/Capabilities.tsx).
 */
const LAST_SECTION = 'section[aria-label="Capabilities"]';

/**
 * Where the frame ends up. The sides and bottom hug the screen; the top edge
 * stays BELOW the fixed navbar. The corner arms are capped to fit inside the
 * page margin (the gutter) so they never reach the website's content.
 */
const END_LEFT = "4px";
const END_RIGHT = "4px";
const END_BOTTOM = "calc(4px + env(safe-area-inset-bottom, 0px))";
const END_TOP = "calc(var(--header-h) + env(safe-area-inset-top, 0px) + 6px)";
const END_ARM = "max(8px, min(26px, calc(var(--gutter) - 14px)))";

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

function startRect(bounds: WordmarkBounds): Rect | null {
  const { x, y, width, height, stageWidth, stageHeight } = bounds;

  const padX = clamp(height * 0.35, 14, 56);
  const padY = clamp(height * 0.3, 30, 64);

  const left = Math.max(SIDE_LIMIT, x - padX);
  const right = Math.min(stageWidth - SIDE_LIMIT, x + width + padX);
  const top = Math.max(TOP_LIMIT, y - padY);
  const bottom = Math.min(stageHeight - BOTTOM_LIMIT, y + height + padY);

  const w = right - left;
  const h = bottom - top;
  if (w < 80 || h < 60) return null;

  return {
    left,
    top,
    right: stageWidth - right,
    bottom: stageHeight - bottom,
    width: w,
    height: h,
  };
}

function easeInOut(value: number): number {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

/** Running timecode: real time since the page loaded, written straight to the DOM. */
function Timecode({ running }: { running: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const origin = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    if (origin.current === null) origin.current = performance.now();

    const pad = (value: number) => String(value).padStart(2, "0");

    const write = () => {
      const node = ref.current;
      if (!node || origin.current === null || document.hidden) return;
      const elapsed = Math.max(0, performance.now() - origin.current);
      const totalFrames = Math.floor((elapsed / 1000) * FPS);
      const frames = totalFrames % FPS;
      const totalSeconds = Math.floor(totalFrames / FPS);
      node.textContent = `${pad(Math.floor(totalSeconds / 3600))}:${pad(
        Math.floor(totalSeconds / 60) % 60
      )}:${pad(totalSeconds % 60)}:${pad(frames)}`;
    };

    write();
    const timer = window.setInterval(write, 1000 / FPS);
    return () => window.clearInterval(timer);
  }, [running]);

  return <span ref={ref}>00:00:00:00</span>;
}

/** Small battery glyph for the top-right corner. */
function Battery() {
  return (
    <svg viewBox="0 0 20 10" width="16" height="8" fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="16" height="9" stroke="currentColor" />
      <rect x="17.5" y="3" width="2" height="4" fill="currentColor" />
      <rect x="2" y="2" width="3" height="6" fill="currentColor" />
      <rect x="6.5" y="2" width="3" height="6" fill="currentColor" />
      <rect x="11" y="2" width="3" height="6" fill="currentColor" />
    </svg>
  );
}

/** The frame's box. Each edge slides from the wordmark frame to the screen inset. */
const BOX: CSSProperties = {
  position: "absolute",
  left: "calc(var(--sl) + (var(--el) - var(--sl)) * var(--t))",
  top: "calc(var(--st) + (var(--et) - var(--st)) * var(--t))",
  right: "calc(var(--sr) + (var(--er) - var(--sr)) * var(--t))",
  bottom: "calc(var(--sb) + (var(--eb) - var(--sb)) * var(--t))",
};

const LABEL =
  "type-mono absolute whitespace-nowrap text-paper text-[0.5625rem] md:text-[0.625rem]";

interface HeroViewfinderProps {
  bounds: WordmarkBounds | null;
  progress: MotionValue<number>;
}

/**
 * VIEWFINDER FRAME
 *
 * At the top of the homepage it is a restrained camera frame around the
 * OFFSCRIPT wordmark, with a light camera HUD (REC, CAM 01 and battery, a
 * running timecode, 4K 24P and an exposure line).
 *
 * As the visitor scrolls the frame opens out and the HUD text fades away, so
 * nothing is ever drawn over the website's text. What remains is a set of
 * small corner brackets and side ticks that sit inside the page margin, with
 * the top edge kept below the navbar. Once the visitor scrolls past the
 * Capabilities section the whole frame fades out, and it returns when
 * scrolling back up.
 *
 * It is drawn into document.body through a portal so later sections cannot
 * paint over it. It is fixed, never receives pointer events, sits below the
 * navbar and menu, and disappears with the hero when the visitor leaves the
 * homepage.
 */
export default function HeroViewfinder({ bounds, progress }: HeroViewfinderProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [pastContent, setPastContent] = useState(false);
  const [hudOn, setHudOn] = useState(true);
  const lastSection = useRef<Element | null>(null);

  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
    const timer = window.setTimeout(() => setIntroDone(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  // The frame is "past content" once the end of the Capabilities section has
  // come up into view (the pinned stage has finished and About begins).
  const checkPosition = useCallback(() => {
    if (!lastSection.current || !lastSection.current.isConnected) {
      lastSection.current = document.querySelector(LAST_SECTION);
    }
    const section = lastSection.current;
    if (!section) return;
    setPastContent(section.getBoundingClientRect().bottom <= window.innerHeight + 2);
  }, []);

  useMotionValueEvent(scrollY, "change", checkPosition);

  useEffect(() => {
    if (!mounted) return;
    checkPosition();
    window.addEventListener("resize", checkPosition);
    return () => window.removeEventListener("resize", checkPosition);
  }, [mounted, checkPosition]);

  // 0 = frame around the wordmark, 1 = the frame opened out to the screen
  const open = useTransform(progress, (value) =>
    easeInOut(clamp((value - OPEN_START) / (OPEN_END - OPEN_START), 0, 1))
  );

  useMotionValueEvent(open, "change", (value) => setHudOn(value < 0.5));

  // HUD text is only for the opening state, so it never sits over content
  const hudOpacity = useTransform(open, [0, 0.35], [0.9, 0]);
  const verticalTicks = useTransform(open, [0, 0.4], [1, 0]);

  if (!mounted) return null;

  const start = bounds ? startRect(bounds) : null;
  if (!reduceMotion && !start) return null;

  const startArm = start ? clamp(start.width * 0.05, 14, 26) : 12;

  const vars = {
    "--t": reduceMotion ? 1 : open,
    "--sl": `${start ? start.left : 4}px`,
    "--st": `${start ? start.top : 4}px`,
    "--sr": `${start ? start.right : 4}px`,
    "--sb": `${start ? start.bottom : 4}px`,
    "--el": END_LEFT,
    "--et": END_TOP,
    "--er": END_RIGHT,
    "--eb": END_BOTTOM,
    "--arm": `calc(${startArm}px + (${END_ARM} - ${startArm}px) * var(--t))`,
  };

  const corners = [
    { key: "tl", style: { left: 0, top: 0, borderTopWidth: 1, borderLeftWidth: 1 } },
    { key: "tr", style: { right: 0, top: 0, borderTopWidth: 1, borderRightWidth: 1 } },
    { key: "bl", style: { left: 0, bottom: 0, borderBottomWidth: 1, borderLeftWidth: 1 } },
    { key: "br", style: { right: 0, bottom: 0, borderBottomWidth: 1, borderRightWidth: 1 } },
  ];

  const tick: CSSProperties = { position: "absolute", background: TICK };

  // Fades the whole layer out past Capabilities (and in once, after the intro)
  const layerAnimate = { opacity: pastContent ? 0 : 1 };
  const layerTransition = {
    duration: pastContent ? 0.4 : introDone ? 0.5 : reduceMotion ? 0 : 1.1,
    delay: introDone || reduceMotion ? 0 : 0.4,
  };

  return createPortal(
    <>
      {/* Lines: blended against the page so they read on dark and light sections */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] h-svh w-full"
        style={{ ...vars, mixBlendMode: "difference" } as unknown as MotionStyle}
        initial={{ opacity: 0 }}
        animate={layerAnimate}
        transition={layerTransition}
      >
        <div style={BOX}>
          {/* Corner brackets (arms shrink to fit the page margin once open) */}
          {corners.map((corner) => (
            <span
              key={corner.key}
              style={{
                position: "absolute",
                width: "var(--arm)",
                height: "var(--arm)",
                borderStyle: "solid",
                borderColor: LINE,
                borderWidth: 0,
                ...corner.style,
              }}
            />
          ))}

          {/* Side ticks: always inside the margin */}
          <span style={{ ...tick, left: 0, top: "50%", width: 6, height: 1 }} />
          <span style={{ ...tick, right: 0, top: "50%", width: 6, height: 1 }} />

          {/* Top and bottom ticks: only while the frame is around the wordmark */}
          {!reduceMotion && (
            <motion.div className="absolute inset-0" style={{ opacity: verticalTicks }}>
              <span style={{ ...tick, left: "50%", top: 0, width: 1, height: 8 }} />
              <span style={{ ...tick, left: "50%", bottom: 0, width: 1, height: 8 }} />
            </motion.div>
          )}

          {/* Camera HUD: only while the frame is around the wordmark */}
          {!reduceMotion && (
            <motion.div className="absolute inset-0" style={{ opacity: hudOpacity }}>
              <span className={`${LABEL} flex items-center gap-2`} style={{ left: 12, top: 8 }}>
                <span className="h-[7px] w-[7px] shrink-0" />
                REC
              </span>

              <span className={`${LABEL} flex items-center gap-2`} style={{ right: 12, top: 8 }}>
                CAM 01
                <Battery />
              </span>

              <span className={LABEL} style={{ left: 12, bottom: 8 }}>
                <Timecode running={hudOn && !pastContent} />
              </span>

              <span
                className={`${LABEL} hidden md:block`}
                style={{ left: "50%", bottom: 8, transform: "translateX(-50%)" }}
              >
                ISO 800 · F2.8 · 1/48
              </span>

              <span className={LABEL} style={{ right: 12, bottom: 8 }}>
                4K · 24P
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* The red dot lives in its own, unblended layer so it stays red */}
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[61] h-svh w-full"
          style={vars as unknown as MotionStyle}
          initial={{ opacity: 0 }}
          animate={layerAnimate}
          transition={layerTransition}
        >
          <div style={BOX}>
            <motion.div className="absolute inset-0" style={{ opacity: hudOpacity }}>
              <span
                className={`${LABEL} flex items-center gap-2 text-transparent`}
                style={{ left: 12, top: 8 }}
              >
                <span
                  className="h-[7px] w-[7px] shrink-0 animate-pulse rounded-full"
                  style={{ background: "#e5362b" }}
                />
                REC
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>,
    document.body
  );
}