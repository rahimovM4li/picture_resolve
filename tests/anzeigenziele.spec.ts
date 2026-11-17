import { expect, test, type Locator } from "@playwright/test";

async function clickable(link: Locator) {
  await expect(link).toBeInViewport({ ratio: 1 });
  await expect
    .poll(() =>
      link.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return el.contains(
          document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2),
        );
      }),
    )
    .toBe(true);
}

for (const service of ["imagefilme", "recruitingfilme"]) {
  for (const width of [360, 390, 768, 1440]) {
    test(`${service} · Anfrage von Einstieg, Film, FAQ und Footer bei ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
      await page.goto(`/leistungen/${service}/`);
      const href = "/kontakt/?leistung=" + service;
      const selector = `a[href="${href}"]`;
      const fixed = page
        .locator(
          (width < 768 ? ".pr-campaign-bar" : ".pr-header-actions") +
            " " +
            selector,
        )
        .first();
      await clickable(fixed);
      for (const section of [
        ".service-feature",
        ".service-faq",
        ".footer",
        ".service-feature",
      ]) {
        await page.locator(section).scrollIntoViewIfNeeded();
        await clickable(fixed);
      }
      const start = page
        .locator(".service-feature")
        .getByRole("button", { name: /Film abspielen/ });
      await start.click();
      const player = page.locator(".film-dialog[open]");
      await expect
        .poll(
          () =>
            player
              .locator("video")
              .evaluate((v) => (v as HTMLVideoElement).currentTime),
          { timeout: 15000 },
        )
        .toBeGreaterThan(0);
      await player.getByRole("button", { name: "Film schließen" }).click();
      await expect(start).toBeFocused();
      await clickable(fixed);
      if (width < 1024) {
        const before = await page.evaluate(() => scrollY);
        await page.getByRole("button", { name: "Menü öffnen" }).click();
        const menu = page.getByRole("dialog", { name: "Menü" });
        await clickable(menu.getByRole("navigation").locator(selector));
        await page.keyboard.press("Escape");
        await expect(menu).toBeHidden();
        await expect(
          page.getByRole("button", { name: "Menü öffnen" }),
        ).toBeFocused();
        expect(
          Math.abs((await page.evaluate(() => scrollY)) - before),
        ).toBeLessThan(3);
      }
      await page.evaluate(() =>
        scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "instant",
        }),
      );
      await clickable(page.locator(".footer-base a").last());
      await fixed.click();
      await expect(page.locator(`input[value="${service}"]`)).toBeChecked();
      await page.goBack();
      await clickable(fixed);
    });
  }
}

test("Querformat und Doppeltipp lassen den Anfrageweg im mobilen Menü erreichbar", async ({
  browser,
  baseURL,
}) => {
  const ctx = await browser.newContext({
    baseURL,
    viewport: { width: 720, height: 360 },
    hasTouch: true,
    reducedMotion: "reduce",
  });
  try {
    const page = await ctx.newPage();
    await page.goto("/leistungen/recruitingfilme/");
    const button = page.getByRole("button", { name: "Menü öffnen" });
    await button.tap();
    const menu = page.getByRole("dialog", { name: "Menü" }),
      target = menu.getByRole("navigation").locator('a[href*="?leistung="]');
    await target.scrollIntoViewIfNeeded();
    await target.tap();
    await expect(page.locator('input[value="recruitingfilme"]')).toBeChecked();
    await page.goBack();
    const rect = await button.boundingBox();
    await page.touchscreen.tap(
      rect!.x + rect!.width / 2,
      rect!.y + rect!.height / 2,
    );
    await page.touchscreen.tap(
      rect!.x + rect!.width / 2,
      rect!.y + rect!.height / 2,
    );
    await expect(menu).toBeHidden();
    await clickable(page.locator(".pr-campaign-bar a"));
  } finally {
    await ctx.close();
  }
});
