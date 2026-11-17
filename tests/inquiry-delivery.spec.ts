import { randomUUID } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer, type AddressInfo } from "node:net";
import { createInterface } from "node:readline";
import { test, expect } from "@playwright/test";
import { POST } from "../app/api/inquiry/route";
import { closeInquiryLedger } from "../lib/inquiry-ledger";

const mailbox = process.env.QA_MAILPIT_URL || "http://127.0.0.1:8025";
const acceptedMail = "studio@pictureresolve.test";
const local = (url: string) =>
  ["127.0.0.1", "localhost", "[::1]"].includes(new URL(url).hostname);
const synthetic = () => ({
  id: randomUUID(),
  website: "",
  service: "imagefilme",
  company: "",
  phone: "",
  budget: "",
  name: "QA Muster",
  email: randomUUID() + "@example.test",
  privacy: true,
  description: "Wir möchten unseren Fertigungsablauf im Film zeigen.",
});

async function messages(id: string) {
  // Search the sink by exact unique RFC Message-ID, independently of other test runs.
  const result = await fetch(
    mailbox +
      "/api/v1/search?query=" +
      encodeURIComponent("message-id:" + id + "@pictureresolve.test"),
  );
  expect(result.ok).toBe(true);
  const body = (await result.json()) as { messages: { ID: string }[] };
  return body.messages;
}
async function received(id: string, email: string, description: string) {
  await expect.poll(async () => (await messages(id)).length).toBe(1);
  const record = (await messages(id))[0];
  const response = await fetch(mailbox + "/api/v1/message/" + record.ID);
  const message = await response.json();
  expect(message.To[0].Address).toBe(acceptedMail);
  expect(message.From.Address).toBe("website@pictureresolve.test");
  expect(message.ReplyTo[0].Address).toBe(email);
  expect(message.Text).toContain(description);
  return record.ID;
}

test("SMTP rejects invalid requests, prevents duplicate handoffs and recovers from a refused connection", async () => {
  test.skip(
    !process.env.QA_MAILPIT_URL || !local(mailbox),
    "Direkter SMTP-Test nutzt ein lokales Testpostfach.",
  );
  const temp = mkdtempSync(join(tmpdir(), "picture-resolve-inquiry-"));
  const env = {
    SMTP_HOST: "127.0.0.1",
    SMTP_PORT: process.env.QA_MAILPIT_PORT || "4125",
    SMTP_SECURE: "false",
    SMTP_USER: "",
    SMTP_PASSWORD: "",
    INQUIRY_FROM: "website@pictureresolve.test",
    INQUIRY_TO: acceptedMail,
    INQUIRY_DATA_DIR: temp,
    INQUIRY_CLIENT_IP_HEADER: "",
  };
  const original = Object.fromEntries(
    Object.keys(env).map((key) => [key, process.env[key]]),
  );
  Object.assign(process.env, env);
  const request = (input: unknown, extra: Record<string, string> = {}) =>
    POST(
      new Request("http://localhost/api/inquiry/", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...extra },
        body: JSON.stringify(input),
      }),
    );
  try {
    const input = synthetic();
    const invalid = await request({
      ...input,
      privacy: "true",
      name: "",
      email: "a@b.test,c@d.test",
      service: "invalid",
    });
    expect(invalid.status).toBe(422);
    expect((await invalid.json()).errors).toHaveProperty("privacy");
    expect(
      (await request({ ...input, website: "https://spam.example" })).status,
    ).toBe(400);
    expect(
      (await request(input, { "sec-fetch-site": "cross-site" })).status,
    ).toBe(403);
    process.env.SMTP_PORT = "1";
    const outage = await request(input);
    expect(outage.status).toBe(503);
    expect((await outage.json()).status).toBe("failed");
    expect(await messages(input.id)).toEqual([]);

    process.env.SMTP_PORT = env.SMTP_PORT;
    const pair = await Promise.all([request(input), request(input)]);
    expect(pair.map((response) => response.status).sort()).toEqual([200, 202]);
    closeInquiryLedger();
    expect((await (await request(input)).json()).status).toBe("accepted");
    expect(
      (await request({ ...input, description: "Anderer Inhalt." })).status,
    ).toBe(409);
    await received(input.id, input.email, input.description);

    process.env.SMTP_PORT = "1";
    for (let i = 0; i < 3; i++)
      expect((await request({ ...input, id: randomUUID() })).status).toBe(503);
    expect((await request({ ...input, id: randomUUID() })).status).toBe(429);

    // The connection disappears after the message body but before the SMTP 250 receipt.
    const interrupted = createServer((socket) => {
      let data = false;
      socket.write("220 test ESMTP\r\n");
      createInterface({ input: socket, crlfDelay: Infinity }).on(
        "line",
        (line) => {
          if (data && line === ".") socket.destroy();
          else if (!data && line === "DATA") {
            data = true;
            socket.write("354 send body\r\n");
          } else if (!data) socket.write("250 ok\r\n");
        },
      );
    });
    await new Promise<void>((resolve) =>
      interrupted.listen(0, "127.0.0.1", resolve),
    );
    try {
      process.env.SMTP_PORT = String(
        (interrupted.address() as AddressInfo).port,
      );
      const ambiguous = synthetic();
      const interruptedReply = await request(ambiguous);
      expect((await interruptedReply.json()).status).toBe("pending");
      process.env.SMTP_PORT = env.SMTP_PORT;
      const repeat = await request(ambiguous);
      expect(repeat.status).toBe(409);
      expect((await repeat.json()).status).toBe("pending");
      expect(await messages(ambiguous.id)).toEqual([]);
    } finally {
      interrupted.close();
    }
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    closeInquiryLedger();
    rmSync(temp, { recursive: true });
  }
});

