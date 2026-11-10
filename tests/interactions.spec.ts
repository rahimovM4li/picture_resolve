import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("skip link and direct desktop service links work with the keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Zum Inhalt" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  const navigation = page.getByRole("navigation", { name: "Hauptnavigation" });
  const imagefilm = navigation.getByRole("link", { name: "Imagefilme", exact: true });
  await imagefilm.focus();
  await expect(imagefilm).toBeFocused();
  await page.keyboard.press("Tab");
  const recruiting = navigation.getByRole("link", { name: "Recruitingfilme", exact: true });
  await expect(recruiting).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/leistungen\/recruitingfilme\/?$/);
});

test("fullscreen mobile menu confines keyboard focus, closes and opens the chosen service", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Menü öffnen" });
  const menu = page.getByRole("dialog", { name: "Menü", exact: true });
  const links = menu.getByRole("navigation").getByRole("link");
  await opener.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toBeVisible();
  await expect(links).toHaveText([/Imagefilme/, /Recruitingfilme/, /Projekte/, /Über uns/, /Kontakt/]);
  await expect(links.first()).toBeFocused();
  await expect(menu.getByRole("link", { name: "Projekt anfragen" })).toBeHidden();
  expect(await menu.boundingBox()).toEqual({ x: 0, y: 0, width: 390, height: 844 });
  await links.last().focus();
  await page.keyboard.press("Tab");
  await expect(menu.getByRole("link", { name: /Startseite/ })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(links.last()).toBeFocused();
  const menuAudit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(menuAudit.violations.map((issue) => ({ id: issue.id, targets: issue.nodes.map((node) => node.target) }))).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(opener).toBeFocused();
  await opener.click();
  await menu.getByRole("link", { name: "Recruitingfilme", exact: true }).click();
  await expect(page).toHaveURL(/\/leistungen\/recruitingfilme\/?$/);
  await expect(menu).toBeHidden();
});

test("a phone can tap the last menu row before its staggered title appears", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Menü öffnen" }).click();
  const menu = page.getByRole("dialog", { name: "Menü" });
  await menu.evaluate((dialog) => {
    for (const effect of dialog.getAnimations({ subtree: true })) {
      effect.pause();
      effect.currentTime = 0;
    }
  });
  // Use the row's resting position, as a visitor tapping during the reveal would.
  const row = await menu.locator(".pr-menu-mask").last().boundingBox();
  await page.mouse.click(row!.x + 70, row!.y + row!.height / 2);
  await expect(page).toHaveURL(/\/kontakt\/$/);
});

test("header compacts on scroll and switches from tablet menu to desktop service links", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  const header = page.getByRole("banner");
  const menu = page.getByRole("dialog", { name: "Menü" });
  await expect(header.getByRole("link", { name: "Projekt anfragen" })).toBeVisible();
  await expect(header.getByRole("navigation")).toBeHidden();
  const fullHeight = (await header.boundingBox())!.height;
  await page.evaluate(() => scrollTo({ top: 130, behavior: "instant" }));
  await expect(header).toHaveAttribute("data-compact", "");
  await expect.poll(async () => (await header.boundingBox())!.height).toBeLessThan(fullHeight - 10);
  await header.getByRole("button", { name: "Menü öffnen" }).click();
  await expect(menu).toBeVisible();
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(menu).toBeHidden();
  await expect(header.getByRole("link", { name: "Imagefilme" })).toBeFocused();
  await expect(header.getByRole("button", { name: "Menü öffnen" })).toBeHidden();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect(header).not.toHaveAttribute("data-compact", "");
});

test("portfolio filters expose matching project links and restore the full archive", async ({ page }) => {
  await page.goto("/projekte/");
  const gallery = page.getByRole("region", { name: "Projektarchiv" });
  const visibleProjects = gallery.locator("article:visible a");
  await expect(visibleProjects).toHaveCount(5);
  await gallery.getByText("Film", { exact: true }).first().click();
  await expect(gallery.getByRole("radio", { name: "Film", exact: true })).toBeChecked();
  await expect(visibleProjects).toHaveCount(1);
  await expect(visibleProjects).toHaveAttribute("href", "/projekte/kamerastudie/");
  await gallery.locator("label").filter({ hasText: "Fotografie" }).click();
  await expect(visibleProjects).toHaveCount(4);
  await gallery.locator("label").filter({ hasText: "Alle" }).click();
  await expect(visibleProjects).toHaveCount(5);
});

test("camera study exposes a playable local film and HOPP is a still-image project", async ({ page }) => {
  const earlyMedia: string[] = [];
  page.on("request", (request) => {
    if (/\.mp4(?:\?|$)/i.test(request.url())) earlyMedia.push(request.url());
  });
  await page.goto("/projekte/hopp/");
  await expect(page.getByRole("main").locator("img").first()).toBeVisible();
  await expect(page.getByRole("main").locator("video")).toHaveCount(0);
  await page.goto("/projekte/kamerastudie/");
  expect(earlyMedia).toEqual([]);
  const video = page.locator("main video");
  if (!(await video.count())) {
    await page.getByRole("button", { name: /Film (abspielen|ansehen|starten)|Wiedergabe/i }).first().click();
  }
  await expect(video).toHaveAttribute("controls", /.*/);
  await video.evaluate(async (element: HTMLVideoElement) => {
    element.muted = true;
    await element.play();
  });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  expect(await video.evaluate((element: HTMLVideoElement) => element.duration)).toBeGreaterThan(140);
});

