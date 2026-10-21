"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import MenuOverlay from "./MenuOverlay";

/**
 * Fixed header. mix-blend-difference keeps it legible over dark surfaces,
 * the light contact section and full-colour photography. The logo is the
 * WHITE version (src/lib/assets.ts); the blend inverts it over light areas.
 *
 * The menu button: the word rolls between "Menu" and "Close", and the two
 * lines (the bottom one shorter) even out on hover and turn into a centred X
 * when the menu is open. Hover effects apply only on devices that can hover;
 * touch gets the pressed state. The overlay itself is a separate component.
 */
export default function Header() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((value) => !value), []);
  const close = useCallback(() => setOpen(false), []);

  const ease = "[transition-timing-function:var(--ease-push)]";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] pt-[env(safe-area-inset-top,0px)] text-paper mix-blend-difference">
        <div className="page-gutter flex h-[var(--header-h)] items-center justify-between">
          <Link
            href="/"
            aria-label="Offscript, home"
            onClick={close}
            className="flex items-center"
          >
            <Logo
              variant="white"
              className="h-5 w-auto md:h-6"
              fallbackClassName="type-display-wide text-[1rem] md:text-[1.125rem]"
            />
          </Link>

          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="group/menu type-mono -mr-3 flex h-12 items-center gap-3.5 px-3"
          >
            {/* Rolling label */}
            <span
              aria-hidden="true"
              className="relative grid h-[1.1em] overflow-hidden leading-[1.1]"
            >
              <span
                className={`col-start-1 row-start-1 transition-transform duration-500 ${ease} ${
                  open ? "-translate-y-full" : "translate-y-0"
                }`}
              >
                Menu
              </span>
              <span
                className={`col-start-1 row-start-1 transition-transform duration-500 ${ease} ${
                  open ? "translate-y-0" : "translate-y-full"
                }`}
              >
                Close
              </span>
            </span>

            {/* Two-line icon */}
            <span className="relative block h-[10px] w-[22px]" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 block h-px w-full origin-center bg-current transition-transform duration-500 ${ease} ${
                  open ? "translate-y-[4.5px] rotate-45" : "translate-y-0 rotate-0"
                }`}
              />
              <span
                className={`absolute bottom-0 right-0 block h-px origin-center bg-current transition-all duration-500 ${ease} ${
                  open
                    ? "w-full -translate-y-[4.5px] -rotate-45"
                    : "w-[62%] translate-y-0 rotate-0 group-hover/menu:w-full group-active/menu:w-full"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <MenuOverlay open={open} onClose={close} />
    </>
  );
}