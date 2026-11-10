import { expect, test, type Locator, type Page } from "@playwright/test";

async function scrollToY(page: Page, top: number) {
  await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), top);
}

function transformOf(element: Locator) {
  return element.evaluate((node) => {
    const transform = getComputedStyle(node).transform;
    const matrix = transform === "none" ? new DOMMatrix() : new DOMMatrix(transform);
    return { scale: matrix.m11, x: matrix.m41, y: matrix.m42, tilt: Math.abs(matrix.m13) + Math.abs(matrix.m23) };
  });
}

function insetOf(element: Locator) {
  return element.evaluate((node) => {
    const match = getComputedStyle(node).clipPath.match(/^inset\((-?[\d.]+)/);
    return match ? Number(match[1]) : 0;
  });
}

async function pinRange(section: Locator) {
  const spacer = section.locator("xpath=parent::*[contains(@class, 'pin-spacer')]");
  await expect(spacer).toHaveCount(1);
  const range = await spacer.evaluate((node) => {
    const pinned = node.firstElementChild as HTMLElement;
    return { start: scrollY + node.getBoundingClientRect().top, distance: node.getBoundingClientRect().height - pinned.offsetHeight };
  });
  expect(range.distance).toBeGreaterThan(150);
  return range;
}

test("short desktop hero finishes the introduction without scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  const frame = page.locator("[data-hero-parallax]");
  await expect.poll(() => frame.evaluate((node) => (node as HTMLElement).style.transform)).not.toBe("");
  const introduction = page.locator(".premiere-intro");
  await expect(introduction).toBeInViewport();
  await expect(introduction).toHaveCSS("opacity", "1");
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test("portrait opening leaves the centre of the hero photograph visible from the first frame", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const frame = page.locator("[data-hero-parallax]");
  const mattes = await frame.evaluate((node) => {
    const openings = node.getAnimations({ subtree: true }).filter(
      (effect): effect is CSSAnimation => effect instanceof CSSAnimation && effect.animationName === "open-matte",
    );
    const coverage = () => ["::before", "::after"].map((pseudo) => {
      const style = getComputedStyle(node, pseudo);
      const scale = style.transform === "none" ? 1 : new DOMMatrix(style.transform).m22;
      return parseFloat(style.height) * scale / node.getBoundingClientRect().height;
    });
    for (const opening of openings) {
      opening.pause();
      opening.currentTime = 0;
    }
    const first = coverage();
    openings.forEach((opening) => opening.finish());
    return { count: openings.length, first, last: coverage() };
  });
  expect(mattes.count).toBe(2);
  for (const edge of mattes.first) {
    expect(edge).toBeGreaterThan(0.05);
    expect(edge).toBeLessThan(0.2);
  }
  for (const edge of mattes.last) expect(edge).toBeLessThan(0.001);
  await expect(frame.getByRole("img")).toBeInViewport();
});

test("hero frame contracts to its finish scale, fades copy and restores both in reverse", async ({ page }) => {
  await page.goto("/");
  const frame = page.locator("[data-hero-parallax]");
  const copy = page.locator(".premiere-copy");
  const lighting = frame.locator(".premiere-atmosphere");
  const bottom = await frame.evaluate((node) => node.closest("section")!.getBoundingClientRect().bottom + scrollY);
  await expect.poll(async () => (await transformOf(frame)).scale).toBeCloseTo(1, 2);
  const initialLighting = (await transformOf(lighting)).y;
  await scrollToY(page, bottom * 0.5);
  await expect.poll(async () => (await transformOf(frame)).scale).toBeCloseTo(0.93, 2);
  await expect.poll(async () => Math.abs((await transformOf(lighting)).y - initialLighting)).toBeGreaterThan(8);
  await expect.poll(() => copy.evaluate((node) => Number(getComputedStyle(node).opacity))).toBeLessThan(0.5);
  await scrollToY(page, bottom + 2);
  await expect.poll(async () => (await transformOf(frame)).scale).toBeCloseTo(0.86, 2);
  await expect.poll(() => frame.evaluate((node) => parseFloat(getComputedStyle(node).borderTopLeftRadius))).toBeGreaterThan(20);
  await scrollToY(page, 0);
  await expect.poll(async () => (await transformOf(frame)).scale).toBeCloseTo(1, 2);
  await expect.poll(async () => Math.abs((await transformOf(lighting)).y - initialLighting)).toBeLessThan(2);
  await expect(copy).toHaveCSS("opacity", "1");
});

test("service image opens from an inset mask, and pointer feedback settles on exit", async ({ page }) => {
  await page.goto("/leistungen/imagefilme/");
  const clip = page.locator("main [data-cine-clip]").last();
  await expect.poll(() => insetOf(clip)).toBeGreaterThan(85);
  await clip.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect.poll(() => insetOf(clip)).toBeLessThan(1);

  await page.goto("/");
  const target = page.locator(".premiere-copy [data-cine-magnetic]");
  await target.scrollIntoViewIfNeeded();
  const bounds = await target.boundingBox();
  expect(bounds).toBeTruthy();
  await page.mouse.move(bounds!.x + bounds!.width * 0.8, bounds!.y + bounds!.height * 0.75);
  await expect.poll(async () => {
    const { x, y } = await transformOf(target);
    return Math.abs(x) + Math.abs(y);
  }).toBeGreaterThan(1);
  await page.mouse.move(1, 1);
  await expect.poll(async () => {
    const { x, y } = await transformOf(target);
    return Math.abs(x) + Math.abs(y);
  }).toBeLessThan(0.5);
});

test("the service card tilts toward the pointer and returns to its neutral plane", async ({ page }) => {
  await page.goto("/");
  const card = page.locator(".home-service-card[data-tilt], .home-service-card[data-cine-tilt]").first();
  await expect.poll(() => insetOf(card)).toBeGreaterThan(85);
  await card.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect.poll(() => insetOf(card)).toBeLessThan(1);
  const bounds = await card.boundingBox();
  expect(bounds).toBeTruthy();
  await page.mouse.move(bounds!.x + bounds!.width * 0.8, bounds!.y + bounds!.height * 0.65);
  await expect.poll(async () => (await transformOf(card)).tilt).toBeGreaterThan(0.01);
  await page.mouse.move(1, 1);
  await expect.poll(async () => (await transformOf(card)).tilt).toBeLessThan(0.002);
});

test("partner strip moves with reading position and shows a single static logo sheet under reduced motion", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await pinRange(page.locator("[data-process-pin]"));
  const section = page.getByRole("region", { name: "Zusammenarbeit" });
  const production = section.locator(".partner-strip");
  const presentation = section.getByRole("img", { name: /Mercedes-Benz.*Bosch/i });
  await expect(section.getByRole("img")).toHaveCount(1);
  await section.evaluate((node) => scrollTo({ top: scrollY + node.getBoundingClientRect().top - innerHeight * 0.8, behavior: "instant" }));
  await expect(production).toBeVisible();
  const start = (await transformOf(production)).x;
  await section.evaluate((node) => scrollTo({ top: scrollY + node.getBoundingClientRect().top - innerHeight * 0.25, behavior: "instant" }));
  await expect.poll(async () => (await transformOf(production)).x).toBeLessThan(start - 20);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(production).toBeHidden();
  await presentation.scrollIntoViewIfNeeded();
  await expect(presentation).toBeInViewport();
  expect((await presentation.boundingBox())!.width).toBeGreaterThan(250);
});

