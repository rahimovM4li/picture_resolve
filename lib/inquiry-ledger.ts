import { createHmac, randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

type State = "sending" | "accepted" | "failed" | "uncertain";
type Reservation = State | "busy" | "conflict" | "limited";
let connection: DatabaseSync | undefined;
let digestKey: Buffer;

function ledger() {
  if (connection) return connection;
  const directory = resolve(
    /* turbopackIgnore: true */
    process.env.INQUIRY_DATA_DIR ||
      process.env.CMS_DATA_DIR ||
      ".local/picture-resolve",
  );
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(join(directory, "inquiries.sqlite"));
  db.exec(`
    PRAGMA busy_timeout=5000;
    PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value BLOB NOT NULL);
    CREATE TABLE IF NOT EXISTS deliveries (id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, state TEXT NOT NULL, updated INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, hits INTEGER NOT NULL, expires INTEGER NOT NULL);`);
  db.prepare("INSERT OR IGNORE INTO settings VALUES ('digest', ?)").run(
    randomBytes(32),
  );
  digestKey = Buffer.from(
    db.prepare("SELECT value FROM settings WHERE key='digest'").get()!
      .value as Uint8Array,
  );
  connection = db;
  return db;
}

function hash(value: string) {
  return createHmac("sha256", digestKey).update(value).digest("hex");
}

/** Reserve exactly one SMTP attempt while concurrent clients see its durable state. */
export function reserveDelivery(
  id: string,
  content: string,
  email: string,
  source: string | null,
): Reservation {
  const db = ledger();
  const now = Date.now();
  const fingerprint = hash(content);
  db.exec("BEGIN IMMEDIATE");
  try {
    const row = db
      .prepare("SELECT fingerprint,state,updated FROM deliveries WHERE id=?")
      .get(id);
    if (row && row.state !== "failed") {
      if (row.fingerprint !== fingerprint) return "conflict";
      if (row.state === "sending")
        return now - Number(row.updated) < 60_000 ? "busy" : "uncertain";
      return row.state as State;
    }

    db.prepare("DELETE FROM limits WHERE expires<=?").run(now);
    const buckets: [string, number][] = [
      ["total", 120],
      ["email:" + hash(email.toLowerCase()), 5],
    ];
    if (source) buckets.push(["client:" + hash(source), 12]);
    for (const [key, limit] of buckets) {
      const hits =
        db.prepare("SELECT hits FROM limits WHERE key=?").get(key)?.hits ?? 0;
      if (Number(hits) >= limit) return "limited";
    }
    const increment = db.prepare(
      "INSERT INTO limits VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET hits=hits+1",
    );
    for (const [key] of buckets) increment.run(key, now + 15 * 60_000);
    db.prepare(
      `INSERT INTO deliveries VALUES (?,?,'sending',?)
      ON CONFLICT(id) DO UPDATE SET fingerprint=excluded.fingerprint,state='sending',updated=excluded.updated`,
    ).run(id, fingerprint, now);
    // No await between reservation and commit. Different Node workers use the same SQLite lock.
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  } finally {
    if (db.isTransaction) db.exec("COMMIT");
  }
  return "sending";
}

export function finishDelivery(id: string, state: Exclude<State, "sending">) {
  ledger()
    .prepare(
      "UPDATE deliveries SET state=?,updated=? WHERE id=? AND state='sending'",
    )
    .run(state, Date.now(), id);
}

export function closeInquiryLedger() {
  connection?.close();
  connection = undefined;
}
