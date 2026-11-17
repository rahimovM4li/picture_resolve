import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readdirSync, existsSync } from "node:fs";
import { resolve, join, basename } from "node:path";

// Stop the application before running this command so both databases represent one point in time.
const source = resolve(process.env.CMS_DATA_DIR || ".local/picture-resolve");
const inquiry = resolve(process.env.INQUIRY_DATA_DIR || source);
const target = process.argv[2] && resolve(process.argv[2]);
if (!target || existsSync(target))
  throw new Error("Bitte einen neuen leeren Zielpfad angeben.");
const inputs = [...new Set([source, inquiry])].flatMap((dir) =>
  readdirSync(dir)
    .filter((name) => /\.(?:sqlite|db)$/.test(name))
    .map((name) => join(dir, name)),
);
if (
  !inputs.length ||
  new Set(inputs.map((p) => basename(p))).size !== inputs.length
)
  throw new Error("Eindeutige Datenbankdateien fehlen.");
mkdirSync(target, { recursive: true, mode: 0o700 });
for (const input of inputs) {
  const db = new DatabaseSync(input, { readOnly: true });
  const destination = join(target, basename(input));
  db.prepare("VACUUM INTO ?").run(destination);
  db.close();
  const check = new DatabaseSync(destination, { readOnly: true });
  if (check.prepare("PRAGMA integrity_check").get().integrity_check !== "ok")
    throw new Error("Integritätsfehler");
  check.close();
  console.log(basename(input) + " gesichert und geprüft.");
}
