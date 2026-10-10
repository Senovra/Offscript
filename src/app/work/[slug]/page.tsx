import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextProject from "@/components/work/NextProject";
import ProjectHero from "@/components/work/ProjectHero";
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
      <ProjectHero project={project} />

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

      <NextProject project={next} />
    </>
  );
}