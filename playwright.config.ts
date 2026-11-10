import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "@playwright/test";

const externalServer = process.env.QA_BASE_URL;
const baseURL = externalServer ?? "http://127.0.0.1:4173";
const installedChrome = process.env.ProgramFiles
  ? join(process.env.ProgramFiles, "Google", "Chrome", "Application", "chrome.exe")
  : undefined;
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  ?? (installedChrome && existsSync(installedChrome) ? installedChrome : undefined);

export default defineConfig({
  testDir: "./tests",
  snapshotPathTemplate: "{testDir}/../docs/qa/screenshots/{arg}{ext}",
  fullyParallel: false,
  workers: 2,
  timeout: 60_000,
  reporter: "list",
  use: {
    baseURL,
    browserName: "chromium",
    viewport: { width: 1440, height: 900 },
    locale: "de-DE",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: executablePath ? { executablePath } : undefined,
  },
  webServer: externalServer
    ? undefined
    : {
        command: "npx --no-install serve out --listen 4173",
        url: baseURL,
        timeout: 25_000,
        reuseExistingServer: !process.env.CI,
      },
});

