"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { startProjectTransition } from "./projectTransition";

interface ProjectLinkProps {
  href: string;
  /** The project photo, shown in the opening transition. */
  image: string;
  focal?: string;
  /** CSS selector of the image the transition should open from (inside or around the link). */
  originSelector?: string;
  /** Open from the link's own box instead (used when the whole link is the image). */
  fromLink?: boolean;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}

/**
 * A link to a project page with an opening transition. With neither
 * originSelector nor fromLink the photo wipes up from the bottom.
 * Reduced motion and new-tab clicks (Ctrl, Cmd, Shift, middle button) just
 * navigate normally.
 */
export default function ProjectLink({
  href,
  image,
  focal = "50% 50%",
  originSelector,
  fromLink = false,
  className,
  ariaLabel,
  children,
}: ProjectLinkProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      reduceMotion ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    const link = event.currentTarget;
    let origin: Element | null = null;
    if (originSelector) {
      origin = link.querySelector(originSelector) ?? link.closest(originSelector);
    } else if (fromLink) {
      origin = link;
    }

    startProjectTransition({
      image,
      focal,
      origin: origin ? origin.getBoundingClientRect() : null,
      onCovered: () => router.push(href),
    });
  };

  return (
    <Link href={href} onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}