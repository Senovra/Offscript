"use client";

import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { services } from "@/lib/projects";
import { clamp } from "@/lib/utils";

const COUNT = services.length;
const STEP = 1 / COUNT;

function currentIndex(turn: number): number {
  return clamp(Math.floor(turn * COUNT), 0, COUNT - 1);
}

/** One discipline name, set in outline, drifting sideways as the camera turns. */
function DisciplineWord({
  index,
  turn,
}: {
  index: number;
  turn: MotionValue<number>;
}) {
  const title = services[index].title;
  const first = index === 0;
  const last = index === COUNT - 1;
  const start = index * STEP;
  const end = (index + 1) * STEP;

  const opacity = useTransform(
    turn,
    [first ? -2 : start - 0.05, first ? -1 : start + 0.02, last ? 3 : end - 0.03, last ? 4 : end + 0.03],
    [0, 1, 1, 0]
  );
  const x = useTransform(turn, [start - 0.05, end + 0.03], ["10%", "-10%"]);

  const vw = Math.min(18, 90 / (title.length * 0.7));

  return (
    <motion.p
      className="type-display-wide absolute whitespace-nowrap select-none"
      style={{
        opacity,
        x,
        fontSize: `min(12rem, ${vw.toFixed(2)}vw)`,
        color: "transparent",
        WebkitTextStroke: "1px rgba(242, 241, 237, 0.2)",
      }}
    >
      {title}
    </motion.p>
  );
}

/**
 * Sits BEHIND the camera. The discipline names change as the camera turns,
 * and a thin ring with six ticks carries a marker round as it rotates.
 */
export function CameraBackdrop({ turn }: { turn: MotionValue<number> }) {
  const [active, setActive] = useState(0);
  useMotionValueEvent(turn, "change", (value) => setActive(currentIndex(value)));

  const markerRotation = useTransform(turn, (value) => value * 360);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {services.map((service, index) => (
          <DisciplineWord key={service.id} index={index} turn={turn} />
        ))}
      </div>

      <div className="absolute left-1/2 top-1/2 aspect-square w-[min(92vw,84svh)] -translate-x-1/2 -translate-y-1/2 text-paper">
        <svg viewBox="0 0 240 240" className="absolute inset-0 h-full w-full">
          <circle
            cx="120"
            cy="120"
            r="100"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.22"
          />

          {services.map((service, index) => {
            const angle = ((-90 + index * (360 / COUNT)) * Math.PI) / 180;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const isActive = index === active;
            return (
              <g key={service.id}>
                <line
                  x1={120 + cos * 100}
                  y1={120 + sin * 100}
                  x2={120 + cos * 93}
                  y2={120 + sin * 93}
                  stroke="currentColor"
                  strokeOpacity={isActive ? 0.9 : 0.35}
                  style={{ transition: "stroke-opacity 0.4s" }}
                />
                <text
                  x={120 + cos * 111}
                  y={120 + sin * 111}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="currentColor"
                  fillOpacity={isActive ? 1 : 0.35}
                  className="type-mono"
                  style={{ fontSize: 6, transition: "fill-opacity 0.4s" }}
                >
                  {service.number}
                </text>
              </g>
            );
          })}
        </svg>

        <motion.div className="absolute inset-0" style={{ rotate: markerRotation }}>
          <svg viewBox="0 0 240 240" className="h-full w-full">
            <circle cx="120" cy="20" r="3" fill="currentColor" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

/** Small readout: the angle of the turn and the discipline it has reached. */
export function CameraReadout({ turn }: { turn: MotionValue<number> }) {
  const [active, setActive] = useState(0);
  useMotionValueEvent(turn, "change", (value) => setActive(currentIndex(value)));

  const degrees = useTransform(
    turn,
    (value) => `${String(Math.round(value * 360)).padStart(3, "0")}°`
  );

  return (
    <span className="flex items-baseline gap-3">
      <motion.span>{degrees}</motion.span>
      <span className="text-ash">—</span>
      <span>
        {services[active].number} {services[active].title}
      </span>
    </span>
  );
}