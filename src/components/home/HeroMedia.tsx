"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Drop your video here: public/video/hero.mp4 (muted, H.264, ideally under 10 MB). */
export const HERO_VIDEO = "/video/hero.mp4";

interface HeroMediaProps {
  src?: string;
}

/**
 * Optional looping video layer.
 * If the file does not exist, nothing is rendered and the photography
 * underneath stays visible. It pauses when off-screen and is skipped entirely
 * for visitors who prefer reduced motion.
 */
export default function HeroMedia({ src = HERO_VIDEO }: HeroMediaProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || failed) return;
    if (inView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, failed]);

  if (reduceMotion || failed) return null;

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      onCanPlay={() => setReady(true)}
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
      style={{ opacity: ready ? 1 : 0 }}
    />
  );
}