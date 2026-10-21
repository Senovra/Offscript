import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextProject from "@/components/work/NextProject";
import ProjectGallery from "@/components/work/ProjectGallery";
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
  return {
    title: project ? project.title : "Project",
    description: project?.stories[0]?.description,
  };
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

      {/* Details and written case notes */}
      <section className="page-gutter grid gap-12 py-16 md:grid-cols-12 md:gap-10 md:py-24">
        <dl className="grid grid-cols-2 content-start gap-x-6 gap-y-8 md:col-span-4">
          <div>
            <dt className="type-mono text-ash">Category</dt>
            <dd className="mt-2">{project.category}</dd>
          </div>
          <div>
            <dt className="type-mono text-ash">Year</dt>
            <dd className="mt-2">{project.year ?? "To be added"}</dd>
          </div>
          {project.isPlaceholder && (
            <div>
              <dt className="type-mono text-ash">Status</dt>
              <dd className="mt-2">Placeholder</dd>
            </div>
          )}
        </dl>

        <div className="space-y-14 md:col-span-8">
          {project.stories.map((story, storyIndex) => (
            <article
              key={story.heading}
              className={storyIndex > 0 ? "hairline-top pt-14" : undefined}
            >
              <h2 className="type-display-wide size-md">{story.heading}</h2>

              {story.details.length > 0 && (
                <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
                  {story.details.map((detail) => (
                    <div key={detail.label}>
                      <dt className="type-mono text-ash">{detail.label}</dt>
                      <dd className="mt-1 text-paper">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-relaxed text-fog md:text-lg">
                {story.description}
              </p>
            </article>
          ))}

          {project.stories.length === 0 && project.isPlaceholder && (
            <p className="type-body text-fog">
              This is a placeholder page. Project details, media and credits will
              appear here once real work is added.
            </p>
          )}
        </div>
      </section>

      <ProjectGallery images={project.gallery} />

      <NextProject project={next} />
    </>
  );
}