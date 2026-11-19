import {
  expect,
  test,
  type APIRequestContext,
  type Page,
  type Locator,
} from "@playwright/test";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const loginFile = process.env.CMS_QA_ACCOUNT_FILE;
const base = process.env.QA_BASE_URL ?? "http://127.0.0.1:4173";
const origin = new URL(base).origin;
test.skip(
  !loginFile,
  "Benötigt isolierten CMS-Teststand mit CMS_QA_ACCOUNT_FILE.",
);
test.describe.configure({ mode: "serial", timeout: 150000 });
test.use({ actionTimeout: 12000 });

async function call(
  client: APIRequestContext,
  action: string,
  data: object,
  expected = 200,
) {
  const response = await client.post(origin + "/api/cms/" + action + "/", {
    headers: { Origin: origin },
    data,
  });
  const body = await response.json();
  expect(response.status(), body.error).toBe(expected);
  return body;
}
async function chooseMedia(picker: Locator, src: string) {
  await picker
    .getByRole("button", { name: /^(Bild|Film) (wechseln|auswählen)$/ })
    .click();
  await picker.getByRole("dialog").locator(`button[data-src="${src}"]`).click();
}
async function signIn(page: Page, name: string, password: string) {
  await page.goto("/redaktion/");
  await page.getByLabel("Benutzername", { exact: true }).fill(name);
  await page.getByLabel("Passwort", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Anmelden", exact: true }).click();
  await expect(
    page.getByRole("navigation", { name: "Redaktionsbereiche" }),
  ).toBeVisible();
}
function adminCredentials() {
  return readFileSync(loginFile!, "utf8").trim().split(/\r?\n/);
}
test("Startseite: Bild im Editor hochladen und den neuen Titel in Bewegung prüfen", async ({
  page,
  browser,
}) => {
  test.skip(
    process.env.CMS_PILOT === "1",
    "Benötigt die vollständige Startseite.",
  );
  const [name, password] = adminCredentials();
  await signIn(page, name, password);
  await page.getByRole("button", { name: "Seiten", exact: true }).click();
  await page.getByRole("searchbox").fill("Start");
  await page.getByRole("button", { name: "Startseite", exact: true }).click();
  const heading = page
    .getByRole("group", { name: "Hauptüberschrift", exact: true })
    .getByRole("textbox")
    .first();
  const original = await heading.inputValue();
  await heading.fill("Werkstattgeschichten aus Düsseldorf");
  const picker = page.locator("#cms-medien > .cms-picker").first();
  const originalImage = await picker.locator("input").inputValue();
  const altField = page
    .locator("#cms-medien")
    .getByRole("textbox", { name: "Alternativtext", exact: true });
  const originalAlt = await altField.inputValue();
  await picker.getByRole("button", { name: "Bild wechseln" }).click();
  const dialog = picker.getByRole("dialog");
  await dialog.getByRole("button", { name: "Datei hochladen" }).click();
  await dialog
    .getByLabel("Datei · bis 64 MiB")
    .setInputFiles(
      join(process.cwd(), "public/assets/projects/hopp-portraet.webp"),
    );
  const alt = "Porträt aus der Werkstatt im Hochformat";
  await dialog
    .getByLabel("Alternativtext (bei Bildern erforderlich)")
    .fill(alt);
  await dialog
    .getByLabel("Quelle und Nutzungsrecht")
    .fill("Studio · lokaler Bedienungstest");
  await dialog.getByRole("button", { name: "Hochladen", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(altField).toHaveValue(alt);
  const uploaded = await picker.locator("input").inputValue();
  const visitor = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const site = await visitor.newPage();
  try {
    await page.getByRole("button", { name: "Vorschau öffnen" }).click();
    await expect(page.locator("h1")).toContainText("Werkstattgeschichten");
    await site.goto(origin);
    await expect(site.locator("h1")).not.toContainText("Werkstattgeschichten");
    await page
      .getByRole("button", { name: "Entwurfsvorschau beenden" })
      .click();
    await page
      .getByRole("button", { name: "Veröffentlichen", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText("Veröffentlicht");
    await site.setViewportSize({ width: 390, height: 844 });
    await site.reload({ waitUntil: "domcontentloaded" });
    const glyph = site.locator("h1 .cine-glyph").first();
    await expect(glyph).toHaveText("Werkstattgeschichten");
    const photo = site.locator(".premiere-frame img");
    await expect(photo).toHaveAttribute("alt", alt);
    const motion = await site.evaluate(async () => {
      const word = document.querySelector("h1 .cine-glyph")!,
        image = document.querySelector(".premiere-frame img")!;
      const letters = new Set<string>(),
        photos = new Set<string>();
      for (let i = 0; i < 65; i++) {
        await new Promise(requestAnimationFrame);
        letters.add(getComputedStyle(word).transform);
        photos.add(getComputedStyle(image).transform);
      }
      return [letters.size, photos.size];
    });
    expect(motion[0]).toBeGreaterThan(1);
    expect(motion[1]).toBeGreaterThan(1);
    expect(
      await photo.evaluate((img: HTMLImageElement) => img.currentSrc),
    ).toContain("portrait-");
    await site.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [360, 390, 768, 1440]) {
      await site.setViewportSize({ width, height: 900 });
      await expect(glyph).toBeVisible();
      const rect = await glyph.boundingBox();
      expect(rect!.x).toBeGreaterThanOrEqual(-1);
      expect(rect!.x + rect!.width).toBeLessThanOrEqual(width + 1);
      expect(await glyph.evaluate((el) => el.getAnimations().length)).toBe(0);
    }
  } finally {
    await visitor.close();
    await page.goto("/redaktion/?eintrag=pages%2Fhome");
    await heading.fill(original);
    await chooseMedia(picker, originalImage);
    await altField.fill(originalAlt);
    await page
      .getByRole("button", { name: "Veröffentlichen", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText("Veröffentlicht");
    await call(page.request, "delete-medium", { id: uploaded.split("/")[2] });
  }
});
const suffix = () => randomBytes(5).toString("hex");

test("Projekt im CMS mit Medien, Vorschau, Veröffentlichung, Konflikt und Entfernung", async ({
  browser,
  page,
  request,
}) => {
  const [admin, pass] = adminCredentials();
  await call(request, "login", { name: admin, password: pass });
  const name = "red-" + suffix(),
    password = randomBytes(18).toString("base64url");
  await call(request, "account", { name, password, role: "editor" });
  await signIn(page, name, password);
  const editor = page.request,
    anonymous = await browser.newContext();
  const publicClient = anonymous.request;
  await call(
    publicClient,
    "publish",
    { collection: "projects", id: "kamerastudie", revision: 1 },
    401,
  );
  await call(
    editor,
    "account",
    { name: "weiterer", password, role: "admin" },
    403,
  );
  await page.getByRole("button", { name: "Mediathek", exact: true }).click();
  await page
    .getByLabel("Datei · bis 64 MiB")
    .setInputFiles(
      join(process.cwd(), "public/assets/projects/hopp-portraet.webp"),
    );
  await page
    .getByLabel("Alternativtext (bei Bildern erforderlich)")
    .fill("Mechaniker am Rad");
  await page
    .getByLabel("Quelle und Nutzungsrecht")
    .fill("Picture Resolve, ausschließlich lokaler Redaktionstest.");
  await page.getByRole("button", { name: "Hochladen", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Medium hochgeladen");
  await page.locator(".cms-media-list li").first().locator("summary").click();
  const src = await page
    .locator(".cms-media-list li")
    .first()
    .locator("code")
    .innerText();
  const mediaId = src.split("/")[2];
  await page
    .getByLabel("Datei · bis 64 MiB")
    .setInputFiles(
      join(process.cwd(), "public/assets/konzepte/einzelstueck.mp4"),
    );
  await page
    .getByLabel("Quelle und Nutzungsrecht")
    .fill("Eigener Konzeptclip, Redaktionstest.");
  await page.getByRole("button", { name: "Hochladen", exact: true }).click();
  await expect(page.locator(".cms-media-list li").first()).toContainText(
    "einzelstueck.mp4",
  );
  await page.locator(".cms-media-list li").first().locator("summary").click();
  const videoSrc = await page
    .locator(".cms-media-list li")
    .first()
    .locator("code")
    .innerText();
  expect((await publicClient.get(origin + src)).status()).toBe(404);
  await page.getByRole("button", { name: "Projekte", exact: true }).click();
  await page.getByRole("button", { name: "Projekt anlegen" }).click();
  const slug = "pruefung-" + suffix();
  const projectTitle =
    "Präzision in der Werkzeugmaschinenfertigung – vom Rohling zum Laufrad " +
    slug.slice(-7);
  const fields = page.locator(".cms-fields");
  for (const [key, value] of Object.entries({
    "URL-Name": slug,
    Titel: projectTitle,
    Projektart: "Werkstattstudie",
    Kurzbeschreibung: "Der erste Arbeitsschritt.",
    Beschreibung: "Ein fester Handgriff im Detail.",
    "SEO-Titel": "Präzision in der Werkstatt",
    "Meta-Beschreibung": "Ein Einblick in die Arbeit am Rad.",
  })) {
    await fields.getByLabel(key, { exact: true }).fill(value);
  }
  await fields
    .getByRole("combobox", { name: "Medientyp", exact: true })
    .selectOption("film");
  const picker = (group: string, index = 0) =>
    fields
      .getByRole("group", { name: group, exact: true })
      .locator(".cms-picker")
      .nth(index);
  await chooseMedia(picker("Titelmotiv"), src);
  await chooseMedia(picker("Galerie"), src);
  await chooseMedia(picker("Film"), videoSrc);
  await chooseMedia(
    fields
      .getByRole("group", { name: "Film", exact: true })
      .locator(".cms-picker")
      .filter({
        has: page.locator(".cms-field-label", { hasText: /^Filmposter$/ }),
      }),
    src,
  );
  await page.getByRole("button", { name: "Entwurf speichern" }).click();
  await expect(page.getByRole("status")).toContainText("Entwurf gespeichert");
  const url = "/projekte/" + slug + "/";
  expect((await publicClient.get(origin + url)).status()).toBe(404);
  await page.getByRole("button", { name: "Vorschau öffnen" }).click();
  await expect(page).toHaveURL(origin + url);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Präzision",
  );
  await page.getByRole("button", { name: "Entwurfsvorschau beenden" }).click();
  await expect(
    page.getByRole("heading", { name: projectTitle, exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Veröffentlichen", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Veröffentlicht");
  const site = await anonymous.newPage();
  await site.setViewportSize({ width: 360, height: 800 });
  await site.emulateMedia({ reducedMotion: "reduce" });
  await site.goto(origin + url);
  await expect(site.getByRole("heading", { level: 1 })).toContainText(
    "Präzision",
  );
  expect((await publicClient.get(origin + src)).status()).toBe(200);
  const headingWords = site.locator("h1 .cine-glyph").filter({ hasText: /\S/ });
  for (const word of await headingWords.all()) {
    const box = await word.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.x).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(361);
  }
  expect(
    (
      await publicClient.get(origin + videoSrc, {
        headers: { Range: "bytes=0-31" },
      })
    ).status(),
  ).toBe(206);
  await call(editor, "delete-medium", { id: mediaId }, 409);
  const gallery = fields.getByRole("group", { name: "Galerie", exact: true });
  await gallery
    .getByRole("textbox", { name: "Bildunterschrift", exact: true })
    .fill("Am Rad");
  await gallery.getByRole("button", { name: "Galerie ergänzen" }).click();
  await chooseMedia(picker("Galerie", 1), "/assets/konzepte/messung.webp");
  await gallery
    .getByRole("textbox", { name: "Alternativtext", exact: true })
    .nth(1)
    .fill("Messung am Bauteil");
  await gallery
    .getByRole("textbox", { name: "Bildunterschrift", exact: true })
    .nth(1)
    .fill("Vermessung");
  await gallery.getByRole("button", { name: "Galerie 2 nach oben" }).click();
  const cover = fields.getByRole("group", { name: "Titelmotiv", exact: true });
  await chooseMedia(
    cover.locator(".cms-picker"),
    "/assets/konzepte/entwurf.webp",
  );
  await cover
    .getByRole("textbox", { name: "Alternativtext", exact: true })
    .fill("Neues Werkstattmotiv");
  await chooseMedia(picker("Film"), "/assets/konzepte/schicht.mp4");
  // Duplicate publication is idempotent; a stale version cannot replace a newer draft.
  const saved = await editor.post(origin + "/api/cms/delete-medium/", {
    headers: { Origin: "https://ungültig.example" },
    data: { id: mediaId },
  });
  expect(saved.status()).toBe(403);
  await fields.getByRole("textbox", { name: "Titel", exact: true }).fill("Rad");
  await fields
    .getByRole("textbox", { name: "SEO-Titel", exact: true })
    .fill("");
  await page
    .getByRole("button", { name: "Veröffentlichen", exact: true })
    .click();
  await expect(page.locator(".cms-alert").first()).toContainText("Pflichtfeld");
  await site.reload();
  await expect(site.getByRole("heading", { level: 1 })).toContainText(
    "Präzision",
  );
  await fields
    .getByRole("textbox", { name: "SEO-Titel", exact: true })
    .fill("Der nächste Schritt");
  await page
    .getByRole("button", { name: "Veröffentlichen", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Veröffentlicht");
  await site.reload();
  await expect(site.getByRole("heading", { level: 1 })).toContainText("Rad");
  await expect(site.locator(".case-shot img")).toHaveAttribute(
    "alt",
    "Neues Werkstattmotiv",
  );
  await expect(site.locator(".scene-caption h3")).toHaveText([
    "Vermessung",
    "Am Rad",
  ]);
  await site.getByRole("button", { name: /Film abspielen/ }).click();
  const video = site.getByRole("dialog").locator("video");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentSrc))
    .toContain("/assets/konzepte/schicht.mp4");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0);
  await site.getByRole("button", { name: "Film schließen" }).click();
  const checks = await call(request, "account", {
    name: "hilfs-" + suffix(),
    password,
    role: "editor",
  });
  const document = checks.state.docs.find(
    (d: { data: { slug?: string } }) => d.data.slug === slug,
  );
  await call(
    editor,
    "publish",
    {
      collection: "projects",
      id: document.id,
      revision: document.revision - 1,
    },
    409,
  );
  await call(editor, "publish", {
    collection: "projects",
    id: document.id,
    revision: document.revision,
  });
  await page
    .getByRole("button", { name: "Eintrag entfernen", exact: true })
    .click();
  await page.getByRole("button", { name: "Ja, endgültig entfernen" }).click();
  await expect(page.getByRole("status")).toContainText("Eintrag entfernt");
  expect((await publicClient.get(origin + url)).status()).toBe(404);
  expect(
    await (await publicClient.get(origin + "/sitemap.xml")).text(),
  ).not.toContain(slug);
  await call(editor, "delete-medium", { id: mediaId });
  await call(editor, "delete-medium", { id: videoSrc.split("/")[2] });
  expect((await editor.get(origin + src)).status()).toBe(404);
  await call(request, "account", { name, operation: "disable" });
  await call(
    editor,
    "publish",
    { collection: "projects", id: document.id, revision: 1 },
    401,
  );
  const replacement = randomBytes(18).toString("base64url");
  await call(request, "account", {
    name,
    password: replacement,
    role: "editor",
  });
  await call(editor, "login", { name, password }, 401);
  await call(editor, "login", { name, password: replacement });
  await call(request, "account", { name, operation: "disable" });
  await anonymous.close();
});

test("Stadt, Seitentitel und Button vom Entwurf über die öffentliche Fassung bis zur Sitemap", async ({
  browser,
  page,
  request,
}) => {
  test.skip(
    process.env.CMS_PILOT === "1",
    "Vollbefüllung folgt nach dem Pilotprojekt.",
  );
  const [admin, pass] = adminCredentials();
  await call(request, "login", { name: admin, password: pass });
  const name = "stadt-" + suffix(),
    password = randomBytes(18).toString("base64url");
  const { state } = await call(request, "account", {
    name,
    password,
    role: "editor",
  });
  await signIn(page, name, password);
  const client = page.request,
    visitor = await browser.newContext(),
    site = await visitor.newPage();
  const city = state.docs.find(
    (d: { collection: string }) => d.collection === "cities",
  );
  const slug = "teststadt-" + suffix(),
    url = origin + "/standorte/" + slug + "/";
  const data = {
    ...city.data,
    city: "Prüfstadt",
    slug,
    title: ["Dreharbeiten", "in Prüfstadt"],
    paragraphs: ["Hier entsteht der regionale Testfilm."],
    seoTitle: "Filmproduktion in Prüfstadt",
    contact: { label: "Dreh besprechen", href: "/kontakt/" },
  };
  await page.getByRole("button", { name: "Standorte", exact: true }).click();
  await page.getByRole("button", { name: "Standort anlegen" }).click();
  const fields = page.locator(".cms-fields");
  await fields.getByLabel("URL-Name", { exact: true }).fill(slug);
  await fields.getByLabel("Stadt", { exact: true }).fill(data.city);
  const headline = fields
    .getByRole("group", { name: "Titel", exact: true })
    .getByRole("textbox");
  await headline.nth(0).fill(data.title[0]);
  await headline.nth(1).fill(data.title[1]);
  await fields
    .getByRole("textbox", { name: "Einleitung", exact: true })
    .fill("Ein Film für Unternehmen in Prüfstadt.");
  await fields
    .getByRole("textbox", { name: "Abschnittsüberschrift", exact: true })
    .fill("Vor Ort");
  await fields
    .getByRole("group", { name: "Absätze", exact: true })
    .getByRole("textbox")
    .first()
    .fill(data.paragraphs[0]);
  await chooseMedia(
    fields.locator(".cms-group > .cms-picker").first(),
    city.data.image,
  );
  await chooseMedia(
    fields.getByRole("group", { name: "Detailmotiv" }).locator(".cms-picker"),
    city.data.detail.image,
  );
  await fields
    .getByRole("textbox", { name: "Alternativtext", exact: true })
    .last()
    .fill(city.data.alt);
  await fields
    .getByRole("group", { name: "Detailmotiv" })
    .getByRole("textbox", { name: "Alternativtext", exact: true })
    .fill(city.data.detail.alt);
  await fields
    .getByRole("textbox", { name: "SEO-Titel", exact: true })
    .fill(data.seoTitle);
  await fields
    .getByRole("textbox", { name: "Meta-Beschreibung", exact: true })
    .fill("Ein individuelles Testangebot für Unternehmen im Stadtgebiet.");
  await fields
    .getByRole("group", { name: "Kontaktbutton" })
    .getByLabel("Beschriftung", { exact: true })
    .fill(data.contact.label);
  const stored = page.waitForResponse(
    (r) =>
      r.url().includes("/api/cms/create/") && r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Entwurf speichern" }).click();
  const created = await (await stored).json();
  expect(created.error).toBeUndefined();
  const info = { id: created.id, collection: "cities", revision: 1 };
  await call(client, "preview", info);
  await page.goto(url);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Prüfstadt",
  );
  expect((await visitor.request.get(url)).status()).toBe(404);
  await call(client, "publish", info);
  await site.goto(url);
  await expect(site).toHaveTitle(/Filmproduktion in Prüfstadt/);
  await expect(
    site.getByRole("link", { name: "Dreh besprechen" }),
  ).toHaveAttribute("href", "/kontakt/");
  expect(
    await (await visitor.request.get(origin + "/sitemap.xml")).text(),
  ).toContain(slug);
  const dup = await call(client, "create", { collection: "cities", data });
  await call(client, "publish", { ...info, id: dup.id }, 409);
  await call(client, "delete", { ...info, id: dup.id });
  await call(client, "delete", info);
  expect((await visitor.request.get(url)).status()).toBe(404);
  expect(
    await (await visitor.request.get(origin + "/sitemap.xml")).text(),
  ).not.toContain(slug);
  const doc = state.docs.find((d: { id: string }) => d.id === "contact");
  const changed = {
    ...doc.data,
    title: "Redaktionelle Überschrift",
    submitLabel: "Testangebot anfordern",
  };
  const update = async (fields: object, rev: number) =>
    call(client, "save", {
      id: "contact",
      collection: "pages",
      revision: rev,
      data: fields,
    });
  await page.goto("/redaktion/");
  await page.getByRole("button", { name: "Seiten", exact: true }).click();
  await page
    .getByRole("button", {
      name: "Kontakt",
      exact: true,
    })
    .click();
  await fields
    .getByRole("textbox", { name: "Titel", exact: true })
    .fill(changed.title);
  await fields
    .getByRole("textbox", { name: "Absende-Schaltfläche", exact: true })
    .fill(changed.submitLabel);
  await page.getByRole("button", { name: "Entwurf speichern" }).click();
  await expect(page.getByRole("status")).toContainText("Entwurf gespeichert");
  const select = {
    id: "contact",
    collection: "pages",
    revision: doc.revision + 1,
  };
  try {
    await call(client, "preview", select);
    await page.goto("/kontakt/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Redaktionelle",
    );
    await expect(
      page.getByRole("button", { name: "Testangebot anfordern" }),
    ).toBeVisible();
    await site.goto(origin + "/kontakt/");
    await expect(
      site.getByRole("button", { name: "Testangebot anfordern" }),
    ).toHaveCount(0);
    await call(client, "publish", select);
    await site.reload();
    await expect(
      site.getByRole("button", { name: "Testangebot anfordern" }),
    ).toBeVisible();
  } finally {
    await update(doc.data, select.revision);
    await call(client, "publish", { ...select, revision: select.revision + 1 });
    await call(request, "account", { name, operation: "disable" });
    await visitor.close();
  }
});

test("Publikationsprüfung hält falsche Medien, leere Filmbeispiele und aktive Projektverweise zurück", async ({
  request,
}) => {
  test.skip(
    process.env.CMS_PILOT === "1",
    "Benötigt die vollständigen Beispieldaten.",
  );
  const [name, password] = adminCredentials();
  await call(request, "login", { name, password });
  const { state } = await call(request, "account", {
    name: "pruef-" + suffix(),
    role: "editor",
    password: randomBytes(16).toString("hex"),
  });
  const project = state.docs.find(
    (d: { id: string }) => d.id === "kamerastudie",
  );
  await call(
    request,
    "delete",
    { collection: "projects", id: project.id, revision: project.revision },
    409,
  );
  for (const wrong of [
    "/assets/videos/studiofilm.mp4",
    "/assets/projects/",
    "javascript:alert(1)",
  ]) {
    const draft = {
      ...project.data,
      slug: "fehler-" + suffix(),
      cover: { ...project.data.cover, src: wrong },
    };
    const { id } = await call(request, "create", {
      collection: "projects",
      data: draft,
    });
    await call(
      request,
      "publish",
      { collection: "projects", id, revision: 1 },
      422,
    );
    await call(request, "delete", { collection: "projects", id, revision: 1 });
  }
  const service = state.docs.find((d: { id: string }) => d.id === "imagefilme");
  const fields = {
    ...service.data,
    feature: { ...service.data.feature, projectSlug: "hopp" },
  };
  const key = { collection: "services", id: service.id };
  await call(request, "save", {
    ...key,
    revision: service.revision,
    data: fields,
  });
  try {
    await call(
      request,
      "publish",
      { ...key, revision: service.revision + 1 },
      422,
    );
  } finally {
    await call(request, "save", {
      ...key,
      revision: service.revision + 1,
      data: service.data,
    });
    await call(request, "publish", { ...key, revision: service.revision + 2 });
  }
});
