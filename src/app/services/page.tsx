import type { Metadata } from "next";
import ServiceExplorer from "@/components/services/ServiceExplorer";
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
      />

      <ServiceExplorer />
    </>
  );
}