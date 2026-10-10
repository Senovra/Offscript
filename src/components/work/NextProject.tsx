"use client";

import Image from "next/image";
import ProjectLink from "./ProjectLink";
import type { Project } from "@/lib/projects";

/**
 * The band at the bottom of a project page that leads to the next project.
 * The photo zooms and brightens on hover, the arrow slides, a line draws along
 * the bottom edge, and clicking opens the next project from this band.
 */
export default function NextProject({ project }: { project: Project }) {
  return (
    <ProjectLink
      href={`/work/${project.slug}`}
      image={project.image}
      focal={project.focal}
      fromLink
      ariaLabel={`Next project: ${project.title}`}
      className="group relative block h-[70svh] overflow-hidden bg-graphite"
    >
      <Image
        src={project.image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover transition-transform duration-[1600ms] [transition-timing-function:var(--ease-push)] group-hover:scale-[1.06]"
        style={{ objectPosition: project.focal }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-ink/55 transition-colors duration-700 group-hover:bg-ink/30 group-active:bg-ink/30"
      />

      <div className="absolute inset-x-[var(--gutter)] bottom-[max(2.5rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))] text-paper">
        <p className="type-mono">
          Next project
          <span className="mx-2 text-paper/50">—</span>
          {project.number}
        </p>
        <p className="type-display-wide size-xl mt-3 flex items-center gap-4">
          <span className="transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover:translate-x-2">
            {project.title}
          </span>
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover:translate-x-3"
          >
            →
          </span>
        </p>
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-paper transition-transform duration-700 [transition-timing-function:var(--ease-cut)] group-hover:scale-x-100 group-active:scale-x-100"
      />
    </ProjectLink>
  );
}