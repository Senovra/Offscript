/**
 * BACKDROP SENSING
 *
 * Works out how light or dark the page is BEHIND a point on the screen (the
 * header logo), from what is actually rendered there. Nothing has to be tagged.
 *
 * How it works:
 *   1. document.elementsFromPoint() lists every element under the point, top to bottom.
 *   2. Each one contributes what it paints: its background colour, any gradient
 *      (averaged from its colour stops), pictures and video, scaled by its own
 *      and its ancestors' opacity.
 *   3. The layers are composited from the first fully opaque one upwards, which
 *      gives the colour the visitor sees there, and its relative luminance.
 *
 * Limits (documented fallbacks):
 *   - Gradients are averaged, not sampled at the exact point.
 *   - Pixels of an <img> or <video> can only be read when the file is served
 *     with CORS permission (crossOrigin="anonymous"). Cloudinary files are not
 *     requested that way today, so such media counts as a dark photograph
 *     (UNREADABLE_MEDIA): the site's photography sits under dark shades. Add
 *     crossOrigin="anonymous" to an image or video and its real pixels are used.
 *   - Elements with pointer-events: none are not seen (the browser skips them
 *     when hit-testing). The site has no light overlay of that kind.
 */

export type RGB = [number, number, number];

export interface Layer {
  color: RGB;
  alpha: number;
  multiply: boolean;
}

export interface ResolvedColor {
  color: RGB;
  alpha: number;
}

export type ColorResolver = (css: string) => ResolvedColor | null;

/**
 * The decision uses two thresholds on relative luminance, so it never flickers
 * between two states on a borderline background. About 0.18 is the point where
 * black and white contrast equally; the gap on either side is the dead zone.
 */
export const LIGHT_ENTER = 0.24;
export const LIGHT_EXIT = 0.14;

const OPAQUE = 0.98;
const SAMPLE = 16;
/** Stand-in for a photograph or video whose pixels cannot be read. */
const UNREADABLE_MEDIA: RGB = [26, 26, 28];
const DEFAULT_PAGE: RGB = [10, 10, 11];

/* --------------------------------------------------------------------------
   Pure helpers (no DOM)
   -------------------------------------------------------------------------- */

