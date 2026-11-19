import { DatabaseSync } from "node:sqlite";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

export const dataDirectory = resolve(
  /* turbopackIgnore: true */
  process.env.CMS_DATA_DIR || ".local/picture-resolve",
);
let handle;
const scoped = new AsyncLocalStorage();
export function database() {
  if (scoped.getStore()) return scoped.getStore();
  if (handle) return handle;
  mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
  handle = openDatabase(join(dataDirectory, "studio.sqlite"));
  return handle;
}
export async function withTemporaryDatabase(work) {
  const db = openDatabase(":memory:");
  try {
    return await scoped.run(db, work);
  } finally {
    db.close();
  }
}
function openDatabase(path) {
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS users (
      name TEXT PRIMARY KEY, role TEXT NOT NULL, password TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY, name TEXT NOT NULL REFERENCES users(name) ON DELETE CASCADE, expires INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS login_attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, until INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS docs (
      collection TEXT NOT NULL, id TEXT NOT NULL, draft TEXT NOT NULL, live TEXT, revision INTEGER NOT NULL,
      liveRevision INTEGER NOT NULL DEFAULT 0, error TEXT NOT NULL DEFAULT '', PRIMARY KEY(collection,id)
    );
    CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY, json TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS cms_state (key TEXT PRIMARY KEY, value TEXT NOT NULL);`);
  return db;
}
export function passwordHash(password) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + scryptSync(password, salt, 64).toString("hex");
}
export function passwordMatches(password, hash) {
  const [salt, expected] = hash.split(":");
  return timingSafeEqual(
    scryptSync(password, salt, 64),
    Buffer.from(expected, "hex"),
  );
}
export function validName(name) {
  return /^[a-z0-9][a-z0-9._@-]{1,99}$/.test(name);
}
export function replaceAccount(name, role, password) {
  if (
    !validName(name) ||
    !["admin", "editor"].includes(role) ||
    password.length < 14 ||
    password.length > 256
  )
    throw new Error(
      "Benutzername, Rolle oder Passwort ungültig (mindestens 14 Zeichen).",
    );
  const hash = passwordHash(password);
  const db = database();
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare(
      "INSERT INTO users(name,role,password) VALUES(?,?,?) ON CONFLICT(name) DO UPDATE SET role=excluded.role,password=excluded.password,enabled=1",
    ).run(name, role, hash);
    db.prepare("DELETE FROM sessions WHERE name=?").run(name);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
