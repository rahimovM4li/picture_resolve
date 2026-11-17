"use client";
import { createContext, useContext, type CSSProperties } from "react";

export type ImageInfo = {
  width: number;
  height: number;
  preview: string;
  focusX: number;
  focusY: number;
};
export const ImageRegistry = createContext<Record<string, ImageInfo>>({});
export function ImageProvider({
  sizes,
  children,
}: {
  sizes: Record<string, ImageInfo>;
  children: React.ReactNode;
}) {
  return (
    <ImageRegistry.Provider value={sizes}>{children}</ImageRegistry.Provider>
  );
}
export function UploadedImage({
  src,
  alt,
  sizes,
  priority,
  portrait,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority: boolean;
  portrait: boolean;
  className?: string;
}) {
  const info = useContext(ImageRegistry)[src];
  const base = src.slice(0, src.lastIndexOf("/") + 1);
  const widths = [400, 800].filter((w) => info && w < info.width);
  const srcSet = [
    ...widths.map((w) => `${base}image-${w}.webp ${w}w`),
    info && `${src} ${info.width}w`,
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <picture style={{ display: "contents" }}>
      {portrait && (
        <source
          media="(max-width:600px) and (orientation:portrait)"
          srcSet={`${base}portrait-400.webp 400w, ${base}portrait-800.webp 800w`}
          sizes="100vw"
        />
      )}
      <img
        className={["frame-photo", className].filter(Boolean).join(" ")}
        src={src}
        srcSet={srcSet || undefined}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        width={info?.width}
        height={info?.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        style={
          info &&
          ({
            "--frame-preview": `url("data:image/webp;base64,${info.preview}")`,
            objectPosition: `${info.focusX}% ${info.focusY}%`,
          } as CSSProperties)
        }
      />
    </picture>
  );
}
