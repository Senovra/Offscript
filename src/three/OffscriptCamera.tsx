"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import {
  Box3,
  CanvasTexture,
  SRGBColorSpace,
  Vector3,
  type Material,
  type Mesh,
  type MeshPhysicalMaterial,
  type MeshStandardMaterial,
  type Object3D,
  type Texture,
} from "three";

export const MODEL_URL = "/models/offscript-camera.glb";

/** Rotation (radians) that makes the lens face the viewer at rest. */
const FRONT_OFFSET = 0;

/** Near-black used wherever branding is toned down. */
const DARK = 0.012;

/* --------------------------------------------------------------------------
   OFFSCRIPT BADGE SETTINGS
   After the Sony marks are blacked out, every SONY-sized mark found in the
   texture gets the word OFFSCRIPT drawn in its place.
   Set BADGE_ENABLED to false to leave them plain black.
   -------------------------------------------------------------------------- */
const BADGE_ENABLED = true;
const BADGE_TEXT = "OFFSCRIPT";
/** The most marks to replace on one texture (top, lens cap, lens side, spare). */
const BADGE_COUNT = 6;
/** Pixel brightness (0 to 255) that counts as white print. */
const WHITE_MIN = 150;

/**
 * BRANDING, step 1: hide separate meshes that look like logos or labels.
 * (The GLB file is never modified. This happens on a runtime clone.)
 */
const BRAND_PATTERN = /logo|sony|brand|emblem|badge|decal|lettering|typograph/i;
const LABEL_PATTERN = /(^|[^a-z])(text|label)([^a-z]|$)/i;

function looksLikeBranding(name: string | undefined): boolean {
  if (!name) return false;
  return BRAND_PATTERN.test(name) || LABEL_PATTERN.test(name);
}

function ancestorLooksLikeBranding(object: Object3D, root: Object3D): boolean {
  let current: Object3D | null = object.parent;
  while (current && current !== root) {
    if (looksLikeBranding(current.name)) return true;
    current = current.parent;
  }
  return false;
}

/* --------------------------------------------------------------------------
   LOGO FINDER
   1. Find every separate white shape ("glyph") in the texture.
   2. Group neighbouring glyphs into words, both side-by-side and stacked
      (a logo can be rotated in the texture).
   3. Keep word-sized groups: SONY has four letters.
   4. Work out which way the word faces by finding its "Y", the one letter
      that is clearly top-heavy. That gives the reading direction and which
      side is "up", including mirrored or upside-down marks.
   -------------------------------------------------------------------------- */
interface Glyph {
  id: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  count: number;
}

interface Logo {
  x: number;
  y: number;
  w: number;
  h: number;
  /** reading direction in texture space */
  rx: number;
  ry: number;
  /** "up" direction of the letters in texture space */
  ux: number;
  uy: number;
  glyphs: number;
  orientationKnown: boolean;
}

function groupGlyphs(glyphs: Glyph[], vertical: boolean): Glyph[][] {
  const parent = glyphs.map((_, index) => index);
  const find = (index: number): number => {
    let i = index;
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  };

  for (let i = 0; i < glyphs.length; i++) {
    const a = glyphs[i];
    const a0 = vertical ? a.y0 : a.x0;
    const a1 = vertical ? a.y1 : a.x1;
    const ac0 = vertical ? a.x0 : a.y0;
    const ac1 = vertical ? a.x1 : a.y1;
    const aCross = ac1 - ac0 + 1;

    for (let j = i + 1; j < glyphs.length; j++) {
      const b = glyphs[j];
      const b0 = vertical ? b.y0 : b.x0;
      const b1 = vertical ? b.y1 : b.x1;
      const bc0 = vertical ? b.x0 : b.y0;
      const bc1 = vertical ? b.x1 : b.y1;
      const bCross = bc1 - bc0 + 1;

      const minCross = Math.min(aCross, bCross);
      const maxCross = Math.max(aCross, bCross);
      if (minCross / maxCross < 0.5) continue;

      const crossOverlap = Math.min(ac1, bc1) - Math.max(ac0, bc0) + 1;
      if (crossOverlap < minCross * 0.6) continue;

      const gap = Math.max(a0, b0) - Math.min(a1, b1) - 1;
      if (gap > maxCross * 0.9) continue;

      const ra = find(i);
      const rb = find(j);
      if (ra !== rb) parent[ra] = rb;
    }
  }

  const groups = new Map<number, Glyph[]>();
  glyphs.forEach((glyph, index) => {
    const root = find(index);
    const list = groups.get(root);
    if (list) list.push(glyph);
    else groups.set(root, [glyph]);
  });
  return [...groups.values()];
}

