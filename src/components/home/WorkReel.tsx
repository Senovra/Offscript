"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { projects, type Project } from "@/lib/projects";
import { pad2 } from "@/lib/utils";

const HIDDEN = "inset(100% 0% 0% 0%)";
const SHOWN = "inset(0% 0% 0% 0%)";

interface PlateBodyProps {
  project: Project;
  count: number;
  priority?: boolean;
  imageScale?: MotionValue<number>;
}

/**
 * One full-screen project plate: media edge to edge, quiet utility labels at
 * the top, a moderate title at the bottom. Shared by the pinned reel and the
 * reduced-motion list.
 */
function PlateBody({ project, count, priority = false, imageScale }: PlateBodyProps) {
  return (
    <>
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ scale: imageScale }}
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="100vw"
          priority={priority}
          className="object-cover"
          style={{ objectPosition: project.focal }}
        />
      </motion.div>

      {/* Shade so white type reads on any photograph */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,11,0.82) 0%, rgba(10,10,11,0.2) 40%, rgba(10,10,11,0.34) 100%)",
        }}
      />

      <div className="absolute inset-x-[var(--gutter)] top-[calc(var(--header-h)+0.75rem)] z-10 flex items-start justify-between text-paper">
        <p className="type-mono">
          Work <span className="mx-2 text-paper/50">—</span>
          {project.number} / {pad2(count)}
        </p>
        <Link
          href="/work"
          className="type-mono inline-flex h-11 items-center gap-3 border-b border-current"
        >
          All work <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="absolute inset-x-[var(--gutter)] bottom-[max(2rem,calc(env(safe-area-inset-bottom,0px)+1.25rem))] z-10 flex items-end justify-between gap-8 text-paper">
        <div className="min-w-0">
          <p className="type-mono mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-paper/80">
            {project.isPlaceholder && (
              <span className="border border-current px-2 py-1">Placeholder</span>
            )}
            <span>
              {project.category}
              {project.year ? ` / ${project.year}` : ""}
            </span>
          </p>
          <h3 className="type-display-wide size-lg">
            <Link href={`/work/${project.slug}`}>{project.title}</Link>
          </h3>
          <Link
            href={`/work/${project.slug}`}
            className="type-mono mt-5 inline-flex h-11 items-center gap-3 border-b border-current"
          >
            View project <span aria-hidden="true">→</span>
          </Link>
        </div>

        <p
          aria-hidden="true"
          className="type-display hidden text-[clamp(3rem,7vw,6.5rem)] leading-none text-paper/90 md:block"
        >
          {project.number}
        </p>
      </div>
    </>
  );
}

interface PlateProps {
  project: Project;
  index: number;
  count: number;
  progress: MotionValue<number>;
}

/** CUT: each plate wipes up over the previous one while its image settles (PUSH). */
function Plate({ project, index, count, progress }: PlateProps) {
  const step = 1 / count;
  const start = Math.max(0, index * step - step * 0.45);
  const end = index * step + step * 0.05;

  const clipPath = useTransform(progress, [start, end], [HIDDEN, SHOWN]);
  const imageScale = useTransform(progress, [start, end + step * 0.6], [1.15, 1]);

  return (
    <motion.article
      className="absolute inset-0 overflow-hidden bg-coal"
      style={{ zIndex: index + 1, clipPath: index === 0 ? undefined : clipPath }}
    >
      <PlateBody
        project={project}
        count={count}
        priority={index === 0}
        imageScale={imageScale}
      />
    </motion.article>
  );
}

function ReelTrack() {
  const ref = useRef<HTMLElement>(null);
  const count = projects.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      aria-label="Selected work"
      className="relative"
      style={{ height: `${count * 100}svh` }}
    >
      <div className="stage-sticky">
        {projects.map((project, index) => (
          <Plate
            key={project.slug}
            project={project}
            index={index}
            count={count}
            progress={scrollYProgress}
          />
        ))}

        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-[40] h-[2px] origin-left bg-paper"
          style={{ scaleX: scrollYProgress }}
        />
      </div>
    </section>
  );
}

function ReelStatic() {
  const count = projects.length;
  return (
    <div>
      {projects.map((project) => (
        <article
          key={project.slug}
          aria-label={project.title}
          className="relative h-svh overflow-hidden bg-coal"
        >
          <PlateBody project={project} count={count} />
        </article>
      ))}
    </div>
  );
}

/**
 * WORK
 * Full-screen project media, one at a time, with controlled cuts between them.
 * Real Offscript projects replace the placeholders in src/lib/projects.ts.
 */
export default function WorkReel() {
  const reduceMotion = useReducedMotion();

  return (
    <div id="work" className="bg-coal">
      {reduceMotion ? <ReelStatic /> : <ReelTrack />}
    </div>
  );
}