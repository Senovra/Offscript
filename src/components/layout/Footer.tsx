"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { legalLinks, navLinks } from "@/lib/projects";

/**
 * PLACEHOLDER LINKS: replace with Offscript's real details.
 *   FACEBOOK_URL : TEMPORARILY the Facebook homepage. Replace with the full
 *                  address of Offscript's own page.
 *   WHATSAPP_URL : https://wa.me/ followed by the number, digits only, with the
 *                  country code (for example https://wa.me/15551234567)
 */
const FACEBOOK_URL = "https://www.facebook.com/";
const WHATSAPP_URL = "https://wa.me/";

/** Confirmed Instagram accounts, main account first. */
const INSTAGRAM_ACCOUNTS = [
  { handle: "offscript_co", detail: "Bangladesh · Main", spoken: "Bangladesh, main account" },
  { handle: "offscript_co_lk", detail: "Sri Lanka · Branch", spoken: "Sri Lanka, branch" },
  {
    handle: "offscript_co_automotive",
    detail: "Automotive · Sub-branch",
    spoken: "Automotive, sub-branch",
  },
];

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  width: 18,
  height: 18,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function InstagramIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M9 8.5c0 3.5 2.5 6 6 6.5l1.5-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2L9 8.5z" />
    </svg>
  );
}

/** Shared square icon button: fills on hover, press and while open. */
const BOX_CLASS =
  "group/social relative flex h-11 w-11 items-center justify-center overflow-hidden border border-paper/25 text-fog transition-colors duration-500 hover:text-ink active:text-ink focus-visible:text-ink";

const FILL_CLASS =
  "absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-500 [transition-timing-function:var(--ease-cut)] group-hover/social:scale-y-100 group-active/social:scale-y-100 group-focus-visible/social:scale-y-100";

const GLYPH_CLASS =
  "relative transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover/social:-translate-y-0.5";

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

/** A plain external icon link (Facebook and WhatsApp). */
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
      className={BOX_CLASS}
    >
      <span aria-hidden="true" className={FILL_CLASS} />
      <span className={GLYPH_CLASS}>{children}</span>
    </a>
  );
}

/**
 * Instagram: one icon that reveals the three accounts.
 *   Mouse  : hover opens it, moving away closes it. A click pins it open.
 *   Touch  : tap to open, tap again to close.
 *   Keyboard: Enter or Space opens it, Tab moves through the accounts,
 *             Escape closes it and returns focus to the icon.
 * It also closes when you click outside or choose an account.
 */
function InstagramMenu() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const openedByHover = useRef(false);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        if (!open) {
          openedByHover.current = true;
          setOpen(true);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        if (openedByHover.current) {
          openedByHover.current = false;
          setOpen(false);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          openedByHover.current = false;
          setOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label="Instagram accounts"
        aria-expanded={open}
        aria-controls="instagram-accounts"
        onClick={() => {
          if (open && !openedByHover.current) {
            setOpen(false);
          } else {
            // A click while hover-opened pins it open
            openedByHover.current = false;
            setOpen(true);
          }
        }}
        className={`${BOX_CLASS} ${open ? "text-ink" : ""}`}
      >
        <span
          aria-hidden="true"
          className={`${FILL_CLASS} ${open ? "scale-y-100" : ""}`}
        />
        <span className={GLYPH_CLASS}>
          <InstagramIcon />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <div className="absolute bottom-full left-0 z-30 pb-3 md:left-auto md:right-0">
            <motion.div
              id="instagram-accounts"
              role="group"
              aria-label="Instagram accounts"
              className="w-[min(17.5rem,calc(100vw-2.5rem))] border border-[var(--line)] bg-ink p-2"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul>
                {INSTAGRAM_ACCOUNTS.map((account) => (
                  <li key={account.handle}>
                    <a
                      href={`https://www.instagram.com/${account.handle}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`@${account.handle}, ${account.spoken}. Opens Instagram in a new tab.`}
                      onClick={() => {
                        openedByHover.current = false;
                        setOpen(false);
                      }}
                      className="group/account flex items-center justify-between gap-4 px-3 py-3 text-fog transition-colors duration-300 hover:bg-graphite hover:text-paper focus-visible:bg-graphite focus-visible:text-paper active:bg-graphite active:text-paper"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[0.9375rem] text-paper">
                          @{account.handle}
                        </span>
                        <span className="type-mono mt-0.5 block text-ash transition-colors duration-300 group-hover/account:text-fog">
                          {account.detail}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="shrink-0 transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover/account:-translate-y-0.5 group-hover/account:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
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
                <InstagramMenu />

                <SocialLink label="Facebook" href={FACEBOOK_URL}>
                  <FacebookIcon />
                </SocialLink>

                <SocialLink label="WhatsApp" href={WHATSAPP_URL}>
                  <WhatsAppIcon />
                </SocialLink>
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