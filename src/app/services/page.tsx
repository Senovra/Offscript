import type { Metadata } from "next";
import ServiceExplorer from "@/components/services/ServiceExplorer";
import PageHeader from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Offscript Services | Strategy, Branding, Content & Marketing",
  absoluteTitle: true,
  description:
    "Strategy, graphic design, content creation, performance marketing, brand identity and immersive experiences from Offscript in Bangladesh and Sri Lanka.",
  path: "/services/",
});

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