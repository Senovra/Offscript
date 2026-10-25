"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { ASSETS } from "@/lib/assets";
import MenuOverlay from "./MenuOverlay";

/** How far from the top of the screen the logo's centre sits (px). */
const LOGO_PROBE_Y = 36;

/**
 * True while the logo is over a LIGHT section. A section opts in by carrying
 * data-header-theme="light" (the home page's "Start a project" band does).
 * Everything else on the site is dark.
 */
function useLightBackdrop(): boolean {
  const pathname = usePathname();
  const [light, setLight] = useState(false);

  useEffect(() => {
    let frame = 0;

    const check = () => {
      frame = 0;
      let over = false;
      document
        .querySelectorAll<HTMLElement>("[data-header-theme='light']")
        .forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.top <= LOGO_PROBE_Y && rect.bottom >= LOGO_PROBE_Y) over = true;
        });
      setLight(over);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return light;
}

const LOGO_SIZE = "h-12 w-12 md:h-14 md:w-14";

/**
 * Both logos sit on top of each other, so both are already loaded and the
 * swap is a short cross-fade: no loading delay, no flicker, no layout shift.
 *   dark background  : the black logo (black square, white artwork)
 *   light background : the white logo
 */
function HeaderLogo({ light }: { light: boolean }) {
  const hasBoth = Boolean(
    ASSETS.logo.horizontalBlack.trim() && ASSETS.logo.horizontalWhite.trim()
  );

  if (!hasBoth) {
    return (
      <Logo
        variant="black"
        alt=""
        className={LOGO_SIZE}
        fallbackClassName="type-display-wide text-[1rem] mix-blend-difference md:text-[1.125rem]"
      />
    );
  }

  return (
    <span className={`relative block ${LOGO_SIZE}`}>
      <Logo
        variant="black"
        alt=""
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
          light ? "opacity-0" : "opacity-100"
        }`}
      />
      <Logo
        variant="white"
        alt=""
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
          light ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}

/**
 * Fixed header. The Menu button uses mix-blend-difference so it stays legible
 * over dark surfaces, the light contact band and full-colour photography.
 * The logo is NOT blended (that would recolour its artwork); it swaps between
 * its black and white versions instead, depending on what is behind it.
 *
 * The menu button: the word rolls between "Menu" and "Close", and the two
 * lines (the bottom one shorter) even out on hover and turn into a centred X
 * when the menu is open. Hover effects apply only on devices that can hover;
 * touch gets the pressed state. The overlay itself is a separate component.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const lightBackdrop = useLightBackdrop();

  const toggle = useCallback(() => setOpen((value) => !value), []);
  const close = useCallback(() => setOpen(false), []);

  const ease = "[transition-timing-function:var(--ease-push)]";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] pt-[env(safe-area-inset-top,0px)] text-paper">
        <div className="page-gutter flex h-[var(--header-h)] items-center justify-between">
          <Link
            href="/"
            aria-label="Offscript, home"
            onClick={close}
            className="flex items-center"
          >
            {/* While the menu is open the screen behind is dark, so use the dark-background logo */}
            <HeaderLogo light={lightBackdrop && !open} />
          </Link>

          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="group/menu type-mono -mr-3 flex h-12 items-center gap-3.5 px-3 mix-blend-difference"
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