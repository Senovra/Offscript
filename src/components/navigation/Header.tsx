"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import MenuOverlay from "@/components/navigation/MenuOverlay";
import { ASSETS } from "@/lib/assets";
import { measureBackdropLuminance, nextTone } from "@/lib/backdrop";

/**
 * Which logo shows on which kind of background. The "white" logo has the white
 * square background; the "black" logo has the black one. Swap the two words to
 * reverse the rule.
 */
const LOGO_ON_DARK: "white" | "black" = "black";
const LOGO_ON_LIGHT: "white" | "black" = "white";

/** The logo's size. */
const LOGO_SIZE = "h-12 w-12 md:h-14 md:w-14";

/** The backdrop is checked at most this often while scrolling, and this often while still. */
const MIN_GAP_MS = 80;
const POLL_MS = 500;

/**
 * True while the page behind the logo is light, judged from what is actually
 * rendered there (see src/lib/backdrop.ts): no section needs to be tagged.
 * `paused` is true while the menu is open (the screen behind is dark).
 */
function useBackdropIsLight(ref: RefObject<HTMLElement | null>, paused: boolean): boolean {
  const pathname = usePathname();
  const [light, setLight] = useState(false);
  const lightRef = useRef(false);

  useEffect(() => {
    if (paused) return;

    let timer = 0;
    let lastRun = 0;

    const run = () => {
      timer = 0;
      lastRun = performance.now();
      const element = ref.current;
      if (!element || document.hidden) return;

      const rect = element.getBoundingClientRect();
      const luminance = measureBackdropLuminance(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        element.closest("header")
      );
      if (luminance === null) return;

      const next = nextTone(lightRef.current, luminance);
      if (next !== lightRef.current) {
        lightRef.current = next;
        setLight(next);
      }
    };

    const schedule = () => {
      if (timer) return;
      timer = window.setTimeout(run, Math.max(0, MIN_GAP_MS - (performance.now() - lastRun)));
    };

    run();
    const interval = window.setInterval(schedule, POLL_MS);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (timer) window.clearTimeout(timer);
      window.clearInterval(interval);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname, paused, ref]);

  return light && !paused;
}

/**
 * Both logos sit on top of each other, so both are already loaded and the
 * swap is a short cross-fade: no loading delay, no flicker, no layout shift.
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

  const showing = light ? LOGO_ON_LIGHT : LOGO_ON_DARK;

  return (
    <span className={`relative block ${LOGO_SIZE}`}>
      <Logo
        variant="black"
        alt=""
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
          showing === "black" ? "opacity-100" : "opacity-0"
        }`}
      />
      <Logo
        variant="white"
        alt=""
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
          showing === "white" ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}

/**
 * Fixed header. The Menu button uses mix-blend-difference so it stays legible
 * over dark surfaces, the light contact band and full-colour photography.
 * The logo is NOT blended (that would recolour its artwork); it swaps between
 * its two versions instead, according to the background actually behind it.
 *
 * The menu button: the word rolls between "Menu" and "Close", and the two
 * lines (the bottom one shorter) even out on hover and turn into a centred X
 * when the menu is open. Hover effects apply only on devices that can hover;
 * touch gets the pressed state. The overlay itself is a separate component.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const logoLink = useRef<HTMLAnchorElement>(null);
  // While the menu is open the screen behind the logo is dark
  const lightBackdrop = useBackdropIsLight(logoLink, open);

  const toggle = useCallback(() => setOpen((value) => !value), []);
  const close = useCallback(() => setOpen(false), []);

  const ease = "[transition-timing-function:var(--ease-push)]";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] pt-[env(safe-area-inset-top,0px)] text-paper">
        <div className="page-gutter flex h-[var(--header-h)] items-center justify-between">
          <Link
            ref={logoLink}
            href="/"
            aria-label="Offscript, home"
            onClick={close}
            className="flex items-center"
          >
            <HeaderLogo light={lightBackdrop} />
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