"use client";

import { useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import ProjectLink from "./ProjectLink";
import type { Project } from "@/lib/projects";
import { EASE_CUT } from "@/lib/utils";

interface WorkCardProps {
  project: Project;
  index: number;
}

/**
 * One project on the Work page. The photo has gentle scroll parallax, opens
 * like a window as it scrolls into view, and zooms a little on hover. On mouse
 * devices a "View" circle follows the pointer. Clicking opens the project with
 * the page transition.
 */
export default function WorkCard({ project, index }: WorkCardProps) {
  const reduceMotion = useReducedMotion();
  const mediaRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const followX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.4 });
  const followY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.4 });

  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ["start end", "end start"],
  });
  const parallax = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !mediaRef.current) return;
    const rect = mediaRef.current.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <li
      className={`transition-opacity duration-500 md:group-hover/list:opacity-40 md:hover:opacity-100! ${
        index % 2 ? "md:pl-[16%]" : "md:pr-[16%]"
      }`}
    >
      <ProjectLink
        href={`/work/${project.slug}`}
        image={project.image}
        focal={project.focal}
        originSelector="[data-card-media]"
        className="group block"
      >
        <motion.div
          ref={mediaRef}
          data-card-media
          className="relative aspect-[4/5] overflow-hidden bg-graphite md:aspect-[16/9]"
          initial={reduceMotion ? false : { clipPath: "inset(0% 0% 100% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 1.1, ease: EASE_CUT }}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setHovering(true);
          }}
          onPointerLeave={() => setHovering(false)}
          onPointerMove={onMove}
        >
          <motion.div
            className="absolute inset-[-6%]"
            style={reduceMotion ? undefined : { y: parallax }}
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(min-width: 768px) 84vw, 100vw"
              priority={index < 2}
              className="object-cover transition-transform duration-[1400ms] [transition-timing-function:var(--ease-push)] group-hover:scale-[1.05]"
              style={{ objectPosition: project.focal }}
            />
          </motion.div>

          {project.isPlaceholder && (
            <span className="type-mono absolute left-4 top-4 z-10 border border-paper/50 bg-ink/40 px-2 py-1 text-paper">
              Placeholder
            </span>
          )}

          {/* "View" circle that follows the mouse (mouse devices only) */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10"
            style={{ x: followX, y: followY }}
          >
            <span
              className={`type-mono flex h-[5.5rem] w-[5.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink transition-all duration-300 ${
                hovering ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            >
              View
            </span>
          </motion.div>
        </motion.div>

        <div className="mt-5 flex items-end justify-between gap-6">
          <div className="transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover:translate-x-2">
            <p className="type-mono text-ash transition-colors duration-300 group-hover:text-fog">
              {project.number}
              <span className="mx-2">—</span>
              {project.category}
              {project.year ? ` / ${project.year}` : ""}
            </p>
            <h2 className="type-display-wide size-lg mt-2">{project.title}</h2>
          </div>

          <span
            aria-hidden="true"
            className="type-mono hidden items-center gap-2 border-b border-current pb-1 md:inline-flex"
          >
            View project
            <span className="inline-block transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover:translate-x-1.5">
              →
            </span>
          </span>
        </div>
      </ProjectLink>
    </li>
  );
}