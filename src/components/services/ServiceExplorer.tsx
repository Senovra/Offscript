"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import FitImage from "@/components/ui/FitImage";
import { services } from "@/lib/projects";
import { EASE_CUT, EASE_PUSH, pad2 } from "@/lib/utils";

/**
 * SERVICES EXPLORER
 *
 * Desktop: a large index on the left and a pinned photo window on the right.
 *   Hover, click or keyboard focus on a service wipes the photo to it. Rows do
 *   not expand, so the list never jumps under the cursor.
 * Touch and small screens: nothing depends on hover. Tapping a service opens it
 *   in place (photo, description, link). One service is open at a time.
 * Photos keep their proportions: a photo that fits its frame fills it, and one
 * that would be cropped too much is shown whole (see FitImage).
 */
export default function ServiceExplorer() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <section
      aria-label="Services"
      className="page-gutter grid pb-24 md:grid-cols-12 md:gap-12 md:pb-36"
    >
      {/* Index */}
      <ol className="md:col-span-6">
        {services.map((service, index) => {
          const selected = index === active;
          return (
            <li key={service.id} className="hairline-bottom first:border-t first:border-[var(--line)]">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(index)}
                onFocus={() => setActive(index)}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setActive(index);
                }}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
              >
                <span className="flex min-w-0 items-baseline gap-5 md:gap-8">
                  <span
                    className={`type-mono w-6 shrink-0 transition-colors duration-500 ${
                      selected ? "text-paper" : "text-ash"
                    }`}
                  >
                    {service.number}
                  </span>
                  <span
                    className={`type-display-wide size-lg transition-all duration-500 [transition-timing-function:var(--ease-push)] ${
                      selected
                        ? "translate-x-2 text-paper"
                        : "text-paper/35 group-hover:text-paper/70"
                    }`}
                  >
                    {service.title}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-all duration-500 [transition-timing-function:var(--ease-push)] ${
                    selected
                      ? "rotate-90 border-paper text-paper md:rotate-0"
                      : "border-paper/20 text-ash"
                  }`}
                >
                  →
                </span>
              </button>

              {/* Phones and tablets: the service opens in place */}
              <div className="md:hidden">
                <AnimatePresence initial={false}>
                  {selected && (
                    <motion.div
                      key="panel"
                      initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0.15 : 0.5, ease: EASE_PUSH }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8">
                        <div className="relative aspect-[16/10] overflow-hidden bg-graphite">
                          <FitImage
                            src={service.image}
                            alt={service.imageAlt}
                            sizes="100vw"
                          />
                        </div>

                        <p className="mt-5 text-[1rem] leading-relaxed text-fog">
                          {service.description}
                        </p>

                        <Link
                          href="/contact"
                          className="type-mono mt-5 inline-flex h-11 items-center gap-3 border-b border-current"
                        >
                          Start a project <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Desktop: pinned photo window */}
      <div className="hidden md:col-span-6 md:block">
        <div className="sticky top-[calc(var(--header-h)+1.5rem)]">
          <div className="relative aspect-[4/3] max-h-[50svh] w-full overflow-hidden bg-graphite">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.id}
                className="absolute inset-0"
                initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
                animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 1, transition: { delay: 0.9, duration: 0.01 } }}
                transition={{ duration: reduceMotion ? 0.2 : 0.85, ease: EASE_CUT }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={reduceMotion ? false : { scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.4, ease: EASE_PUSH }}
                >
                  <FitImage
                    src={current.image}
                    alt={current.imageAlt}
                    sizes="(min-width: 768px) 46vw, 100vw"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,11,0.5) 0%, transparent 35%)",
              }}
            />

            <p className="type-mono absolute bottom-4 left-4 z-10 text-paper">
              {pad2(active + 1)} / {pad2(services.length)}
            </p>
          </div>

          <div className="mt-6 min-h-[11rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EASE_PUSH }}
              >
                <p className="type-mono text-ash">
                  {current.number}
                  <span className="mx-2">—</span>
                  {current.title}
                </p>
                <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-fog">
                  {current.description}
                </p>
                <Link
                  href="/contact"
                  className="group type-mono mt-4 inline-flex h-11 items-center gap-3 border-b border-current"
                >
                  Start a project
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}