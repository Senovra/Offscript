import PageHeader from "@/components/ui/PageHeader";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

interface LegalPageProps {
  title: string;
  sections: LegalSection[];
  /** An optional opening line, shown under the title. */
  intro?: string;
}

const EMAIL = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/;

/** Turns any email address in the text into a working mailto link. */
function withLinks(text: string) {
  return text.split(EMAIL).map((part, index) =>
    index % 2 === 1 ? (
      <a
        key={index}
        href={`mailto:${part}`}
        className="break-all border-b border-current text-paper transition-colors hover:text-fog focus-visible:text-fog"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

/**
 * Shared layout for the Privacy Policy and the Terms & Conditions.
 * Each section pairs a numbered heading (left, fixed in place on large screens
 * while the section is read) with its text (right), set at a comfortable
 * reading width.
 */
export default function LegalPage({ title, sections, intro }: LegalPageProps) {
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
        intro={intro}
      />

      <div className="page-gutter pb-28 md:pb-36">
        {sections.map((section, index) => (
          <section
            key={section.heading}
            className="hairline-top grid gap-5 py-10 md:grid-cols-12 md:gap-10 md:py-14"
          >
            <div className="md:col-span-4">
              <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
                <p className="type-mono text-ash">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="type-editorial mt-2 text-[1.375rem] leading-[1.2] text-paper md:text-[1.625rem]">
                  {section.heading}
                </h2>
              </div>
            </div>

            <div className="space-y-5 text-[1.0625rem] leading-[1.8] text-fog md:col-span-8">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="max-w-[62ch]">
                  {withLinks(paragraph)}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}