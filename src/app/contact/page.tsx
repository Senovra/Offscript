import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import Note from "@/components/ui/Note";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Offscript.",
};

const details = [
  { label: "Email", value: "[to be added]" },
  { label: "Phone", value: "[to be added]" },
  { label: "Location", value: "[to be added]" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Start A <span className="type-serif">Project</span>
          </>
        }
        intro="Tell us what you have in mind."
      />

      <section className="page-gutter pb-28">
        <div className="hairline-top grid gap-12 pt-12 md:grid-cols-12 md:gap-10 md:pt-16">
          <div className="space-y-10 md:col-span-4">
            <dl>
              {details.map((item) => (
                <div
                  key={item.label}
                  className="hairline-bottom group py-4 transition-all duration-300 first:border-t first:border-[var(--line)] hover:pl-3"
                >
                  <dt className="type-mono text-ash transition-colors duration-300 group-hover:text-fog">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-fog transition-colors duration-300 group-hover:text-paper">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            <Note>
              <p>
                Your email, phone and location will be placed here. The tags in
                the form are a first guess at what people might ask for, so
                change them to match what you actually offer.
              </p>
            </Note>
          </div>

          <div className="md:col-span-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}