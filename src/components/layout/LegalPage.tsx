import Note from "@/components/ui/Note";
import PageHeader from "@/components/ui/PageHeader";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  /** A question or request for the Offscript team, shown under the section. */
  ask?: string;
}

interface LegalPageProps {
  title: string;
  sections: LegalSection[];
}

/** Shared layout for Privacy Policy and Terms & Conditions. */
export default function LegalPage({ title, sections }: LegalPageProps) {
  // Same title style as every other page: the last word in italics
  const words = title.split(" ");
  const lastWord = words.pop();

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={
          <>
            {words.join(" ")} <span className="type-serif">{lastWord}</span>
          </>
        }
      />

      <div className="page-gutter pb-28">
        <Note>
          <p>
            Offscript team, this is a working draft of your {title.toLowerCase()}.
            We&apos;ve laid out the sections most sites need and kept the wording
            plain. Anything in [square brackets] is something only you can tell us.
          </p>
          <p>
            We&apos;re a web team, not lawyers, so please have a solicitor read this
            before the site goes live. Delete these notes once it&apos;s settled.
          </p>
        </Note>

        <div className="mt-12 md:mt-20">
          {sections.map((section, index) => (
            <section
              key={section.heading}
              className="hairline-top grid gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10"
            >
              <h2 className="type-mono text-paper md:col-span-4">
                {String(index + 1).padStart(2, "0")}
                <span className="mx-2 text-ash">—</span>
                {section.heading}
              </h2>
              <div className="space-y-4 text-fog md:col-span-8">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="max-w-[64ch]">
                    {paragraph}
                  </p>
                ))}
                {section.ask && (
                  <p className="max-w-[64ch] border-l border-ash/60 pl-4 text-[0.9375rem] text-ash">
                    <span className="type-mono mr-2 text-fog">For Offscript</span>
                    {section.ask}
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}