"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, type MotionValue } from "framer-motion";
import { EASE_PUSH } from "@/lib/utils";

/** Where the OFFSCRIPT word sits inside the mask, in pixels from the stage's top-left. */
export interface WordmarkBounds {
  x: number;
  y: number;
  width: number;
  /** Estimated height of the capital letters (not the taller line box). */
  height: number;
  stageWidth: number;
  stageHeight: number;
}

interface OffscriptMaskProps {
  /** Media layer (image and/or video). It sits BEHIND the dark layer. */
  children: ReactNode;
  /** PUSH: scales the dark layer so the letters grow past the viewport. */
  overlayScale?: MotionValue<number>;
  /** Fades the dark layer out once the push is complete. */
  overlayOpacity?: MotionValue<number>;
  /** When true, letters stay hidden until `play` becomes true, then arrive one by one. */
  sequence?: boolean;
  play?: boolean;
  letterDelay?: number;
  letterStep?: number;
  /** Optional: told where the word sits whenever it is (re)fitted. */
  onMeasure?: (bounds: WordmarkBounds) => void;
}

const WORD = "OFFSCRIPT";
const MEASURE_SIZE = 200;
const LINE_HEIGHT = 0.84;
/** Approximate cap height of the display font, as a share of its font size. */
const CAP_HEIGHT = 0.7;
const HIDDEN_LETTER = { opacity: 0, y: "0.16em" };
const SHOWN_LETTER = { opacity: 1, y: 0 };

/**
 * THE OFFSCRIPT LETTER WINDOW
 *
 * A dark layer sits on top of the media. Inside it, OFFSCRIPT is real text set
 * in white. The layer uses mix-blend-mode: multiply:
 *   white (letters) x media = media shows through
 *   dark (everywhere else)  x media = dark
 * So the letters are genuine windows into whatever is underneath, whether
 * that is a photograph or a playing video.
 *
 * Sizing: the word is measured with the real font, then scaled uniformly to a
 * share of the width (never stretched). The word always stays on ONE line.
 * On portrait screens it takes more of the width and uses a narrower width
 * setting of the font, so the letters stay as tall as possible.
 *
 * `onMeasure` (optional) reports where the finished word sits, so overlays
 * such as the hero viewfinder can follow it. It does not affect the mask.
 */
export default function OffscriptMask({
  children,
  overlayScale,
  overlayOpacity,
  sequence = false,
  play = true,
  letterDelay = 0.15,
  letterStep = 0.1,
  onMeasure,
}: OffscriptMaskProps) {
  const [portrait, setPortrait] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Always call the latest callback without re-running the fit effect
  const measureRef = useRef(onMeasure);
  useEffect(() => {
    measureRef.current = onMeasure;
  }, [onMeasure]);

  useEffect(() => {
    const query = window.matchMedia("(max-aspect-ratio: 1/1)");
    const update = () => setPortrait(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    const wrap = wrapRef.current;
    if (!box || !wrap) return;

    let last = "";

    const fit = () => {
      wrap.style.fontSize = `${MEASURE_SIZE}px`;

      const row = wrap.querySelector<HTMLElement>("[data-row]");
      const widest = row ? row.offsetWidth : 0;
      if (!row || !widest) return;

      const styles = getComputedStyle(box);
      const available =
        box.clientWidth -
        parseFloat(styles.paddingLeft) -
        parseFloat(styles.paddingRight);

      const share = portrait ? 0.94 : 0.8;
      let size = (MEASURE_SIZE * available * share) / widest;
      size = Math.min(size, box.clientHeight * 0.5);

      wrap.style.fontSize = `${size}px`;

      // Report where the finished word sits (layout offsets, so scroll-driven
      // scaling of the overlay does not distort them)
      const report = measureRef.current;
      if (report) {
        const capHeight = size * CAP_HEIGHT;
        const bounds: WordmarkBounds = {
          x: row.offsetLeft,
          y: row.offsetTop + row.offsetHeight / 2 - capHeight / 2,
          width: row.offsetWidth,
          height: capHeight,
          stageWidth: box.clientWidth,
          stageHeight: box.clientHeight,
        };
        const key = [
          bounds.x,
          bounds.y,
          bounds.width,
          bounds.height,
          bounds.stageWidth,
          bounds.stageHeight,
        ]
          .map((value) => Math.round(value))
          .join(",");
        if (key !== last) {
          last = key;
          report(bounds);
        }
      }
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    document.fonts?.ready.then(fit);

    return () => observer.disconnect();
  }, [portrait]);

  const visible = !sequence || play;

  return (
    <div className="absolute inset-0 isolate overflow-hidden bg-black">
      <div className="absolute inset-0">{children}</div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          scale: overlayScale,
          opacity: overlayOpacity,
          mixBlendMode: "multiply",
          backgroundColor: "#0a0a0b",
        }}
      >
        <div
          ref={boxRef}
          className="absolute inset-0 flex items-center justify-center px-[var(--gutter)]"
        >
          <div
            ref={wrapRef}
            className="flex flex-col items-center"
            style={{
              fontSize: "12vw",
              color: "#ffffff",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontStretch: portrait ? "62%" : "70%",
              letterSpacing: "-0.03em",
              lineHeight: LINE_HEIGHT,
              textTransform: "uppercase",
            }}
          >
            <div data-row className="flex w-max whitespace-nowrap">
              {WORD.split("").map((letter, letterIndex) => (
                <motion.span
                  key={`${WORD}-${letterIndex}`}
                  className="inline-block"
                  initial={sequence ? HIDDEN_LETTER : false}
                  animate={visible ? SHOWN_LETTER : HIDDEN_LETTER}
                  transition={{
                    duration: 0.8,
                    ease: EASE_PUSH,
                    delay: visible && sequence ? letterDelay + letterIndex * letterStep : 0,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}