/** Which half of a glyph (along the cross axis) holds more pixels. */
function heaviness(
  glyph: Glyph,
  labels: Int32Array,
  width: number,
  vertical: boolean
): number {
  const mid = vertical ? (glyph.x0 + glyph.x1 + 1) / 2 : (glyph.y0 + glyph.y1 + 1) / 2;
  let low = 0;
  let high = 0;
  for (let y = glyph.y0; y <= glyph.y1; y++) {
    for (let x = glyph.x0; x <= glyph.x1; x++) {
      if (labels[y * width + x] !== glyph.id) continue;
      const coordinate = (vertical ? x : y) + 0.5;
      if (coordinate < mid) low++;
      else high++;
    }
  }
  return (low - high) / Math.max(1, low + high);
}

function findLogos(data: Uint8ClampedArray, w: number, h: number): Logo[] {
  const total = w * h;
  const mask = new Uint8Array(total);

  for (let i = 0; i < total; i++) {
    const o = i * 4;
    if (
      data[o + 3] > 128 &&
      data[o] > WHITE_MIN &&
      data[o + 1] > WHITE_MIN &&
      data[o + 2] > WHITE_MIN
    ) {
      mask[i] = 1;
    }
  }

  // Step 1: label every connected white shape
  const labels = new Int32Array(total);
  const raw: Glyph[] = [];
  const stack: number[] = [];
  let next = 0;

  for (let start = 0; start < total; start++) {
    if (!mask[start] || labels[start]) continue;

    next++;
    let x0 = w;
    let x1 = 0;
    let y0 = h;
    let y1 = 0;
    let count = 0;

    labels[start] = next;
    stack.push(start);

    while (stack.length > 0) {
      const index = stack.pop() as number;
      const px = index % w;
      const py = (index - px) / w;

      count++;
      if (px < x0) x0 = px;
      if (px > x1) x1 = px;
      if (py < y0) y0 = py;
      if (py > y1) y1 = py;

      for (let dy = -1; dy <= 1; dy++) {
        const ny = py + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = px + dx;
          if (nx < 0 || nx >= w) continue;
          const neighbour = ny * w + nx;
          if (mask[neighbour] && !labels[neighbour]) {
            labels[neighbour] = next;
            stack.push(neighbour);
          }
        }
      }
    }

    raw.push({ id: next, x0, y0, x1, y1, count });
  }

  // Keep letter-sized shapes only
  const glyphs = raw
    .filter((g) => {
      const gw = g.x1 - g.x0 + 1;
      const gh = g.y1 - g.y0 + 1;
      return g.count >= 10 && gw >= 2 && gh >= 5 && gw < w * 0.3 && gh < h * 0.3;
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 3000);

  // Steps 2 and 3: group into words and keep word-sized groups
  const found: Array<Logo & { area: number }> = [];

  for (const vertical of [false, true]) {
    for (const group of groupGlyphs(glyphs, vertical)) {
      if (group.length < 3 || group.length > 5) continue;

      const x0 = Math.min(...group.map((g) => g.x0));
      const y0 = Math.min(...group.map((g) => g.y0));
      const x1 = Math.max(...group.map((g) => g.x1));
      const y1 = Math.max(...group.map((g) => g.y1));
      const bw = x1 - x0 + 1;
      const bh = y1 - y0 + 1;

      const length = vertical ? bh : bw;
      const cross = vertical ? bw : bh;
      const aspect = length / cross;

      if (cross < Math.max(8, w * 0.009)) continue;
      if (aspect < 2.2 || aspect > 7.5) continue;
      // Only SONY-shaped groups (four letters) are accepted when small
      if (group.length !== 4 && cross < w * 0.02) continue;

      // Step 4: reading direction and "up", from the position of the Y
      const sorted = [...group].sort((a, b) =>
        vertical ? a.y0 - b.y0 : a.x0 - b.x0
      );

      let along = 1;
      let crossUp = vertical ? 1 : -1;
      let known = false;

      if (group.length === 4) {
        const first = heaviness(sorted[0], labels, w, vertical);
        const last = heaviness(sorted[3], labels, w, vertical);
        if (Math.abs(Math.abs(first) - Math.abs(last)) > 0.08) {
          const yIsLast = Math.abs(last) > Math.abs(first);
          const heavy = yIsLast ? last : first;
          along = yIsLast ? 1 : -1;
          crossUp = heavy > 0 ? -1 : 1;
          known = true;
        }
      }

      found.push({
        x: x0,
        y: y0,
        w: bw,
        h: bh,
        rx: vertical ? 0 : along,
        ry: vertical ? along : 0,
        ux: vertical ? crossUp : 0,
        uy: vertical ? 0 : crossUp,
        glyphs: group.length,
        orientationKnown: known,
        area: bw * bh,
      });
    }
  }

  // Largest first, skipping overlaps
  found.sort((a, b) => b.area - a.area);
  const accepted: Logo[] = [];

  for (const candidate of found) {
    const overlaps = accepted.some((other) => {
      const ix = Math.min(candidate.x + candidate.w, other.x + other.w) - Math.max(candidate.x, other.x);
      const iy = Math.min(candidate.y + candidate.h, other.y + other.h) - Math.max(candidate.y, other.y);
      if (ix <= 0 || iy <= 0) return false;
      return ix * iy > 0.5 * Math.min(candidate.w * candidate.h, other.w * other.h);
    });
    if (!overlaps) accepted.push(candidate);
    if (accepted.length >= BADGE_COUNT) break;
  }

  return accepted;
}

