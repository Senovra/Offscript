import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import WorkCard from "@/components/work/WorkCard";
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
      />

      <ul className="group/list page-gutter space-y-16 pb-28 md:space-y-28">
        {projects.map((project, index) => (
          <WorkCard key={project.slug} project={project} index={index} />
        ))}
      </ul>
    </>
  );
}