test("Raman hero opens the studio film and restores keyboard focus", async ({ page }) => {
  const requestedFilms: string[] = [];
  page.on("request", (request) => {
    if (/\.mp4(?:\?|$)/i.test(request.url())) requestedFilms.push(request.url());
  });
  await page.goto("/", { waitUntil: "networkidle" });
  expect(requestedFilms).toEqual([]);
  const title = page.getByRole("heading", { level: 1 });
  await expect(title).toHaveAccessibleName(/Jede Geschichte ist einzigartig/i);
  const hero = title.locator("xpath=ancestor::section[1]");
  const cover = hero.getByRole("img").first();
  await expect(cover).toBeVisible();
  await expect(cover).toHaveAttribute("src", /raman-kamera/);
  const film = hero.getByRole("button", { name: /Film ansehen|Studiofilm ansehen|Showreel ansehen/i });
  await film.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Kamerastudie bei Nacht" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Film schließen" })).toBeFocused();
  const player = dialog.locator("video");
  await expect(player).toBeVisible();
  await expect.poll(() => player.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0);
  expect(await player.evaluate((video: HTMLVideoElement) => video.currentSrc)).toMatch(/\/studiofilm\.mp4$/);
  expect(requestedFilms.every((url) => !url.includes("-720.mp4"))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(film).toBeFocused();
});

test("native pause, resume and repeat control the reel without losing the film position", async ({ page }) => {
  await page.goto("/projekte/kamerastudie/");
  const start = page.getByRole("button", { name: /Film abspielen/i });
  await start.click();
  const dialog = page.getByRole("dialog", { name: "Kamerastudie bei Nacht" });
  const video = dialog.locator("video");
  const reel = dialog.locator(".film-reel-rotor").first();
  const repeat = dialog.getByRole("button", { name: "Film wiederholen" });
  await expect(dialog).toHaveAttribute("data-playback", "playing");
  await expect(video).toHaveAttribute("controls", /.*/);
  await expect(video.locator("track[kind='captions']")).toHaveAttribute("srclang", "de");
  await expect(repeat).toHaveAttribute("aria-pressed", "false");
  await expect(video).toHaveJSProperty("loop", false);
  const rotation = () => reel.evaluate((node) => getComputedStyle(node).transform);
  const initialRotation = await rotation();
  await expect.poll(rotation).not.toBe(initialRotation);
  const timecode = dialog.locator(".film-time span");
  await expect(timecode).not.toHaveText("00:00");
  await video.focus();
  await page.keyboard.press("Space");
  await expect(dialog).toHaveAttribute("data-playback", "paused");
  const pausedTime = await video.evaluate((node: HTMLVideoElement) => node.currentTime);
  const pausedRotation = await rotation();
  const pausedTimecode = await timecode.textContent();
  await repeat.click();
  await expect(repeat).toHaveAttribute("aria-pressed", "true");
  await expect(video).toHaveJSProperty("loop", true);
  await repeat.click();
  await expect(video).toHaveJSProperty("loop", false);
  expect(await rotation()).toBe(pausedRotation);
  await expect(timecode).toHaveText(pausedTimecode!);
  expect(await video.evaluate((node: HTMLVideoElement) => node.currentTime)).toBe(pausedTime);
  await video.focus();
  await page.keyboard.press("Space");
  await expect(dialog).toHaveAttribute("data-playback", "playing");
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeGreaterThan(pausedTime + 0.1);
  await expect.poll(rotation).not.toBe(pausedRotation);
  await video.evaluate((node: HTMLVideoElement) => { node.currentTime = node.duration - 0.25; });
  await expect(dialog).toHaveAttribute("data-playback", "ended");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
  await expect(start).toBeFocused();
});

test("reduced motion keeps the screen and reel still while the requested film plays", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: /Film ansehen/ }).click();
  const dialog = page.getByRole("dialog", { name: "Kamerastudie bei Nacht" });
  const rotor = dialog.locator(".film-reel-rotor").first();
  const video = dialog.locator("video");
  await expect(dialog).toHaveAttribute("data-playback", "playing");
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeGreaterThan(0.2);
  await expect(rotor).toHaveCSS("animation-name", "none");
  expect(await dialog.locator(".film-screen").evaluate((screen) =>
    ["::before", "::after"].map((pseudo) => getComputedStyle(screen, pseudo).animationName)
  )).toEqual(["none", "none"]);
  const audit = await new AxeBuilder({ page }).include(".film-dialog[open]")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
});

