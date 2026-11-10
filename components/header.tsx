"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { site } from "@/content/site";
import Link from "@/components/site-link";
import { Arrow } from "@/components/ui";
import "@/app/navigation.css";

const menuItems = [...site.navigation, { href: "/kontakt/", label: "Kontakt" }];

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      className="pr-brand"
      href="/"
      aria-label="Picture Resolve – Startseite"
      onClick={onClick}
    >
      <Image
        src="/assets/brand/signatur-navigation.webp"
        width={500}
        height={209}
        alt=""
        unoptimized
        priority
      />
    </Link>
  );
}

function Inquiry({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/kontakt/" className="pr-header-inquiry" onClick={onClick}>
      Projekt anfragen <Arrow diagonal />
    </Link>
  );
}

function IconLines() {
  return (
    <>
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </>
  );
}

export function Header() {
  const path = usePathname().replace(/\/$/, "") || "/";
  const photoHero =
    path === "/" ||
    path === "/ueber-uns" ||
      path === "/projekte" ||
      path === "/kontakt" ||
    path.startsWith("/leistungen/") ||
    path.startsWith("/standorte/");
  const header = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const breakpoint = window.matchMedia("(min-width: 1024px)");
    const panel = dialog.current;
    const updateSize = () => {
      if (breakpoint.matches) panel?.close();
    };
    const updateScroll = () =>
      header.current?.toggleAttribute("data-compact", window.scrollY > 40);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    breakpoint.addEventListener("change", updateSize);
    return () => {
      window.removeEventListener("scroll", updateScroll);
      breakpoint.removeEventListener("change", updateSize);
    };
  }, []);

  function show() {
    const panel = dialog.current;
    if (!panel || panel.open) return;
    panel.showModal();
    setOpen(true);
    panel.querySelector<HTMLElement>("nav a")?.focus({ preventScroll: true });
  }
  function close() {
    dialog.current?.close();
  }
  function restoreFocus() {
    setOpen(false);
    if (window.matchMedia("(min-width: 1024px)").matches) {
      header.current
        ?.querySelector<HTMLElement>(".pr-links a")
        ?.focus({ preventScroll: true });
    } else {
      opener.current?.focus({ preventScroll: true });
    }
  }
  function keepFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const stops = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("a[href], button"),
    ).filter((el) => el.getClientRects().length > 0);
    const destination =
      event.shiftKey && document.activeElement === stops[0]
        ? stops.at(-1)
        : !event.shiftKey && document.activeElement === stops.at(-1)
          ? stops[0]
          : undefined;
    if (destination) {
      event.preventDefault();
      destination.focus();
    }
  }
  function current(href: string) {
    const route = href.replace(/\/$/, "");
    if (path === route) return "page";
    if (path.startsWith(route + "/")) return "location";
  }

  return (
    <>
      {!photoHero && <div className="pr-header-space" aria-hidden="true" />}
      <header
        ref={header}
        className="pr-header"
        data-overlay={photoHero ? (path === "/" ? "home" : "photo") : undefined}
        aria-hidden={open || undefined}
      >
        <div className="pr-header-inner">
          <Brand />
          <nav className="pr-links" aria-label="Hauptnavigation">
            {site.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pr-header-actions">
            <Inquiry />
            <button
              ref={opener}
              type="button"
              className="pr-menu-control"
              aria-haspopup="dialog"
              aria-controls="pr-menu"
              aria-expanded={open}
              aria-label="Menü öffnen"
              onClick={show}
            >
              <IconLines />
            </button>
            <noscript>
              <style>{".pr-menu-control{display:none!important}"}</style>
              <details className="pr-nav-fallback">
                <summary>Menü</summary>
                <nav aria-label="Hauptnavigation">
                  {menuItems.map((item) => (
                    <Link href={item.href} key={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </details>
            </noscript>
          </div>
        </div>
      </header>
      <dialog
        ref={dialog}
        id="pr-menu"
        className="pr-menu"
        aria-label="Menü"
        data-lenis-prevent
        onClose={restoreFocus}
        onKeyDown={keepFocus}
      >
        <div className="pr-menu-layout">
          <div className="pr-header-inner pr-menu-top">
            <Brand onClick={close} />
            <div className="pr-header-actions">
              <Inquiry onClick={close} />
              <button
                type="button"
                className="pr-menu-control"
                aria-label="Menü schließen"
                aria-controls="pr-menu"
                aria-expanded="true"
                onClick={close}
              >
                <IconLines />
              </button>
            </div>
          </div>
          <div className="pr-menu-body">
            <nav className="pr-menu-links" aria-label="Hauptnavigation">
              {menuItems.map((item, i) => (
                <div className="pr-menu-mask" key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current(item.href)}
                    onClick={close}
                  >
                    <span aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
            <p className="pr-menu-locality">Filmproduktion · Düsseldorf</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
