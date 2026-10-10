import Link from "next/link";
import { navLinks } from "@/lib/projects";

/**
 * 404 page. All caps, same type as the rest of the site, with an outlined
 * number behind the content and a numbered list of places to go next.
 */
export default function NotFound() {
  const links = navLinks.filter((link) => link.href !== "/");

  return (
    <section className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-ink px-[var(--gutter)] pb-[max(2rem,env(safe-area-inset-bottom,0px))] pt-[calc(var(--header-h)+2rem)]">
      {/* Outlined 404 behind the content */}
      <p
        aria-hidden="true"
        className="type-display pointer-events-none absolute -right-[2%] top-1/2 -translate-y-1/2 select-none text-[clamp(10rem,38vw,42rem)] leading-none"
        style={{
          color: "transparent",
          WebkitTextStroke: "1px rgba(242, 241, 237, 0.09)",
        }}
      >
        404
      </p>

      <p className="type-mono relative text-ash">Error 404</p>

      <div className="relative">
        <h1 className="type-display-wide text-[clamp(2.5rem,7vw,6.5rem)]">
          Page Not Found
        </h1>
        <p className="type-body mt-6 text-fog">
          This page doesn&apos;t exist. It may have moved, or the link may be
          wrong.
        </p>

        <Link
          href="/"
          className="group type-mono relative mt-8 inline-flex h-14 items-center justify-center gap-3 overflow-hidden border border-paper/30 bg-steel px-8 text-paper transition-colors duration-500 hover:text-ink active:text-ink"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-left scale-x-0 bg-bone transition-transform duration-500 [transition-timing-function:var(--ease-cut)] group-hover:scale-x-100 group-active:scale-x-100"
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

      <nav aria-label="Try these pages" className="relative mt-16 md:max-w-[34rem]">
        <p className="type-mono mb-4 text-ash">Or try one of these</p>
        <ul className="border-t border-[var(--line)]">
          {links.map((link, index) => (
            <li key={link.href} className="border-b border-[var(--line)]">
              <Link
                href={link.href}
                className="group flex items-center justify-between gap-6 py-3.5 text-fog transition-all duration-300 hover:pl-3 hover:text-paper active:text-paper"
              >
                <span className="flex items-baseline gap-5">
                  <span className="type-mono text-ash">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="type-display-wide text-[1.125rem] md:text-[1.375rem]">
                    {link.label}
                  </span>
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
    </section>
  );
}