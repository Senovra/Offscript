import type { Metadata } from "next";
import type { ReactNode } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { heroFrames, modelCredit } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Credits",
  description: "Third-party assets used on the Offscript website.",
};

const linkClass = "border-b border-current pb-0.5 transition-colors hover:text-fog";

/** The opening of the home page still uses temporary stock photography. */
const usesStockPhotography = heroFrames.some((frame) =>
  frame.src.includes("images.unsplash.com")
);

export default function CreditsPage() {
  const rows: Array<{ label: string; value: ReactNode }> = [
    { label: "Model", value: modelCredit.title },
    { label: "Creator", value: modelCredit.author },
    { label: "Source", value: modelCredit.platform },
    { label: "Licence", value: modelCredit.licence },
    {
      label: "Changes",
      value:
        "Converted to a lightweight GLB with 1K textures. Displayed with custom lighting and surface adjustments, including hiding the original manufacturer branding and adding the Offscript name.",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Credits"
        intro="Third-party assets used on this website, and the licences they are shared under."
      />

      <div className="page-gutter pb-28">
        <h2 className="type-mono mb-6 text-paper">3D model</h2>

        <dl className="hairline-top">
          {rows.map((row) => (
            <div
              key={row.label}
              className="hairline-bottom grid gap-1 py-5 md:grid-cols-12 md:gap-8"
            >
              <dt className="type-mono text-ash md:col-span-3">{row.label}</dt>
              <dd className="md:col-span-9">{row.value}</dd>
            </div>
          ))}

          <div className="hairline-bottom grid gap-1 py-5 md:grid-cols-12 md:gap-8">
            <dt className="type-mono text-ash md:col-span-3">Links</dt>
            <dd className="flex flex-col gap-2 md:col-span-9 md:flex-row md:gap-8">
              <a
                href={modelCredit.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Original model on Sketchfab ↗
              </a>
              <a
                href={modelCredit.licenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Licence: CC BY 4.0 ↗
              </a>
            </dd>
          </div>
        </dl>

        <p className="type-body mt-8 max-w-[64ch] text-fog">
          &ldquo;{modelCredit.title}&rdquo; (
          <a
            href={modelCredit.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {modelCredit.sourceUrl}
          </a>
          ) by {modelCredit.author} is licensed under {modelCredit.licence} (
          <a
            href={modelCredit.licenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {modelCredit.licenceUrl}
          </a>
          ).
        </p>

        <p className="type-body mt-6 max-w-[64ch] text-ash">
          Sony is a trademark of its owner. Offscript is not affiliated with or
          endorsed by Sony.
        </p>

        {usesStockPhotography && (
          <>
            <h2 className="type-mono mb-6 mt-20 text-paper">Temporary photography</h2>
            <p className="type-body max-w-[64ch] text-fog">
              The photographs inside the OFFSCRIPT letters on the home page are
              temporary stock material from Unsplash, used until Offscript
              supplies its own. They do not represent Offscript work and will be
              replaced.
            </p>
          </>
        )}
      </div>
    </>
  );
}