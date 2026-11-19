import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const accessFile = process.env.DEMO_QA_ACCESS_FILE;
test.skip(
  !accessFile,
  "Benötigt eine separate Kundendemo und ihren Vorschauzugang.",
);

test("Kunde kann Titel und Bild privat entwerfen, ansehen, veröffentlichen und zurücksetzen", async ({
  browser,
  baseURL,
  request,
}) => {
  test.setTimeout(180_000);
  const [username, password] = readFileSync(accessFile!, "utf8")
    .trim()
    .split(/\r?\n/);
  const unauthenticated = await request.get(baseURL! + "/redaktion/");
  expect(unauthenticated.status()).toBe(401);
  const options = { baseURL, httpCredentials: { username, password } };
  const customer = await browser.newContext(options);
  const observer = await browser.newContext(options);
  try {
    const page = await customer.newPage();
    const published = await customer.newPage();
    const independent = await observer.newPage();
    const response = await page.goto("/redaktion/?eintrag=pages%2Fhome");
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-robots-tag"]).toContain("noindex");
    const title = "Kundenprobe " + Date.now();
    const heading = page
      .getByRole("group", { name: "Hauptüberschrift", exact: true })
      .getByRole("textbox")
      .first();
    await heading.fill(title);
    const picker = page.locator("#cms-medien > .cms-picker").first();
    await picker.getByRole("button", { name: "Bild wechseln" }).click();
    const dialog = picker.getByRole("dialog");
    await dialog.getByRole("button", { name: "Datei hochladen" }).click();
    await dialog
      .getByLabel("Datei · bis 4 MiB")
      .setInputFiles(
        join(process.cwd(), "public/assets/projects/hopp-portraet.webp"),
      );
    const alt = "Eigenes Porträt für die Kundendemo";
    await dialog
      .getByLabel("Alternativtext (bei Bildern erforderlich)")
      .fill(alt);
    await dialog
      .getByLabel("Quelle und Nutzungsrecht")
      .fill("Picture Resolve – Abnahmetest");
    await dialog
      .getByRole("button", { name: "Hochladen", exact: true })
      .click();
    await expect(dialog).toBeHidden({ timeout: 30000 });
    await page.getByRole("button", { name: "Vorschau öffnen" }).click();
    await expect(page.locator("h1")).toContainText(title, { timeout: 30000 });
    await page
      .getByRole("button", { name: "Entwurfsvorschau beenden" })
      .click();
    await published.goto("/");
    await expect(published.locator("h1")).not.toContainText(title);
    await page
      .getByRole("button", { name: "Veröffentlichen", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText("Veröffentlicht", {
      timeout: 30000,
    });
    await published.setViewportSize({ width: 390, height: 844 });
    await published.reload();
    await expect(published.locator("h1")).toContainText(title);
    const image = published.locator(".premiere-frame img");
    await expect(image).toHaveAttribute("alt", alt);
    await expect
      .poll(() =>
        image.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
    const src = await image.evaluate((img: HTMLImageElement) => img.currentSrc);
    expect(src).toContain("/portrait-");
    await expect(published.locator("h1 .cine-glyph").first()).toHaveText(
      "Kundenprobe",
    );
    await independent.goto("/");
    await expect(independent.locator("h1")).not.toContainText(title);
    expect((await independent.request.get(src)).status()).toBe(404);
    page.once("dialog", (prompt) => prompt.accept());
    await page.getByRole("button", { name: "Demo neu starten" }).click();
    await expect(heading).not.toHaveValue(title);
    await published.reload();
    await expect(published.locator("h1")).not.toContainText(title);
  } finally {
    await customer.close();
    await observer.close();
  }
});
