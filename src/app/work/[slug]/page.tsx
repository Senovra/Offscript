import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextProject from "@/components/work/NextProject";
import ProjectGallery from "@/components/work/ProjectGallery";
import ProjectHero from "@/components/work/ProjectHero";
import { getProject, projects, type ProjectStory } from "@/lib/projects";
import { PROJECT_DESCRIPTIONS, pageMetadata } from "@/lib/seo";

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
  if (!project) return { title: "Project" };

  const description = PROJECT_DESCRIPTIONS[project.slug];
  if (!description) {
    // Modeling keeps its existing metadata until its content is final
    return { title: project.title, description: project.stories[0]?.description };
  }

  return pageMetadata({
    title: project.title,
    description,
    path: `/work/${project.slug}/`,
  });
}

/** A story is shown once it has something to show: details, a description or photographs. */
function hasContent(story: ProjectStory): boolean {
  return (
    story.details.length > 0 ||
    Boolean(story.description) ||
    (story.gallery?.length ?? 0) > 0
  );
}

const DESCRIPTION_CLASS =
  "max-w-[62ch] text-[1.0625rem] leading-relaxed text-fog md:text-lg";

function Details({ story }: { story: ProjectStory }) {
  if (story.details.length === 0) return null;
  return (
    <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
      {story.details.map((detail) => (
        <div key={detail.label}>
          <dt className="type-mono text-ash">{detail.label}</dt>
          <dd className="mt-1 text-paper">{detail.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * One model's section on a project with several (the Modeling page): a numbered
 * heading, its details and description, then its own photographs. Sections
 * alternate between two surfaces and are divided by a hairline, so it is clear
 * where one ends and the next begins.
 */
function ModelSection({
  story,
  number,
  alternate,
}: {
  story: ProjectStory;
  number: string;
  alternate: boolean;
}) {
  const headingId = `model-${story.id ?? number}`;

  return (
    <section
      aria-labelledby={headingId}
      className={`hairline-top ${alternate ? "bg-graphite" : "bg-ink"}`}
    >
      <div className="page-gutter py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <p className="type-mono text-ash">{number}</p>
            <h2 id={headingId} className="type-display-wide size-lg mt-3">
              {story.heading}
            </h2>
            <Details story={story} />
          </div>

          {story.description && (
            <div className="md:col-span-7">
              <p className={DESCRIPTION_CLASS}>{story.description}</p>
            </div>
          )}
        </div>

        {story.gallery && story.gallery.length > 0 && (
          <div className="mt-12 md:mt-16">
            <ProjectGallery
              images={story.gallery}
              label=""
              ariaLabel={`${story.heading} gallery`}
              className=""
            />
          </div>
        )}
      </div>
    </section>
  );
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

  const stories = project.stories.filter(hasContent);
  // A project whose stories carry their own photographs (Modeling) is laid out model by model
  const modelByModel = stories.some((story) => story.gallery !== undefined);

  return (
    <>
      <ProjectHero project={project} />

      {modelByModel ? (
        <>
          <section className="page-gutter pb-16 pt-16 md:pb-20 md:pt-24">
            <dl className="grid max-w-md grid-cols-2 gap-x-6 gap-y-8">
              <div>
                <dt className="type-mono text-ash">Category</dt>
                <dd className="mt-2">{project.category}</dd>
              </div>
              <div>
                <dt className="type-mono text-ash">Year</dt>
                <dd className="mt-2">{project.year ?? "To be added"}</dd>
              </div>
            </dl>
          </section>

          {stories.map((story, storyIndex) => (
            <ModelSection
              key={story.id ?? story.heading}
              story={story}
              number={String(storyIndex + 1).padStart(2, "0")}
              alternate={storyIndex % 2 === 1}
            />
          ))}
        </>
      ) : (
        /* Details and written case notes */
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
            {stories.map((story, storyIndex) => (
              <article
                key={story.id ?? story.heading}
                className={storyIndex > 0 ? "hairline-top pt-14" : undefined}
              >
                <h2 className="type-display-wide size-md">{story.heading}</h2>
                <Details story={story} />
                {story.description && (
                  <p className={`mt-6 ${DESCRIPTION_CLASS}`}>{story.description}</p>
                )}
              </article>
            ))}

            {stories.length === 0 && project.isPlaceholder && (
              <p className="type-body text-fog">
                This is a placeholder page. Project details, media and credits will
                appear here once real work is added.
              </p>
            )}
          </div>
        </section>
      )}

      <ProjectGallery images={project.gallery} />

      <NextProject project={next} />
    </>
  );
}