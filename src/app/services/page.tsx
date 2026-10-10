import type { Metadata } from "next";
import Image from "next/image";
import Note from "@/components/ui/Note";
import PageHeader from "@/components/ui/PageHeader";
import { services } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Services",
  description: "What Offscript does.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            Our <span className="type-serif">Services</span>
          </>
        }
      >
        <Note className="mt-8">
          <p>
            Offscript team, the six names come from your brief. We haven&apos;t
            written descriptions because we&apos;d only be guessing at what you
            offer. Send us a line or two for each, and a real photo if you have
            one.
          </p>
        </Note>
      </PageHeader>

      <ol className="page-gutter pb-24">
        {services.map((service) => (
          <li
            key={service.id}
            className="hairline-top grid gap-8 py-10 md:grid-cols-12 md:gap-10 md:py-16"
          >
            <div className="md:col-span-5">
              <p className="type-mono text-ash">{service.number}</p>
              <h2 className="type-display-wide size-lg mt-3">{service.title}</h2>
              <p className="type-mono mt-5 text-ash">Description to come from Offscript</p>
            </div>

            <div className="md:col-span-7">
              <div className="relative aspect-[16/10] overflow-hidden bg-graphite">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="object-cover"
                />
                <span className="type-mono absolute left-4 top-4 border border-paper/50 bg-ink/40 px-2 py-1 text-paper">
                  Placeholder
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}