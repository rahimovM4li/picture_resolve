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
    const reelFrames = page.locator(".reel-cell:visible img");
    await expect(reelFrames).toHaveCount(viewport.width < 768 ? 1 : 3);
    await reelFrames.evaluateAll(async (images) => {
      await Promise.all(images.map((image) => (image as HTMLImageElement).decode()));
    });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].filter((image) => image.loading !== "lazy").map((image) => image.decode().catch(() => undefined)));
    });
    await expect(page).toHaveScreenshot(`home-${viewport.width}.png`, { animations: "disabled", maxDiffPixelRatio: 0.015 });
    const photos = page.locator(".home-film-image");
    const wide = (await photos.nth(0).boundingBox())!;
    const portrait = (await photos.nth(1).boundingBox())!;
    expect(wide.width).toBeGreaterThan(wide.height);
    expect(portrait.height).toBeGreaterThan(portrait.width);
    expect(portrait.width).toBeLessThan(wide.width);
    if (viewport.width <= 700) expect(portrait.y).toBeGreaterThan(wide.y + wide.height);
    else expect(portrait.x).toBeGreaterThan(wide.x + wide.width);
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

