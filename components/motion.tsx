"use client";

import { useEffect } from "react";
import type { gsap as Gsap } from "gsap";

const clips = "[data-cine-clip],[data-clip]";
const reveals = "[data-cine-reveal],[data-reveal]";
const lines = "[data-cine-line]";
const easeOut = "cubic-bezier(.16,1,.3,1)";
const easeInOut = "cubic-bezier(.87,0,.13,1)";

function touchEntrances() {
  const running = new Set<Animation>();
  function animate(
    element: Element,
    frames: Keyframe[],
    duration: number,
    easing = easeOut,
    delay = 0,
  ) {
    const effect = element.animate(frames, {
      duration,
      easing,
      delay,
      fill: "backwards",
    });
    running.add(effect);
    effect.onfinish = () => running.delete(effect);
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        if (target.matches(".cine-title")) {
          target.querySelectorAll(".cine-glyph").forEach((word, index) => {
            animate(
              word,
              [
                { transform: "translateY(110%) rotate(4deg)" },
                { transform: "none" },
              ],
              1050,
              easeOut,
              index * 50,
            );
          });
        } else if (target.matches(clips)) {
          animate(
            target,
            [{ clipPath: "inset(100% 0 0)" }, { clipPath: "inset(0% 0 0)" }],
            1050,
            easeInOut,
          );
          const image = target.querySelector("img");
          if (image) animate(image, [{ scale: "1.24" }, { scale: "1" }], 1500);
        } else if (target.matches(lines)) {
          animate(target, [{ scale: "0 1" }, { scale: "1 1" }], 950, easeInOut);
        } else {
          animate(
            target,
            [
              { transform: "translateY(30px)", opacity: 0 },
              { transform: "none", opacity: 1 },
            ],
            850,
          );
        }
      }
    },
    { rootMargin: "0px 0px -5%" },
  );
  document
    .querySelectorAll(`.cine-title,${reveals},${clips},${lines}`)
    .forEach((element) => {
      if (element.getBoundingClientRect().top >= innerHeight)
        observer.observe(element);
    });
  return () => {
    observer.disconnect();
    running.forEach((effect) => effect.cancel());
  };
}

function followPointer(gsap: typeof Gsap) {
  const controller = new AbortController();
  const options = { signal: controller.signal };
  document
    .querySelectorAll<HTMLElement>(
      "[data-cine-tilt],[data-tilt],[data-cine-magnetic]",
    )
    .forEach((target) => {
      const tilt = !target.hasAttribute("data-cine-magnetic");
      const strength =
        Number(target.dataset.tilt || target.dataset.cineTilt) || 8;
      const drive = {
        duration: tilt ? 0.8 : 0.6,
        ease: tilt ? "power3.out" : "elastic.out(1,.4)",
      };
      if (tilt) gsap.set(target, { transformPerspective: 1200 });
      const horizontal = gsap.quickTo(target, tilt ? "rotationY" : "x", drive);
      const vertical = gsap.quickTo(target, tilt ? "rotationX" : "y", drive);
      function settle() {
        horizontal(0);
        vertical(0);
      }
      target.addEventListener(
        "pointermove",
        (e) => {
          if (e.pointerType === "touch") return;
          const rect = target.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          horizontal(tilt ? (strength * x) / rect.width : x * 0.35);
          vertical(tilt ? (-strength * y) / rect.height : y * 0.35);
        },
        options,
      );
      target.addEventListener("pointerleave", settle, options);
      target.addEventListener("pointercancel", settle, options);
      target.addEventListener("focusout", settle, options);
    });
  return () => controller.abort();
}

