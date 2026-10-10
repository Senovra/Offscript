"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import MenuOverlay from "./MenuOverlay";

/**
 * Fixed header. mix-blend-difference keeps it legible over dark surfaces,
 * the light contact section and full-colour photography.
 * The menu button is a real button and works the same on touch and mouse.
 */
export default function Header() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((value) => !value), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] pt-[env(safe-area-inset-top,0px)] text-paper mix-blend-difference">
        <div className="page-gutter flex h-[var(--header-h)] items-center justify-between">
          <Link
            href="/"
            aria-label="Offscript, home"
            onClick={close}
            className="type-display-wide text-[1rem] md:text-[1.125rem]"
          >
            Offscript
          </Link>

          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="site-menu"
            className="type-mono -mr-3 flex h-11 items-center gap-3 px-3"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="relative block h-[7px] w-5" aria-hidden="true">
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-all duration-500 ${
                  open ? "top-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-all duration-500 ${
                  open ? "top-1/2 -rotate-45" : "top-full"
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