test("case study presents its stills with a reversible masked image and progress rule", async ({ page }) => {
  await page.goto("/projekte/hopp/");
  const book = page.locator(".scene-book");
  await expect(book).toHaveAttribute("data-sequence", "");
  const nextStage = book.locator("figure").nth(1);
  const caption = nextStage.locator("figcaption");
  const frame = nextStage.locator(".scene-frame");
  const rule = nextStage.locator(".scene-rule b");
  const jumpTo = async (readingLine: number) => {
    await caption.evaluate((node, fraction) => {
      scrollTo({ top: scrollY + node.getBoundingClientRect().top - innerHeight * fraction, behavior: "instant" });
    }, readingLine);
  };
  await jumpTo(0.68);
  await expect.poll(() => insetOf(frame)).toBeGreaterThan(97);
  await jumpTo(0.26);
  await expect.poll(() => insetOf(frame)).toBeLessThan(1);
  await expect.poll(async () => (await transformOf(rule)).scale).toBeGreaterThan(0.97);
  await jumpTo(0.68);
  await expect.poll(() => insetOf(frame)).toBeGreaterThan(97);
  await expect.poll(async () => (await transformOf(rule)).scale).toBeLessThan(0.03);
});

test("pinned film track travels horizontally in both directions", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("[data-portfolio-pin]");
  const track = section.locator("[data-portfolio-track]");
  const { start, distance } = await pinRange(section);
  await scrollToY(page, start + distance * 0.2);
  await expect.poll(async () => (await transformOf(track)).x).toBeLessThan(-distance * 0.18);
  const earlyX = (await transformOf(track)).x;
  const earlyY = (await section.boundingBox())!.y;
  await scrollToY(page, start + distance * 0.8);
  await expect.poll(async () => (await transformOf(track)).x).toBeLessThan(earlyX - distance * 0.54);
  expect(Math.abs((await section.boundingBox())!.y - earlyY)).toBeLessThan(3);
  await scrollToY(page, start + distance * 0.2);
  await expect.poll(async () => Math.abs((await transformOf(track)).x - earlyX)).toBeLessThan(distance * 0.03);
  const links = track.locator("article a[href]");
  await expect(links).toHaveCount(5);
  await links.first().focus();
  for (const key of ["Tab", "Shift+Tab"]) {
    for (let step = 1; step < 5; step++) {
      await page.keyboard.press(key);
      const current = links.nth(key === "Tab" ? step : 4 - step);
      await expect(current).toBeFocused();
      await expect(current).toBeInViewport({ ratio: 0.9 });
    }
  }
});

