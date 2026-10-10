"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { legalLinks, navLinks } from "@/lib/projects";
import { EASE_CUT, EASE_PUSH, pad2 } from "@/lib/utils";

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen navigation. The panel wipes in with a hard clip-path and the
 * links rise out of masks one after another. Escape closes it, and page scroll
 * is locked while it is open. On desktop the links sit left and quiet utility
 * links sit right. On phones they stack.
 */
export default function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    const focusTimer = window.setTimeout(() => {
      firstLinkRef.current?.focus({ preventScroll: true });
    }, 450);

    return () => {
      root.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu"
          role="dialog"
          aria-label="Site menu"
          data-lenis-prevent
          className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-coal text-paper"
          initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
          animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
          exit={reduceMotion ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
          transition={{ duration: reduceMotion ? 0.2 : 0.75, ease: EASE_CUT }}
        >
          <div className="page-gutter grid min-h-full grid-cols-1 content-between gap-16 pb-[max(1.75rem,env(safe-area-inset-bottom,0px))] pt-[calc(var(--header-h)+3rem)] md:grid-cols-12 md:content-stretch md:gap-8">
            <nav aria-label="Primary" className="md:col-span-8 md:self-center">
              <ul className="group/nav">
                {navLinks.map((link, index) => {
                  const active = pathname === link.href;
                  return (
                    <li
                      key={link.href}
                      className="overflow-hidden transition-opacity duration-300 md:group-hover/nav:opacity-35 md:hover:opacity-100!"
                    >
                      <motion.div
                        initial={reduceMotion ? false : { y: "105%" }}
                        animate={{ y: "0%" }}
                        transition={{
                          duration: 0.9,
                          ease: EASE_PUSH,
                          delay: reduceMotion ? 0 : 0.25 + index * 0.07,
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={onClose}
                          ref={index === 0 ? firstLinkRef : undefined}
                          aria-current={active ? "page" : undefined}
                          className="flex items-baseline gap-5 py-[0.35rem] md:gap-8 md:py-2"
                        >
                          <span className="type-mono w-6 text-ash">
                            {pad2(index + 1)}
                          </span>
                          <span
                            className={`type-display-wide text-[clamp(2.25rem,5.4vw,4.75rem)] ${
                              active ? "text-paper" : "text-bone"
                            }`}
                          >
                            {link.label}
                          </span>
                        </Link>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="type-mono flex flex-col justify-end gap-10 text-fog md:col-span-4 md:items-end md:text-right">
              <Link
                href="/contact"
                onClick={onClose}
                className="inline-flex h-11 items-center gap-3 border-b border-current text-paper"
              >
                Start a project <span aria-hidden="true">→</span>
              </Link>

              <ul className="flex flex-wrap gap-x-6 gap-y-1 md:flex-col md:gap-y-0">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="inline-block py-2 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}