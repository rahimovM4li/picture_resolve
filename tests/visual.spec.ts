import { expect, test } from "@playwright/test";

const screens = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

for (const viewport of screens) {
  test(`homepage visual baseline · ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await page.goto("/");
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].filter((image) => image.loading !== "lazy").map((image) => image.decode().catch(() => undefined)));
    });
    await expect(page).toHaveScreenshot(`home-${viewport.width}.png`, { animations: "disabled", maxDiffPixelRatio: 0.015 });
  });
}

test("visitor color preference preserves the intended hero contrast", async ({ page }) => {
  await page.goto("/");
  const headingColor = () => page.getByRole("heading", { level: 1 }).evaluate((element) => getComputedStyle(element).color);
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  const light = await headingColor();
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  expect(await headingColor()).toBe(light);
});

