/**
 * Image fitting helpers, shared by FitImage and the project page transition.
 *
 * A photo is shown "cover" (fills the frame, may crop the edges) when the crop
 * would be small, and "contain" (the whole photo, with a soft blurred
 * backdrop behind it) when filling the frame would crop too much.
 */

/** The largest share of a photo that may be cropped away before it is shown whole. */
export const MAX_CROP = 0.25;

const ratios = new Map<string, number>();

/** Remembers a photo's natural proportions (width / height) once it has loaded. */
export function rememberRatio(src: string, width: number, height: number): void {
  if (width > 0 && height > 0) ratios.set(src, width / height);
}

export function getRatio(src: string): number | undefined {
  return ratios.get(src);
}

/** true when covering the frame would crop more than `maxCrop` of the photo. */
export function shouldContain(
  imageRatio: number,
  boxRatio: number,
  maxCrop: number = MAX_CROP
): boolean {
  if (!(imageRatio > 0) || !(boxRatio > 0)) return false;
  const crop = 1 - Math.min(imageRatio, boxRatio) / Math.max(imageRatio, boxRatio);
  return crop > maxCrop;
}