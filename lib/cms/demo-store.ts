import { getCache } from "@vercel/functions";
import { createHash, randomUUID } from "node:crypto";
import { gzipSync, gunzipSync } from "node:zlib";
import { cache } from "react";
import { cookies } from "next/headers";
import { database, withTemporaryDatabase } from "./accounts.mjs";
import { initStore } from "./model";
import { listMedia, mediumResponse } from "./media";
import { CmsError, type Collection, type Medium, type User } from "./types";

export const demoUser: User = { name: "Kundendemo", role: "editor" };
export const demoCookie = "pr_demo_revision";
const hours = 8;
const lifetime = hours * 3600;
const chunkSize = 768 * 1024;
const store = getCache({
  namespace: "picture-resolve-demo-v1",
  keyHashFunction: (key) => createHash("sha256").update(key).digest("hex"),
});
const options = { ttl: lifetime + 600, name: "Kundendemo" };
async function writeEntry(key: string, value: string) {
  // The platform cache can decline a write. Do not acknowledge an incomplete upload.
  for (let attempt = 0; attempt < 2; attempt++) {
    await store.set(key, value, options);
    if ((await store.get(key)) === value) return;
  }
  throw new CmsError(
    "Der Demospeicher ist gerade nicht erreichbar. Bitte erneut versuchen.",
    503,
  );
}
type DocRow = {
  collection: Collection;
  id: string;
  draft: string;
  live: string | null;
  revision: number;
  liveRevision: number;
  error: string;
};
type Session = { docs: DocRow[]; media: Medium[]; expires: number };

// Every successful write produces an immutable snapshot. Only its unguessable
// reference travels in the browser cookie. Other browsers start from the seed.
export const readDemo = cache(async (): Promise<Session | undefined> => {
  const key = (await cookies()).get(demoCookie)?.value;
  if (!key || !/^[a-f0-9-]{36}$/.test(key)) return;
  const stored = await store.get("state/" + key);
  if (typeof stored !== "string") return;
  const state: Session = JSON.parse(
    gunzipSync(Buffer.from(stored, "base64")).toString(),
  );
  return state.expires > Date.now() ? state : undefined;
});

export async function inDemo<T>(
  state: Session | undefined,
  work: () => T | Promise<T>,
) {
  return withTemporaryDatabase(async () => {
    const db = database();
    if (state) {
      const doc = db.prepare(
        "INSERT INTO docs(collection,id,draft,live,revision,liveRevision,error) VALUES(?,?,?,?,?,?,?)",
      );
      for (const d of state.docs)
        doc.run(
          d.collection,
          d.id,
          d.draft,
          d.live,
          d.revision,
          d.liveRevision,
          d.error,
        );
      const media = db.prepare("INSERT INTO media(id,json) VALUES(?,?)");
      for (const m of state.media.toReversed())
        media.run(m.id, JSON.stringify(m));
      db.exec("INSERT INTO cms_state VALUES('initialized','1')");
    } else initStore();
    return work();
  });
}

export async function saveDemo(previous: Session | undefined, secure: boolean) {
  const db = database();
  const expires = previous?.expires ?? Date.now() + lifetime * 1000;
  const state = {
    docs: db.prepare("SELECT * FROM docs ORDER BY rowid").all(),
    media: listMedia(),
    expires,
  };
  const packed = gzipSync(JSON.stringify(state)).toString("base64");
  if (packed.length > 1024 * 1024 || state.media.length > 40)
    throw new CmsError(
      "Der Teststand ist voll. Bitte ungenutzte Medien oder Einträge entfernen.",
      413,
    );
  // Only freshly uploaded files are present in the temporary database.
  const files = db.prepare("SELECT id,name,mime,bytes FROM media_files").all();
  for (const f of files) {
    const bytes = Buffer.from(f.bytes as Uint8Array);
    const key = "file/" + f.id + "/" + f.name;
    const parts = Math.ceil(bytes.length / chunkSize);
    await Promise.all(
      Array.from({ length: parts }, (_, i) =>
        writeEntry(
          key + "/" + i,
          bytes.subarray(i * chunkSize, (i + 1) * chunkSize).toString("base64"),
        ),
      ),
    );
    await writeEntry(key, JSON.stringify({ mime: f.mime, parts }));
  }
  const key = randomUUID();
  await writeEntry("state/" + key, packed);
  (await cookies()).set(demoCookie, key, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    expires: new Date(expires),
  });
}

export async function demoFile(
  id: string,
  name: string,
  range: string | null,
  head: boolean,
) {
  const state = await readDemo();
  const missing = () =>
    new Response(null, {
      status: 404,
      headers: { "Cache-Control": "private, no-store" },
    });
  if (!state?.media.some((m) => m.id === id) || !/^[\w.-]{1,40}$/.test(name))
    return missing();
  const key = "file/" + id + "/" + name;
  const stored = await store.get(key);
  if (typeof stored !== "string") return missing();
  const file: { mime: string; parts: number } = JSON.parse(stored);
  const parts = await Promise.all(
    Array.from({ length: file.parts }, (_, i) => store.get(key + "/" + i)),
  );
  if (!parts.every((p): p is string => typeof p === "string")) return missing();
  return inDemo(state, async () => {
    listMedia();
    database()
      .prepare("INSERT INTO media_files VALUES(?,?,?,?)")
      .run(
        id,
        name,
        file.mime,
        Buffer.concat(parts.map((part) => Buffer.from(part, "base64"))),
      );
    const response = mediumResponse(id, name, range, true, head);
    // The production reader streams from SQLite. Finish the bounded demo read before closing it.
    return new Response(response.body ? await response.arrayBuffer() : null, {
      status: response.status,
      headers: response.headers,
    });
  });
}
