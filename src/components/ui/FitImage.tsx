"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type SyntheticEvent,
} from "react";
import Image from "next/image";
import { imageUrl } from "@/lib/cloudinary";
import { MAX_CROP, getRatio, rememberRatio, shouldContain } from "@/lib/fit";
import { clamp } from "@/lib/utils";

interface FitImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** CSS object-position used when the photo is cropped to fill the frame. */
  focal?: string;
  /** Largest share of the photo allowed to be cropped before it is shown whole. */
  maxCrop?: number;
  /**
   * natural: the frame takes the photo's own shape (no cropping at all).
   * Use it where the layout can follow the photo's height.
   */
  natural?: boolean;
  /** Shape used by `natural` frames until the photo has loaded (width / height). */
  defaultRatio?: number;
  imageClassName?: string;
  imageStyle?: CSSProperties;
}

const MIN_RATIO = 0.6;
const MAX_RATIO = 2.2;

/**
 * A photo that fits its frame without ugly cropping.
 *   Default : fills its parent (the parent must be positioned, with a size).
 *             Small crop: the photo fills the frame ("cover", using `focal`).
 *             Big crop  : the whole photo is shown ("contain") over a soft
 *                         backdrop made from a tiny copy of the same photo,
 *                         so there are never empty bars.
 *   natural : the frame itself takes the photo's shape.
 * The photo is never stretched. It decides again when the frame resizes.
 */
export default function FitImage({
  src,
  alt,
  sizes,
  priority = false,
  focal = "50% 50%",
  maxCrop = MAX_CROP,
  natural = false,
  defaultRatio = 4 / 3,
  imageClassName = "",
  imageStyle,
}: FitImageProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const ratioRef = useRef<number | null>(null);
  const [frameRatio, setFrameRatio] = useState<number | null>(() =>
    natural ? getRatio(src) ?? null : null
  );
  const [contain, setContain] = useState(false);

  const evaluate = useCallback(() => {
    const box = boxRef.current;
    const imageRatio = ratioRef.current;
    if (!box || !imageRatio) return;
    const { clientWidth, clientHeight } = box;
    if (!clientWidth || !clientHeight) return;
    setContain(shouldContain(imageRatio, clientWidth / clientHeight, maxCrop));
  }, [maxCrop]);

  const settle = useCallback(
    (width: number, height: number) => {
      if (width <= 0 || height <= 0) return;
      ratioRef.current = width / height;
      rememberRatio(src, width, height);
      if (natural) {
        setFrameRatio(width / height);
      } else {
        evaluate();
      }
    },
    [src, natural, evaluate]
  );

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    settle(img.naturalWidth, img.naturalHeight);
  };

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    // Photos that were already cached may have loaded before React was listening
    const img = box.querySelector<HTMLImageElement>("img[data-fit-main]");
    if (img && img.complete && img.naturalWidth > 0) {
      settle(img.naturalWidth, img.naturalHeight);
    }

    if (natural) return;
    const observer = new ResizeObserver(evaluate);
    observer.observe(box);
    return () => observer.disconnect();
  }, [settle, evaluate, natural]);

  const rootStyle: CSSProperties | undefined = natural
    ? { aspectRatio: String(clamp(frameRatio ?? defaultRatio, MIN_RATIO, MAX_RATIO)) }
    : undefined;

  return (
    <div
      ref={boxRef}
      className={
        natural
          ? "relative w-full overflow-hidden"
          : "absolute inset-0 overflow-hidden"
      }
      style={rootStyle}
    >
      {contain && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl(src, 96)}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-ink/45" />
        </>
      )}

      <Image
        data-fit-main=""
        fill
        src={src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        onLoad={handleLoad}
        className={`${contain ? "object-contain" : "object-cover"} ${imageClassName}`}
        style={{ objectPosition: contain ? "50% 50%" : focal, ...imageStyle }}
      />
    </div>
  );
}