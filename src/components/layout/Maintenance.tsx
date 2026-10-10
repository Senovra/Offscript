"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const PAGES = [
  {
    number: "01",
    name: "Home",
    description: "Developing the cinematic homepage experience.",
    status: "In active development",
    state: "active",
    progress: 93,
    preview: [
      { name: "Arrival", progress: 100 },
      { name: "Identity", progress: 100 },
      { name: "Viewfinder", progress: 100 },
      { name: "Lens Lock → Iris transition", progress: 100 },
      { name: "Work Reel", progress: 100 },
      { name: "Capability", progress: 100 },
      { name: "Footer", progress: 50 },
    ],
    previewLabel: "Homepage chapters",
  },
  {
    number: "02",
    name: "About",
    description: "Layouts and interactive components implemented; awaiting final copy.",
    status: "Awaiting content",
    state: "pending",
    progress: 85,
    preview: [
      { name: "Page Structure & Grid Architecture", progress: 100 },
      { name: "Agency Story & Section Layouts", progress: 100 },
      { name: "Client & Collaboration Modules", progress: 100 },
      { name: "360° Perspective Interactive Component", progress: 100 },
      { name: "Approved Content Integration (Offscript)", progress: 25 },
    ],
    previewLabel: "Development roadmap",
  },
  {
    number: "03",
    name: "Services",
    description: "Core service architecture built; layout refinements underway.",
    status: "Design in progress",
    state: "active",
    progress: 80,
    preview: [
      { name: "Service Capability Data Structures", progress: 100 },
      { name: "Interactive Service Grid & Hover States", progress: 100 },
      { name: "Sub-service Detail Expansion UI", progress: 100 },
      { name: "Layout Refinements & Spatial Rhythm", progress: 60 },
      { name: "Micro-interactions & Visual Polish", progress: 40 },
    ],
    previewLabel: "Development roadmap",
  },
  {
    number: "04",
    name: "Work",
    description:
      "Refining full-screen project presentations and custom transitions.",
    status: "Design in progress",
    state: "active",
    progress: 65,
    preview: [
      { name: "Portfolio Listing & Grid Architecture", progress: 100 },
      { name: "Full-Screen Project Detail Views", progress: 50 },
      { name: "Cinematic Transitions & Scroll Animations", progress: 45 },
    ],
    previewLabel: "Development roadmap",
  },
  {
    number: "05",
    name: "Contact",
    description: "Completing the final refinements.",
    status: "Finalising",
    state: "finalising",
    progress: 90,
  },
  {
    number: "06",
    name: "Privacy Policy",
    description: "Awaiting approved policy content from Offscript.",
    status: "Awaiting content",
    state: "pending",
    progress: 10,
  },
  {
    number: "07",
    name: "Terms & Conditions",
    description: "Awaiting approved terms from Offscript.",
    status: "Awaiting content",
    state: "pending",
    progress: 10,
  },
  {
    number: "08",
    name: "Credits",
    description: "Credits page completed.",
    status: "Completed",
    state: "completed",
    progress: 100,
  },
] as const;

const DEVELOPMENT_LOGS = [
  "Refining Framer Motion spring physics on Services grid...",
  "Structural layout complete — pending Offscript content assets.",
  "Optimizing cinematic Iris transition performance...",
  "Core architecture build on track — waiting on asset handover.",
];

const TIME_ZONE = "Asia/Colombo";

type PageState = (typeof PAGES)[number]["state"];

const STATUS_STYLES: Record<
  PageState,
  { text: string; dot: string }
> = {
  active: {
    text: "text-[#D2B783]",
    dot: "bg-[#C7A46A]",
  },
  pending: {
    text: "text-[#B7B0A2]",
    dot: "bg-[#A7A095]",
  },
  finalising: {
    text: "text-[#A6C2AC]",
    dot: "bg-[#91B69A]",
  },
  completed: {
    text: "text-[#A6C2AC]",
    dot: "bg-[#91B69A]",
  },
};

