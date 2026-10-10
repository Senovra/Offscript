/**
 * Project page transition, shared by every "view project" link.
 *
 * startProjectTransition() puts a full-screen photo overlay on top of the page
 * and opens it from the clicked image (or wipes it up from the bottom), then
 * calls onCovered so the router can load the project page underneath.
 * finishProjectTransition() is called by the project page when it has loaded,
 * and fades the overlay away.
 *
 * It is plain DOM and the Web Animations API, so it survives the page change.
 */

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const OPEN_MS = 850;
const FADE_MS = 700;
/** If the project page never calls finish, the overlay removes itself. */
const FAILSAFE_MS = 6000;

let overlay: HTMLDivElement | null = null;
let failsafe = 0;
let busy = false;
let finishing = false;

function remove() {
  window.clearTimeout(failsafe);
  overlay?.remove();
  overlay = null;
  busy = false;
  finishing = false;
}

interface StartOptions {
  image: string;
  focal: string;
  /** The rectangle to open from. When null the overlay wipes up from the bottom. */
  origin: DOMRect | null;
  onCovered: () => void;
}

export function startProjectTransition({ image, focal, origin, onCovered }: StartOptions) {
  if (busy) return;
  remove();
  busy = true;

  const element = document.createElement("div");
  element.setAttribute("aria-hidden", "true");
  element.style.cssText =
    "position:fixed;inset:0;z-index:75;overflow:hidden;background:#0a0a0b;";

  const picture = document.createElement("div");
  picture.style.cssText = `position:absolute;inset:0;background-image:url("${image}");background-size:cover;background-position:${focal};`;

  // Same shade as the project hero, so the hand-over is seamless
  const shade = document.createElement("div");
  shade.style.cssText =
    "position:absolute;inset:0;background:linear-gradient(to top, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.15) 45%, rgba(10,10,11,0.3) 100%);";

  element.append(picture, shade);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const from = origin
    ? `inset(${Math.max(0, origin.top)}px ${Math.max(0, vw - origin.right)}px ${Math.max(
        0,
        vh - origin.bottom
      )}px ${Math.max(0, origin.left)}px)`
    : "inset(100% 0px 0px 0px)";

  element.style.clipPath = from;
  document.body.appendChild(element);
  overlay = element;
  failsafe = window.setTimeout(remove, FAILSAFE_MS);

  const open = element.animate(
    [{ clipPath: from }, { clipPath: "inset(0px 0px 0px 0px)" }],
    { duration: OPEN_MS, easing: EASE, fill: "forwards" }
  );
  picture.animate([{ transform: "scale(1.18)" }, { transform: "scale(1)" }], {
    duration: OPEN_MS,
    easing: EASE,
    fill: "forwards",
  });

  open.finished.then(onCovered, onCovered);
}

export function finishProjectTransition() {
  const element = overlay;
  if (!element) {
    busy = false;
    return;
  }
  if (finishing) return;
  finishing = true;

  const fade = element.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: FADE_MS,
    easing: "ease",
    fill: "forwards",
  });
  fade.finished.then(remove, remove);
}