let blankBadge: CanvasTexture | null = null;
const badgeCache = new WeakMap<object, CanvasTexture>();

/** A 1x1 transparent texture, used when nothing is drawn. */
function getBlankBadge(): CanvasTexture {
  if (!blankBadge) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    blankBadge = new CanvasTexture(canvas);
    blankBadge.flipY = false;
    blankBadge.colorSpace = SRGBColorSpace;
  }
  return blankBadge;
}

/** Builds (and caches) the transparent OFFSCRIPT layer for one base texture. */
function getBadgeFor(map: Texture): CanvasTexture {
  const image = map.image as (CanvasImageSource & { width: number; height: number }) | null;
  if (!BADGE_ENABLED || !image || !image.width || !image.height) return getBlankBadge();

  const cached = badgeCache.get(image);
  if (cached) return cached;

  let result: CanvasTexture = getBlankBadge();

  try {
    const w = image.width;
    const h = image.height;

    const reader = document.createElement("canvas");
    reader.width = w;
    reader.height = h;
    const readerCtx = reader.getContext("2d", { willReadFrequently: true });
    if (!readerCtx) throw new Error("no 2d context");
    readerCtx.drawImage(image, 0, 0, w, h);

    const logos = findLogos(readerCtx.getImageData(0, 0, w, h).data, w, h);

    if (process.env.NODE_ENV !== "production") {
      console.groupCollapsed("[Offscript camera] logos");
      console.info("texture size:", w, "x", h);
      console.table(logos);
      console.groupEnd();
    }

    if (logos.length > 0) {
      const scale = w <= 1024 ? 2 : 1;
      const canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no 2d context");

      const family = getComputedStyle(document.body).fontFamily;
      ctx.fillStyle = "rgba(232, 231, 226, 0.92)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const logo of logos) {
        // Local text axes: x runs along the reading direction, y runs down the letters
        ctx.setTransform(
          scale * logo.rx,
          scale * logo.ry,
          scale * -logo.ux,
          scale * -logo.uy,
          scale * (logo.x + logo.w / 2),
          scale * (logo.y + logo.h / 2)
        );

        const readsAlongX = Math.abs(logo.rx) > 0.5;
        const length = readsAlongX ? logo.w : logo.h;
        const cross = readsAlongX ? logo.h : logo.w;

        ctx.font = `800 100px ${family}`;
        const measured = ctx.measureText(BADGE_TEXT).width || 1;
        const size = Math.min((100 * length * 0.98) / measured, cross / 0.72);

        ctx.font = `800 ${size}px ${family}`;
        ctx.fillText(BADGE_TEXT, 0, size * 0.04);
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const texture = new CanvasTexture(canvas);
      texture.flipY = false;
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = 8;
      texture.channel = map.channel;
      texture.needsUpdate = true;
      result = texture;
    }
  } catch {
    result = getBlankBadge();
  }

  badgeCache.set(image, result);
  return result;
}

/**
 * BRANDING, step 2: remove white print, including its soft edges, then add the
 * OFFSCRIPT badge.
 *
 * For every textured material a small shader step does these things:
 *   1. Looks at each pixel AND its neighbours. If any is near-white, the pixel
 *      counts as "logo", which also covers the anti-aliased fringe.
 *   2. Paints those pixels the body's near-black.
 *   3. Flattens the surface normal and dulls the shine there, so raised
 *      lettering no longer catches light.
 *   4. Lays the OFFSCRIPT badge layer over the top.
 *
 * The orange ring is not white, so it is untouched.
 */
