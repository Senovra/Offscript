"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { ASSETS } from "@/lib/assets";
import { videoUrl } from "@/lib/cloudinary";
import { assetPath } from "@/lib/utils";

/** Local fallback: public/video/hero.mp4 (muted, H.264, ideally under 10 MB). */
export const HERO_VIDEO = assetPath("/video/hero.mp4");

interface HeroMediaProps {
  src?: string;
}

/**
 * Optional looping video layer.
 * Source order: the Cloudinary URL in src/lib/assets.ts (hero.video), then the
 * local file. If neither plays, nothing is rendered and the photography
 * underneath stays visible. It pauses when off-screen and is skipped entirely
 * for visitors who prefer reduced motion.
 */
export default function HeroMedia({ src }: HeroMediaProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const cloudinary = ASSETS.hero.video.trim();
  const source = src ?? (cloudinary ? videoUrl(cloudinary) : HERO_VIDEO);

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
      src={source}
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