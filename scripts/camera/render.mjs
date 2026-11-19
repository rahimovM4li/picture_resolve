// Run with: node scripts/camera/render.mjs /path/to/three (r176).
// Only the rendered WebP is shipped to the site.
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const three = resolve(process.argv[2] ?? "node_modules/three");
const root = fileURLToPath(new URL("../../", import.meta.url));
const output = join(root, "public/assets/brand/rangefinder-turn.webp");
const chrome =
  process.env.ProgramFiles &&
  join(process.env.ProgramFiles, "Google/Chrome/Application/chrome.exe");
const browser = await chromium.launch({
  executablePath: chrome && existsSync(chrome) ? chrome : undefined,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage();
  await page.route("http://camera.localhost/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/signatur-weiss.webp") {
      return route.fulfill({
        contentType: "image/webp",
        body: await readFile(
          join(root, "public/assets/brand/signatur-weiss.webp"),
        ),
      });
    }
    if (path === "/") {
      return route.fulfill({
        contentType: "text/html",
        body: '<script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script>',
      });
    }
    const file =
      path === "/model.mjs"
        ? join(root, "scripts/camera/model.mjs")
        : join(three, path.slice("/three/".length));
    await route.fulfill({
      contentType: "text/javascript",
      body: await readFile(file),
    });
  });
  await page.goto("http://camera.localhost/");
  const { frames, emitter } = await page.evaluate(async () =>
    (await import("/model.mjs")).cameraTurn(),
  );
  const images = await Promise.all(
    frames.map((png) =>
      sharp(Buffer.from(png, "base64")).resize(675, 480).png().toBuffer(),
    ),
  );
  const { width, height } = await sharp(images[0]).metadata();
  await mkdir(dirname(output), { recursive: true });
  await sharp({
    create: {
      width: width * images.length,
      height,
      channels: 4,
      background: "#0000",
    },
  })
    .composite(
      images.map((input, index) => ({ input, left: width * index, top: 0 })),
    )
    .webp({ quality: 78, alphaQuality: 93, smartSubsample: true, effort: 5 })
    .toFile(output);
  console.log(
    "Final flash position within frame (%)",
    emitter.map((value) => (value * 100).toFixed(2)),
  );
} finally {
  await browser.close();
}
