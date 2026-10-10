"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import type { MotionValue } from "framer-motion";

/**
 * Scroll choreography for the camera scene, in degrees.
 *   yaw   : 0 means the lens faces the viewer. Positive turns it to one side.
 *   scale : relative size multiplier
 *   y     : vertical offset as a fraction of the viewport height
 *
 * The camera enters at a three-quarter angle, holds, makes one slow full
 * orbit, settles facing the viewer, then moves slightly closer.
 */
interface Pose {
  at: number;
  yaw: number;
  pitch: number;
  scale: number;
  y: number;
}

const POSES: Pose[] = [
  { at: 0.0, yaw: 38, pitch: 8, scale: 0.94, y: 0.02 },
  { at: 0.12, yaw: 38, pitch: 8, scale: 0.94, y: 0.02 },
  { at: 0.85, yaw: -360, pitch: 3, scale: 1.0, y: 0.0 },
  { at: 1.0, yaw: -360, pitch: 0, scale: 1.22, y: 0.0 },
];

/** Writes the interpolated pose for a scroll progress into `out`. */
function sample(progress: number, out: Pose): void {
  const first = POSES[0];
  const last = POSES[POSES.length - 1];

  let from = first;
  let to = first;
  let t = 0;

  if (progress >= last.at) {
    from = last;
    to = last;
  } else if (progress > first.at) {
    for (let i = 0; i < POSES.length - 1; i++) {
      if (progress <= POSES[i + 1].at) {
        from = POSES[i];
        to = POSES[i + 1];
        t = MathUtils.smootherstep(progress, from.at, to.at);
        break;
      }
    }
  }

  out.yaw = MathUtils.lerp(from.yaw, to.yaw, t);
  out.pitch = MathUtils.lerp(from.pitch, to.pitch, t);
  out.scale = MathUtils.lerp(from.scale, to.scale, t);
  out.y = MathUtils.lerp(from.y, to.y, t);
}

const DEG = Math.PI / 180;

interface CameraRigProps {
  progress: MotionValue<number>;
  children: ReactNode;
}

/**
 * Moves the camera model from scroll progress. Scroll is read from a Framer
 * Motion value inside the render loop, so there is no React state and no
 * re-render per scroll event. Values are damped so stepped mouse-wheel input
 * still looks smooth. Portrait screens get their own size logic.
 */
export default function CameraRig({ progress, children }: CameraRigProps) {
  const group = useRef<Group>(null);
  const goal = useRef<Pose>({ ...POSES[0] });
  const current = useRef<Pose | null>(null);

  useFrame((state, delta) => {
    const target = group.current;
    if (!target) return;

    sample(progress.get(), goal.current);
    if (!current.current) current.current = { ...goal.current };

    const now = current.current;
    const want = goal.current;
    now.yaw = MathUtils.damp(now.yaw, want.yaw, 4, delta);
    now.pitch = MathUtils.damp(now.pitch, want.pitch, 4, delta);
    now.scale = MathUtils.damp(now.scale, want.scale, 4, delta);
    now.y = MathUtils.damp(now.y, want.y, 4, delta);

    const { viewport } = state;
    const tall = viewport.width < viewport.height;
    const fit = tall
      ? viewport.width * 0.88
      : Math.min(viewport.height * 0.66, viewport.width * 0.82);

    // A slow, barely visible float so the object never feels frozen
    const bob = Math.sin(state.clock.elapsedTime * 0.6) * 0.012 * viewport.height;

    target.position.set(0, now.y * viewport.height + bob, 0);
    target.scale.setScalar(fit * now.scale);
    target.rotation.order = "YXZ";
    target.rotation.set(now.pitch * DEG, now.yaw * DEG, 0);
  });

  return <group ref={group}>{children}</group>;
}