export function relativeLuminance([r, g, b]: RGB): number {
  const linear = (value: number) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** The next tone, given the current one and the measured luminance. */
export function nextTone(isLight: boolean, luminance: number): boolean {
  return isLight ? luminance > LIGHT_EXIT : luminance > LIGHT_ENTER;
}

/** Splits "a, b(c, d), e" at the commas that are not inside brackets. */
export function splitTopLevel(text: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === "(") depth++;
    else if (char === ")") depth = Math.max(0, depth - 1);
    else if (char === "," && depth === 0) {
      parts.push(text.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(text.slice(start).trim());
  return parts.filter(Boolean);
}

/** The arguments inside "linear-gradient( ... )". */
function gradientArguments(layer: string): string[] | null {
  const open = layer.indexOf("(");
  if (open === -1 || !layer.slice(0, open).includes("gradient")) return null;
  let depth = 0;
  for (let i = open; i < layer.length; i++) {
    if (layer[i] === "(") depth++;
    else if (layer[i] === ")") {
      depth--;
      if (depth === 0) return splitTopLevel(layer.slice(open + 1, i));
    }
  }
  return null;
}

const STOP_POSITION =
  /\s+[-+]?[\d.]+(?:%|px|r?em|vh|vw|vmax|vmin|deg|turn)?(?:\s+[-+]?[\d.]+(?:%|px|r?em|vh|vw|vmax|vmin)?)?$/;

/** A gradient's overall colour: the average of its colour stops. */
export function averageGradient(layer: string, resolve: ColorResolver): ResolvedColor | null {
  const args = gradientArguments(layer);
  if (!args) return null;

  let alphaSum = 0;
  let count = 0;
  const sum: RGB = [0, 0, 0];

  for (const arg of args) {
    // Direction and shape arguments ("to top", "circle at 50% 50%") do not resolve and are skipped
    const resolved = resolve(arg.replace(STOP_POSITION, ""));
    if (!resolved) continue;
    count++;
    alphaSum += resolved.alpha;
    sum[0] += resolved.color[0] * resolved.alpha;
    sum[1] += resolved.color[1] * resolved.alpha;
    sum[2] += resolved.color[2] * resolved.alpha;
  }

  if (count === 0) return null;
  const color: RGB =
    alphaSum > 0 ? [sum[0] / alphaSum, sum[1] / alphaSum, sum[2] / alphaSum] : [0, 0, 0];
  return { color, alpha: alphaSum / count };
}

/** Layers are listed top to bottom. Composites them over `base`, stopping at the first opaque one. */
export function composeLayers(layers: Layer[], base: RGB): RGB {
  const used: Layer[] = [];
  for (const layer of layers) {
    used.push(layer);
    if (layer.alpha >= OPAQUE && !layer.multiply) break;
  }

  const result: RGB = [base[0], base[1], base[2]];
  for (let i = used.length - 1; i >= 0; i--) {
    const { color, alpha, multiply } = used[i];
    for (let k = 0; k < 3; k++) {
      const top = multiply ? (result[k] * color[k]) / 255 : color[k];
      result[k] = top * alpha + result[k] * (1 - alpha);
    }
  }
  return result;
}

/* --------------------------------------------------------------------------
   DOM part (browser only)
   -------------------------------------------------------------------------- */

let colourContext: CanvasRenderingContext2D | null | undefined;
const colourCache = new Map<string, ResolvedColor | null>();

/** Any CSS colour the browser understands (rgb, oklch, color-mix ...) to RGB and alpha. */
function toRgba(css: string): ResolvedColor | null {
  const text = css.trim();
  if (!text) return null;
  if (text === "transparent") return { color: [0, 0, 0], alpha: 0 };

  const cached = colourCache.get(text);
  if (cached !== undefined) return cached;

  if (colourContext === undefined) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    colourContext = canvas.getContext("2d", { willReadFrequently: true });
  }

  let result: ResolvedColor | null = null;
  const ctx = colourContext;
  if (ctx) {
    // An invalid colour leaves fillStyle unchanged, which is how it is detected
    ctx.fillStyle = "#010203";
    ctx.fillStyle = text;
    if (ctx.fillStyle !== "#010203") {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillRect(0, 0, 1, 1);
      const data = ctx.getImageData(0, 0, 1, 1).data;
      result = { color: [data[0], data[1], data[2]], alpha: data[3] / 255 };
    }
  }

  if (colourCache.size > 300) colourCache.clear();
  colourCache.set(text, result);
  return result;
}

/** An element's opacity combined with that of all its ancestors. */
function effectiveOpacity(element: Element): number {
  let opacity = 1;
  for (let node: Element | null = element; node; node = node.parentElement) {
    opacity *= parseFloat(getComputedStyle(node).opacity || "1");
    if (opacity < 0.02) return 0;
  }
  return opacity;
}

const unreadable = new WeakSet<Element>();
let sampler: CanvasRenderingContext2D | null = null;

/** The colour of a picture or video at a relative position, if the browser allows reading it. */
function sampleMedia(
  element: HTMLImageElement | HTMLVideoElement,
  fx: number,
  fy: number
): RGB | null {
  if (unreadable.has(element)) return null;
  try {
    const ready =
      element instanceof HTMLVideoElement
        ? element.readyState >= 2 && element.videoWidth > 0
        : element.complete && element.naturalWidth > 0;
    if (!ready) return null;

    if (!sampler) {
      const canvas = document.createElement("canvas");
      canvas.width = SAMPLE;
      canvas.height = SAMPLE;
      sampler = canvas.getContext("2d", { willReadFrequently: true });
    }
    if (!sampler) return null;

    sampler.clearRect(0, 0, SAMPLE, SAMPLE);
    sampler.drawImage(element, 0, 0, SAMPLE, SAMPLE);
    const px = Math.min(SAMPLE - 1, Math.max(0, Math.floor(fx * SAMPLE)));
    const py = Math.min(SAMPLE - 1, Math.max(0, Math.floor(fy * SAMPLE)));
    const data = sampler.getImageData(px, py, 1, 1).data;
    return data[3] < 8 ? null : [data[0], data[1], data[2]];
  } catch {
    // Media from another site cannot be read without its permission. Remember
    // that, and start a new canvas, because a failed read taints the old one.
    unreadable.add(element);
    sampler = null;
    return null;
  }
}

/** What one element paints at the point, appended top to bottom. */
function pushLayers(element: Element, x: number, y: number, out: Layer[]): void {
  const opacity = effectiveOpacity(element);
  if (opacity < 0.02) return;

  const style = getComputedStyle(element);
  const multiply = style.mixBlendMode === "multiply";

  // A WebGL canvas (the 3D camera) is transparent here and reads as blank
  if (element instanceof HTMLCanvasElement) return;

  if (element instanceof HTMLImageElement || element instanceof HTMLVideoElement) {
    const rect = element.getBoundingClientRect();
    const fx = rect.width ? (x - rect.left) / rect.width : 0.5;
    const fy = rect.height ? (y - rect.top) / rect.height : 0.5;
    out.push({
      color: sampleMedia(element, fx, fy) ?? UNREADABLE_MEDIA,
      alpha: opacity,
      multiply,
    });
    return;
  }

  // Gradients and pictures sit above the background colour, top first
  const image = style.backgroundImage;
  if (image && image !== "none") {
    for (const layer of splitTopLevel(image)) {
      if (layer.includes("gradient(")) {
        const average = averageGradient(layer, toRgba);
        if (average && average.alpha > 0.01) {
          out.push({ color: average.color, alpha: average.alpha * opacity, multiply });
        }
      } else if (layer.startsWith("url(")) {
        out.push({ color: UNREADABLE_MEDIA, alpha: opacity, multiply });
      }
    }
  }

  const background = toRgba(style.backgroundColor);
  if (background && background.alpha > 0.01) {
    out.push({ color: background.color, alpha: background.alpha * opacity, multiply });
  }
}

/** The page's own background, used if nothing opaque is found under the point. */
function pageBase(): RGB {
  const resolved = toRgba(getComputedStyle(document.documentElement).backgroundColor);
  return resolved && resolved.alpha > 0.5 ? resolved.color : DEFAULT_PAGE;
}

/**
 * Relative luminance (0 dark to 1 light) of what is rendered behind the point.
 * Elements inside `ignoreWithin` (the header itself) are skipped.
 * Returns null where the browser cannot hit-test.
 */
export function measureBackdropLuminance(
  x: number,
  y: number,
  ignoreWithin: Element | null
): number | null {
  if (typeof document.elementsFromPoint !== "function") return null;
  const stack = document.elementsFromPoint(x, y);
  if (stack.length === 0) return null;

  const layers: Layer[] = [];
  for (const element of stack) {
    if (ignoreWithin?.contains(element)) continue;
    pushLayers(element, x, y, layers);
    if (layers.some((layer) => layer.alpha >= OPAQUE && !layer.multiply)) break;
  }

  return relativeLuminance(composeLayers(layers, pageBase()));
}