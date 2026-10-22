"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CameraBackdrop, CameraReadout } from "./CameraOverlay";
import { useIntroDone } from "./introState";
import { assetPath, clamp } from "@/lib/utils";

/**
 * Set to false to remove the camera from the page entirely (the 3D code stays
 * in the project).
 */
const CAMERA_ENABLED = true;

/** The 3D chunk is only downloaded on demand, never on the server. */
const CameraScene = dynamic(() => import("@/three/CameraScene"), { ssr: false });

/** Same file the camera loads, fetched early so it is already cached. */
const MODEL_FILE = assetPath("/models/offscript-camera.glb");

/**
 * Timing, counted from the moment the loading screen starts to dissolve:
 *   WARM : the 3D code and the model file are downloaded quietly
 *   ARM  : the 3D scene itself is started
 * Both run in a spare moment of the browser, never while the loader plays.
 */
const WARM_DELAY_MS = 1200;
const ARM_DELAY_MS = 2400;

/** Warm-up runs once per page load, however often the section re-renders. */
let warmed = false;

function warmDownloads() {
  if (warmed) return;
  warmed = true;
  // Pulls the 3D code into the cache; the dynamic import above then resolves at once
  void import("@/three/CameraScene");
  // Pulls the model into the browser cache for the loader that fetches it later
  fetch(MODEL_FILE).catch(() => {});
}

/** Static fallback: aperture rings, shown when WebGL is unavailable. */
function LensGraphic() {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 h-[min(70vw,56vh)] w-[min(70vw,56vh)] -translate-x-1/2 -translate-y-1/2 text-paper"
    >
      {[92, 70, 48, 26].map((radius, index) => (
        <circle
          key={radius}
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={index === 0 ? 1.2 : 0.6}
          strokeOpacity={0.5 - index * 0.08}
        />
      ))}
    </svg>
  );
}

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/**
 * CAMERA SIGNATURE
 *
 * A dedicated pinned scene between the hero and Work. The camera makes one
 * slow turn while the six disciplines appear behind it, one for each sixth of
 * the turn, and a ring marker travels round with it.
 *
 * Loading, so a fast scroll still finds the camera ready WITHOUT slowing the
 * loading screen:
 *   1. Nothing 3D starts while the loader plays.
 *   2. Once it has dissolved, the 3D code and the model are downloaded in a
 *      spare moment, and a little later the scene itself is started.
 *   3. If the visitor scrolls towards the camera first (within one screen of
 *      it), everything starts at once.
 *   4. If a visitor still arrives before it is ready, a small "Loading camera"
 *      label shows until the camera fades in at the right angle.
 * Visitors with Data Saver on only load it when the section is near.
 *
 * Reduced motion: no pinned track, the camera rests in its opening pose.
 * No WebGL: a static lens graphic.
 */
export default function CameraSection() {
  const trackRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const introDone = useIntroDone();
  /** Within one screen of the camera section: the visitor is on the way. */
  const soon = useInView(trackRef, { margin: "100% 0px 100% 0px" });
  const visible = useInView(trackRef, { margin: "0px" });

  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);

  const resting = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const source = reduceMotion ? resting : scrollYProgress;

  /** 0 to 1 across the camera's full turn (matches CameraRig's poses). */
  const turn = useTransform(source, (value) => clamp((value - 0.12) / 0.73, 0, 1));
  const dissolve = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    try {
      const probe = document.createElement("canvas");
      setWebgl(Boolean(probe.getContext("webgl2") || probe.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

  // Start the 3D scene: never during the loader, and in a spare moment after it
  useEffect(() => {
    if (webgl !== true || !introDone || armed) return;

    // On screen, or one screen away: no waiting
    if (visible || soon) {
      warmDownloads();
      setArmed(true);
      return;
    }

    // Data Saver: wait until the visitor is on the way
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;

    const idleWindow = window as IdleWindow;
    const timers: number[] = [];
    const idles: number[] = [];

    const whenIdle = (task: () => void) => {
      if (idleWindow.requestIdleCallback) {
        idles.push(idleWindow.requestIdleCallback(task, { timeout: 2000 }));
      } else {
        task();
      }
    };

    timers.push(window.setTimeout(() => whenIdle(warmDownloads), WARM_DELAY_MS));
    timers.push(window.setTimeout(() => whenIdle(() => setArmed(true)), ARM_DELAY_MS));

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      idles.forEach((handle) => idleWindow.cancelIdleCallback?.(handle));
    };
  }, [webgl, introDone, visible, soon, armed]);

  if (!CAMERA_ENABLED) return null;

  return (
    <section
      ref={trackRef}
      aria-label="Camera"
      className={reduceMotion ? "relative h-svh" : "relative h-[320svh] md:h-[400svh]"}
    >
      <div
        className={
          reduceMotion ? "relative h-svh overflow-hidden" : "stage-sticky"
        }
      >
        {/* Studio: a soft pool of light on charcoal */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(62% 56% at 50% 46%, #2b2b2e 0%, #161617 55%, #0a0a0b 100%)",
          }}
        />

        {/* Soft floor shadow */}
        <div
          aria-hidden="true"
          className="absolute bottom-[17%] left-1/2 h-[7%] w-[46%] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)",
          }}
        />

        {/* Behind the camera: discipline words and the turning ring */}
        <CameraBackdrop turn={turn} />

        {webgl === false && <LensGraphic />}

        {armed && webgl && (
          <div className="pointer-events-none absolute inset-0">
            <CameraScene
              progress={source}
              active={visible}
              onReady={() => setReady(true)}
            />
          </div>
        )}

        {/* Shown only if the visitor arrives before the camera is ready */}
        {webgl && (
          <div
            role="status"
            aria-live="polite"
            className={`type-mono pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 text-fog transition-opacity duration-700 ${
              ready ? "opacity-0" : "opacity-100"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full bg-paper ${
                reduceMotion ? "" : "animate-pulse"
              }`}
            />
            {ready ? "" : "Loading camera"}
          </div>
        )}

        {/* Utility labels */}
        <div
          aria-hidden="true"
          className="type-mono pointer-events-none absolute inset-x-[var(--gutter)] bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] flex items-end justify-between gap-4 text-fog"
        >
          {reduceMotion ? (
            <span />
          ) : (
            <motion.span style={{ opacity: cueOpacity }}>Scroll to turn</motion.span>
          )}
          <CameraReadout turn={turn} />
        </div>

        {/* Dissolve into the Work section's surface */}
        {!reduceMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-coal"
            style={{ opacity: dissolve }}
          />
        )}
      </div>
    </section>
  );
}