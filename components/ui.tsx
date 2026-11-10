import { CineTitle } from "./cine-title";
import Link from "@/components/site-link";
import { mediaSizes } from "@/content/asset-sizes";
import type { ReactNode } from "react";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {diagonal ? (
        <path d="M5 19 19 5M6 5h13v13" />
      ) : (
        <path d="M3 12h17m-7-7 7 7-7 7" />
      )}
    </svg>
  );
}
export function Play() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="13"
      height="13"
      fill="currentColor"
    >
      <path d="M3 1.8 14 8 3 14.2z" />
    </svg>
  );
}
export function Frame({
  src,
  alt,
  className,
  sizes = "(max-width: 760px) 100vw, 60vw",
  priority = false,
  portraitCover = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  portraitCover?: boolean;
}) {
  const image = mediaSizes[src];
  const stem = src.replace(/\.webp$/, "");
  const srcSet = image?.widths.map(width => {
    const url = width === image.width ? src : `${stem}-${width}.webp`;
    return `${url} ${width}w`;
  }).join(", ");
  const photo = (
    // eslint-disable-next-line @next/next/no-img-element -- Native sources are pre-encoded for static hosting.
    <img
      width={image?.width}
      height={image?.height}
      className={className}
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
  if (!portraitCover || !image?.portrait) return photo;
  return (
    <picture style={{ display: "contents" }}>
      {image.portraitAvif && (
        <source
          type="image/avif"
          media="(max-width: 600px) and (orientation: portrait)"
          sizes="max(100vw, 60svh)"
          srcSet={image.portraitAvif.map(width => `${stem}-portrait-${width}.avif ${width}w`).join(", ")}
        />
      )}
      <source
        media="(max-width: 600px) and (orientation: portrait)"
        sizes="max(100vw, 60svh)"
        srcSet={image.portrait.map(width => `${stem}-portrait-${width}.webp ${width}w`).join(", ")}
      />
      {photo}
    </picture>
  );
}
export function InquiryLink({
  children = "Projekt anfragen",
}: {
  children?: ReactNode;
}) {
  return (
    <Link className="button solid" href="/kontakt/" data-cine-magnetic>
      {children}
      <Arrow diagonal />
    </Link>
  );
}
export function ContactBand() {
  return (
    <section className="contact-band">
      <div className="wrap contact-inside">
        <div>
          <p className="eyebrow">
            <i />
            Kontakt
          </p>
          <CineTitle
            as="h2"
            lead="Wann dürfen wir Ihre Geschichte"
            accent="erzählen?"
          />
        </div>
        <InquiryLink />
      </div>
    </section>
  );
}

