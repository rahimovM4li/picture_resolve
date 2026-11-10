import { ShotStage } from "@/components/shot-stage";
import type { ReactNode } from "react";
import { CineTitle } from "@/components/cine-title";
import { Frame } from "@/components/ui";

interface StoryCoverProps {
  title: readonly [string, string];
  label: string;
  description: string;
  image: string;
  alt: string;
  caption: string;
  subject: "imagefilme" | "recruitingfilme" | "studio" | "region";
  chapter: string;
  children: ReactNode;
}

export function StoryCover({
  title,
  label,
  description,
  image,
  alt,
  caption,
  subject,
  chapter,
  children,
}: StoryCoverProps) {
  return (
    <ShotStage className={`sub-cover sub-cover--${subject}`}>
      <div className="sub-cover-image" data-shot-frame>
        <div className="sub-parallax-plane" data-shot-photo>
          <Frame
            src={image}
            alt={alt}
            sizes={
              subject === "studio"
                ? "max(100vw, 150svh)"
                : "(max-width: 600px) max(100vw, 110svh), (min-width: 900px) 68vw, 100vw"
            }
            portraitCover
            priority
          />
        </div>
      </div>
      <div className="sub-cover-shade" />
      <div className="wrap sub-cover-inner">
        <div className="sub-cover-copy">
          <p className="sub-label">
            <i aria-hidden="true" />
            {label}
          </p>
          <div data-shot-title>
            <CineTitle
              lead={title[0]}
              accent={title[1]}
              as="h1"
              className="sub-hero-title"
            />
          </div>
          <p className="sub-intro">{description}</p>
          {children}
        </div>
        <div className="sub-cover-foot">
          <i className="sub-rule" data-cine-line aria-hidden="true" />
          <span>{caption}</span>
          <a href="#einblick">
            {chapter}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </ShotStage>
  );
}
