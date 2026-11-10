import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const projectPaths = [
  "/projekte/kamerastudie", "/projekte/hopp", "/projekte/hinter-der-kamera",
  "/projekte/gesichter-des-studios", "/projekte/duesseldorf-am-rhein",
];

const routes = [
  "/", "/leistungen/imagefilme", "/leistungen/recruitingfilme",
  "/projekte", ...projectPaths,
  "/ueber-uns", "/kontakt", "/standorte/duesseldorf",
  "/impressum", "/datenschutz",
];

test("home and project index show the same five distinct linked works in order", async ({ page }) => {
  const presentations = [];
  for (const route of ["/", "/projekte/"]) {
    await page.goto(route);
    const cards = page.locator("main a.archive-card");
    await expect(cards).toHaveCount(projectPaths.length);
    const entries = await cards.evaluateAll((links) => links.map((link) => ({
      path: new URL((link as HTMLAnchorElement).href).pathname.replace(/\/$/, ""),
      title: link.querySelector("h2,h3")!.textContent?.trim(),
      image: link.querySelector("img")!.getAttribute("src"),
    })));
    expect(entries.map((entry) => entry.path)).toEqual(projectPaths);
    expect(new Set(entries.map((entry) => entry.image)).size).toBe(projectPaths.length);
    for (const [index, entry] of entries.entries()) {
      await expect(cards.nth(index)).toHaveAccessibleName(new RegExp(entry.title!));
    }
    presentations.push(entries);
  }
  expect(presentations[1]).toEqual(presentations[0]);
  await page.locator(".archive-card").first().click();
  for (const [index, path] of projectPaths.entries()) {
    await expect(page).toHaveURL(new RegExp(path + "/?$"));
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(presentations[0][index].title + ".");
    const next = page.locator(".case-next a");
    await expect(next).toHaveAttribute("href", projectPaths[(index + 1) % projectPaths.length] + "/");
    await expect(page.locator(".case-back")).toHaveAttribute("href", "/projekte/");
    if (index > 0) await expect(page.getByRole("button", { name: /Film abspielen/ })).toHaveCount(0);
    await next.click();
  }
  await expect(page).toHaveURL(/\/projekte\/kamerastudie\/?$/);
});

for (const display of [
  { name: "portrait phone", width: 390, height: 844, portrait: true, minimumPixels: 780 },
  { name: "retina desktop", width: 1440, height: 900, portrait: false, minimumPixels: 2880 },
]) {
  test(`hero selects a source photograph sized for a 2× ${display.name}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({
      baseURL, viewport: { width: display.width, height: display.height },
      deviceScaleFactor: 2, reducedMotion: "reduce",
    });
    try {
      const page = await context.newPage();
      await page.goto("/");
      const image = page.locator(".premiere-plate img");
      const actual = await image.evaluate(async (element: HTMLImageElement) => {
        await element.decode();
        const url = element.currentSrc;
        const bitmap = await createImageBitmap(await (await fetch(url)).blob());
        const size = { url, width: bitmap.width, height: bitmap.height };
        bitmap.close();
        return size;
      });
      expect(actual.width).toBeGreaterThanOrEqual(display.minimumPixels);
      expect(actual.height > actual.width).toBe(display.portrait);
      expect(actual.url.includes("-portrait-")).toBe(display.portrait);
    } finally {
      await context.close();
    }
  });
}

for (const pathname of routes) {
  test(`semantics, assets and accessibility · ${pathname}`, async ({ page }, info) => {
    const errors: string[] = [];
    const broken: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.status() >= 400) broken.push(`${response.status()} ${response.url()}`);
    });
    const response = await page.goto(pathname);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", /^de(-DE)?$/i);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page).toHaveTitle(/Picture Resolve/i);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.trim().length).toBeGreaterThan(20);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).pathname.replace(/\/$/, "")).toBe(pathname.replace(/\/$/, ""));
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /^https?:\/\//);
    const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const block of schema) expect(JSON.parse(block)).toBeTruthy();

    await page.evaluate(() => document.fonts.ready);
    const missingAlt = await page.locator("img:not([alt])").count();
    expect(missingAlt).toBe(0);
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
    const issues = axe.violations.map((issue) => ({
      id: issue.id,
      targets: issue.nodes.map((node) => node.target),
      message: issue.help,
    }));
    await info.attach("accessibility", { contentType: "application/json", body: JSON.stringify(issues, null, 2) });
    expect(issues, "WCAG findings").toEqual([]);
    expect(errors, "browser errors").toEqual([]);
    expect(broken, "HTTP errors").toEqual([]);
  });
}

for (const width of [360, 390, 768, 1440]) {
  test(`responsive layout, navigation targets and renderable images · ${width}px`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const destinations = new Set<string>();
    for (const path of routes) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const headingOverflow = await page.locator("h1").evaluate((heading) => {
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        const clipped: string[] = [];
        let text: Node | null;
        while ((text = walker.nextNode())) {
          if (!text.textContent?.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(text);
          for (const rect of range.getClientRects()) {
            if (rect.width && (rect.left < -2 || rect.right > document.documentElement.clientWidth + 2)) {
              clipped.push(text.textContent.trim());
            }
          }
        }
        return clipped;
      });
      expect(headingOverflow, "Heading text outside viewport on " + path).toEqual([]);
      const pageState = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
        broken: [...document.images].filter((img) => img.complete && img.currentSrc && img.naturalWidth === 0).map((img) => img.currentSrc),
        hrefs: [...document.querySelectorAll<HTMLAnchorElement>("main a[href], header a[href], footer a[href]")]
          .filter((link) => link.origin === location.origin)
          .map((link) => link.pathname),
      }));
      expect(pageState.width, path).toBeLessThanOrEqual(pageState.viewport + 1);
      expect(pageState.broken, path).toEqual([]);
      pageState.hrefs.forEach((href) => destinations.add(href));
    }
    if (width === 390) {
      for (const href of destinations) {
        const result = await request.get(href);
        expect(result.ok(), href).toBeTruthy();
      }
    }
  });
}

test("XML, robots directives and actual 404 responses", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toMatch(/User-agent:/i);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  expect(xml).toContain("<urlset");
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname.replace(/\/$/, "") || "/");
  expect(paths.sort()).toEqual([...routes].sort());
  for (const url of ["/kein-solches-ziel/", "/projekte/kein-solcher-film/"]) {
    expect((await request.get(url)).status(), url).toBe(404);
  }
});

test("server rendering, distinct metadata and preview indexing", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  try {
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      if (route === "/") {
        await expect(page.getByRole("heading", { name: /Jede Geschichte ist einzigartig/i })).toBeVisible();
        const filmFallback = page.getByRole("link", { name: "Zum Film", exact: true });
        await expect(filmFallback).toBeVisible();
        await expect(filmFallback).toHaveAttribute("href", "/projekte/kamerastudie/");
        await expect(page.locator(".walk-sequence figcaption")).toHaveCount(3);
      }
      const title = await page.title();
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(titles.has(title), route).toBe(false);
      expect(descriptions.has(description!), route).toBe(false);
      titles.add(title);
      descriptions.add(description!);
      if (process.env.ENABLE_INDEXING !== "true") {
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);
      }
    }
  } finally {
    await context.close();
  }
});
