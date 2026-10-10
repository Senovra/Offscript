import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected work by Offscript.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title={
          <>
            Selected <span className="type-serif">Work</span>
          </>
        }
      >
        <p className="type-mono mt-8 max-w-[52ch] text-ash">
          Placeholder media. Stock photography used to design this layout, not
          Offscript projects.
        </p>
      </PageHeader>

      <ul className="page-gutter space-y-16 pb-28 md:space-y-28">
        {projects.map((project, index) => (
          <li key={project.slug} className={index % 2 ? "md:pl-[16%]" : "md:pr-[16%]"}>
            <Link href={`/work/${project.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-graphite md:aspect-[16/9]">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(min-width: 768px) 84vw, 100vw"
                  priority={index < 2}
                  className="object-cover transition-transform duration-[1400ms] [transition-timing-function:var(--ease-push)] group-hover:scale-[1.04]"
                  style={{ objectPosition: project.focal }}
                />
                {project.isPlaceholder && (
                  <span className="type-mono absolute left-4 top-4 border border-paper/50 bg-ink/40 px-2 py-1 text-paper">
                    Placeholder
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-end justify-between gap-6">
                <div>
                  <p className="type-mono text-ash">
                    {project.number}
                    <span className="mx-2">—</span>
                    {project.category}
                    {project.year ? ` / ${project.year}` : ""}
                  </p>
                  <h2 className="type-display-wide size-lg mt-2">{project.title}</h2>
                </div>
                <span
                  aria-hidden="true"
                  className="type-mono hidden border-b border-current pb-1 md:inline-block"
                >
                  View project →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}