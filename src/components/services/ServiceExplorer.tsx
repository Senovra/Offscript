"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { services } from "@/lib/projects";
import { EASE_CUT, EASE_PUSH, pad2 } from "@/lib/utils";

const DESCRIPTION_NOTE = "Description to come from Offscript";

/**
 * SERVICES EXPLORER
 *
 * Desktop: a large index on the left and a pinned photo window on the right.
 *   Hover, click or keyboard focus on a service wipes the photo to it. Rows do
 *   not expand, so the list never jumps under the cursor.
 * Touch and small screens: nothing depends on hover. Tapping a service opens it
 *   in place (photo, description line, link). One service is open at a time.
 * The photos are placeholder stock photography until Offscript supplies its own.
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
                          <Image
                            src={service.image}
                            alt={service.imageAlt}
                            fill
                            sizes="100vw"
                            className="object-cover"
                          />
                          <span className="type-mono absolute left-3 top-3 border border-paper/50 bg-ink/40 px-2 py-1 text-paper">
                            Placeholder
                          </span>
                        </div>

                        <p className="type-mono mt-5 text-ash">{DESCRIPTION_NOTE}</p>

                        <Link
                          href="/contact"
                          className="type-mono mt-4 inline-flex h-11 items-center gap-3 border-b border-current"
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
          <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
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
                  initial={reduceMotion ? false : { scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.4, ease: EASE_PUSH }}
                >
                  <Image
                    src={current.image}
                    alt={current.imageAlt}
                    fill
                    sizes="(min-width: 768px) 46vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(to top, rgba(10,10,11,0.55) 0%, transparent 40%)",
              }}
            />

            <div className="type-mono absolute inset-x-4 bottom-4 z-10 flex items-center justify-between text-paper">
              <span>
                {pad2(active + 1)} / {pad2(services.length)}
              </span>
              <span className="border border-paper/50 bg-ink/40 px-2 py-1">
                Placeholder
              </span>
            </div>
          </div>

          <div className="mt-6 min-h-[7rem]" aria-live="polite">
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
                <p className="type-mono mt-3 text-fog">{DESCRIPTION_NOTE}</p>
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