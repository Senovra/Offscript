"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";

const TIME_ZONE = "Asia/Colombo";

/**
 * Full-screen maintenance / holding page. Shown instead of the whole site when
 * MAINTENANCE is set to true in src/app/layout.tsx.
 */
export default function Maintenance() {
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion ?? false;

  const [localTime, setLocalTime] = useState("");
  const [turns, setTurns] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const updateClock = () => {
      setLocalTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: TIME_ZONE,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };

    updateClock();
    const interval = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (
      shouldReduceMotion ||
      event.pointerType !== "mouse" ||
      !panelRef.current
    ) {
      return;
    }

    const rect = panelRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    panelRef.current.style.setProperty("--pointer-x", `${x}%`);
    panelRef.current.style.setProperty("--pointer-y", `${y}%`);
  };

  const resetPointerLight = () => {
    panelRef.current?.style.setProperty("--pointer-x", "50%");
    panelRef.current?.style.setProperty("--pointer-y", "0%");
  };

  return (
    <main
      className="relative flex min-h-svh flex-col overflow-hidden px-[var(--gutter)] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-[max(1.5rem,env(safe-area-inset-top,0px))] text-paper"
      style={{
        background:
          "radial-gradient(75% 55% at 50% 42%, #1c1c1f 0%, #121213 55%, #09090a 100%)",
      }}
    >
      {/* Centred outlined wordmark */}
      <p
        aria-hidden="true"
        className="type-display pointer-events-none fixed inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none whitespace-nowrap text-center text-[clamp(3.1rem,18.5vw,22rem)] leading-none"
        style={{
          color: "transparent",
          WebkitTextStroke: "1px rgba(242, 241, 237, 0.055)",
        }}
      >
        Offscript
      </p>

      {/* Subtle ambient lighting */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                background: [
                  "radial-gradient(48% 34% at 48% 35%, rgba(199,164,106,0.075), transparent 75%)",
                  "radial-gradient(48% 34% at 56% 43%, rgba(199,164,106,0.045), transparent 75%)",
                  "radial-gradient(48% 34% at 48% 35%, rgba(199,164,106,0.075), transparent 75%)",
                ],
              }
        }
        transition={{
          duration: 18,
          repeat: shouldReduceMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(48% 34% at 48% 35%, rgba(199,164,106,0.065), transparent 75%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(9,9,10,0.12) 0%, transparent 35%, rgba(9,9,10,0.3) 100%)",
        }}
      />

      {/* Header */}
      <motion.header
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative z-10 flex items-center justify-between gap-4 border-b border-[var(--line)] pb-5 md:pb-6"
      >
        <p className="type-display-wide text-base uppercase tracking-[0.16em] md:text-lg">
          Offscript
        </p>

        <div className="flex flex-col items-end gap-1.5">
          <div className="type-mono inline-flex items-center gap-2.5 rounded-full border border-[#C7A46A]/25 bg-[#C7A46A]/[0.06] py-1 pl-2.5 pr-3.5 text-[0.58rem] tracking-[0.12em] text-fog sm:text-[0.65rem]">
            <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
              {!shouldReduceMotion && (
                <motion.span
                  aria-hidden="true"
                  className="absolute h-3 w-3 rounded-full border border-[#C7A46A]/60"
                  animate={{
                    scale: [0.7, 1.25, 0.7],
                    opacity: [0.8, 0.2, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
              <span className="relative h-1.5 w-1.5 rounded-full bg-[#C7A46A]" />
            </span>
            <span>UNDER MAINTENANCE</span>
          </div>

          <div
            className="type-mono flex items-center gap-2 text-[0.55rem] tracking-[0.08em] text-ash sm:text-[0.65rem]"
            aria-label={
              localTime
                ? `Sri Lanka local time, ${localTime}`
                : "Sri Lanka local time"
            }
          >
            <span>SLT</span>
            <span aria-hidden="true" className="text-[#C7A46A]/50">
              /
            </span>
            <span className="tabular-nums">{localTime || "--:--:--"}</span>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-center justify-center py-12 md:py-16">
        <motion.section
          ref={panelRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointerLight}
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15 }}
          aria-labelledby="maintenance-heading"
          className="relative isolate w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.10] px-6 py-10 text-center shadow-[0_18px_70px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-xl sm:px-10 sm:py-14"
          style={{
            backgroundImage:
              "radial-gradient(380px circle at var(--pointer-x, 50%) var(--pointer-y, 0%), rgba(199,164,106,0.08), transparent 72%)",
            backgroundColor: "rgba(255,255,255,0.03)",
            ["--pointer-x" as string]: "50%",
            ["--pointer-y" as string]: "0%",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.025]"
          />

          <div className="relative flex flex-col items-center">
            {/* Wrench: shakes now and then, tilts on hover, spins on press */}
            <motion.div
              style={{ transformOrigin: "50% 50%" }}
              animate={
                shouldReduceMotion
                  ? undefined
                  : { rotate: [0, -9, 9, -6, 6, -3, 0] }
              }
              transition={{
                duration: 0.9,
                ease: "easeInOut",
                repeat: shouldReduceMotion ? 0 : Infinity,
                repeatDelay: 1.8,
              }}
            >
              <motion.button
                type="button"
                onClick={() => setTurns((count) => count + 1)}
                aria-label="Spin the wrench"
                className="flex h-20 w-20 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.03] text-paper transition-colors duration-300 hover:border-[#C7A46A]/45 hover:text-[#D2B783] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C7A46A] sm:h-24 sm:w-24"
                animate={{ rotate: turns * 360 }}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.07 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 90, damping: 14 }
                }
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="40"
                  height="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </motion.button>
            </motion.div>

            <p className="type-mono mt-8 text-[0.62rem] tracking-[0.18em] text-[#C7A46A] sm:text-xs">
              MAINTENANCE
            </p>

            <h1
              id="maintenance-heading"
              className="type-display-wide mt-4 text-balance text-[clamp(1.75rem,5vw,3rem)] leading-[1.08]"
            >
              Site Under Maintenance
            </h1>

            <p className="type-body mt-5 max-w-md text-sm leading-7 text-fog sm:text-base">
              We&apos;re making a few updates to the Offscript website. Please
              check back soon.
            </p>

            {/* Quiet indeterminate line */}
            <div
              aria-hidden="true"
              className="relative mt-9 h-px w-full max-w-[16rem] overflow-hidden bg-white/[0.10]"
            >
              <motion.div
                className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-transparent via-[#C7A46A]/90 to-[#E6D0A6]"
                initial={{ x: "-100%" }}
                animate={
                  shouldReduceMotion ? { x: "75%" } : { x: ["-100%", "250%"] }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 3.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 0.35,
                      }
                }
              />
            </div>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <motion.footer
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="relative z-10 border-t border-[var(--line)] pt-6 md:pt-8"
      >
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <div>
            <p className="type-mono text-[0.65rem] tracking-[0.12em] text-ash">
              WEBSITE DEVELOPMENT
            </p>

            <a
              href="https://www.senovra.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 inline-flex items-center gap-2 text-sm text-paper transition-colors duration-300 hover:text-[#D2B783] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C7A46A]"
            >
              Senovra
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <path d="M5 3h8v8M13 3 3 13" />
              </svg>
            </a>

            <p className="type-body mt-2 text-sm text-fog">
              Your Vision. Perfected.
            </p>

            <a
              href="https://www.senovra.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="type-mono mt-2 inline-block break-all text-xs text-ash transition-colors duration-300 hover:text-paper focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C7A46A]"
            >
              www.senovra.com
            </a>
          </div>

          <div>
            <p className="type-mono text-[0.65rem] tracking-[0.12em] text-ash">
              SUPPORT
            </p>
            <a
              href="mailto:support@senovra.com"
              className="type-body mt-3 inline-block break-all text-sm text-fog transition-colors duration-300 hover:text-paper focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C7A46A]"
            >
              support@senovra.com
            </a>
          </div>

          <div>
            <p className="type-mono text-[0.65rem] tracking-[0.12em] text-ash">
              GENERAL ENQUIRIES
            </p>
            <a
              href="mailto:info@senovra.com"
              className="type-body mt-3 inline-block break-all text-sm text-fog transition-colors duration-300 hover:text-paper focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C7A46A]"
            >
              info@senovra.com
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[var(--line)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-mono text-[0.65rem] text-ash">
            © {year} Offscript. All rights reserved.
          </p>
          <p className="type-mono text-[0.65rem] text-ash">
            DEVELOPED BY SENOVRA
          </p>
        </div>
      </motion.footer>
    </main>
  );
}