"use client";

import { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import CameraRig from "./CameraRig";
import OffscriptCamera from "./OffscriptCamera";

interface CameraSceneProps {
  /** Camera section scroll progress, 0 to 1. */
  progress: MotionValue<number>;
  /** False when the section is off-screen. */
  active: boolean;
  /** Called once the model has loaded and the camera is showing. */
  onReady?: () => void;
}

/**
 * Transparent canvas over the studio background (drawn in CSS by CameraSection).
 * Low-key studio lighting with rim lights so the black body keeps its outline.
 * Everything is procedural, so no HDR file is downloaded.
 *
 * Off-screen the loop runs in "demand" mode, not "never": that still renders
 * one frame, so the GPU compiles shaders and uploads textures before the
 * visitor arrives, and the camera appears without a hitch.
 */
export default function CameraScene({ progress, active, onReady }: CameraSceneProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoaded = useCallback(() => {
    setLoaded(true);
    onReady?.();
  }, [onReady]);

  const coarsePointer =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  return (
    <div
      className="absolute inset-0 transition-opacity duration-700"
      style={{ opacity: loaded ? 1 : 0 }}
    >
      <Canvas
        frameloop={active ? "always" : "demand"}
        dpr={coarsePointer ? [1, 1.25] : [1, 1.75]}
        camera={{ fov: 30, position: [0, 0, 6], near: 0.1, far: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.18} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <directionalLight position={[-4, 2, -4]} intensity={1.4} />

        <Suspense fallback={null}>
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={3} position={[0, 5, 0]} scale={[10, 4, 1]} rotation-x={Math.PI / 2} />
            <Lightformer form="rect" intensity={2} position={[-6, 1, 2]} scale={[2.5, 8, 1]} />
            <Lightformer form="rect" intensity={1.6} position={[6, 0, 2]} scale={[2.5, 7, 1]} />
            <Lightformer form="rect" intensity={5} position={[-4, 2, -6]} scale={[2, 8, 1]} />
            <Lightformer form="rect" intensity={5} position={[4, 2, -6]} scale={[2, 8, 1]} />
          </Environment>

          <CameraRig progress={progress}>
            <OffscriptCamera onLoaded={handleLoaded} />
          </CameraRig>
        </Suspense>
      </Canvas>
    </div>
  );
}