"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type TaskItem = {
  name: string;
  completed: boolean;
};

type BatchItem = {
  number: string;
  name: string;
  description: string;
  status: string;
  state: "completed" | "active" | "planned";
  tasks: TaskItem[];
};

// ==========================================
// CENTRALIZED DATA STRUCTURE & CONFIG
// ==========================================

// Easily change build status here in code: "active" | "halted" | "standby" | "deploy"
const CURRENT_BUILD_STATUS: "active" | "halted" | "standby" | "deploy" = "active";

const BUILD_STATUS_CONFIG = {
  active: {
    label: "BUILD IN PROGRESS",
    message: "Active development underway across core system modules.",
    isAnimated: true,
    dotColor: "bg-[#C7A46A]",
    barColor: "bg-[#C7A46A]",
    textColor: "text-[#D2B783]",
    borderColor: "border-[#C7A46A]/25",
    bgColor: "bg-[#C7A46A]/[0.03]",
    glowClass: "drop-shadow-[0_0_10px_rgba(199,164,106,0.45)]",
    logs: [
      "Batches 01 and 02 successfully completed and deployed.",
      "Batch 03 currently underway: optimizing responsive image fitting and mobile layouts.",
      "Preparing asset maps and configuration for Batch 04 branding phase.",
    ],
  },
  halted: {
    label: "DEVELOPMENT HALTED",
    message: "Development is temporarily paused. Work will resume during the next scheduled development session.",
    isAnimated: false,
    dotColor: "bg-red-500",
    barColor: "bg-red-500/80",
    textColor: "text-red-400",
    borderColor: "border-red-500/30",
    bgColor: "bg-red-500/[0.03]",
    glowClass: "drop-shadow-[0_0_10px_rgba(239,68,68,0.45)]",
    logs: [
      "Development session currently halted. Active progress paused.",
      "All active build processes saved and queued for next session.",
      "Scheduled maintenance and development will resume shortly.",
    ],
  },
  standby: {
    label: "STANDBY / PAUSED",
    message: "Development is on standby. Awaiting next synchronization cycle.",
    isAnimated: false,
    dotColor: "bg-[#91B69A]",
    barColor: "bg-[#91B69A]/70",
    textColor: "text-[#A6C2AC]",
    borderColor: "border-[#91B69A]/25",
    bgColor: "bg-[#91B69A]/[0.03]",
    glowClass: "drop-shadow-[0_0_10px_rgba(145,182,154,0.45)]",
    logs: [
      "System in standby mode. Awaiting developer synchronization.",
      "Core modules compiled and resting at stable checkpoint.",
    ],
  },
  deploy: {
    label: "READY FOR DEPLOYMENT",
    message: "Build verification passed. Preparing final deployment pipeline.",
    isAnimated: true,
    dotColor: "bg-[#E2D4B7]",
    barColor: "bg-[#E2D4B7]",
    textColor: "text-[#E2D4B7]",
    borderColor: "border-[#E2D4B7]/25",
    bgColor: "bg-[#E2D4B7]/[0.03]",
    glowClass: "drop-shadow-[0_0_10px_rgba(226,212,183,0.45)]",
    logs: [
      "All core batches completed successfully.",
      "Preparing release pipeline and production environment deployment.",
    ],
  },
};