function knockOutBranding(source: Material): Material {
  const material = source.clone();
  const standard = material as MeshStandardMaterial;
  if (!standard.isMeshStandardMaterial) return material;

  if (standard.map) {
    const badge = getBadgeFor(standard.map);

    standard.onBeforeCompile = (shader) => {
      shader.uniforms.offscriptBadge = { value: badge };

      shader.fragmentShader =
        "uniform sampler2D offscriptBadge;\n" +
        shader.fragmentShader
          .replace(
            "#include <map_fragment>",
            `#include <map_fragment>
          #ifdef USE_MAP
            vec2 brandPx = 1.0 / vec2(textureSize(map, 0));
            float brandWhite = min(diffuseColor.r, min(diffuseColor.g, diffuseColor.b));
            for (int i = 0; i < 8; i++) {
              float brandAngle = float(i) * 0.785398;
              vec2 brandDir = vec2(cos(brandAngle), sin(brandAngle));
              vec4 nearA = texture2D(map, vMapUv + brandDir * brandPx * 1.5);
              vec4 nearB = texture2D(map, vMapUv + brandDir * brandPx * 3.0);
              brandWhite = max(brandWhite, min(nearA.r, min(nearA.g, nearA.b)));
              brandWhite = max(brandWhite, min(nearB.r, min(nearB.g, nearB.b)));
            }
            float brandMask = smoothstep(0.08, 0.25, brandWhite);
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(${DARK.toFixed(3)}), brandMask);
            vec4 badgeSample = texture2D(offscriptBadge, vMapUv);
            diffuseColor.rgb = mix(diffuseColor.rgb, badgeSample.rgb, badgeSample.a);
          #else
            float brandMask = 0.0;
          #endif`
          )
          .replace(
            "#include <roughnessmap_fragment>",
            `#include <roughnessmap_fragment>
          roughnessFactor = mix(roughnessFactor, 0.9, brandMask * 0.6);`
          )
          .replace(
            "#include <normal_fragment_maps>",
            `#include <normal_fragment_maps>
          normal = normalize(mix(normal, nonPerturbedNormal, brandMask));`
          );
    };
    standard.customProgramCacheKey = () => "offscript-brand-knockout-v4";
  } else {
    const physical = standard as MeshPhysicalMaterial;
    const plain =
      !standard.transparent &&
      standard.opacity >= 1 &&
      standard.metalness < 0.5 &&
      !(physical.transmission > 0);
    const { r, g, b } = standard.color;
    if (plain && Math.min(r, g, b) > 0.4) standard.color.setScalar(DARK);
  }

  return material;
}

interface OffscriptCameraProps {
  onLoaded?: () => void;
}

/**
 * Loads the supplied GLB as-is, clones it so the cached original is never
 * altered, applies the branding treatment to the clone, then centres it on its
 * own bounds and scales it so its largest dimension is 1 unit.
 * CameraRig sizes and rotates it.
 */
export default function OffscriptCamera({ onLoaded }: OffscriptCameraProps) {
  const { scene } = useGLTF(MODEL_URL);

  const { object, offset, scale } = useMemo(() => {
    const clone = scene.clone(true);
    const swapped = new Map<Material, Material>();

    clone.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;

      mesh.frustumCulled = false;

      const isArray = Array.isArray(mesh.material);
      const originals: Material[] = isArray
        ? (mesh.material as Material[])
        : [mesh.material as Material];

      const hide =
        looksLikeBranding(mesh.name) ||
        ancestorLooksLikeBranding(mesh, clone) ||
        (originals.length === 1 && looksLikeBranding(originals[0].name));

      if (hide) mesh.visible = false;

      const replaced = originals.map((original) => {
        let result = swapped.get(original);
        if (!result) {
          result = knockOutBranding(original);
          swapped.set(original, result);
        }
        return result;
      });

      mesh.material = isArray ? replaced : replaced[0];
    });

    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const largest = Math.max(size.x, size.y, size.z) || 1;

    return {
      object: clone,
      offset: center.clone().multiplyScalar(-1),
      scale: 1 / largest,
    };
  }, [scene]);

  useEffect(() => {
    onLoaded?.();
  }, [object, onLoaded]);

  return (
    <group rotation={[0, FRONT_OFFSET, 0]}>
      <group scale={scale}>
        <primitive object={object} position={offset} />
      </group>
    </group>
  );
}

/** Starts fetching the GLB the moment this chunk loads. */
useGLTF.preload(MODEL_URL);