for (const [service, label, width] of [
  ["imagefilme", "Imagefilm", 1440],
  ["recruitingfilme", "Recruitingfilm", 390],
] as const) {
  test(
    label + " führt vom Anzeigenziel bis ins Testpostfach",
    async ({ page, baseURL }) => {
      test.skip(
        !process.env.QA_MAILPIT_URL ||
          !baseURL ||
          !local(baseURL) ||
          !local(mailbox),
        "Nur bei explizit konfiguriertem lokalem Testpostfach senden.",
      );
      const input = synthetic();
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/leistungen/" + service + "/");
      const visibleCta = page
        .locator('a[href*="leistung=' + service + '"]:visible')
        .first();
      await visibleCta.click();
      const form = page.getByRole("form", {
        name: "Projektanfrage",
        exact: true,
      });
      await expect(
        form.getByRole("radio", { name: label, exact: true }),
      ).toBeChecked();
      await form.getByLabel("Name", { exact: true }).fill(input.name);
      await form.getByLabel("E-Mail", { exact: true }).fill(input.email);
      await form
        .getByLabel("Projektbeschreibung", { exact: true })
        .fill(input.description);
      await form.getByRole("checkbox").check();
      const submit = form.getByRole("button", { name: "Anfrage senden" });
      // Exercise the recoverable network-failure UI, then let the exact same request reach SMTP.
      await page.route(
        "**/api/inquiry/",
        (route) =>
          route.fulfill({
            status: 503,
            json: {
              status: "failed",
              message: "Testunterbrechung. Bitte erneut senden.",
            },
          }),
        { times: 1 },
      );
      await submit.click();
      await expect(
        form.getByText("Testunterbrechung. Bitte erneut senden."),
      ).toBeVisible();
      await expect(
        form.getByLabel("Projektbeschreibung", { exact: true }),
      ).toHaveValue(input.description);
      const delivery = page.waitForResponse(
        (r) => r.request().method() === "POST" && r.url().endsWith("/api/inquiry/"),
      );
      await submit.dblclick({ delay: 10 });
      const response = await delivery;
      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual({ status: "accepted" });
      const id = response.request().postDataJSON().id;
      await expect(
        page.getByRole("heading", { name: "Ihre Anfrage wurde gesendet." }),
      ).toBeFocused();
      const record = await received(id, input.email, input.description);
      test.info().annotations.push({ type: "Mailpit", description: record });
    },
  );
}
