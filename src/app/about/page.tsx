import type { Metadata } from "next";
import Image from "next/image";
import DisciplineClock from "@/components/about/DisciplineClock";
import Note from "@/components/ui/Note";
import PageHeader from "@/components/ui/PageHeader";
import { aboutImages } from "@/lib/projects";

export const metadata: Metadata = {
  title: "About",
  description: "About Offscript.",
};

const prompts = [
  { label: "Who we are", body: "[Offscript to write]" },
  { label: "How we work", body: "[Offscript to write]" },
  { label: "Who we work with", body: "[Offscript to write]" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            About <span className="type-serif">Offscript</span>
          </>
        }
      >
        <Note className="mt-8">
          <p>
            Offscript team, we don&apos;t know your story yet, so we haven&apos;t
            made one up. Send us a few lines on who you are, how you work and
            who you work with and we&apos;ll set it here.
          </p>
          <p>
            The dial below uses the six service names from your brief. Scroll to
            turn it. If any of them change, tell us.
          </p>
        </Note>
      </PageHeader>

      <DisciplineClock />

      <section className="bg-graphite py-24 md:py-36">
        <div className="page-gutter grid gap-14 md:grid-cols-12 md:gap-10">
          <ol className="md:col-span-6">
            {prompts.map((item, index) => (
              <li
                key={item.label}
                className="hairline-top py-6 last:border-b last:border-[var(--line)] md:py-8"
              >
                <p className="type-mono text-ash">
                  {String(index + 1).padStart(2, "0")}
                  <span className="mx-2">—</span>
                  {item.label}
                </p>
                <p className="mt-3 text-fog">{item.body}</p>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-2 gap-4 md:col-span-6">
            {aboutImages.map((image) => (
              <div key={image.src} className="relative aspect-[3/4] overflow-hidden bg-slate">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 24vw, 46vw"
                  className="object-cover"
                />
                <span className="type-mono absolute left-3 top-3 border border-paper/50 bg-ink/40 px-2 py-1 text-paper">
                  Placeholder
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}