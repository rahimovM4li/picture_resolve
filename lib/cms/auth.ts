import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import {
  database,
  passwordMatches,
  replaceAccount,
  validName,
} from "./accounts.mjs";
import { CmsError, type User } from "./types";

const sessionCookie = "pr_cms_session";
const digest = (token: string) =>
  createHash("sha256").update(token).digest("hex");
const lifespan = 8 * 60 * 60;

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || token.length !== 64) return null;
  const result = database()
    .prepare(
      "SELECT u.name,u.role FROM users u JOIN sessions s ON u.name=s.name WHERE s.token=? AND s.expires>? AND u.enabled=1",
    )
    .get(digest(token), Date.now());
  return result
    ? { name: String(result.name), role: result.role as User["role"] }
    : null;
}

export async function login(name: string, password: string, secure: boolean) {
  const db = database();
  const now = Date.now();
  db.prepare("DELETE FROM login_attempts WHERE until<=?").run(now);
  // A global throttle also covers rotating account names; no proxy headers are trusted.
  const keys = ["all", digest(name.toLowerCase())];
  for (const key of keys) {
    const row = db
      .prepare("SELECT count FROM login_attempts WHERE key=?")
      .get(key);
    if (Number(row?.count ?? 0) >= (key === "all" ? 120 : 8))
      throw new CmsError(
        "Zu viele Anmeldeversuche. Bitte in 15 Minuten erneut versuchen.",
        429,
      );
  }
  const user = db
    .prepare("SELECT * FROM users WHERE name=? AND enabled=1")
    .get(name.toLowerCase());
  const hash =
    user?.password ?? "00000000000000000000000000000000:" + "00".repeat(64);
  if (
    !passwordMatches(password.slice(0, 256), String(hash)) ||
    !user ||
    password.length > 256
  ) {
    for (const key of keys)
      db.prepare(
        "INSERT INTO login_attempts VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1",
      ).run(key, now + 900000);
    throw new CmsError(
      "Anmeldung fehlgeschlagen. Bitte Zugangsdaten prüfen.",
      401,
    );
  }
  db.prepare("DELETE FROM login_attempts WHERE key=?").run(keys[1]);
  db.prepare("DELETE FROM sessions WHERE expires<=?").run(now);
  const token = randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(
    digest(token),
    user.name,
    now + lifespan * 1000,
  );
  (await cookies()).set(sessionCookie, token, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: lifespan,
  });
}
export async function logout() {
  const jar = await cookies();
  const token = jar.get(sessionCookie)?.value;
  if (token)
    database().prepare("DELETE FROM sessions WHERE token=?").run(digest(token));
  jar.delete(sessionCookie);
  jar.delete("pr_cms_preview");
}
export function manageAccount(
  actor: User,
  name: string,
  role: string,
  password: string,
  operation: string,
) {
  if (actor.role !== "admin")
    throw new CmsError(
      "Dafür ist ein Administrationszugang erforderlich.",
      403,
    );
  if (!validName(name) || name === actor.name)
    throw new CmsError("Bitte einen anderen gültigen Benutzernamen angeben.");
  const db = database();
  if (operation === "disable") {
    db.prepare("UPDATE users SET enabled=0 WHERE name=?").run(name);
    db.prepare("DELETE FROM sessions WHERE name=?").run(name);
  } else {
    if (
      !["admin", "editor"].includes(role) ||
      password.length < 14 ||
      password.length > 256
    )
      throw new CmsError(
        "Ein Passwort mit 14 bis 256 Zeichen und eine gültige Rolle angeben.",
      );
    replaceAccount(name, role, password);
  }
}
