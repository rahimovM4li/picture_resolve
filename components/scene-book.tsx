"use client";

import { mountInteriorMotion } from "@/components/interior-motion";
import { useEffect, useRef, type CSSProperties } from "react";
import { Frame } from "@/components/ui";
import "@/app/scene-book.css";

export interface Scene {
  title: string;
  copy?: string;
  image: { src: string; alt: string; caption?: string };
}

// The complete sequence is in reading order before the optional desktop wipes load.
export function SceneBook({ scenes }: { scenes: Scene[] }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    return mountInteriorMotion(
      element,
      "(min-width: 900px) and (min-height: 600px)",
      (gsap) => {
        element.dataset.sequence = "";
        const rows = Array.from(element.querySelectorAll("figure"));
        rows.slice(1).forEach((row, offset) => {
          const frame = row.querySelector(".scene-frame");
          const progress = row.querySelector(".scene-rule b");
          const outgoing = rows[offset].querySelector(".scene-optics");
          const incoming = row.querySelector(".scene-optics");
          const sequence = gsap.timeline({
            scrollTrigger: {
              trigger: row.querySelector("figcaption"),
              start: "top 67%",
              end: "top 25%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          sequence
            .fromTo(
              frame,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", ease: "power1.inOut" },
              0,
            )
            .fromTo(
              incoming,
              { scale: 1.16, yPercent: -5 },
              { scale: 1.02, yPercent: 0, ease: "power1.out" },
              0,
            )
            .to(outgoing, { scale: 1.11, yPercent: 3.5, ease: "sine.inOut" }, 0)
            .fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
        });
        return () => {
          delete element.dataset.sequence;
        };
      },
    );
  }, [scenes]);
  return (
    <div
      className="scene-book"
      ref={root}
      style={{ "--scene-count": scenes.length } as CSSProperties}
    >
      {scenes.map((scene, index) => (
        <figure
          key={scene.title}
          style={{ "--scene-row": index + 1 } as CSSProperties}
        >
          <div className="scene-frame">
            <div className="scene-optics">
              <Frame
                src={scene.image.src}
                alt={scene.image.alt}
                sizes="(min-width: 900px) 61vw, 96vw"
              />
            </div>
            {scene.image.caption && scene.image.caption !== scene.title && (
              <span className="scene-credit">{scene.image.caption}</span>
            )}
          </div>
          <figcaption>
            <div className="scene-caption">
              <div className="scene-rule" aria-hidden="true">
                <b />
              </div>
              <span className="scene-count" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}{" "}
                <small>/ {String(scenes.length).padStart(2, "0")}</small>
              </span>
              <h3>{scene.title}</h3>
              {scene.copy && <p>{scene.copy}</p>}
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
