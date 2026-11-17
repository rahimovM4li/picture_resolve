import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { database } from "./accounts.mjs";
import { CmsError, type Medium } from "./types";

function mediaDb() {
  const db = database();
  db.exec(
    "CREATE TABLE IF NOT EXISTS media_files (id TEXT REFERENCES media(id) ON DELETE CASCADE, name TEXT, mime TEXT, bytes BLOB NOT NULL, PRIMARY KEY(id,name))",
  );
  return db;
}
export function listMedia(): Medium[] {
  return mediaDb()
    .prepare("SELECT json FROM media ORDER BY rowid DESC")
    .all()
    .map((r) => JSON.parse(String(r.json)));
}
export function getMediaInfo(src: string): Medium | undefined {
  const match = /^\/medien\/([a-f0-9-]{36})\//.exec(src);
  if (!match) return;
  const row = mediaDb()
    .prepare("SELECT json FROM media WHERE id=?")
    .get(match[1]);
  return row ? JSON.parse(String(row.json)) : undefined;
}
export const maxUpload = 64 * 1024 * 1024;
type BlobFile = { name: string; mime: string; bytes: Buffer };
export async function storeMedium(
  file: File,
  alt: string,
  rights: string,
  focusX: number,
  focusY: number,
) {
  if (!rights.trim() || rights.length > 1500 || alt.length > 1500)
    throw new CmsError(
      "Rechtevermerk und ein kurzer Alternativtext werden benötigt.",
    );
  if (![focusX, focusY].every((n) => Number.isInteger(n) && n >= 0 && n <= 100))
    throw new CmsError("Bildfokus zwischen 0 und 100 Prozent wählen.");
  if (!file.size || file.size > maxUpload)
    throw new CmsError("Bitte eine Datei mit höchstens 64 MiB auswählen.", 413);
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length < 12)
    throw new CmsError("Die Datei ist zu kurz für ein Bild oder Video.");
  const id = randomUUID();
  const base = "/medien/" + id + "/";
  const info: Medium = {
    id,
    name: file.name.slice(0, 160),
    type: "image",
    src: "",
    alt: alt.trim(),
    rights: rights.trim(),
    focusX,
    focusY,
    width: 0,
    height: 0,
    preview: "",
  };
  const files: BlobFile[] = [];
  if (
    (bytes.subarray(4, 8).toString() === "ftyp" && file.type === "video/mp4") ||
    (bytes.readUInt32BE(0) === 0x1a45dfa3 && file.type === "video/webm")
  ) {
    const name = file.type === "video/mp4" ? "film.mp4" : "film.webm";
    files.push({ name, mime: file.type, bytes });
    info.type = "video";
    info.src = base + name;
  } else {
    if (!alt.trim())
      throw new CmsError("Ein informativer Alternativtext fehlt.");
    try {
      const input = sharp(bytes, {
        limitInputPixels: 40000000,
        failOn: "warning",
      });
      const meta = await input.metadata();
      if (
        !["jpeg", "png", "webp", "avif", "heif"].includes(meta.format ?? "") ||
        !meta.width ||
        !meta.height
      )
        throw new Error();
      const oriented = await input.rotate().toBuffer();
      const upright = sharp(oriented);
      const dims = await upright.metadata();
      const width = dims.width!,
        height = dims.height!;
      const main = await upright
        .resize({
          width: 2400,
          height: 2400,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 86 })
        .toBuffer({ resolveWithObject: true });
      info.width = main.info.width;
      info.height = main.info.height;
      files.push({ name: "image.webp", mime: "image/webp", bytes: main.data });
      files.push({
        name: "original." + meta.format,
        mime: meta.format === "jpeg" ? "image/jpeg" : "image/" + meta.format,
        bytes,
      });
      const cropWidth = Math.max(1, Math.min(width, Math.round(height * 0.75)));
      const cropHeight = Math.max(
        1,
        Math.min(height, Math.round(width / 0.75)),
      );
      const left = Math.round(((width - cropWidth) * focusX) / 100),
        top = Math.round(((height - cropHeight) * focusY) / 100);
      for (const size of [400, 800]) {
        files.push({
          name: "image-" + size + ".webp",
          mime: "image/webp",
          bytes: await sharp(oriented)
            .resize({ width: size, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toBuffer(),
        });
        files.push({
          name: "portrait-" + size + ".webp",
          mime: "image/webp",
          bytes: await sharp(oriented)
            .extract({ left, top, width: cropWidth, height: cropHeight })
            .resize({ width: size, withoutEnlargement: true })
            .webp({ quality: 83 })
            .toBuffer(),
        });
      }
      info.preview = (
        await sharp(oriented)
          .resize({ width: 32, height: 32, fit: "inside" })
          .webp({ quality: 48 })
          .toBuffer()
      ).toString("base64");
      info.src = base + "image.webp";
    } catch {
      throw new CmsError(
        "Die Bilddatei ist nicht lesbar. Bitte JPEG, PNG, WebP, AVIF oder ein MP4-/WebM-Video verwenden.",
      );
    }
  }
  const db = mediaDb();
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare("INSERT INTO media VALUES(?,?)").run(id, JSON.stringify(info));
    const insert = db.prepare("INSERT INTO media_files VALUES(?,?,?,?)");
    for (const item of files) insert.run(id, item.name, item.mime, item.bytes);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return info;
}
export function deleteMedium(id: string) {
  const db = mediaDb();
  const needle = "/medien/" + id + "/";
  db.exec("BEGIN IMMEDIATE");
  try {
    const refs = db
      .prepare(
        "SELECT collection,id FROM docs WHERE instr(draft,?)>0 OR instr(live,?)>0",
      )
      .all(needle, needle);
    if (refs.length)
      throw new CmsError(
        "Zuerst die Medienverweise ersetzen und veröffentlichen: " +
          refs.map((r) => r.collection + "/" + r.id).join(", "),
        409,
      );
    if (!db.prepare("DELETE FROM media WHERE id=?").run(id).changes)
      throw new CmsError("Medium nicht gefunden.", 404);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
export function mediumResponse(
  id: string,
  name: string,
  range: string | null,
  privateAccess: boolean,
  head: boolean,
) {
  const db = mediaDb();
  const notFound = () =>
    new Response(null, {
      status: 404,
      headers: { "Cache-Control": "private, no-store" },
    });
  if (
    !privateAccess &&
    (name.startsWith("original.") ||
      !db
        .prepare("SELECT 1 FROM docs WHERE instr(live,?)>0 LIMIT 1")
        .get("/medien/" + id + "/"))
  )
    return notFound();
  const meta = db
    .prepare(
      "SELECT mime,length(bytes) AS size FROM media_files WHERE id=? AND name=?",
    )
    .get(id, name);
  if (!meta) return notFound();
  const size = Number(meta.size);
  let start = 0,
    end = size - 1;
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match && (match[1] || match[2])) {
      start = match[1]
        ? Number(match[1])
        : Math.max(0, size - Number(match[2]));
      end =
        match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    } else start = size;
    if (start >= size || end < start || !Number.isSafeInteger(start))
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": "bytes */" + size },
      });
  }
  const headers: Record<string, string> = {
    "Content-Type": String(meta.mime),
    "Accept-Ranges": "bytes",
    "Content-Length": String(end - start + 1),
    "Cache-Control": privateAccess
      ? "private, no-store"
      : "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
  };
  if (range)
    headers["Content-Range"] = "bytes " + start + "-" + end + "/" + size;
  const query = db.prepare(
    "SELECT substr(bytes,?,?) AS chunk FROM media_files WHERE id=? AND name=?",
  );
  const body = head
    ? null
    : new ReadableStream<Uint8Array>({
        pull(controller) {
          const count = Math.min(262144, end - start + 1);
          const row = query.get(start + 1, count, id, name);
          if (!row) {
            controller.error(new Error("Medium entfernt."));
            return;
          }
          controller.enqueue(row.chunk as Uint8Array);
          start += count;
          if (start > end) controller.close();
        },
      });
  return new Response(body, { status: range ? 206 : 200, headers });
}
