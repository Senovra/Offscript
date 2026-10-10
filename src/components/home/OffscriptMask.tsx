"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, type MotionValue } from "framer-motion";
import { EASE_PUSH } from "@/lib/utils";

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
}

const WORD = "OFFSCRIPT";
const MEASURE_SIZE = 200;
const LINE_HEIGHT = 0.84;
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
 */
export default function OffscriptMask({
  children,
  overlayScale,
  overlayOpacity,
  sequence = false,
  play = true,
  letterDelay = 0.15,
  letterStep = 0.1,
}: OffscriptMaskProps) {
  const [portrait, setPortrait] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

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

    const fit = () => {
      wrap.style.fontSize = `${MEASURE_SIZE}px`;

      const row = wrap.querySelector<HTMLElement>("[data-row]");
      const widest = row ? row.offsetWidth : 0;
      if (!widest) return;

      const styles = getComputedStyle(box);
      const available =
        box.clientWidth -
        parseFloat(styles.paddingLeft) -
        parseFloat(styles.paddingRight);

      const share = portrait ? 0.94 : 0.8;
      let size = (MEASURE_SIZE * available * share) / widest;
      size = Math.min(size, box.clientHeight * 0.5);

      wrap.style.fontSize = `${size}px`;
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