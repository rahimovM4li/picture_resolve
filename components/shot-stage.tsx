"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { mountInteriorMotion } from "@/components/interior-motion";

/** Release the photographic frame slowly while typography passes in the foreground. */
export function ShotStage({
  children,
  className,
  as: Tag = "header",
}: {
  children: ReactNode;
  className: string;
  as?: "header" | "section";
}) {
  const stage = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    return mountInteriorMotion(
      node,
      "(min-width: 900px) and (min-height: 600px)",
      (gsap) => {
        const frame = node.querySelector("[data-shot-frame]");
        const picture = node.querySelector("[data-shot-photo]");
        const title = node.querySelector("[data-shot-title]");
        const exit = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: node,
            start: "top top",
            end: "bottom 12%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        if (frame)
          exit.to(
            frame,
            { scale: 0.91, yPercent: 7, transformOrigin: "70% 56%" },
            0,
          );
        if (picture)
          exit.fromTo(
            picture,
            { scale: 1.055, yPercent: -1.5 },
            { scale: 1.15, yPercent: 2.5 },
            0,
          );
        if (title)
          exit.to(title, { y: () => -Math.min(48, innerHeight * 0.055) }, 0);
      },
    );
  }, []);
  return (
    <Tag ref={stage} className={className}>
      {children}
    </Tag>
  );
}
