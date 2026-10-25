"use client";

import { useRef, useState, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import FitImage from "@/components/ui/FitImage";
import ProjectLink from "./ProjectLink";
import type { Project } from "@/lib/projects";
import { EASE_CUT } from "@/lib/utils";

interface WorkCardProps {
  project: Project;
  index: number;
}

/** Space the cursor tag needs on the right before it flips to the left of the cursor (px). */
const TAG_ROOM = 120;

/** The small "View →" tag: a thin border, mono type, a dark fill. No blur. */
const TAG_CLASS =
  "type-mono inline-flex h-8 items-center gap-2 whitespace-nowrap border border-paper/40 bg-ink/80 px-3 text-[0.625rem] tracking-[0.12em] text-paper";

/**
 * One project on the Work page. The photo has gentle scroll parallax, opens
 * like a window as it scrolls into view, and zooms a little on hover.
 *
 * "View" affordance:
 *   Mouse    : a small tag follows the cursor, flipping to its left near the edge.
 *   Touch    : the same tag sits quietly in the photo's corner.
 *   Keyboard : the corner tag appears when the card has focus.
 * Clicking opens the project with the page transition.
 *
 * The frame is 4:3 on phones and 16:9 from tablets up (see FitImage for how
 * photos fit it).
 */
export default function WorkCard({ project, index }: WorkCardProps) {
  const reduceMotion = useReducedMotion();
  const mediaRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [flip, setFlip] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.4 });
  // With reduced motion the tag simply sits at the cursor, with no easing
  const tagX = reduceMotion ? x : springX;
  const tagY = reduceMotion ? y : springY;

  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ["start end", "end start"],
  });
  const parallax = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !mediaRef.current) return;
    const rect = mediaRef.current.getBoundingClientRect();
    const px = event.clientX - rect.left;
    x.set(px);
    y.set(event.clientY - rect.top);
    setFlip(px > rect.width - TAG_ROOM);
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
          className="relative aspect-[4/3] overflow-hidden bg-graphite md:aspect-[16/9]"
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
            <FitImage
              src={project.image}
              alt={project.imageAlt}
              sizes="(min-width: 768px) 92vw, 112vw"
              priority={index < 2}
              focal={project.focal}
              imageClassName="transition-transform duration-[1400ms] [transition-timing-function:var(--ease-push)] group-hover:scale-[1.04]"
            />
          </motion.div>

          {project.isPlaceholder && (
            <span className="type-mono absolute left-4 top-4 z-10 border border-paper/50 bg-ink/40 px-2 py-1 text-paper">
              Placeholder
            </span>
          )}

          {/* Mouse: a small tag that follows the cursor */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10"
            style={{ x: tagX, y: tagY }}
          >
            <span
              className={`${TAG_CLASS} mt-4 transition-opacity duration-300 ${
                flip ? "-ml-4 -translate-x-full" : "ml-4"
              } ${hovering ? "opacity-100" : "opacity-0"}`}
            >
              View <span>→</span>
            </span>
          </motion.div>

          {/* Touch and keyboard: the same tag, resting in the corner */}
          <span
            aria-hidden="true"
            className={`${TAG_CLASS} pointer-events-none absolute bottom-3 right-3 z-10 opacity-0 transition-opacity duration-300 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100`}
          >
            View <span>→</span>
          </span>
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