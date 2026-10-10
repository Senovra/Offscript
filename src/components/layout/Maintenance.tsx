"use client";

import { motion, useReducedMotion } from "framer-motion";

const STATUS = [
  { label: "Status", value: "Updating" },
  { label: "Back online", value: "To be announced" },
  { label: "Enquiries", value: "[to be added]" },
];

/**
 * Full-screen maintenance page. Shown instead of the whole site when
 * MAINTENANCE is set to true in src/app/layout.tsx.
 */
export default function Maintenance() {
  const year = new Date().getFullYear();
  const reduceMotion = useReducedMotion();

  return (
    <main
      className="relative flex min-h-svh flex-col justify-between overflow-hidden px-[var(--gutter)] pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-[max(2rem,env(safe-area-inset-top,0px))] text-paper"
      style={{
        background:
          "radial-gradient(70% 60% at 50% 48%, #1d1d20 0%, #121213 55%, #0a0a0b 100%)",
      }}
    >
      {/* Faint outlined wordmark behind everything */}
      <p
        aria-hidden="true"
        className="type-display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[clamp(4rem,19vw,22rem)] leading-none"
        style={{
          color: "transparent",
          WebkitTextStroke: "1px rgba(242, 241, 237, 0.07)",
        }}
      >
        Offscript
      </p>

      <header className="relative flex items-center justify-between gap-4">
        <p className="type-display-wide text-[1rem] md:text-[1.125rem]">Offscript</p>
        <p className="type-mono flex items-center gap-3 text-fog">
          <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-paper" />
          Maintenance mode
        </p>
      </header>

      <div className="relative flex flex-col items-center text-center">
        <motion.div
          aria-hidden="true"
          className="text-paper"
          style={{ transformOrigin: "50% 50%" }}
          animate={reduceMotion ? undefined : { rotate: [0, -9, 9, -6, 6, -3, 0] }}
          transition={{
            duration: 0.9,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1.6,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="72"
            height="72"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </motion.div>

        <h1 className="type-display-wide mt-8 text-[clamp(2rem,5.4vw,4.5rem)]">
          Site Under Maintenance
        </h1>

        <p className="type-body mt-5 text-fog">
          We&apos;re making a few updates to the site. Please check back soon.
        </p>

        {/* Indeterminate progress line */}
        <div
          aria-hidden="true"
          className="relative mt-10 h-px w-full max-w-[22rem] overflow-hidden bg-paper/15"
        >
          <motion.span
            className="absolute inset-y-0 w-1/3 bg-paper"
            initial={{ left: reduceMotion ? "33%" : "-33%" }}
            animate={reduceMotion ? undefined : { left: "100%" }}
            transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </div>

      <footer className="relative">
        <dl className="grid gap-px border-t border-[var(--line)] md:grid-cols-3">
          {STATUS.map((item) => (
            <div key={item.label} className="py-4 md:pr-6">
              <dt className="type-mono text-ash">{item.label}</dt>
              <dd className="type-mono mt-1 text-paper">{item.value}</dd>
            </div>
          ))}
        </dl>
        <p className="type-mono mt-4 text-ash">© {year} Offscript</p>
      </footer>
    </main>
  );
}