"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AmbientBackdropProps {
  /** The large outlined word behind the content. */
  word: string;
  /** Size classes for the word. */
  wordClassName?: string;
}

/**
 * The shared Offscript backdrop for the maintenance and 404 pages: a charcoal
 * pool of light, a faint outlined word, and a slow ambient glow.
 * The parent must be `relative` and `overflow-hidden`, and its content `relative z-10`.
 */
export default function AmbientBackdrop({
  word,
  wordClassName = "text-[clamp(3.1rem,18.5vw,22rem)]",
}: AmbientBackdropProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 55% at 50% 42%, #1c1c1f 0%, #121213 55%, #09090a 100%)",
        }}
      />

      <p
        className={`type-display absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center leading-none ${wordClassName}`}
        style={{
          color: "transparent",
          WebkitTextStroke: "1px rgba(242, 241, 237, 0.055)",
        }}
      >
        {word}
      </p>

      <motion.div
        className="absolute inset-0"
        animate={
          reduceMotion
            ? undefined
            : {
                background: [
                  "radial-gradient(48% 34% at 48% 35%, rgba(199,164,106,0.075), transparent 75%)",
                  "radial-gradient(48% 34% at 56% 43%, rgba(199,164,106,0.045), transparent 75%)",
                  "radial-gradient(48% 34% at 48% 35%, rgba(199,164,106,0.075), transparent 75%)",
                ],
              }
        }
        transition={{
          duration: 18,
          repeat: reduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(48% 34% at 48% 35%, rgba(199,164,106,0.065), transparent 75%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(9,9,10,0.12) 0%, transparent 35%, rgba(9,9,10,0.3) 100%)",
        }}
      />
    </div>
  );
}