const DEVELOPMENT_BATCHES: BatchItem[] = [
  {
    number: "01",
    name: "Content & Image Infrastructure",
    description: "Core project and service structures along with initial fitting systems.",
    status: "Completed and deployed",
    state: "completed",
    tasks: [
      { name: "Project and service content updates", completed: true },
      { name: "Project gallery and page content infrastructure", completed: true },
      { name: "Initial reusable image fitting system", completed: true },
      { name: "FitImage component and image fitting helper", completed: true },
    ],
  },
  {
    number: "02",
    name: "Loader & Hero Performance",
    description: "Refined loading transitions, video coordination and camera timing.",
    status: "Completed and deployed",
    state: "completed",
    tasks: [
      { name: "Refined loading screen to hero transition", completed: true },
      { name: "Improved coordination of hero video and supporting image loading", completed: true },
      { name: "Deferred loading of the heavier 3D camera scene", completed: true },
      { name: "Refined hero lettering animation", completed: true },
      { name: "Camera frame timing improvements", completed: true },
    ],
  },
  {
    number: "03",
    name: "Image Quality, Responsive Fitting & Project Galleries",
    description: "Refining image delivery, responsive layouts and project specific galleries.",
    status: "In progress",
    state: "active",
    tasks: [
      { name: "Responsive image fitting across Work reel, project heroes, next project band, Capabilities section and project open transition", completed: true },
      { name: "Improve mobile layouts where landscape images are excessively zoomed or cropped", completed: false },
      { name: "Review image delivery settings for unnecessary quality loss", completed: false },
      { name: "Configure each project's additional gallery images separately from its hero image", completed: false },
      { name: "Preserve existing asset URLs and confirmed project specific image assignments", completed: false },
    ],
  },
  {
    number: "04",
    name: "Branding, Contact & Final Page Refinements",
    description: "Contact page selectors, metadata, 404 views and final checks.",
    status: "Planned",
    state: "planned",
    tasks: [
      { name: "Contact page and WhatsApp selector refinements", completed: false },
      { name: "Footer and Senovra credit", completed: false },
      { name: "Logo, favicon and sharing metadata", completed: false },
      { name: "Maintenance page and 404 page refinements", completed: false },
      { name: "Remaining asset map configuration and integration checks", completed: false },
    ],
  },
];

const REMAINING_LAUNCH_TASKS: TaskItem[] = [
  { name: "Integrate and review supplied Privacy Policy content", completed: false },
  { name: "Obtain and integrate approved Terms of Use content", completed: false },
  { name: "Complete remaining simple content, asset or presentation updates agreed with Offscript", completed: false },
  { name: "Perform final responsive, functional, navigation and deployment checks", completed: false },
];

const TIME_ZONE = "Asia/Colombo";

const STATUS_STYLES: Record<
  BatchItem["state"],
  { text: string; dot: string; badgeBg: string; badgeBorder: string }
> = {
  completed: {
    text: "text-[#A6C2AC]",
    dot: "bg-[#91B69A]",
    badgeBg: "bg-[#91B69A]/10",
    badgeBorder: "border-[#91B69A]/30",
  },
  active: {
    text: "text-[#D2B783]",
    dot: "bg-[#C7A46A]",
    badgeBg: "bg-[#C7A46A]/10",
    badgeBorder: "border-[#C7A46A]/30",
  },
  planned: {
    text: "text-[#B7B0A2]",
    dot: "bg-[#A7A095]",
    badgeBg: "bg-white/[0.04]",
    badgeBorder: "border-white/[0.08]",
  },
};

