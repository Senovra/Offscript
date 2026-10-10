"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { services } from "@/lib/projects";

const COUNT = services.length;
const STEP = 360 / COUNT;
const HOLD = 0.045;

/**
 * The hand holds on each discipline for a moment, then swings to the next,
 * like a clock hand ticking round the dial.
 */
function buildStops() {
  const inputs: number[] = [0];
  const outputs: number[] = [0];
  for (let i = 0; i < COUNT; i++) {
    const centre = (i + 0.5) / COUNT;
    inputs.push(centre - HOLD, centre + HOLD);
    outputs.push(i * STEP, i * STEP);
  }
  inputs.push(1);
  outputs.push((COUNT - 1) * STEP);
  return { inputs, outputs };
}

const STOPS = buildStops();

function nodePosition(index: number, radius: number) {
  const angle = ((-90 + index * STEP) * Math.PI) / 180;
  return { x: 100 + Math.cos(angle) * radius, y: 100 + Math.sin(angle) * radius };
}

/** The dial: rings, six nodes, the active one filled. */
function Dial({ active }: { active: number }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full text-paper"
    >
      <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeOpacity="0.3" />
      <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeOpacity="0.12" />
      <circle cx="100" cy="100" r="24" fill="none" stroke="currentColor" strokeOpacity="0.12" />

      {services.map((service, index) => {
        const dot = nodePosition(index, 76);
        const label = nodePosition(index, 92);
        const isActive = index === active;
        return (
          <g key={service.id}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r={isActive ? 4 : 2.2}
              fill={isActive ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1"
              style={{ transition: "all 0.4s" }}
            />
            <text
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              fillOpacity={isActive ? 1 : 0.4}
              className="type-mono"
              style={{ fontSize: 6, transition: "fill-opacity 0.4s" }}
            >
              {service.number}
            </text>
          </g>
        );
      })}

      <text
        x="100"
        y="100"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="currentColor"
        className="type-serif"
        style={{ fontSize: 16 }}
      >
        360°
      </text>
    </svg>
  );
}

/** Reduced motion: the dial at rest beside a plain list. */
function StaticClock() {
  return (
    <section className="page-gutter grid items-center gap-14 pb-24 md:grid-cols-12 md:gap-10 md:pb-36">
      <div className="relative mx-auto aspect-square w-full max-w-[26rem] md:col-span-5">
        <Dial active={-1} />
      </div>
      <ol className="md:col-span-7 md:pl-[8%]">
        {services.map((service) => (
          <li
            key={service.id}
            className="hairline-top flex items-baseline gap-5 py-4 last:border-b last:border-[var(--line)]"
          >
            <span className="type-mono w-6 shrink-0 text-ash">{service.number}</span>
            <span className="type-display-wide size-md">{service.title}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * The 360° loop as a clock. Scrolling turns the hand from the first
 * discipline round to the last, and the name beside it changes each time.
 */
function ScrollClock() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const rawAngle = useTransform(scrollYProgress, STOPS.inputs, STOPS.outputs);
  const angle = useSpring(rawAngle, { stiffness: 90, damping: 20, mass: 0.6 });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(COUNT - 1, Math.max(0, Math.floor(value * COUNT))));
  });

  const current = services[active];

  return (
    <section
      ref={ref}
      aria-label="Disciplines"
      className="relative"
      style={{ height: `${100 + COUNT * 60}svh` }}
    >
      <div className="stage-sticky">
        <div className="page-gutter flex h-full flex-col items-center justify-center gap-8 pt-[var(--header-h)] md:grid md:grid-cols-12 md:gap-10">
          <div className="relative aspect-square w-[min(78vw,44svh)] md:col-span-6 md:w-[min(40vw,68svh)] md:justify-self-center">
            <Dial active={active} />

            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ rotate: angle }}
            >
              <svg viewBox="0 0 200 200" className="h-full w-full text-paper">
                <line x1="100" y1="100" x2="100" y2="28" stroke="currentColor" strokeWidth="1" />
                <circle cx="100" cy="100" r="2.5" fill="currentColor" />
              </svg>
            </motion.div>
          </div>

          <div className="w-full md:col-span-6 md:pl-[6%]">
            <p className="type-mono text-ash">
              {current.number} / {String(COUNT).padStart(2, "0")}
            </p>

            <div className="relative mt-4 min-h-[8rem] md:min-h-[11rem]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="type-editorial text-[clamp(2.25rem,5vw,4.75rem)] tracking-[-0.04em]">
                    {current.title}
                  </h2>
                  <p className="type-mono mt-5 text-ash">
                    Description to come from Offscript
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DisciplineClock() {
  const reduceMotion = useReducedMotion();
  return reduceMotion ? <StaticClock /> : <ScrollClock />;
}