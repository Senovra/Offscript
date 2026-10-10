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
    preview: [
      "Arrival",
      "Identity",
      "Viewfinder",
      "Lens Lock → Iris transition",
      "Work Reel",
      "Capability",
      "360° / About",
      "Footer",
    ],
    previewLabel: "Homepage chapters",
  },
  {
    number: "02",
    name: "About",
    description: "Awaiting content from Offscript.",
    status: "Awaiting content",
    state: "pending",
    preview: ["Who We Are", "How We Work", "Who We Work With"],
    previewLabel: "Three-part introduction",
  },
  {
    number: "03",
    name: "Services",
    description: "Layouts and animations are still underway.",
    status: "Design in progress",
    state: "active",
    preview: [
      "Strategy",
      "Design",
      "Content Creation",
      "Performance Marketing",
      "Social Media",
      "Immersive Experience",
    ],
    previewLabel: "Service capabilities",
  },
  {
    number: "04",
    name: "Work",
    description: "Refining the work presentation and full-screen project experiences.",
    status: "Design in progress",
    state: "active",
    preview: [
      "Work sections",
      "Individual full-screen project experiences",
      "Animations and visual design",
    ],
    previewLabel: "Portfolio experience",
  },
  {
    number: "05",
    name: "Contact",
    description: "Completing the final refinements.",
    status: "Finalising",
    state: "finalising",
  },
  {
    number: "06",
    name: "Privacy Policy",
    description: "Awaiting approved policy content from Offscript.",
    status: "Awaiting content",
    state: "pending",
  },
  {
    number: "07",
    name: "Terms & Conditions",
    description: "Awaiting approved terms from Offscript.",
    status: "Awaiting content",
    state: "pending",
  },
  {
    number: "08",
    name: "Credits",
    description: "Credits page completed.",
    status: "Completed",
    state: "completed",
  },
] as const;

const TIME_ZONE = "Asia/Colombo";

export default function Maintenance() {
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion ?? false;

  const [localTime, setLocalTime] = useState("");
  const [hoveredPage, setHoveredPage] = useState<string | null>(null);
  const [expandedPage, setExpandedPage] = useState<string | null>(null);

  const statusPanelRef = useRef<HTMLDivElement>(null);
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

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
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
    if (statusPanelRef.current) {
      statusPanelRef.current.style.setProperty("--pointer-x", "50%");
      statusPanelRef.current.style.setProperty("--pointer-y", "0%");
    }
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
        <p className="type-display-wide text-base uppercase tracking-[0.16em] md:text-lg">
          Offscript
        </p>

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
              <span
                aria-hidden="true"
                className="relative h-1.5 w-1.5 rounded-full bg-[#C7A46A]"
              />
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

          {/* Animated development progress indicator */}
          <div
            className="mb-5 flex items-center gap-3"
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
              const isHovered = hoveredPage === page.name;
              const isExpanded = expandedPage === page.name;
              const showPreview = hasPreview && (isHovered || isExpanded);

              const statusColor =
                page.state === "finalising"
                  ? "text-[#A6C2AC]"
                  : page.state === "completed"
                    ? "text-[#A6C2AC]"
                    : page.state === "pending"
                      ? "text-[#B7B0A2]"
                      : "text-[#D2B783]";

              const dotColor =
                page.state === "finalising" || page.state === "completed"
                  ? "bg-[#91B69A]"
                  : page.state === "pending"
                    ? "bg-[#A7A095]"
                    : "bg-[#C7A46A]";

              return (
                <motion.div
                  key={page.name}
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: shouldReduceMotion ? 0 : 0.4 + index * 0.07,
                  }}
                  onHoverStart={() => {
                    if (hasPreview) setHoveredPage(page.name);
                  }}
                  onHoverEnd={() => {
                    if (hasPreview) setHoveredPage(null);
                  }}
                  className={`group/row relative border-b border-white/[0.075] last:border-b-0 transition-colors duration-300 ${
                    showPreview ? "bg-white/[0.025]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 px-4 py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-x-5 sm:px-5 sm:py-5">
                    <span className="type-mono pt-1 text-xs text-ash transition-transform duration-300 group-hover/row:translate-x-0.5 group-hover/row:text-[#C7A46A]">
                      {page.number}
                    </span>

                    <div className="min-w-0">
                      <h3 className="type-display-wide text-base transition-colors duration-300 group-hover/row:text-white sm:text-lg">
                        {page.name}
                      </h3>
                      <p className="type-body mt-1 text-xs leading-5 text-fog sm:text-sm">
                        {page.description}
                      </p>
                    </div>

                    <div className="col-start-2 mt-3 flex items-center gap-2 sm:col-start-auto sm:mt-0 sm:justify-self-end">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`}
                      />
                      <span
                        className={`type-mono text-[0.65rem] sm:text-xs ${statusColor}`}
                      >
                        {page.status}
                      </span>

                      {hasPreview && (
                        <button
                          type="button"
                          aria-label={`${isExpanded ? "Hide" : "Show"} ${page.name} details`}
                          aria-expanded={Boolean(showPreview)}
                          onClick={() => togglePreview(page.name)}
                          className="ml-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.10] text-ash transition-colors hover:border-[#C7A46A]/50 hover:text-[#D2B783] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#C7A46A] sm:hidden"
                        >
                          <motion.svg
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            width="12"
                            height="12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <path d="m3 6 5 5 5-5" />
                          </motion.svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Section preview: hover on desktop, tap on touch devices */}
                  {hasPreview && (
                    <AnimatePresence initial={false}>
                      {showPreview && (
                        <motion.div
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
                          <div className="mx-4 mb-4 rounded-lg border border-[#C7A46A]/15 bg-black/20 px-4 py-4 sm:mx-5 sm:mb-5 sm:px-5">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <p className="type-mono text-[0.58rem] tracking-[0.13em] text-[#C7A46A] sm:text-[0.65rem]">
                                {page.previewLabel}
                              </p>
                              <span className="type-mono text-[0.55rem] text-ash">
                                {page.preview.length.toString().padStart(2, "0")}{" "}
                                ITEMS
                              </span>
                            </div>

                            <div
                              className={`grid gap-x-6 gap-y-2 ${
                                page.name === "Home" || page.name === "Services"
                                  ? "sm:grid-cols-2"
                                  : "grid-cols-1"
                              }`}
                            >
                              {page.preview.map((item, previewIndex) => (
                                <motion.div
                                  key={item}
                                  initial={
                                    shouldReduceMotion
                                      ? undefined
                                      : { opacity: 0, x: -5 }
                                  }
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: shouldReduceMotion
                                      ? 0
                                      : previewIndex * 0.025,
                                  }}
                                  className="flex min-w-0 items-start gap-2.5"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="mt-[0.48rem] h-1 w-1 shrink-0 rounded-full bg-[#C7A46A]/80"
                                  />
                                  <span className="type-body text-xs leading-5 text-fog sm:text-sm">
                                    {item}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {/* Subtle amber hover accent */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute bottom-3 left-0 top-3 w-px origin-center bg-[#C7A46A]/80 transition-transform duration-300 ${
                      showPreview
                        ? "scale-y-100"
                        : "scale-y-0 group-hover/row:scale-y-100"
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>

          <p className="type-body mt-4 text-xs leading-6 text-ash sm:text-sm">
            Further refinements, content integration and final checks will
            continue as the website progresses towards launch.
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
