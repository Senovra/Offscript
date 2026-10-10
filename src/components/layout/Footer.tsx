"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { legalLinks, navLinks } from "@/lib/projects";

/**
 * PLACEHOLDER LINKS: replace with Offscript's real accounts.
 *   Instagram : https://instagram.com/their-handle
 *   WhatsApp  : https://wa.me/ followed by the number, digits only, with the
 *               country code (for example https://wa.me/15551234567)
 */
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "WhatsApp", href: "https://wa.me/" },
];

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M9 8.5c0 3.5 2.5 6 6 6.5l1.5-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2L9 8.5z" />
    </svg>
  );
}

/**
 * A footer link: an arrow slides in, the label nudges, and an underline draws.
 * Hover effects only apply on devices that can hover; touch shows the pressed state.
 */
function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group/link relative inline-flex items-center py-1.5 text-fog transition-colors duration-300 hover:text-paper active:text-paper"
    >
      <span
        aria-hidden="true"
        className="inline-block w-0 -translate-x-2 overflow-hidden opacity-0 transition-all duration-300 group-hover/link:mr-2 group-hover/link:w-3 group-hover/link:translate-x-0 group-hover/link:opacity-100"
      >
        →
      </span>
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover/link:scale-x-100"
        />
      </span>
    </Link>
  );
}

/** A square icon button that fills on hover (and on press, for touch). */
function SocialLink({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group/social relative flex h-11 w-11 items-center justify-center overflow-hidden border border-paper/25 text-fog transition-colors duration-500 hover:text-ink active:text-ink"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-500 [transition-timing-function:var(--ease-cut)] group-hover/social:scale-y-100 group-active/social:scale-y-100"
      />
      <span className="relative transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover/social:-translate-y-0.5">
        {children}
      </span>
    </a>
  );
}

/**
 * Restrained: wordmark and tagline, navigation, legal links, socials and
 * contact, back-to-top. Third-party credits live on the dedicated /credits page.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="hairline-top bg-ink pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-16 md:pt-24">
      <div className="page-gutter">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="type-display-wide size-lg">Offscript</p>
            {/* Space for the brand tagline */}
            <p className="mt-4 max-w-[32ch] text-fog">Brand tagline comes here</p>
          </div>

          <nav aria-label="Footer" className="type-mono md:col-span-3">
            <p className="mb-4 text-ash">Navigate</p>
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="type-mono md:col-span-3">
            <nav aria-label="Legal">
              <p className="mb-4 text-ash">Legal</p>
              <ul>
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-10">
              <p className="mb-4 text-ash">Socials &amp; Contact</p>

              <div className="flex gap-2">
                {SOCIALS.map((social) => (
                  <SocialLink key={social.label} label={social.label} href={social.href}>
                    {social.label === "Instagram" ? <InstagramIcon /> : <WhatsAppIcon />}
                  </SocialLink>
                ))}
              </div>

              <ul className="mt-5 space-y-1 text-fog">
                <li>Email: [to be added]</li>
                <li>Phone: [to be added]</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="type-mono hairline-top mt-16 flex flex-col gap-2 pt-4 text-ash md:flex-row md:items-center md:justify-between">
          <p>© {year} Offscript. All rights reserved.</p>
          <button
            type="button"
            onClick={toTop}
            className="group/top inline-flex h-11 items-center gap-3 text-fog transition-colors hover:text-paper active:text-paper"
          >
            Back to top
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover/top:-translate-y-1"
            >
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}