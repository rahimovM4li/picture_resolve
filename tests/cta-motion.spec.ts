import { expect, test } from "@playwright/test";

const shotKey = "cta-test-exposure";

test.beforeEach(async ({ page }) => {
  // The link loads a new document. Capture the outgoing frame before it disappears.
  await page.addInitScript((key) => {
    new MutationObserver((changes) => {
      for (const change of changes) {
        for (const node of change.addedNodes) {
          if (node instanceof HTMLElement && node.matches(".cta-exposure")) {
            const body = node.querySelector<HTMLElement>(".cta-camera-body")!;
            const lamp = node.querySelector<HTMLElement>(".cta-camera-flash")!;
            const shot = {
              x: parseFloat(node.style.getPropertyValue("--enter-x")),
              y: parseFloat(node.style.getPropertyValue("--enter-y")),
              model: getComputedStyle(body).backgroundImage,
              visibleBeforeFlash: false,
              fired: false,
            };
            function sample() {
              if (!body.isConnected) return;
              const light = Number(getComputedStyle(lamp).opacity);
              if (
                Number(getComputedStyle(node as HTMLElement).opacity) > 0.85 &&
                light === 0 &&
                !shot.fired
              )
                shot.visibleBeforeFlash = true;
              if (light > 0.25 && shot.visibleBeforeFlash) shot.fired = true;
              sessionStorage.setItem(key, JSON.stringify(shot));
              if (!shot.fired) requestAnimationFrame(sample);
            }
            sample();
          }
        }
      }
    }).observe(document, { subtree: true, childList: true });
  }, shotKey);
});

test("Nur der berührte CTA animiert Wörter und Pfeil, Enter öffnet die Anfrage mit Blitz", async ({
  page,
}) => {
  await page.goto("/leistungen/imagefilme/");
  const link = page.locator("header .pr-header-inquiry");
  await expect(link).toHaveAccessibleName("Angebot für Imagefilm anfragen");
  await link.hover();
  const words = link.locator(".cta-word");
  await expect(words.first()).toHaveCSS("animation-name", "cta-word-lift");
  await expect(words.nth(1)).toHaveCSS("animation-delay", "0.032s");
  await expect(link.locator("svg")).toHaveCSS(
    "animation-name",
    "cta-arrow-flight",
  );
  await expect(
    page.locator(".service-inquiry-link .cta-word").first(),
  ).toHaveCSS("animation-name", "none");

  await page.mouse.down();
  await expect(link).toHaveCSS("scale", "0.965");
  await page.mouse.move(0, 0);
  await page.mouse.up();
  await link.focus();
  const rect = (await link.boundingBox())!;
  await link.press("Enter");
  await expect(page).toHaveURL(/\/kontakt\/\?leistung=imagefilme$/);
  await expect(page.locator('input[value="imagefilme"]')).toBeChecked();
  const shot = await page.evaluate(
    (key) => JSON.parse(sessionStorage.getItem(key)!),
    shotKey,
  );
  expect(shot.model).toContain("rangefinder-turn.webp");
  expect(shot.visibleBeforeFlash && shot.fired).toBe(true);
  const viewport = page.viewportSize()!;
  expect(shot.x).toBe(
    Math.round((rect.x + rect.width / 2 - viewport.width / 2) * 0.16),
  );
  expect(shot.y).toBe(
    Math.round((rect.y + rect.height / 2 - viewport.height / 2) * 0.16),
  );
  await page.goBack();
  await expect(page.locator(".cta-exposure")).toHaveCount(0);
});

test("Reduzierte Bewegung und Öffnen im neuen Tab behalten das normale Linkverhalten", async ({
  page,
}) => {
  await page.goto("/");
  const link = page.locator("header .pr-header-inquiry");
  const tabEvent = page.context().waitForEvent("page");
  await link.click({ modifiers: ["ControlOrMeta"] });
  const tab = await tabEvent;
  await expect(tab).toHaveURL(/\/kontakt\/$/);
  await tab.close();
  expect(
    await page.evaluate((key) => sessionStorage.getItem(key), shotKey),
  ).toBeNull();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await link.hover();
  await expect(link.locator(".cta-word").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  await link.click();
  await expect(page).toHaveURL(/\/kontakt\/$/);
  expect(
    await page.evaluate((key) => sessionStorage.getItem(key), shotKey),
  ).toBeNull();
});

test.describe("Touch", () => {
  test.use({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });

  test("Leistungskarten öffnen direkt, der mobile Anfragebutton löst die Kamera aus", async ({
    page,
  }) => {
    await page.goto("/");
    const card = page.locator(".home-service-card").first();
    await card.scrollIntoViewIfNeeded();
    const href = await card.getAttribute("href");
    const action = card.locator(".home-card-action");
    const rect = (await action.boundingBox())!;
    const x = Math.round(rect.x + rect.width / 2);
    const y = Math.round(rect.y + rect.height / 2);
    await page.touchscreen.tap(x, y);
    await expect(page).toHaveURL((url) => url.pathname === href);
    expect(
      await page.evaluate((key) => sessionStorage.getItem(key), shotKey),
    ).toBeNull();
    await page.locator(".pr-campaign-bar a").tap();
    await expect(page).toHaveURL(/\/kontakt\/\?leistung=/);
    const shot = await page.evaluate(
      (key) => JSON.parse(sessionStorage.getItem(key)!),
      shotKey,
    );
    expect(shot.model).toContain("rangefinder-turn.webp");
    expect(shot.visibleBeforeFlash && shot.fired).toBe(true);
  });
});

test("Die Navigation erreicht ihr Ziel auch bei einem fehlenden Kamerabild", async ({
  page,
}) => {
  await page.route("**/rangefinder-turn.webp", (route) => route.abort());
  await page.goto("/");
  await page.locator("header .pr-header-inquiry").click();
  await expect(page).toHaveURL(/\/kontakt\/$/);
  expect(
    await page.evaluate((key) => sessionStorage.getItem(key), shotKey),
  ).toBeNull();
});

for (const [path, name] of [
  ["/", "Film ansehen"],
  ["/projekte/kamerastudie/", "Film abspielen"],
]) {
  test(`${name} startet den Player direkt und lädt kein Kamerabild`, async ({
    page,
  }) => {
    const cameraRequests: string[] = [];
    page.on("request", (req) => {
      if (req.url().endsWith("/rangefinder-turn.webp"))
        cameraRequests.push(req.url());
    });
    await page.goto(path);
    const play = page.getByRole("button", { name: new RegExp(name) });
    await play.click();
    const dialog = page.locator(".film-dialog[open]");
    await expect
      .poll(() =>
        dialog
          .locator("video")
          .evaluate((el) => (el as HTMLVideoElement).currentTime),
      )
      .toBeGreaterThan(0);
    await page.keyboard.press("Escape");
    await expect(play).toBeFocused();
    expect(
      await page.evaluate((key) => sessionStorage.getItem(key), shotKey),
    ).toBeNull();
    expect(cameraRequests).toEqual([]);
  });
}

test("Projekt anfragen auf der Kontaktseite zeigt die Kamera und behält die Formulareingabe", async ({
  page,
}) => {
  await page.goto("/kontakt/");
  const field = page.locator('input[name="name"]');
  await field.fill("Beispielname");
  await page.locator("header .pr-header-inquiry").click();
  await expect(page).toHaveURL(/#anfrage$/);
  await expect(field).toHaveValue("Beispielname");
  expect(
    await page.evaluate(
      (key) => JSON.parse(sessionStorage.getItem(key)!).fired,
      shotKey,
    ),
  ).toBe(true);
});
