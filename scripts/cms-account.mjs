import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { dataDirectory, replaceAccount } from "../lib/cms/accounts.mjs";

const [, , role, name] = process.argv;
if (!name || !["admin", "editor"].includes(role)) {
  console.error(
    "Aufruf: node scripts/cms-account.mjs admin|editor benutzername",
  );
  process.exit(1);
}
const password =
  process.env.CMS_ACCOUNT_PASSWORD || randomBytes(24).toString("base64url");
replaceAccount(name, role, password);
if (!process.env.CMS_ACCOUNT_PASSWORD) {
  const file = join(dataDirectory, "zugang-" + name + ".txt");
  writeFileSync(file, name + "\n" + password + "\n", { mode: 0o600 });
  console.log("Lokales Zugangsdokument: " + file);
}
console.log("Zugang eingerichtet. Bisherige Sitzungen wurden beendet.");
