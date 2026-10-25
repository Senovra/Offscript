import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import WhatsAppChooser from "@/components/contact/WhatsAppChooser";
import PageHeader from "@/components/ui/PageHeader";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Offscript.",
};

const rowClass =
  "hairline-bottom group py-4 transition-all duration-300 first:border-t first:border-[var(--line)] hover:pl-3";
const labelClass =
  "type-mono text-ash transition-colors duration-300 group-hover:text-fog";
const valueClass =
  "mt-1 text-fog transition-colors duration-300 group-hover:text-paper";
const linkClass = "inline-block py-0.5 break-all hover:text-paper focus-visible:text-paper";

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
              <div className={rowClass}>
                <dt className={labelClass}>Email</dt>
                <dd className={valueClass}>
                  <a href={`mailto:${CONTACT.email}`} className={linkClass}>
                    {CONTACT.email}
                  </a>
                </dd>
              </div>

              <div className={rowClass}>
                <dt className={labelClass}>Phone</dt>
                <dd className={valueClass}>
                  {CONTACT.phones.map((phone) => (
                    <span key={phone.tel} className="block">
                      <a href={`tel:${phone.tel}`} className={linkClass}>
                        {phone.display}
                      </a>
                      <span className="type-mono ml-2 text-ash">{phone.label}</span>
                    </span>
                  ))}
                </dd>
              </div>

              <div className={rowClass}>
                <dt className={labelClass}>Location</dt>
                <dd className={valueClass}>{CONTACT.location}</dd>
              </div>
            </dl>

            <WhatsAppChooser />
          </div>

          <div className="md:col-span-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}