test("phone chooses the compact film, plays it, and preserves the close action", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const start = page.getByRole("button", { name: /Film ansehen/ });
  await start.click();
  const dialog = page.getByRole("dialog", { name: "Kamerastudie bei Nacht" });
  const player = dialog.locator("video");
  await expect.poll(() => player.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0);
  expect(await player.evaluate((video: HTMLVideoElement) => video.currentSrc)).toMatch(/\/studiofilm-720\.mp4$/);
  await dialog.getByRole("button", { name: "Film schließen" }).click();
  await expect(start).toBeFocused();
});

test("scroll changes the desktop crop and reduced motion restores a static frame", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const canvas = page.locator("[data-hero-parallax]");
  await expect.poll(() => canvas.evaluate((node) => (node as HTMLElement).style.transform)).not.toBe("");
  const top = await canvas.evaluate((node) => getComputedStyle(node).transform);
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
  await expect.poll(() => canvas.evaluate((node) => getComputedStyle(node).transform)).not.toBe(top);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => canvas.evaluate((node) => (node as HTMLElement).style.transform)).toBe("");
  const at400 = await canvas.evaluate((node) => getComputedStyle(node).transform);
  await page.evaluate(() => window.scrollTo({ top: 700, behavior: "instant" }));
  expect(await canvas.evaluate((node) => getComputedStyle(node).transform)).toBe(at400);
  await expect(page.locator("main a[href='/projekte/']").first()).toBeVisible();
});

test("service inquiry validates fields, previews locally and preserves edits", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/leistungen/recruitingfilme/");
  const destination = page.locator('main a[href*="leistung=recruitingfilme"]').first();
  await destination.click();
  await expect(page).toHaveURL(/kontakt.*leistung=recruitingfilme/);
  await expect(page.getByText(/Demo-Modus/)).toBeVisible();
  const form = page.getByRole("form", { name: "Projektanfrage vorbereiten" });
  const service = form.getByRole("radio", { name: "Recruitingfilm", exact: true });
  await expect(service).toBeChecked();
  const submit = form.getByRole("button", { name: "Anfrage als Vorschau öffnen" });
  await submit.click();
  const name = form.getByRole("textbox", { name: "Name", exact: true });
  const email = form.getByRole("textbox", { name: "E-Mail", exact: true });
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await name.fill("QA Muster");
  await email.fill("fehlerhaft");
  await submit.click();
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute("aria-invalid", "true");

  await email.fill("qa@example.test");
  await form.getByRole("textbox", { name: /Unternehmen/ }).fill("Beispiel GmbH");
  await form.getByRole("textbox", { name: "Projektbeschreibung" }).fill("Wir möchten unsere Ausbildungswerkstatt für Bewerbende zeigen.");
  await form.getByRole("checkbox").check();
  const posts: string[] = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD"].includes(request.method()) || request.url().includes("qa%40example")) {
      posts.push(request.url());
    }
  });
  await submit.click();
  const preview = page.getByRole("heading", { name: "Ihre Anfrage im Überblick" });
  await expect(preview).toBeFocused();
  await expect(page.getByText(/Es wurde keine Anfrage versendet/)).toBeVisible();
  await expect(page.getByText("qa@example.test", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Angaben bearbeiten/ }).click();
  await expect(name).toBeFocused();
  await expect(email).toHaveValue("qa@example.test");
  expect(posts).toEqual([]);
});

test("three studio frames advance and reverse with desktop scroll", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const sequence = page.locator(".walk-sequence");
  await expect(sequence).toHaveAttribute("data-enhanced", "");
  const chapters = sequence.locator("figure");
  await expect(chapters).toHaveCount(3);
  for (const index of [0, 1, 2, 1, 0]) {
    const chapter = chapters.nth(index);
    await chapter.locator("figcaption").evaluate((element) => {
      window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - 100, behavior: "instant" });
    });
    await expect(chapter).toHaveAttribute("data-current", "");
    await expect(sequence.locator("figure[data-current]")).toHaveCount(1);
    await expect(chapter.locator(".walk-frame")).toHaveCSS("opacity", "1");
  }
  await expect(page.getByRole("link", { name: "Zum ganzen Film" })).toHaveAttribute("href", "/projekte/kamerastudie/");
});

for (const mode of ["mobile", "reduced"] as const) {
  test(`walkthrough keeps each caption and image in normal flow · ${mode}`, async ({ page }) => {
    if (mode === "mobile") await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: mode === "reduced" ? "reduce" : "no-preference" });
    await page.goto("/");
    const sequence = page.locator(".walk-sequence");
    await expect(sequence).not.toHaveAttribute("data-enhanced", "");
    await expect(sequence.locator("figcaption")).toHaveCount(3);
    for (const figure of await sequence.locator("figure").all()) {
      await figure.scrollIntoViewIfNeeded();
      await expect(figure.locator("figcaption h3")).toBeVisible();
      await expect(figure.locator(".walk-frame")).toHaveCSS("opacity", "1");
      expect(await figure.locator(".walk-frame").evaluate((node) => getComputedStyle(node).position)).not.toBe("sticky");
    }
  });
}
