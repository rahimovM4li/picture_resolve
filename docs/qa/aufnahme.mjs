import { chromium } from "playwright";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:4281";
const dir = "docs/qa/relaunch";
mkdirSync(dir, { recursive: true });
const chrome = join(
  process.env.ProgramFiles || "",
  "Google/Chrome/Application/chrome.exe",
);
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    (existsSync(chrome) ? chrome : undefined),
});
const results = [];
try {
  for (const width of [360, 390, 768, 1440]) {
    for (const [key, path] of Object.entries({
      start: "/",
      imagefilm: "/leistungen/imagefilme/",
      recruiting: "/leistungen/recruitingfilme/",
      werkstatt: "/projekte/vom-entwurf-zum-einzelstueck/",
    })) {
      const height = width === 1440 ? 900 : width === 768 ? 1024 : 844;
      const context = await browser.newContext({
        baseURL,
        viewport: { width, height },
        deviceScaleFactor: width < 768 ? 2 : 1,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.goto(path);
      const photo = page.locator("main img").first();
      await photo.evaluate((img) => img.decode());
      await page.evaluate(() => document.fonts.ready);
      const data = await photo.evaluate((img) => {
        const resources = performance.getEntriesByType("resource");
        const loaded = resources.find((e) => e.name === img.currentSrc);
        return {
          image: new URL(img.currentSrc).pathname,
          bildBytes: loaded?.encodedBodySize ?? null,
          prioritaet: img.fetchPriority,
          breite: document.documentElement.scrollWidth,
          videosVorKlick: resources.filter((r) =>
            /\.(mp4|webm)(\?|$)/.test(r.name),
          ).length,
        };
      });
      if (data.videosVorKlick || data.breite > width + 1)
        throw Error(path + " Layout oder Medienstart fehlerhaft");
      results.push({ width, height, path, ...data });
      if ([390, 1440].includes(width))
        await page.screenshot({
          path: join(dir, key + "-" + width + ".jpg"),
          type: "jpeg",
          quality: 80,
          scale: "css",
        });
      // Alle Abschnitte und Footer einmal in normaler Lesereihenfolge sichtbar machen.
      for (const section of await page.locator("main section,footer").all())
        await section.scrollIntoViewIfNeeded();
      await context.close();
    }
  }
  writeFileSync(
    join(dir, "kaltstart.json"),
    JSON.stringify(results, null, 2) + "\n",
  );
} finally {
  await browser.close();
}
