"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { finishProjectTransition } from "./projectTransition";
import type { Project } from "@/lib/projects";
import { EASE_PUSH } from "@/lib/utils";

/**
 * Full-screen opening of a project page. It hands over from the transition
 * overlay (which has the identical photo and shade), settles the photo, and
 * raises the title. Scrolling drifts the photo and lifts the title away.
 */
export default function ProjectHero({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Tell the transition overlay the page is ready, then it fades away
  useEffect(() => {
    const timer = window.setTimeout(finishProjectTransition, 150);
    return () => window.clearTimeout(timer);
  }, []);

  const delay = reduceMotion ? 0 : 0.35;

  return (
    <section
      ref={ref}
      className="relative h-svh min-h-[28rem] overflow-hidden bg-graphite"
    >
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: EASE_PUSH }}
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={reduceMotion ? undefined : { scale: imageScale, y: imageY }}
        >
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: project.focal }}
          />
        </motion.div>
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.15) 45%, rgba(10,10,11,0.3) 100%)",
        }}
      />

      <motion.div
        className="absolute inset-x-[var(--gutter)] top-[calc(var(--header-h)+0.75rem)] z-10"
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: delay + 0.2 }}
      >
        <Link
          href="/work"
          className="group type-mono inline-flex h-11 items-center gap-3 text-paper"
        >
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover:-translate-x-1.5"
          >
            ←
          </span>
          All work
        </Link>
      </motion.div>

      <motion.div
        className="absolute inset-x-[var(--gutter)] bottom-[max(2.5rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))] z-10 text-paper"
        style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}
      >
        <motion.p
          className="type-mono"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay }}
        >
          {project.number}
          <span className="mx-2 text-paper/50">—</span>
          {project.category}
          {project.year ? ` / ${project.year}` : ""}
        </motion.p>

        <div className="mt-3 overflow-hidden pb-[0.1em]">
          <motion.h1
            className="type-display-wide size-xl"
            initial={reduceMotion ? false : { y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, ease: EASE_PUSH, delay: delay + 0.1 }}
          >
            {project.title}
          </motion.h1>
        </div>
      </motion.div>
    </section>
  );
}