"use client";

import { useEffect, useRef, type ReactNode } from "react";

const sceneViewport =
  "(min-width: 768px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)";

export function HomeEditorialMotion({ children }: { children: ReactNode }) {
  const section = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const viewport = window.matchMedia(sceneViewport);
    let revision = 0;
    let dispose: (() => void) | undefined;

    async function synchronize() {
      const current = ++revision;
      dispose?.();
      dispose = undefined;
      if (!root || !viewport.matches) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (current !== revision) return;
      gsap.registerPlugin(ScrollTrigger);

      const gallery = root.querySelector<HTMLElement>(".home-works")!;
      const track = gallery.querySelector<HTMLElement>(
        "[data-portfolio-track]",
      )!;
      const process = root.querySelector<HTMLElement>(".home-process")!;
      const stages = Array.from(
        process.querySelectorAll<HTMLElement>(".home-process-list li"),
      );
      const copies = stages.map((stage) =>
        stage.querySelector<HTMLElement>(".home-stage-copy")!,
      );
      const layers = stages.map((stage) =>
        stage.querySelector<HTMLElement>(".home-stage-frame")!,
      );
      const bar = process.querySelector(".home-process-progress > span");
      gallery.dataset.portfolioPin = "";
      process.dataset.processPin = "";
      let scrollFocusedProject: ((event: FocusEvent) => void) | undefined;

      const context = gsap.context(() => {
        const paragraph = root.querySelector<HTMLElement>(".home-manifesto")!;
        gsap.fromTo(
          paragraph.children,
          { opacity: 0.46 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: paragraph,
              start: "top 75%",
              end: "bottom 45%",
              scrub: true,
            },
          },
        );

        const distance = () =>
          Math.max(0, track.scrollWidth - gallery.clientWidth);
        const pan = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: gallery,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gallery
          .querySelectorAll<HTMLElement>(".home-film-image")
          .forEach((frame) => {
            gsap.fromTo(
              frame.querySelector("img"),
              { xPercent: -10.5 },
              {
                xPercent: 10.5,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  containerAnimation: pan,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          });
        scrollFocusedProject = (event) => {
          const link = event.target;
          const trigger = pan.scrollTrigger;
          if (
            !(link instanceof HTMLAnchorElement) ||
            !link.matches(":focus-visible") ||
            !trigger
          )
            return;
          const rect = link.getBoundingClientRect();
          if (rect.left >= 0 && rect.right <= gallery.clientWidth) return;
          const x =
            rect.left -
            track.getBoundingClientRect().left -
            (gallery.clientWidth - rect.width) / 2;
          const progress = gsap.utils.clamp(0, 1, x / Math.max(distance(), 1));
          window.scrollTo({
            top: trigger.start + progress * (trigger.end - trigger.start),
            behavior: "instant",
          });
          ScrollTrigger.update();
          trigger.getTween()?.progress(1);
        };
        gallery.addEventListener("focusin", scrollFocusedProject);

        const markStage = (index: number) => {
          stages.forEach((stage, i) =>
            stage.toggleAttribute("data-active", index === i),
          );
        };
        markStage(0);
        gsap.set(copies.slice(1), { opacity: 0, y: 40 });
        gsap.set(layers.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(bar, { scaleY: 1 / stages.length });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: process,
            start: "top top",
            end: () => "+=" + Math.round(innerHeight * stages.length * 0.9),
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          onUpdate() {
            markStage(Math.round(this.progress() * (stages.length - 1)));
          },
        });
        for (let i = 1; i < stages.length; i++) {
          timeline
            .to(
              layers[i],
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1,
                ease: "power2.inOut",
              },
              i - 1,
            )
            .fromTo(
              layers[i].querySelector("img"),
              { scale: 1.3 },
              { scale: 1, duration: 1, ease: "power2.out" },
              i - 1,
            )
            .to(copies[i - 1], { opacity: 0, y: -40, duration: 0.4 }, i - 1)
            .to(copies[i], { opacity: 1, y: 0, duration: 0.4 }, i - 0.6)
            .to(
              bar,
              { scaleY: (i + 1) / stages.length, duration: 1, ease: "none" },
              i - 1,
            );
        }
      }, root);
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      dispose = () => {
        if (scrollFocusedProject)
          gallery.removeEventListener("focusin", scrollFocusedProject);
        context.revert();
        delete gallery.dataset.portfolioPin;
        delete process.dataset.processPin;
        stages.forEach((stage) => stage.removeAttribute("data-active"));
        ScrollTrigger.refresh();
      };
    }

    const update = () => {
      void synchronize();
    };
    update();
    viewport.addEventListener("change", update);
    return () => {
      revision++;
      viewport.removeEventListener("change", update);
      dispose?.();
    };
  }, []);
  return (
    <div className="home-editorial" ref={section}>
      {children}
    </div>
  );
}
