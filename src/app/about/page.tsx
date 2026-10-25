import type { Metadata } from "next";
import DisciplineClock from "@/components/about/DisciplineClock";
import FitImage from "@/components/ui/FitImage";
import PageHeader from "@/components/ui/PageHeader";
import { aboutCopy, aboutImages } from "@/lib/projects";

export const metadata: Metadata = {
  title: "About",
  description: "About Offscript.",
};

/** A section heading in the site's title style: the last word in italics. */
function Heading({ text }: { text: string }) {
  const words = text.split(" ");
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <span className="type-serif">{last}</span>
    </>
  );
}

/**
 * The client's paragraphs, unchanged. A paragraph that is a question is set as
 * a short lead-in line, so the text that follows reads as its answer.
 */
function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((paragraph) =>
        paragraph.endsWith("?") ? (
          <p
            key={paragraph}
            className="type-editorial max-w-[30ch] pt-6 text-[clamp(1.375rem,2.4vw,2rem)] leading-[1.15] text-paper"
          >
            {paragraph}
          </p>
        ) : (
          <p key={paragraph} className="max-w-[60ch]">
            {paragraph}
          </p>
        )
      )}
    </>
  );
}

interface BlockProps {
  index: string;
  title: string;
  children: React.ReactNode;
}

/** One question and its answer: the question on the left, the answer on the right. */
function Block({ index, title, children }: BlockProps) {
  return (
    <section className="hairline-top grid gap-6 py-12 md:grid-cols-12 md:gap-10 md:py-20">
      <div className="md:col-span-5">
        <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
          <p className="type-mono text-ash">{index}</p>
          <h2 className="type-display-wide size-lg mt-3">
            <Heading text={title} />
          </h2>
        </div>
      </div>

      <div className="space-y-6 text-[1.0625rem] leading-[1.75] text-fog md:col-span-7 md:space-y-7 md:text-[1.1875rem]">
        {children}
      </div>
    </section>
  );
}

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
      />

      <DisciplineClock />

      <div className="bg-graphite py-12 md:py-20">
        <div className="page-gutter">
          <Block index="01" title="Who We Are?">
            <Paragraphs items={aboutCopy.who} />
          </Block>

          {/* Behind the scenes: each photo keeps its own shape */}
          <div className="grid grid-cols-1 items-start gap-4 pb-12 sm:grid-cols-2 md:gap-6 md:pb-20">
            {aboutImages.map((image) => (
              <div key={image.src} className="overflow-hidden bg-slate">
                <FitImage
                  natural
                  src={image.src}
                  alt={image.alt}
                  sizes="(min-width: 640px) 46vw, 100vw"
                />
              </div>
            ))}
          </div>

          <Block index="02" title="How We Work?">
            <Paragraphs items={aboutCopy.how} />
          </Block>

          <Block index="03" title="Who We Work With?">
            <p className="type-editorial size-lg max-w-[20ch] text-paper">
              {aboutCopy.withLead}
            </p>
            <p className="max-w-[60ch]">{aboutCopy.withText}</p>
          </Block>
        </div>
      </div>
    </>
  );
}