export default function Maintenance() {
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion ?? false;

  const [localTime, setLocalTime] = useState("");
  const [expandedBatch, setExpandedBatch] = useState<string | null>("03");
  const [logIndex, setLogIndex] = useState(0);

  const statusPanelRef = useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();

  const statusCfg = BUILD_STATUS_CONFIG[CURRENT_BUILD_STATUS];

  // Calculate overall global progress dynamically (10 / 23 = 43%)
  const allTasks = [
    ...DEVELOPMENT_BATCHES.flatMap((b) => b.tasks),
    ...REMAINING_LAUNCH_TASKS,
  ];
  const completedTaskCount = allTasks.filter((t) => t.completed).length;
  const globalProgress = Math.round((completedTaskCount / allTasks.length) * 100);

  const activeBatch = DEVELOPMENT_BATCHES.find((b) => b.state === "active");

  useEffect(() => {
    const updateClock = () => {
      setLocalTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: TIME_ZONE,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    };

    updateClock();
    const interval = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(interval);
  }, []);

  // Development feed ticker cycle logic bound to current status logs respecting useReducedMotion
  useEffect(() => {
    setLogIndex(0);
    const logInterval = window.setInterval(() => {
      setLogIndex((prev) => (prev + 1) % statusCfg.logs.length);
    }, 4500);

    return () => window.clearInterval(logInterval);
  }, [CURRENT_BUILD_STATUS, statusCfg.logs.length]);

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

  const toggleBatch = (batchNumber: string) => {
    setExpandedBatch((current) =>
      current === batchNumber ? null : batchNumber
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

      {/* Cinematic ambient lighting with subtle secondary motion */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                background: [
                  "radial-gradient(48% 34% at 48% 35%, rgba(199,164,106,0.075), transparent 75%)",
                  "radial-gradient(48% 34% at 54% 42%, rgba(199,164,106,0.055), transparent 78%)",
                  "radial-gradient(48% 34% at 48% 35%, rgba(199,164,106,0.075), transparent 75%)",
                ],
              }
        }
        transition={{
          duration: 22,
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
        className="relative z-10 flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4 md:pb-6"
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <p className="type-display-wide text-sm uppercase tracking-[0.16em] sm:text-base md:text-lg">
            Offscript
          </p>
          <span className="type-mono rounded-full border border-[#C7A46A]/30 bg-[#C7A46A]/10 px-2 sm:px-2.5 py-0.5 text-[0.55rem] sm:text-[0.6rem] text-[#D2B783]">
            {globalProgress}% COMPLETE
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="type-mono flex items-center gap-1.5 sm:gap-2.5 text-[0.55rem] text-fog sm:text-xs">
            <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 items-center justify-center">
              {!shouldReduceMotion && (
                <motion.span
                  aria-hidden="true"
                  className="absolute h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-[#C7A46A]/60"
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
              <span className="relative h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[#C7A46A]" />
            </span>
            <span className="hidden sm:inline">DEVELOPMENT STATUS DASHBOARD</span>
            <span className="sm:hidden">STATUS DASHBOARD</span>
          </div>

          <div
            className="type-mono flex items-center gap-1.5 text-[0.5rem] tracking-[0.08em] text-ash sm:text-[0.65rem]"
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
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center py-8 sm:py-12 md:py-16">
        {/* Introduction */}
        <section className="flex flex-col items-center text-center">
          <motion.div
            aria-hidden="true"
            className="text-paper scale-90 sm:scale-100"
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
            className="type-mono mt-5 sm:mt-7 text-[0.6rem] tracking-[0.16em] text-[#C7A46A] sm:text-xs"
          >
            DEVELOPMENT PROGRESS REPORT
          </motion.p>

          <motion.h1
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18 }}
            className="type-display-wide mt-3 sm:mt-4 max-w-3xl text-balance text-[clamp(1.75rem,5.2vw,4.5rem)] leading-[1.08]"
          >
            Website Development Status
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="type-body mt-4 sm:mt-5 max-w-xl text-xs sm:text-sm md:text-base leading-6 sm:leading-7 text-fog"
          >
            We&rsquo;re continuing to refine the Offscript website, with updates being completed in stages. Here&rsquo;s a look at what&rsquo;s been completed, what&rsquo;s currently underway and what remains before launch.
          </motion.p>
        </section>

        {/* Development Batches Section */}
        <motion.section
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.35 }}
          aria-labelledby="development-batches-heading"
          className="mt-8 sm:mt-12 md:mt-16"
        >
          <div className="mb-2.5 sm:mb-3 flex items-center justify-between gap-4">
            <h2
              id="development-batches-heading"
              className="type-mono text-[0.6rem] tracking-[0.12em] text-ash sm:text-xs"
            >
              CORE DEVELOPMENT BATCHES (01 — 04)
            </h2>

            <span className="type-mono text-[0.55rem] text-ash sm:text-[0.7rem]">
              4 BATCHES
            </span>
          </div>

          {/* Streamlined, Premium Build Status Bar */}
          <div className={`mb-3 sm:mb-4 flex flex-col gap-1.5 sm:gap-2 rounded-lg border px-3 sm:px-3.5 py-2.5 sm:py-3 ${statusCfg.borderColor} ${statusCfg.bgColor}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
                  {statusCfg.isAnimated && !shouldReduceMotion && (
                    <span className="absolute h-3 w-3 rounded-full bg-[#C7A46A]/40 animate-ping" />
                  )}
                  <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dotColor}`} />
                </span>
                {/* Glowing Status Text */}
                <motion.span
                  animate={
                    statusCfg.isAnimated && !shouldReduceMotion
                      ? { opacity: [1, 0.75, 1] }
                      : { opacity: 1 }
                  }
                  transition={{ duration: 2.5, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
                  className={`type-mono font-semibold tracking-wide text-[0.7rem] sm:text-xs ${statusCfg.textColor} ${statusCfg.glowClass}`}
                >
                  [{statusCfg.label}]
                </motion.span>
                <span className="type-mono text-fog text-[0.6rem] sm:text-[0.65rem] truncate hidden sm:inline">
                  — {statusCfg.message}
                </span>
              </div>
            </div>

            <span className="type-mono text-fog text-[0.6rem] sm:hidden leading-4">
              {statusCfg.message}
            </span>

            {/* True Directional Loading Bar */}
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-black/50 border border-white/[0.06] mt-0.5 sm:mt-1">
              {statusCfg.isAnimated && !shouldReduceMotion ? (
                <motion.div
                  className={`absolute top-0 bottom-0 w-1/3 rounded-full ${statusCfg.barColor}`}
                  animate={{ left: ["-35%", "100%"] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ) : (
                <div
                  className={`absolute inset-y-0 left-0 w-1/2 rounded-full ${statusCfg.barColor} opacity-80`}
                />
              )}
            </div>
          </div>

          {/* Current Focus Spotlight & Progress Bar */}
          <div className="mb-3 sm:mb-4 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div
              className="flex items-center gap-2.5 sm:gap-3 flex-1"
              role="status"
              aria-label="Development batches actively progressing"
            >
              <span className="type-mono shrink-0 text-[0.55rem] tracking-[0.1em] text-ash sm:text-[0.65rem]">
                OVERALL PROGRESS
              </span>

              <div
                aria-hidden="true"
                className="relative h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C7A46A]/80 via-[#E6D0A6] to-[#C7A46A]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${globalProgress}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  {statusCfg.isAnimated && !shouldReduceMotion && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                    />
                  )}
                </motion.div>
              </div>

              <span className="type-mono shrink-0 text-[0.55rem] tracking-[0.08em] text-[#D2B783] sm:text-[0.65rem]">
                {completedTaskCount} / {allTasks.length} TASKS
              </span>
            </div>

            {activeBatch && (
              <div className="type-mono inline-flex items-center gap-2 rounded-lg border border-[#C7A46A]/25 bg-[#C7A46A]/5 px-2.5 py-1 text-[0.58rem] sm:text-[0.6rem] text-fog self-start sm:self-auto">
                <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
                  {statusCfg.isAnimated && !shouldReduceMotion && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-[#C7A46A]"
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ borderTopColor: "transparent" }}
                    />
                  )}
                  <span className="h-1 w-1 shrink-0 rounded-full bg-[#C7A46A]" />
                </span>
                <span className="text-ash">CURRENT FOCUS:</span>
                <span className="text-[#D2B783]">Batch {activeBatch.number} — {activeBatch.name}</span>
              </div>
            )}
          </div>

          {/* Dynamic Development Update Feed Ticker */}
          <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 rounded-md border border-white/[0.06] bg-black/40 px-3 py-2 text-[0.6rem] sm:text-[0.62rem]">
            <span className={`type-mono shrink-0 font-semibold ${statusCfg.textColor}`}>
              [DEVELOPMENT UPDATE FEED]
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={`${CURRENT_BUILD_STATUS}-${logIndex}`}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -3 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
                className="type-mono text-fog whitespace-normal break-words sm:truncate leading-4 sm:leading-normal"
              >
                {statusCfg.logs[logIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Glass Panel */}
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

            {DEVELOPMENT_BATCHES.map((batch, index) => {
              const isExpanded = expandedBatch === batch.number;
              const isActive = batch.state === "active";
              const statusStyle = STATUS_STYLES[batch.state];
              const batchCompletedCount = batch.tasks.filter((t) => t.completed).length;
              const batchProgress = Math.round((batchCompletedCount / batch.tasks.length) * 100);

              return (
                <motion.div
                  key={batch.number}
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: shouldReduceMotion ? 0 : 0.4 + index * 0.07,
                  }}
                  className={`group/row relative border-b border-white/[0.075] last:border-b-0 transition-colors duration-300 ${
                    isActive ? "bg-[#C7A46A]/[0.025]" : ""
                  } ${isExpanded ? "bg-white/[0.035]" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleBatch(batch.number)}
                    aria-expanded={isExpanded}
                    aria-controls={`batch-${batch.number}`}
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} Batch ${batch.number}: ${batch.name}`}
                    className="block w-full cursor-pointer text-left transition-colors duration-300 hover:bg-white/[0.025] active:bg-white/[0.045] focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#C7A46A]"
                  >
                    <div className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] gap-x-2.5 px-3.5 py-3.5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-x-5 sm:px-5 sm:py-5">
                      <span className={`type-mono col-start-1 row-start-1 pt-0.5 text-[0.7rem] sm:text-xs transition-colors duration-300 ${isActive ? "text-[#C7A46A]" : "text-ash group-hover/row:text-[#C7A46A]"}`}>
                        {batch.number}
                      </span>

                      <div className="col-start-2 row-start-1 min-w-0">
                        <h3 className={`type-display-wide text-sm sm:text-base md:text-lg transition-colors duration-300 ${isActive ? "text-white" : "text-paper group-hover/row:text-white"}`}>
                          {batch.name}
                        </h3>

                        <p className="type-body mt-0.5 sm:mt-1 text-[0.7rem] sm:text-xs md:text-sm leading-4 sm:leading-5 text-fog">
                          {batch.description}
                        </p>
                      </div>

                      {/* Status label with percentage badge */}
                      <div className="col-start-2 row-start-2 mt-2 sm:mt-0 flex min-w-0 items-center gap-2 sm:gap-3 sm:col-start-3 sm:row-start-1 sm:justify-self-end">
                        <div className={`flex items-center gap-1.5 sm:gap-2 rounded-full border px-2 sm:px-2.5 py-0.5 ${statusStyle.badgeBg} ${statusStyle.badgeBorder}`}>
                          {isActive && !shouldReduceMotion ? (
                            <span className="relative flex h-1.5 w-1.5 shrink-0 items-center justify-center">
                              <span className="absolute h-3 w-3 rounded-full bg-[#C7A46A]/40 animate-ping" />
                              <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                            </span>
                          ) : (
                            <span
                              aria-hidden="true"
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusStyle.dot}`}
                            />
                          )}
                          <span
                            className={`type-mono text-[0.58rem] sm:text-[0.62rem] md:text-xs leading-4 sm:leading-5 ${statusStyle.text}`}
                          >
                            {batch.status}
                          </span>
                        </div>

                        <span className="type-mono rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[0.55rem] sm:text-[0.58rem] md:text-[0.65rem] tabular-nums text-ash">
                          {batchProgress}%
                        </span>
                      </div>

                      {/* Arrow indicator */}
                      <span
                        aria-hidden="true"
                        className={`col-start-3 row-start-1 flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center self-center rounded-full border transition-all duration-300 sm:col-start-4 ${
                          isExpanded
                            ? "border-[#C7A46A]/55 bg-[#C7A46A]/10 text-[#D2B783]"
                            : isActive
                            ? "border-[#C7A46A]/40 text-[#D2B783]"
                            : "border-white/[0.12] text-ash group-hover/row:border-[#C7A46A]/50 group-hover/row:text-[#D2B783]"
                        }`}
                      >
                        <motion.svg
                          viewBox="0 0 16 16"
                          width="12"
                          height="12"
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
                      </span>
                    </div>
                  </button>

                  {/* Batch Tasks Expansion */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        id={`batch-${batch.number}`}
                        key={`batch-${batch.number}-tasks`}
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
                        <div className="mx-2.5 sm:mx-3 md:mx-5 mb-3 sm:mb-4 md:mb-5 rounded-lg border border-[#C7A46A]/20 bg-black/25 p-3 sm:p-4 md:p-5">
                          <div className="mb-3 sm:mb-4 flex flex-wrap items-center justify-between gap-2">
                            <p className="type-mono text-[0.55rem] sm:text-[0.58rem] md:text-[0.65rem] tracking-[0.12em] text-[#C7A46A]">
                              INCLUDED TASKS & COMPLETION STATES
                            </p>
                            <span className="type-mono text-[0.52rem] sm:text-[0.55rem] text-ash">
                              {String(batch.tasks.length).padStart(2, "0")} TASKS
                            </span>
                          </div>

                          <div className="grid gap-1.5 sm:gap-2 grid-cols-1 sm:grid-cols-2">
                            {batch.tasks.map((task, taskIndex) => {
                              const isCompleted = task.completed;
                              const circumference = 50.26;
                              const strokeDashoffset = isCompleted ? 0 : 50.26;

                              return (
                                <motion.div
                                  key={task.name}
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
                                      : taskIndex * 0.025,
                                  }}
                                  className="flex min-w-0 items-center gap-2.5 sm:gap-3 rounded-md border border-white/[0.055] bg-white/[0.025] px-2.5 sm:px-3 py-2.5 sm:py-3 transition-colors duration-200 hover:border-[#C7A46A]/20 hover:bg-white/[0.045]"
                                >
                                  {/* Circular Indicator */}
                                  <div className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 items-center justify-center">
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
                                          duration: shouldReduceMotion ? 0 : 0.8,
                                          ease: "easeInOut",
                                          delay: taskIndex * 0.05,
                                        }}
                                        className={
                                          isCompleted
                                            ? "text-[#C7A46A]"
                                            : "text-white/10"
                                        }
                                      />
                                    </svg>
                                    {isCompleted && (
                                      <motion.span
                                        initial={shouldReduceMotion ? undefined : { scale: 0 }}
                                        animate={shouldReduceMotion ? undefined : { scale: 1 }}
                                        transition={{ delay: 0.3 + taskIndex * 0.05, type: "spring", stiffness: 300 }}
                                        className="absolute h-1.5 w-1.5 rounded-full bg-[#C7A46A]"
                                      />
                                    )}
                                  </div>

                                  <span
                                    aria-hidden="true"
                                    className="type-mono text-[0.55rem] sm:text-[0.6rem] text-[#C7A46A]/80"
                                  >
                                    {String(taskIndex + 1).padStart(2, "0")}
                                  </span>

                                  <span className="type-body min-w-0 flex-1 text-[0.7rem] sm:text-xs md:text-sm leading-4 sm:leading-5 text-fog">
                                    {task.name}
                                  </span>

                                  <span className={`type-mono text-[0.52rem] sm:text-[0.55rem] ${isCompleted ? "text-[#C7A46A]" : "text-ash/60"}`}>
                                    {isCompleted ? "DONE" : "PENDING"}
                                  </span>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Subtle edge accent */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute bottom-3 left-0 top-3 w-px origin-center bg-[#C7A46A]/80 transition-transform duration-300 ${
                      isExpanded
                        ? "scale-y-100"
                        : isActive
                        ? "scale-y-75 bg-[#C7A46A]/60"
                        : "scale-y-0 group-hover/row:scale-y-100"
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Post-Batch Launch Tasks */}
        <motion.section
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.45 }}
          aria-labelledby="remaining-launch-heading"
          className="mt-8 sm:mt-12 md:mt-16"
        >
          <div className="mb-2.5 sm:mb-3 flex items-center justify-between gap-4">
            <h2
              id="remaining-launch-heading"
              className="type-mono text-[0.6rem] tracking-[0.12em] text-ash sm:text-xs"
            >
              REMAINING BEFORE LAUNCH
            </h2>

            <span className="type-mono text-[0.55rem] text-ash sm:text-[0.7rem]">
              POST-BATCH TASKS
            </span>
          </div>

          <div className="rounded-xl border border-white/[0.10] bg-white/[0.025] p-3.5 sm:p-5 backdrop-blur-xl">
            <p className="type-body mb-3 sm:mb-4 text-[0.7rem] sm:text-xs md:text-sm leading-4 sm:leading-5 text-fog">
              The following checklist items follow the completion of the core development batches:
            </p>

            <div className="grid gap-1.5 sm:gap-2 grid-cols-1 sm:grid-cols-2">
              {REMAINING_LAUNCH_TASKS.map((task, idx) => {
                const isCompleted = task.completed;
                return (
                  <div
                    key={task.name}
                    className="flex items-center gap-2.5 sm:gap-3 rounded-md border border-white/[0.055] bg-white/[0.025] px-2.5 sm:px-3 py-2.5 sm:py-3"
                  >
                    <span className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/30">
                      {isCompleted && <span className="h-1.5 w-1.5 rounded-full bg-[#C7A46A]" />}
                    </span>
                    <span className="type-mono text-[0.55rem] sm:text-[0.6rem] text-[#C7A46A]/80">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="type-body min-w-0 flex-1 text-[0.7rem] sm:text-xs md:text-sm leading-4 sm:leading-5 text-fog">
                      {task.name}
                    </span>
                    <span className={`type-mono text-[0.52rem] sm:text-[0.55rem] ${isCompleted ? "text-[#C7A46A]" : "text-ash/60"}`}>
                      {isCompleted ? "DONE" : "PENDING"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="type-body mt-3 sm:mt-4 w-full text-balance text-[0.7rem] sm:text-xs md:text-sm leading-5 sm:leading-6 text-ash">
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
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1. Offscript Enquiries Section (First on Mobile, Left on Laptop/Desktop) */}
          <div className="order-1 lg:order-1">
            <p className="type-mono text-[0.65rem] tracking-[0.12em] text-ash">
              OFFSCRIPT ENQUIRIES
            </p>
            <a
              href="mailto:neveroffscript@gmail.com"
              className="type-body mt-2 sm:mt-3 inline-block break-all text-xs sm:text-sm text-fog transition-colors duration-300 hover:text-paper focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C7A46A]"
            >
              neveroffscript@gmail.com
            </a>
          </div>

          {/* 2. Website Development Section (Senovra Logo & Brand Info - Center on Laptop/Desktop) */}
          <div className="order-2 lg:order-2">
            <p className="type-mono text-[0.65rem] tracking-[0.12em] text-ash">
              WEBSITE DEVELOPMENT
            </p>

            <a
              href="https://www.senovra.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2.5 inline-flex items-center gap-3 text-xs sm:text-sm text-paper transition-colors duration-300 hover:text-[#D2B783] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C7A46A]"
            >
              <img
                src="https://res.cloudinary.com/css2xcvk/image/upload/v1792555517/Senovra_Official_Logo_Transparent_Background.png"
                alt="Senovra logo"
                className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
              />
              <span className="type-body font-medium">Senovra</span>
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

            <p className="type-body mt-1.5 text-xs sm:text-sm text-fog">
              Your Vision. Perfected.
            </p>

            <a
              href="https://www.senovra.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="type-mono mt-1.5 inline-block break-all text-[0.7rem] sm:text-xs text-ash transition-colors duration-300 hover:text-paper focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C7A46A]"
            >
              www.senovra.com
            </a>
          </div>

          {/* 3. Senovra Contact Details (Appears under Logo on Mobile, and on the Right on Laptop/Desktop) */}
          <div className="order-3 lg:order-3 flex flex-col gap-4">
            <div>
              <p className="type-mono text-[0.65rem] tracking-[0.12em] text-ash">
                GENERAL ENQUIRIES
              </p>
              <a
                href="mailto:info@senovra.com"
                className="type-body mt-1.5 inline-block break-all text-xs sm:text-sm text-fog transition-colors duration-300 hover:text-paper focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C7A46A]"
              >
                info@senovra.com
              </a>
            </div>

            <div>
              <p className="type-mono text-[0.65rem] tracking-[0.12em] text-ash">
                SUPPORT
              </p>
              <a
                href="mailto:support@senovra.com"
                className="type-body mt-1.5 inline-block break-all text-xs sm:text-sm text-fog transition-colors duration-300 hover:text-paper focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#C7A46A]"
              >
                support@senovra.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col gap-2.5 sm:gap-3 border-t border-[var(--line)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-mono text-[0.6rem] sm:text-[0.65rem] text-ash">
            © {year} Offscript. All rights reserved.
          </p>
          <p className="type-mono text-[0.6rem] sm:text-[0.65rem] text-ash">
            DEVELOPED BY SENOVRA
          </p>
        </div>
      </motion.footer>
    </main>
  );
}