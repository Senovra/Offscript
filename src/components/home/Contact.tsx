import Link from "next/link";

/**
 * CONTACT
 * The one project-start moment on the site. A full-width light band that
 * wipes to dark on hover (and on press, for touch).
 */
export default function Contact() {
  return (
    <section aria-label="Contact" className="bg-paper text-ink">
      <Link
        href="/contact"
        aria-label="Start a project: go to the contact page"
        className="group relative block overflow-hidden"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-700 [transition-timing-function:var(--ease-cut)] group-hover:scale-y-100 group-active:scale-y-100"
        />

        <span className="page-gutter relative flex min-h-[64svh] flex-col justify-between py-10 transition-colors duration-500 group-hover:text-paper group-active:text-paper md:min-h-[72svh] md:py-14">
          <span className="type-mono flex items-center gap-3 opacity-60">
            <span>04</span>
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
            <span>Contact</span>
          </span>

          <span className="flex items-end justify-between gap-6">
            <span className="type-display-wide text-[clamp(2.5rem,7.4vw,7rem)]">
              Start a
              <br />
              project
            </span>

            <span
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center border border-current text-xl transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover:-rotate-45 group-active:-rotate-45 md:h-24 md:w-24 md:text-4xl"
            >
              →
            </span>
          </span>
        </span>
      </Link>
    </section>
  );
}