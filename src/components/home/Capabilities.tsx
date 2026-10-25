"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import FitImage from "@/components/ui/FitImage";
import Eyebrow from "@/components/ui/Eyebrow";
import { FULLSCREEN_MAX_CROP } from "@/lib/fit";
import { services, type Service } from "@/lib/projects";

const HIDDEN = "inset(100% 0% 0% 0%)";
const SHOWN = "inset(0% 0% 0% 0%)";

interface LayerProps {
  service: Service;
  index: number;
  count: number;
  progress: MotionValue<number>;
}

/**
 * One full-bleed environment. Scroll wipes it up over the previous one.
 * The photo fills the screen when little would be cropped, and is shown whole
 * over a soft backdrop when filling would crop too much (see FitImage).
 */
function Layer({ service, index, count, progress }: LayerProps) {
  const step = 1 / count;
  const start = Math.max(0, index * step - step * 0.18);
  const end = index * step + step * 0.02;

  const clipPath = useTransform(progress, [start, end], [HIDDEN, SHOWN]);
  const scale = useTransform(progress, [start, end + step], [1.14, 1]);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: index + 1, clipPath: index === 0 ? undefined : clipPath }}
    >
      <motion.div className="absolute inset-0 will-change-transform" style={{ scale }}>
        <FitImage
          src={service.image}
          alt={service.imageAlt}
          sizes="115vw"
          maxCrop={FULLSCREEN_MAX_CROP}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Pinned and scroll-controlled: scrolling changes the discipline, the media
 * wipes between them, and the list highlights the current one. Tapping or
 * clicking a name scrolls to it, so touch and keyboard work the same way.
 */
function PinnedCapabilities() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const count = services.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(count - 1, Math.max(0, Math.floor(value * count + 0.05))));
  });

  const jumpTo = (index: number) => {
    const track = ref.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const distance = track.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + ((index + 0.5) / count) * distance,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={ref}
      aria-label="Capabilities"
      className="relative bg-graphite"
      style={{ height: `${100 + count * 55}svh` }}
    >
      <div className="stage-sticky">
        {services.map((service, index) => (
          <Layer
            key={service.id}
            service={service}
            index={index}
            count={count}
            progress={scrollYProgress}
          />
        ))}

        {/* Scrims for legibility: left on desktop, bottom on phones */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[20] hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.4) 50%, rgba(10,10,11,0.15) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[20] md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,11,0.92) 0%, rgba(10,10,11,0.45) 55%, rgba(10,10,11,0.3) 100%)",
          }}
        />

        <div className="page-gutter absolute inset-0 z-[30] flex flex-col pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-[calc(var(--header-h)+0.75rem)] text-paper">
          <div className="flex items-start justify-between gap-4">
            <Eyebrow index="02">Capabilities</Eyebrow>
          </div>

          <ul className="mt-auto md:my-auto md:max-w-[34rem]">
            {services.map((service, index) => {
              const selected = index === active;
              return (
                <li key={service.id} className="border-t border-paper/15 last:border-b">
                  <button
                    type="button"
                    onClick={() => jumpTo(index)}
                    aria-current={selected ? "true" : undefined}
                    className={`flex w-full items-baseline gap-4 py-2.5 text-left transition-[color,transform] duration-500 md:py-3.5 ${
                      selected
                        ? "text-paper md:translate-x-2"
                        : "text-paper/40 hover:text-paper/80"
                    }`}
                  >
                    <span className="type-mono w-6 shrink-0">{service.number}</span>
                    <span className="type-display-wide size-md">{service.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-[40] h-[2px] origin-left bg-paper"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    </section>
  );
}

/** Reduced motion: a plain, readable list with a photo for each discipline. */
function StaticCapabilities() {
  return (
    <section aria-label="Capabilities" className="page-gutter bg-graphite py-24">
      <Eyebrow index="02">Capabilities</Eyebrow>
      <ul className="mt-10">
        {services.map((service) => (
          <li
            key={service.id}
            className="hairline-top grid gap-6 py-8 md:grid-cols-12 md:gap-10"
          >
            <div className="md:col-span-5">
              <p className="type-mono text-ash">{service.number}</p>
              <h3 className="type-display-wide size-md mt-2">{service.title}</h3>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden bg-slate md:col-span-7">
              <FitImage
                src={service.image}
                alt={service.imageAlt}
                sizes="(min-width: 768px) 58vw, 100vw"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * CAPABILITIES
 * Disciplines shown as environments that scroll controls.
 */
export default function Capabilities() {
  const reduceMotion = useReducedMotion();
  return reduceMotion ? <StaticCapabilities /> : <PinnedCapabilities />;
}