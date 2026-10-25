import Link from "next/link";
import AmbientBackdrop from "@/components/ui/AmbientBackdrop";
import { navLinks } from "@/lib/projects";

/**
 * 404 page. It uses the same backdrop, glass panel and type as the maintenance
 * page, inside the normal site header and footer. The footer carries the
 * developer credit.
 */
export default function NotFound() {
  const links = navLinks.filter((link) => link.href !== "/");

  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden px-[var(--gutter)] pb-16 pt-[calc(var(--header-h)+2rem)] text-paper">
      <AmbientBackdrop word="404" wordClassName="text-[clamp(9rem,38vw,40rem)]" />

      <div className="relative z-10 mx-auto w-full max-w-xl rounded-2xl border border-white/[0.10] bg-white/[0.03] px-6 py-10 text-center shadow-[0_18px_70px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-xl sm:px-10 sm:py-14">
        <div className="type-mono mx-auto inline-flex items-center gap-2.5 rounded-full border border-[#C7A46A]/25 bg-[#C7A46A]/[0.06] py-1 pl-2.5 pr-3.5 text-[0.58rem] tracking-[0.12em] text-fog sm:text-[0.65rem]">
          <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C7A46A]" />
          ERROR 404
        </div>

        <h1 className="type-display-wide mt-6 text-balance text-[clamp(1.75rem,5vw,3rem)] leading-[1.08]">
          Page Not Found
        </h1>

        <p className="type-body mx-auto mt-5 max-w-md text-sm leading-7 text-fog sm:text-base">
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

        <nav aria-label="Or try one of these" className="mt-10 text-left">
          <p className="type-mono mb-3 text-center text-ash">Or try one of these</p>
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