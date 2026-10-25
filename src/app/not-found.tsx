import Link from "next/link";
import { navLinks } from "@/lib/projects";

/**
 * 404 page. Its own composition: an oversized outlined "404" fills the screen
 * behind the content, with the message, the way home and a few destinations
 * set in plain type over it. Inside the normal site header and footer.
 */
export default function NotFound() {
  const links = navLinks.filter((link) => link.href !== "/");

  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-ink px-[var(--gutter)] pb-[max(3.5rem,env(safe-area-inset-bottom,0px))] pt-[calc(var(--header-h)+2rem)] text-paper">
      {/* A soft pool of light behind the number */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 36%, rgba(242,241,237,0.07) 0%, transparent 70%)",
        }}
      />

      {/* The large background number */}
      <p
        aria-hidden="true"
        className="type-display pointer-events-none absolute inset-x-0 top-[36%] -translate-y-1/2 select-none text-center text-[clamp(11rem,52vw,64rem)] leading-none"
        style={{
          color: "rgba(242, 241, 237, 0.025)",
          WebkitTextStroke: "1.5px rgba(242, 241, 237, 0.2)",
        }}
      >
        404
      </p>

      <div className="relative z-10 grid gap-12 md:grid-cols-12 md:items-end md:gap-10">
        <div className="md:col-span-7">
          <p className="type-mono flex items-center gap-3 text-fog">
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
            Error 404
          </p>

          <h1 className="type-display-wide mt-5 text-[clamp(2.5rem,7vw,6rem)] leading-[0.98]">
            Page Not <span className="type-serif">Found</span>
          </h1>

          <p className="type-body mt-6 text-fog">
            This page doesn&apos;t exist. It may have moved, or the link may be
            wrong.
          </p>

          <Link
            href="/"
            className="group type-mono relative mt-8 inline-flex h-14 items-center justify-center gap-3 overflow-hidden border border-paper/30 bg-steel px-8 text-paper transition-colors duration-500 hover:text-ink active:text-ink focus-visible:text-ink"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-left scale-x-0 bg-bone transition-transform duration-500 [transition-timing-function:var(--ease-cut)] group-hover:scale-x-100 group-active:scale-x-100 group-focus-visible:scale-x-100"
            />
            <span
              aria-hidden="true"
              className="relative inline-block transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover:-translate-x-1.5"
            >
              ←
            </span>
            <span className="relative">Back to home</span>
          </Link>
        </div>

        <nav aria-label="Or try one of these" className="md:col-span-5">
          <p className="type-mono mb-3 text-ash">Or try one of these</p>
          <ul className="border-t border-[var(--line)]">
            {links.map((link, index) => (
              <li key={link.href} className="border-b border-[var(--line)]">
                <Link
                  href={link.href}
                  className="group flex items-center justify-between gap-6 py-3.5 text-fog transition-all duration-300 hover:pl-3 hover:text-paper focus-visible:pl-3 focus-visible:text-paper active:text-paper"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="type-mono text-ash">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="type-display-wide text-[1.125rem]">{link.label}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}