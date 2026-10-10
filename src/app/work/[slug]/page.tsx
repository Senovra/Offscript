import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";

type Params = { slug: string };

/**
 * Static export: every project page is generated at build time from
 * src/lib/projects.ts. Anything not listed there does not exist.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? project.title : "Project" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      {/* Media takeover */}
      <section className="relative h-[80svh] min-h-[28rem] overflow-hidden bg-graphite md:h-svh">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: project.focal }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.15) 45%, rgba(10,10,11,0.3) 100%)",
          }}
        />
        <div className="absolute inset-x-[var(--gutter)] bottom-[max(2.5rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))] text-paper">
          <p className="type-mono">
            {project.number}
            <span className="mx-2 text-paper/50">—</span>
            {project.category}
          </p>
          <h1 className="type-display-wide size-xl mt-3">{project.title}</h1>
        </div>
      </section>

      {/* Details */}
      <section className="page-gutter grid gap-10 py-16 md:grid-cols-12 md:py-24">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:col-span-5">
          <div>
            <dt className="type-mono text-ash">Category</dt>
            <dd className="mt-2">{project.category}</dd>
          </div>
          <div>
            <dt className="type-mono text-ash">Year</dt>
            <dd className="mt-2">{project.year ?? "To be added"}</dd>
          </div>
          <div>
            <dt className="type-mono text-ash">Status</dt>
            <dd className="mt-2">{project.isPlaceholder ? "Placeholder" : "Published"}</dd>
          </div>
        </dl>

        {project.isPlaceholder && (
          <p className="type-body text-fog md:col-span-7">
            This is a placeholder page. Project details, media and credits will
            appear here once real work is added.
          </p>
        )}
      </section>

      {/* Next project */}
      <Link
        href={`/work/${next.slug}`}
        aria-label={`Next project: ${next.title}`}
        className="group relative block h-[70svh] overflow-hidden bg-graphite"
      >
        <Image
          src={next.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-[1600ms] [transition-timing-function:var(--ease-push)] group-hover:scale-[1.05]"
          style={{ objectPosition: next.focal }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-x-[var(--gutter)] bottom-[max(2.5rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))] text-paper">
          <p className="type-mono">Next project</p>
          <p className="type-display-wide size-xl mt-3">
            {next.title} <span aria-hidden="true">→</span>
          </p>
        </div>
      </Link>
    </>
  );
}