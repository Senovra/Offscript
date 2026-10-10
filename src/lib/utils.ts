/**
 * Small shared helpers: class joining, maths, timecode, asset paths and the
 * two motion easings. Easing arrays are used by Framer Motion. Matching CSS
 * versions live in globals.css.
 */

export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function pad2(value: number): string {
  return String(Math.max(0, Math.floor(value))).padStart(2, "0");
}

/**
 * Prefixes a path from /public with the site's base path.
 * Needed only for raw URLs (fetch, <video src>, the 3D model). Next's <Link>
 * adds the base path by itself. Empty in development and on a custom domain.
 */
export function assetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Converts 0..1 scroll progress into a film-style timecode (MM:SS:FF).
 * Purely decorative. Part of the viewfinder / media language.
 */
export function formatTimecode(
  progress: number,
  totalSeconds = 30,
  fps = 24
): string {
  const totalFrames = Math.round(clamp(progress, 0, 1) * totalSeconds * fps);
  const frames = totalFrames % fps;
  const totalSecs = Math.floor(totalFrames / fps);
  const secs = totalSecs % 60;
  const mins = Math.floor(totalSecs / 60);
  return `${pad2(mins)}:${pad2(secs)}:${pad2(frames)}`;
}

/** CUT: hard, decisive. Used for wipes and menu reveals. */
export const EASE_CUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

/** PUSH: fast start, long settle. Used for camera-like moves. */
export const EASE_PUSH: [number, number, number, number] = [0.22, 1, 0.36, 1];