function desktopScenes(gsap: typeof Gsap) {
  document.querySelectorAll<HTMLElement>(".cine-title").forEach((title) => {
    const inHero = title.tagName === "H1";
    gsap.from(title.querySelectorAll(".cine-glyph"), {
      yPercent: 110,
      rotation: 4,
      transformOrigin: "0 100%",
      duration: 1.3,
      ease: "expo.out",
      stagger: 0.05,
      delay: inHero ? 0.25 : 0,
      clearProps: "transform,transformOrigin",
      scrollTrigger: inHero
        ? undefined
        : { trigger: title, start: "top 88%", once: true },
    });
  });
  document.querySelectorAll<HTMLElement>(reveals).forEach((el) => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1.2,
      delay: Number(el.dataset.delay || 0),
      ease: "power3.out",
      clearProps: "opacity,transform",
      scrollTrigger: el.closest(".premiere-copy")
        ? undefined
        : { trigger: el, start: "top 90%", once: true },
    });
  });
  document.querySelectorAll<HTMLElement>(clips).forEach((el) => {
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
    timeline.fromTo(
      el,
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.5,
        ease: "expo.inOut",
        clearProps: "clipPath",
      },
    );
    const image = el.querySelector("img");
    if (image)
      timeline.fromTo(
        image,
        { scale: 1.35 },
        { scale: 1, duration: 2, ease: "expo.out", clearProps: "transform" },
        0,
      );
  });
  document.querySelectorAll<HTMLElement>(lines).forEach((line) => {
    gsap.from(line, {
      scaleX: 0,
      duration: 1.6,
      ease: "expo.inOut",
      transformOrigin: "left",
      clearProps: "transform",
      scrollTrigger: { trigger: line, start: "top 92%", once: true },
    });
  });
  const frame = document.querySelector<HTMLElement>("[data-hero-parallax]");
  if (frame) {
    const hero = frame.closest("section");
    gsap.fromTo(
      frame,
      { scale: 1, borderRadius: 0 },
      {
        scale: 0.86,
        borderRadius: 24,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      },
    );
    gsap.fromTo(
      frame.querySelector("img"),
      { scale: 1.4 },
      { scale: 1.08, duration: 3, ease: "expo.out" },
    );
    gsap.to(".premiere-copy", {
      yPercent: -40,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "60% top",
        scrub: true,
      },
    });
  }
  document
    .querySelectorAll<HTMLElement>("[data-cine-parallax]")
    .forEach((plane) => {
      const amount = Number(plane.dataset.cineParallax) || 12;
      gsap.fromTo(
        plane,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: "none",
          scrollTrigger: {
            trigger: plane.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
  document
    .querySelectorAll<HTMLElement>("[data-cine-image],[data-scroll-frame]")
    .forEach((box) => {
      const image = box.matches("img") ? box : box.querySelector("img");
      if (!image || image.closest(`${clips},[data-cine-parallax]`)) return;
      gsap.fromTo(
        image,
        { scale: 1.09, yPercent: -3 },
        {
          scale: 1.09,
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: box,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
}

export function ScrollMotion() {
  useEffect(() => {
    let teardown: (() => void) | undefined;
    let generation = 0;
    const preference = matchMedia("(prefers-reduced-motion: no-preference)");
    const desktop = matchMedia("(min-width: 900px) and (pointer: fine)");
    async function synchronize() {
      const run = ++generation;
      teardown?.();
      teardown = undefined;
      if (!preference.matches) return;
      if (!desktop.matches) {
        teardown = touchEntrances();
        return;
      }
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("lenis"),
        ]);
      if (run !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      let unbind: (() => void) | undefined;
      const context = gsap.context(() => {
        desktopScenes(gsap);
        unbind = followPointer(gsap);
      });
      const smooth = new Lenis({
        duration: 1.25,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        anchors: false,
        prevent: (node) =>
          node.matches("dialog,textarea,select,[data-lenis-prevent]"),
      });
      const tick = (time: number) => smooth.raf(time * 1000);
      smooth.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      document.fonts.ready.then(() => {
        if (run === generation) ScrollTrigger.refresh();
      });
      teardown = () => {
        unbind?.();
        gsap.ticker.remove(tick);
        smooth.destroy();
        context.revert();
      };
    }
    const update = () => {
      void synchronize().catch(() => {
        teardown?.();
        teardown = undefined;
      });
    };
    update();
    desktop.addEventListener("change", update);
    preference.addEventListener("change", update);
    return () => {
      generation++;
      desktop.removeEventListener("change", update);
      preference.removeEventListener("change", update);
      teardown?.();
    };
  }, []);
  return null;
}