test("four production stages scrub their image masks forward and back inside the pin", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("[data-process-pin]");
  const steps = section.locator(".home-process-list li");
  await expect(steps).toHaveCount(4);
  const { start, distance } = await pinRange(section);
  for (const index of [0, 1, 2, 3, 2, 0]) {
    await scrollToY(page, start + distance * index / 3);
    await expect(steps.nth(index)).toHaveAttribute("data-active", "");
    await expect.poll(() => insetOf(steps.nth(index).locator(".home-stage-frame"))).toBeLessThan(1);
    if (index + 1 < 4) {
      await expect.poll(() => insetOf(steps.nth(index + 1).locator(".home-stage-frame"))).toBeGreaterThan(97);
    }
  }
  await scrollToY(page, start + distance / 6);
  const second = steps.nth(1).locator(".home-stage-frame");
  await expect.poll(() => insetOf(second)).toBeGreaterThan(8);
  await expect.poll(() => insetOf(second)).toBeLessThan(92);
  await scrollToY(page, start);
  await expect.poll(() => insetOf(second)).toBeGreaterThan(97);
});

for (const mode of ["mobile", "reduced"] as const) {
  test(`portfolio and process remain legible in document order without pins · ${mode}`, async ({ page }) => {
    if (mode === "mobile") await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: mode === "reduced" ? "reduce" : "no-preference" });
    await page.goto("/");
    const portfolio = page.locator(".home-works");
    const process = page.locator(".home-process");
    const finalStep = process.locator(".home-process-list li").last();
    await finalStep.scrollIntoViewIfNeeded();
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(process.locator(".home-process-list li")).toHaveCount(4);
    for (const step of await process.locator(".home-process-list li").all()) {
      await step.scrollIntoViewIfNeeded();
      const frame = step.locator(".home-stage-frame");
      await expect(frame).toBeInViewport();
      await expect(step.locator("h3")).toBeVisible();
      expect(await insetOf(frame)).toBe(0);
    }
    const projects = portfolio.locator("article a[href]");
    await expect(projects).toHaveCount(5);
    for (const link of await projects.all()) {
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeInViewport();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(await page.evaluate(() => innerWidth));
  });
}
