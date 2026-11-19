"use client";

import { useEffect } from "react";
import { playCameraShot, prepareCamera } from "./camera-shot";

const cameraCta = 'a[href][data-cta="inquiry"]';

/** Give a normal same-tab link one shutter beat before its full-page navigation. */
export function CtaTransition() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelShot: (() => void) | undefined;
    let destination: string | undefined;

    function clear() {
      cancelShot?.();
      cancelShot = undefined;
      destination = undefined;
    }

    function activate(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      )
        return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) {
        if (destination && event.target.closest("button")) clear();
        return;
      }
      if (
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self")
      )
        return;
      if (destination === link.href && link.matches(cameraCta)) {
        event.preventDefault();
        return;
      }
      clear();
      if (
        !link.matches(cameraCta) ||
        link.origin !== location.origin ||
        !/^https?:$/.test(link.protocol)
      )
        return;

      const dialog = link.closest<HTMLDialogElement>("dialog[open]");
      const staysOnPage = link.hash && link.pathname === location.pathname && link.search === location.search;
      if (reduced.matches) {
        if (staysOnPage) dialog?.close();
        return;
      }
      const bounds = link.getBoundingClientRect();
      const x = event.detail ? event.clientX : bounds.left + bounds.width / 2;
      const y = event.detail ? event.clientY : bounds.top + bounds.height / 2;
      const href = link.href;
      event.preventDefault();
      destination = href;
      cancelShot = playCameraShot(
        dialog ?? document.body,
        { x, y },
        () => {
          destination = undefined;
          if (staysOnPage) dialog?.close();
          window.location.assign(href);
        },
      );
    }

    function prepare(event: Event) {
      if (
        !reduced.matches &&
        event.target instanceof Element &&
        event.target.closest(cameraCta)
      )
        prepareCamera();
    }
    document.addEventListener("pointerover", prepare, { passive: true });
    document.addEventListener("pointerdown", prepare, { passive: true });
    document.addEventListener("focusin", prepare);
    document.addEventListener("click", activate);
    window.addEventListener("pagehide", clear);
    return () => {
      clear();
      document.removeEventListener("pointerover", prepare);
      document.removeEventListener("pointerdown", prepare);
      document.removeEventListener("focusin", prepare);
      document.removeEventListener("click", activate);
      window.removeEventListener("pagehide", clear);
    };
  }, []);
  return null;
}
