import type { gsap as Gsap } from "gsap";

/** Load the scroll engine only when a desktop sequence can actually run. */
export function mountInteriorMotion(
  scope: HTMLElement,
  breakpoint: string,
  build: (gsap: typeof Gsap) => void | (() => void),
) {
  const media = window.matchMedia(
    breakpoint +
      " and (hover: hover) and (prefers-reduced-motion: no-preference)",
  );
  let generation = 0;
  let cleanup: (() => void) | undefined;
  async function sync() {
    const revision = ++generation;
    cleanup?.();
    cleanup = undefined;
    if (!media.matches) return;
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);
    if (revision !== generation || !media.matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => build(gsap), scope);
    cleanup = () => ctx.revert();
  }
  void sync();
  media.addEventListener("change", sync);
  return () => {
    ++generation;
    media.removeEventListener("change", sync);
    cleanup?.();
  };
}
