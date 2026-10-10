import type { Metadata } from "next";
import ServiceExplorer from "@/components/services/ServiceExplorer";
import Note from "@/components/ui/Note";
import PageHeader from "@/components/ui/PageHeader";

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

      <ServiceExplorer />
    </>
  );
}