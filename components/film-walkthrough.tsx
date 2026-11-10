"use client";

import { useEffect, useRef } from "react";
import SiteLink from "@/components/site-link";
import { Arrow, Frame } from "@/components/ui";
import { filmWalkthrough } from "@/content/film-walkthrough";
import "@/app/walkthrough.css";

const desktopMotion =
  "(min-width: 900px) and (min-height: 540px) and (prefers-reduced-motion: no-preference)";

export function FilmWalkthrough() {
  const sequenceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sequence = sequenceRef.current;
    if (!sequence) return;

    const media = window.matchMedia(desktopMotion);
    let generation = 0;
    let revert: (() => void) | undefined;

    async function synchronize() {
      const current = ++generation;
      revert?.();
      revert = undefined;
      if (!sequence || !media.matches) return;

      // The static film strip is usable while the optional motion code loads.
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (current !== generation || !media.matches) return;
      gsap.registerPlugin(ScrollTrigger);

      const chapters = Array.from(
        sequence.querySelectorAll<HTMLElement>("figure"),
      );
      const frames = Array.from(
        sequence.querySelectorAll<HTMLElement>(".walk-frame"),
      );
      const captions = Array.from(
        sequence.querySelectorAll<HTMLElement>("figcaption"),
      );
      const progress: number[] = chapters.map((_, index) =>
        index === 0 ? 1 : 0,
      );
      let active = -1;

      function markScene() {
        let index = 0;
        progress.forEach((value, candidate) => {
          if (value >= 0.5) index = candidate;
        });
        if (index === active) return;
        active = index;
        chapters.forEach((chapter, candidate) =>
          chapter.toggleAttribute("data-current", candidate === active),
        );
      }

      sequence.dataset.enhanced = "";
      const context = gsap.context(() => {
        frames.slice(1).forEach((frame, offset) => {
          const index = offset + 1;
          gsap.fromTo(
            frame,
            { opacity: 0 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: captions[index],
                start: () => {
                  const stickyTop = parseFloat(getComputedStyle(frames[0]).top);
                  const middle = stickyTop + frames[0].offsetHeight * 0.58;
                  return `top ${Math.round(middle)}px`;
                },
                end: () => `+=${Math.round(Math.min(108, innerHeight * 0.12))}`,
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate(trigger) {
                  progress[index] = trigger.progress;
                  markScene();
                },
                onRefresh(trigger) {
                  progress[index] = trigger.progress;
                  markScene();
                },
              },
            },
          );
        });
      }, sequence);
      markScene();
      // Activating the two-column layout changes downstream trigger positions.
      ScrollTrigger.refresh();

      revert = () => {
        context.revert();
        delete sequence.dataset.enhanced;
        chapters.forEach((chapter) => chapter.removeAttribute("data-current"));
        ScrollTrigger.refresh();
      };
    }

    const update = () => {
      void synchronize().catch(() => {
        delete sequence.dataset.enhanced;
      });
    };
    update();
    media.addEventListener("change", update);
    return () => {
      generation++;
      media.removeEventListener("change", update);
      revert?.();
    };
  }, []);

  return (
    <section className="film-walk" aria-labelledby="walk-title">
      <div className="wrap">
        <header className="walk-heading">
          <div>
            <p className="eyebrow">
              <i aria-hidden="true" />
              {filmWalkthrough.title}
            </p>
            <h2 id="walk-title">
              Eine Nacht in <em>drei Einstellungen.</em>
            </h2>
          </div>
          <SiteLink className="line-link" href={filmWalkthrough.href}>
            Zum ganzen Film <Arrow diagonal />
          </SiteLink>
        </header>
        <div className="walk-sequence" ref={sequenceRef}>
          {filmWalkthrough.scenes.map((scene) => (
            <figure key={scene.seconds}>
              <div className="walk-frame">
                <Frame
                  src={scene.image}
                  alt={scene.alt}
                  sizes="(min-width: 900px) 59vw, (min-width: 700px) 35vw, 92vw"
                />
                <span className="walk-stage-clock" aria-hidden="true">
                  {scene.timecode} <span>/ {filmWalkthrough.duration}</span>
                </span>
              </div>
              <figcaption>
                <time dateTime={`PT${scene.seconds}S`}>
                  {scene.timecode} Min.
                </time>
                <h3>{scene.heading}</h3>
                <p>{scene.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
