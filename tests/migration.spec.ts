import { expect, test } from "@playwright/test";
const historical = {
  "/film": "/leistungen/imagefilme/",
  "/impressum": "/impressum/",
  "/leistungen": "/#leistungen",
  "/ueberuns": "/ueber-uns/",
  "/hopp": "/projekte/hopp/",
  "/demovideo": "/projekte/kamerastudie/",
  "/kunden": "/projekte/",
  "/agentur": "/ueber-uns/",
};
test("Alte URLs leiten in einem 301-Schritt auf erreichbare Inhalte", async ({
  request,
  baseURL,
}) => {
  for (const [source, target] of Object.entries(historical)) {
    const response = await request.get(source, { maxRedirects: 0 });
    expect(response.status(), source).toBe(301);
    expect(new URL(response.headers().location, baseURL).href, source).toBe(
      new URL(target, baseURL).href,
    );
    expect((await request.get(target, { maxRedirects: 0 })).status()).toBe(200);
  }
  for (const path of [
    "/foto",
    "/sound",
    "/standorte/unbekannt/",
    "/projekte/unbekannt/",
    "/leistungen/unbekannt/",
  ]) {
    expect((await request.get(path, { maxRedirects: 0 })).status(), path).toBe(
      404,
    );
  }
  expect(
    (
      await request.get("/film?utm_source=anzeige", { maxRedirects: 0 })
    ).headers().location,
  ).toBe("/leistungen/imagefilme/?utm_source=anzeige");
});
