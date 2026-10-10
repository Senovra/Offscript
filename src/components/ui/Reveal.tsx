"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn, EASE_PUSH } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Masked line reveal: content rises out of a clipping window.
 * It is a "cut" in the type, not a fade. Use it for headings only.
 * With reduced motion the content is simply shown.
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        ref={ref}
        initial={reduceMotion ? false : { y: "110%" }}
        animate={reduceMotion || inView ? { y: "0%" } : { y: "110%" }}
        transition={{ duration: 0.95, ease: EASE_PUSH, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}