export default function Maintenance() {
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion ?? false;

  const [localTime, setLocalTime] = useState("");
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [logIndex, setLogIndex] = useState(0);

  const statusPanelRef = useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();
  // Calculate global progress from all roadmap sub-items
  const allPreviewItems = PAGES.flatMap((page) =>
    "preview" in page ? [...page.preview] : [],
  );

  const totalSubItemProgress = allPreviewItems.reduce(
    (total, item) => total + item.progress,
    0,
  );

  const globalProgress =
    allPreviewItems.length > 0
      ? Math.round(totalSubItemProgress / allPreviewItems.length)
      : 0;
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

    // Rotate development update messages every 4 seconds
    const logInterval = window.setInterval(() => {
      setLogIndex((prev) => (prev + 1) % DEVELOPMENT_LOGS.length);
    }, 4000);

    return () => {
      window.clearInterval(interval);
      window.clearInterval(logInterval);
    };
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (
      shouldReduceMotion ||
      event.pointerType !== "mouse" ||
      !statusPanelRef.current
    ) {
      return;
    }

    const rect = statusPanelRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    statusPanelRef.current.style.setProperty("--pointer-x", `${x}%`);
    statusPanelRef.current.style.setProperty("--pointer-y", `${y}%`);
  };

  const resetPointerLight = () => {
    statusPanelRef.current?.style.setProperty("--pointer-x", "50%");
    statusPanelRef.current?.style.setProperty("--pointer-y", "0%");
  };

  const togglePreview = (pageName: string) => {
    setExpandedPage((current) =>
      current === pageName ? null : pageName,
    );
  };

  return (
    <main
      className="relative flex min-h-svh flex-col overflow-hidden px-[var(--gutter)] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-[max(1.5rem,env(safe-area-inset-top,0px))] text-paper"
      style={{
        background:
          "radial-gradient(75% 55% at 50% 42%, #1c1c1f 0%, #121213 55%, #09090a 100%)",
      }}
    >
      {/* Centred background wordmark */}
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

      {/* Cinematic ambient lighting */}
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
        <div className="flex items-center gap-3">
          <p className="type-display-wide text-base uppercase tracking-[0.16em] md:text-lg">
            Offscript
          </p>
          <span className="type-mono rounded-full border border-[#C7A46A]/30 bg-[#C7A46A]/10 px-2.5 py-0.5 text-[0.6rem] text-[#D2B783]">
            {globalProgress}% COMPLETE
          </span>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="type-mono flex items-center gap-2.5 text-[0.6rem] text-fog sm:text-xs">
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
            <span>DEVELOPMENT IN PROGRESS</span>
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
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center py-12 md:py-16">
        {/* Introduction */}
        <section className="flex flex-col items-center text-center">
          <motion.div
            aria-hidden="true"
            className="text-paper"
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
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </motion.div>

          <motion.p
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="type-mono mt-7 text-[0.65rem] tracking-[0.18em] text-[#C7A46A] sm:text-xs"
          >
            BUILD IN PROGRESS
          </motion.p>

          <motion.h1
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18 }}
            className="type-display-wide mt-4 max-w-3xl text-balance text-[clamp(2rem,5.2vw,4.5rem)] leading-[1.08]"
          >
            Website Under Development
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="type-body mt-5 max-w-xl text-sm leading-7 text-fog sm:text-base"
          >
            We are developing and refining the Offscript digital experience.
            Each section is being carefully prepared to reflect the quality,
            creativity and ambition behind the brand.
          </motion.p>
        </section>

        {/* Development status */}
        <motion.section
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.35 }}
          aria-labelledby="development-status-heading"
          className="mt-12 md:mt-16"
        >
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2
              id="development-status-heading"
              className="type-mono text-[0.65rem] tracking-[0.13em] text-ash sm:text-xs"
            >
              WEBSITE DEVELOPMENT STATUS
            </h2>

            <span className="type-mono text-[0.6rem] text-ash sm:text-[0.7rem]">
              01 — 08
            </span>
          </div>

          {/* Overall activity indicator & Spotlight badge */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="flex items-center gap-3 flex-1"
              role="status"
              aria-label="Website development is actively progressing"
            >
              <span className="type-mono shrink-0 text-[0.55rem] tracking-[0.12em] text-ash sm:text-[0.65rem]">
                BUILD STATUS
              </span>

              <div
                aria-hidden="true"
                className="relative h-px min-w-0 flex-1 overflow-hidden bg-white/[0.10]"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-transparent via-[#C7A46A]/90 to-[#E6D0A6]"
                  initial={{ x: "-100%" }}
                  animate={
                    shouldReduceMotion ? { x: "0%" } : { x: ["-100%", "250%"] }
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

              <span className="type-mono shrink-0 text-[0.55rem] tracking-[0.1em] text-[#D2B783] sm:text-[0.65rem]">
                ACTIVE
              </span>
            </div>

            {/* Next Up / Current Focus Spotlight Badge */}
            <div className="type-mono inline-flex items-center gap-2 rounded-lg border border-[#C7A46A]/25 bg-[#C7A46A]/5 px-3 py-1 text-[0.6rem] text-fog">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#C7A46A]" />
              <span className="text-ash">NEXT FOCUS:</span>
              <span className="text-[#D2B783]">03 Services (Layout Fixes & Animations)</span>
            </div>
          </div>

          {/* Development Update Feed Ticker */}
          <div className="mb-5 flex items-center gap-2.5 rounded-md border border-white/[0.06] bg-black/40 px-3 py-2 text-[0.62rem]">
            <span className="type-mono text-[#C7A46A] shrink-0 font-semibold">[DEVELOPMENT UPDATE FEED]</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={logIndex}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.3 }}
                className="type-mono text-fog truncate"
              >
                {DEVELOPMENT_LOGS[logIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Interactive glass panel */}
          <div
            ref={statusPanelRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointerLight}
            className="group/status relative isolate overflow-hidden rounded-xl border border-white/[0.10] bg-white/[0.035] shadow-[0_18px_70px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-xl"
            style={{
              backgroundImage:
                "radial-gradient(360px circle at var(--pointer-x, 50%) var(--pointer-y, 0%), rgba(199,164,106,0.075), transparent 72%)",
              backgroundColor: "rgba(255,255,255,0.025)",
              ["--pointer-x" as string]: "50%",
              ["--pointer-y" as string]: "0%",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.025]"
            />

            {PAGES.map((page, index) => {
              const hasPreview = "preview" in page;
              const isExpanded = expandedPage === page.name;
              const statusStyle = STATUS_STYLES[page.state];

              return (
                <motion.div
                  key={page.name}
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: shouldReduceMotion ? 0 : 0.4 + index * 0.07,
                  }}
                  className={`group/row relative border-b border-white/[0.075] last:border-b-0 ${
                    isExpanded ? "bg-white/[0.035]" : ""
                  }`}
                >
                  {/* The entire chapter header is one accessible button */}
                  <button
                    type="button"
                    onClick={() => hasPreview && togglePreview(page.name)}
                    aria-expanded={hasPreview ? isExpanded : undefined}
                    aria-controls={hasPreview ? `preview-${page.number}` : undefined}
                    aria-label={
                      hasPreview
                        ? `${isExpanded ? "Collapse" : "Expand"} ${page.name} chapter details`
                        : `${page.name}: ${page.status} (${page.progress}%)`
                    }
                    className={`block w-full text-left transition-colors duration-300 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#C7A46A] ${
                      hasPreview
                        ? "cursor-pointer hover:bg-white/[0.025] active:bg-white/[0.045]"
                        : "cursor-default"
                    }`}
                  >
                    <div className="grid grid-cols-[2rem_minmax(0,1fr)_auto] gap-x-3 px-4 py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-x-5 sm:px-5 sm:py-5">
                      <span className="type-mono col-start-1 row-start-1 pt-0.5 text-xs text-ash transition-colors duration-300 group-hover/row:text-[#C7A46A]">
                        {page.number}
                      </span>

                      <div className="col-start-2 row-start-1 min-w-0">
                        <h3 className="type-display-wide text-base text-paper transition-colors duration-300 group-hover/row:text-white sm:text-lg">
                          {page.name}
                        </h3>

                        <p className="type-body mt-1 text-xs leading-5 text-fog sm:text-sm">
                          {page.description}
                        </p>
                      </div>

                      {/* Status label with percentage badge */}
                      <div className="col-start-2 row-start-2 mt-3 flex min-w-0 items-center gap-3 sm:col-start-3 sm:row-start-1 sm:mt-0 sm:justify-self-end">
                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusStyle.dot}`}
                          />
                          <span
                            className={`type-mono text-[0.62rem] leading-5 sm:text-xs ${statusStyle.text}`}
                          >
                            {page.status}
                          </span>
                        </div>

                        <span className="type-mono rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[0.58rem] tabular-nums text-ash sm:text-[0.65rem]">
                          {page.progress}%
                        </span>
                      </div>

                      {/* Arrow stays visible as a visual hint */}
                      <span
                        aria-hidden="true"
                        className={`col-start-3 row-start-1 flex h-8 w-8 shrink-0 items-center justify-center self-center rounded-full border transition-all duration-300 sm:col-start-4 ${
                          hasPreview
                            ? isExpanded
                              ? "border-[#C7A46A]/55 bg-[#C7A46A]/10 text-[#D2B783]"
                              : "border-white/[0.12] text-ash group-hover/row:border-[#C7A46A]/50 group-hover/row:text-[#D2B783]"
                            : "border-transparent text-transparent"
                        }`}
                      >
                        {hasPreview && (
                          <motion.svg
                            viewBox="0 0 16 16"
                            width="13"
                            height="13"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{
                              duration: shouldReduceMotion ? 0 : 0.22,
                            }}
                          >
                            <path d="m3 6 5 5 5-5" />
                          </motion.svg>
                        )}
                      </span>
                    </div>
                  </button>

                  {/* Preview opens by tapping the whole card on every device */}
                  {hasPreview && (
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          id={`preview-${page.number}`}
                          key={`${page.name}-preview`}
                          initial={
                            shouldReduceMotion
                              ? { opacity: 1 }
                              : { opacity: 0, height: 0 }
                          }
                          animate={{ opacity: 1, height: "auto" }}
                          exit={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { opacity: 0, height: 0 }
                          }
                          transition={{
                            duration: shouldReduceMotion ? 0 : 0.28,
                            ease: "easeInOut",
                          }}
                          className="overflow-hidden"
                        >
                          <div className="mx-3 mb-4 rounded-lg border border-[#C7A46A]/20 bg-black/25 p-4 sm:mx-5 sm:mb-5 sm:p-5">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                              <p className="type-mono text-[0.58rem] tracking-[0.13em] text-[#C7A46A] sm:text-[0.65rem]">
                                {page.previewLabel}
                              </p>
                              <span className="type-mono text-[0.55rem] text-ash">
                                {String(page.preview.length).padStart(2, "0")}{" "}
                                ITEMS
                              </span>
                            </div>

                            <div
                              className={`grid gap-2 ${
                                page.name === "Home" || page.name === "Services" || page.name === "About"
                                  ? "sm:grid-cols-2"
                                  : "grid-cols-1"
                              }`}
                            >
                              {page.preview.map((item, previewIndex) => {
                                const itemProgress = item.progress;
                                const isFullyComplete = itemProgress === 100;

                                // SVG Circle Circumference for radius r=8 is ~50.26
                                const circumference = 50.26;
                                const strokeDashoffset =
                                  circumference - (itemProgress / 100) * circumference;

                                return (
                                  <motion.div
                                    key={item.name}
                                    initial={
                                      shouldReduceMotion
                                        ? undefined
                                        : { opacity: 0, y: 5 }
                                    }
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      duration: shouldReduceMotion ? 0 : 0.2,
                                      delay: shouldReduceMotion
                                        ? 0
                                        : previewIndex * 0.025,
                                    }}
                                    className="flex min-w-0 items-center gap-3 rounded-md border border-white/[0.055] bg-white/[0.025] px-3 py-3 transition-colors duration-200 hover:border-[#C7A46A]/20 hover:bg-white/[0.045]"
                                  >
                                    {/* Circular Progress Indicator Ring */}
                                    <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                                      <svg
                                        viewBox="0 0 20 20"
                                        className="h-full w-full -rotate-90 transform"
                                      >
                                        <circle
                                          cx="10"
                                          cy="10"
                                          r="8"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          className="text-white/10"
                                        />
                                        <motion.circle
                                          cx="10"
                                          cy="10"
                                          r="8"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeDasharray={circumference}
                                          initial={{
                                            strokeDashoffset: circumference,
                                          }}
                                          animate={{ strokeDashoffset }}
                                          transition={{
                                            duration: shouldReduceMotion ? 0 : 0.6,
                                            ease: "easeOut",
                                          }}
                                          className={
                                            isFullyComplete
                                              ? "text-[#C7A46A]"
                                              : "text-[#C7A46A]/60"
                                          }
                                        />
                                      </svg>
                                      {isFullyComplete && (
                                        <span className="absolute h-1.5 w-1.5 rounded-full bg-[#C7A46A]" />
                                      )}
                                    </div>

                                    <span
                                      aria-hidden="true"
                                      className="type-mono text-[0.6rem] text-[#C7A46A]/80"
                                    >
                                      {String(previewIndex + 1).padStart(2, "0")}
                                    </span>

                                    <span className="type-body min-w-0 flex-1 text-xs leading-5 text-fog sm:text-sm">
                                      {item.name}
                                    </span>

                                    <span className="type-mono text-[0.55rem] text-ash/80">
                                      {itemProgress}%
                                    </span>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {/* Subtle amber edge accent */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute bottom-3 left-0 top-3 w-px origin-center bg-[#C7A46A]/80 transition-transform duration-300 ${
                      isExpanded
                        ? "scale-y-100"
                        : "scale-y-0 group-hover/row:scale-y-100"
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>

          <p className="type-body mt-4 w-full text-balance text-xs leading-6 text-ash sm:text-sm">
            Further refinements, content integration and final checks will continue as the website progresses towards launch.
          </p>
        </motion.section>
      </div>

      {/* Footer */}
      <motion.footer
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
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