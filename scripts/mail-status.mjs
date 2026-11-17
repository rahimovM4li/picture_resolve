import { DatabaseSync } from "node:sqlite";
import { join, resolve } from "node:path";

const [id, decision] = process.argv.slice(2);
if (
  !id ||
  !/^[a-f\d-]{36}$/i.test(id) ||
  (decision && !["angenommen", "abgelehnt"].includes(decision))
) {
  throw new Error(
    "Aufruf: node --env-file-if-exists=.env.local scripts/mail-status.mjs <Anfragenummer> [angenommen|abgelehnt]",
  );
}
const directory = resolve(
  process.env.INQUIRY_DATA_DIR ||
    process.env.CMS_DATA_DIR ||
    ".local/picture-resolve",
);
const db = new DatabaseSync(join(directory, "inquiries.sqlite"), {
  readOnly: !decision,
});
try {
  db.exec("PRAGMA busy_timeout=5000");
  if (decision) {
    const result = db
      .prepare(
        `UPDATE deliveries SET state=?,updated=?
      WHERE id=? AND (state='uncertain' OR (state='sending' AND updated<?))`,
      )
      .run(
        decision === "angenommen" ? "accepted" : "failed",
        Date.now(),
        id,
        Date.now() - 300_000,
      );
    if (!result.changes)
      throw new Error(
        "Kein ungeklärter Übergabestatus. Laufende Übergaben lassen sich frühestens nach fünf Minuten abgleichen.",
      );
  }
  const row = db
    .prepare("SELECT state,updated FROM deliveries WHERE id=?")
    .get(id);
  if (!row) throw new Error("Anfragenummer nicht gefunden.");
  console.log(id, row.state, new Date(Number(row.updated)).toISOString());
} finally {
  db.close();
}
