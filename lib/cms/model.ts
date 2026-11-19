import { fieldLabel } from "./field-labels";
import { statSync } from "node:fs";
import { resolve } from "node:path";
import { database } from "./accounts.mjs";
import { seedDocuments } from "./seed";
import { customerDemo } from "../demo";
import {
  CmsError,
  type CmsDoc,
  type Collection,
  type Fields,
  type Value,
  previewPath,
} from "./types";

export const projectTemplate: Fields = {
  slug: "",
  title: "",
  titleAccent: "",
  kind: "",
  attribution: "Picture Resolve",
  type: "archive",
  meta: "",
  review: "draft",
  summary: "",
  description: "",
  cover: { src: "", alt: "", caption: "" },
  stills: [{ src: "", alt: "", caption: "" }],
  source: "",
  services: ["imagefilme"],
  seoTitle: "",
  seoDescription: "",
};
export const videoTemplate: Fields = {
  src: "",
  compactSrc: "",
  duration: "00:00",
  captions: "",
};
export function template(collection: Collection, id: string): Fields {
  const sample =
    seedDocuments.find((d) => d.collection === collection && d.id === id) ??
    seedDocuments.find((d) => d.collection === collection);
  if (collection === "projects") {
    const known = Object.assign(
      {},
      ...seedDocuments
        .filter((d) => d.collection === "projects")
        .map((d) => d.data),
    );
    return {
      ...projectTemplate,
      ...known,
      video: { ...videoTemplate, ...known.video },
    };
  }
  if (!sample) throw new CmsError("Vorlage fehlt.");
  return sample.data as Fields;
}

export function initStore() {
  const db = database();
  if (db.prepare("SELECT 1 FROM cms_state WHERE key='initialized'").get())
    return db;
  db.exec("BEGIN IMMEDIATE");
  try {
    if (!db.prepare("SELECT 1 FROM cms_state WHERE key='initialized'").get()) {
      const insert = db.prepare(
        "INSERT INTO docs (collection,id,draft,live,revision,liveRevision) VALUES(?,?,?,?,1,1)",
      );
      const seeds =
        process.env.CMS_PILOT === "1"
          ? seedDocuments.filter(
              (d) =>
                d.collection === "settings" ||
                d.collection === "services" ||
                (d.collection === "projects" && d.id === "kamerastudie"),
            )
          : seedDocuments;
      for (const { collection, id, data } of seeds) {
        const json = JSON.stringify(data);
        insert.run(collection, id, json, json);
      }
      db.prepare("INSERT INTO cms_state VALUES('initialized','1')").run();
    }
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
  return db;
}
export function documents(): CmsDoc[] {
  return initStore()
    .prepare("SELECT * FROM docs ORDER BY rowid")
    .all()
    .map((r) => ({
      collection: r.collection as Collection,
      id: String(r.id),
      data: JSON.parse(String(r.draft)),
      revision: Number(r.revision),
      liveRevision: Number(r.liveRevision),
      error: String(r.error),
    }));
}

function publicDocs(): CmsDoc[] {
  return initStore()
    .prepare("SELECT * FROM docs WHERE live IS NOT NULL ORDER BY rowid")
    .all()
    .map((r) => ({
      collection: r.collection as Collection,
      id: String(r.id),
      data: JSON.parse(String(r.live)),
      revision: Number(r.liveRevision),
      liveRevision: Number(r.liveRevision),
      error: "",
    }));
}
export function snapshot(preview?: string): CmsDoc[] {
  const db = initStore();
  const rows = db
    .prepare(
      "SELECT collection,id, CASE WHEN collection||'/'||id=? THEN draft ELSE live END AS body FROM docs ORDER BY rowid",
    )
    .all(preview ?? "");
  return rows
    .filter((r) => r.body != null)
    .map((r) => ({
      collection: r.collection as Collection,
      id: String(r.id),
      data: JSON.parse(String(r.body)),
      revision: 0,
      liveRevision: 0,
      error: "",
    }));
}

const optional = new Set([
  "titleAccent",
  "video",
  "projectSlug",
  "compactSrc",
  "captions",
  "poster",
  "source",
  "meta",
  "caption",
  "review",
  "reviewStatus",
  "concept",
  "isConcept",
]);
function shape(value: Value, sample: Value, field: string, path: string) {
  const fail = () => {
    throw new CmsError("Ungültiger Feldaufbau: " + path);
  };
  if (Array.isArray(sample)) {
    if (!Array.isArray(value) || value.length > 100) return fail();
    if (["headline", "title"].includes(field) && value.length !== sample.length)
      return fail();
    for (const [i, v] of value.entries())
      if (sample.length)
        shape(v, sample[i] ?? sample[0], String(i), path + " / " + (i + 1));
  } else if (sample !== null && typeof sample === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value))
      return fail();
    for (const key of Object.keys(value))
      if (!Object.hasOwn(sample, key)) return fail();
    for (const [key, expected] of Object.entries(sample)) {
      if (value[key] === undefined && optional.has(key)) continue;
      shape(value[key], expected, key, path + " / " + key);
    }
  } else if (
    typeof value !== typeof sample ||
    value === null ||
    (typeof value === "string" && value.length > 20000)
  )
    fail();
}

function safeLocal(value: string) {
  return (
    /^\/(?!\/)/.test(value) &&
    !/[\\\s\x00-\x1f]/.test(value) &&
    !/%(?:2f|5c|2e)/i.test(value) &&
    !value.split(/[/?#]/).includes("..")
  );
}
// Vercel serves the public directory from the CDN, outside function bundles.
const demoAssets = new Set<string>();
if (customerDemo) JSON.stringify(seedDocuments, (_key, value) => {
  if (typeof value === "string" && value.startsWith("/assets/")) demoAssets.add(value);
  return value;
});
function mediaUrl(value: string, kind: "video" | "image" | "captions") {
  const ext = {
    video: /\.(?:mp4|webm)$/i,
    image: /\.(?:webp|jpe?g|png|avif)$/i,
    captions: /\.vtt$/i,
  }[kind];
  if (
    safeLocal(value) &&
    /^\/assets\/[\w./-]+$/.test(value) &&
    ext.test(value) &&
    (customerDemo ? demoAssets.has(value) : statSync(resolve("public", "." + value), {
      throwIfNoEntry: false,
    })?.isFile())
  )
    return;
  if (
    safeLocal(value) &&
    /^\/medien\/[a-f0-9-]{36}\/(?:image\.webp|film\.(?:mp4|webm))$/.test(
      value,
    ) &&
    ext.test(value) &&
    database()
      .prepare("SELECT 1 FROM media WHERE json_extract(json,'$.src')=?")
      .get(value)
  )
    return;
  if (
    kind === "video" &&
    allowedExternal(value) &&
    ext.test(new URL(value).pathname)
  )
    return;
  throw new CmsError(
    "Das Medium ist nicht erreichbar oder nicht zulässig: " +
      value.slice(0, 120),
  );
}
function allowedExternal(value: string) {
  try {
    const u = new URL(value);
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !/[\\\s]/.test(value)
    );
  } catch {
    return false;
  }
}
function inspectFields(
  value: Value,
  key: string,
  path: string,
  urls: Set<string>,
  projects: Set<string>,
  services: Set<string>,
) {
  if (Array.isArray(value)) {
    for (const child of value)
      inspectFields(child, key, path, urls, projects, services);
    return;
  }
  if (typeof value === "object" && value !== null) {
    for (const [field, child] of Object.entries(value))
      inspectFields(child, field, path + "." + field, urls, projects, services);
    return;
  }
  if (typeof value !== "string") return;
  if (
    ["featuredSlugs", "showreelSlug", "projectSlug"].includes(key) &&
    value &&
    !projects.has(value)
  )
    throw new CmsError("Verknüpftes Projekt fehlt: " + value);
  if (["services", "serviceSlugs"].includes(key) && !services.has(value))
    throw new CmsError("Verknüpfte Leistung fehlt: " + value);
  if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    throw new CmsError("Bitte die Kontaktadresse prüfen.");
  if (key === "href" || key === "url" || /Href$/.test(key)) {
    if (allowedExternal(value)) return;
    if (
      /^mailto:[^?\s@]+@[^?\s@]+$/.test(value) ||
      /^tel:\+?[\d()-]{5,22}$/.test(value)
    )
      return;
    if (
      !safeLocal(value) ||
      !urls.has(
        new URL(value, "https://preview.invalid").pathname.replace(/\/?$/, "/"),
      )
    )
      throw new CmsError("Unbekanntes Linkziel: " + value);
  }
  if (key === "source" && value && !allowedExternal(value) && !safeLocal(value))
    throw new CmsError("Quellenangabe prüfen.");
  if (
    /^(image|src|poster|logo|compactSrc|captions|partnersStill|partnersImage|regionalImage)$/i.test(
      key,
    ) &&
    value
  )
    mediaUrl(
      value,
      key === "captions"
        ? "captions"
        : path.includes(".video.") && ["src", "compactSrc"].includes(key)
          ? "video"
          : "image",
    );
}
function validate(doc: CmsDoc, all: CmsDoc[]) {
  const { collection, id, data } = doc;
  shape(data, template(collection, id), collection, collection);
  const required =
    collection === "projects"
      ? [
          "slug",
          "title",
          "description",
          "summary",
          "seoTitle",
          "seoDescription",
          "kind",
        ]
      : collection === "cities"
        ? [
            "slug",
            "city",
            "lead",
            "image",
            "alt",
            "chapter",
            "seoTitle",
            "seoDescription",
          ]
        : collection === "services"
          ? [
              "slug",
              "name",
              "headline",
              "intro",
              "image",
              "alt",
              "seoTitle",
              "seoDescription",
            ]
          : collection === "pages"
            ? ["title", "seoTitle", "seoDescription"]
            : ["name", "email", "logo"];
  for (const field of required)
    if (typeof data[field] !== "string" || !data[field].trim())
      throw new CmsError("Pflichtfeld fehlt: " + fieldLabel(field));
  if (["projects", "cities", "services"].includes(collection)) {
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(data.slug)) ||
      String(data.slug).length > 100
    )
      throw new CmsError(
        "Der URL-Name muss aus Kleinbuchstaben, Zahlen und Bindestrichen bestehen.",
      );
    if (
      all.some(
        (d) =>
          d.collection === collection &&
          d.id !== id &&
          d.data.slug === data.slug,
      )
    )
      throw new CmsError("Dieser URL-Name wird bereits verwendet.", 409);
  }
  if (collection === "projects") {
    const cover = data.cover as Fields;
    if (
      !cover?.src ||
      !cover.alt ||
      !Array.isArray(data.services) ||
      !data.services.length ||
      !Array.isArray(data.stills) ||
      data.stills.some((s) => !(s as Fields)?.src || !(s as Fields)?.alt)
    )
      throw new CmsError(
        "Leistung, Titelmotiv und Alternativtexte für alle Bilder angeben.",
      );
    if (
      !["film", "archive"].includes(String(data.type)) ||
      Boolean(data.video) !== (data.type === "film")
    )
      throw new CmsError(
        "Filmprojekte brauchen eine Videodatei oder einen HTTPS-Filmlink.",
      );
    if (data.video && !(data.video as Fields).src)
      throw new CmsError("Videodatei oder Filmlink fehlt.");
  }
  if (
    collection === "cities" &&
    (!(data.title as string[]).some((s) => s.trim()) ||
      !(data.paragraphs as string[]).some((s) => s.trim()) ||
      !(data.contact as Fields).label)
  )
    throw new CmsError(
      "Standorte brauchen eine Überschrift, lokalen Text und eine Kontaktbeschriftung.",
    );
  if (collection === "services" && data.slug !== id)
    throw new CmsError("Die Leistungsadresse ist für die Kampagne festgelegt.");
  if (
    collection === "cities" &&
    (!(data.detail as Fields).image || !(data.detail as Fields).alt)
  )
    throw new CmsError("Das Detailmotiv und sein Alternativtext fehlen.");
  const requiredFilm =
    collection === "services"
      ? (data.feature as Fields).projectSlug
      : collection === "pages" && id === "home"
        ? data.showreelSlug
        : undefined;
  if (
    (collection === "services" || (collection === "pages" && id === "home")) &&
    !all.some(
      (d) =>
        d.collection === "projects" &&
        d.data.slug === requiredFilm &&
        d.data.video &&
        (d.data.video as Fields).src,
    )
  ) {
    throw new CmsError(
      "Für das Filmbeispiel ein veröffentlichtes Projekt mit abspielbarem Film wählen.",
    );
  }
  const projects = new Set(
    all
      .filter((d) => d.collection === "projects")
      .map((d) => String(d.data.slug)),
  );
  const services = new Set(
    all
      .filter((d) => d.collection === "services")
      .map((d) => String(d.data.slug)),
  );
  const urls = new Set([
    "/",
    "/kontakt/",
    "/ueber-uns/",
    "/projekte/",
    "/impressum/",
    "/datenschutz/",
    ...all.map((d) => previewPath(d.collection, d.id, d.data) ?? ""),
  ]);
  inspectFields(data, "", collection, urls, projects, services);
}
function entry(collection: Collection, id: string, revision: number) {
  const doc = documents().find(
    (d) => d.collection === collection && d.id === id,
  );
  if (!doc) throw new CmsError("Eintrag nicht gefunden.", 404);
  if (doc.revision !== revision)
    throw new CmsError(
      "Der Entwurf wurde inzwischen geändert. Bitte neu laden.",
      409,
    );
  return doc;
}
function protectPublicReferences(doc: CmsDoc, others: CmsDoc[]) {
  const row = database()
    .prepare("SELECT live FROM docs WHERE collection=? AND id=?")
    .get(doc.collection, doc.id);
  if (!row?.live) return;
  const previous = JSON.parse(String(row.live)) as Fields;
  const path = previewPath(doc.collection, doc.id, previous);
  const linked = (value: Value, key: string): boolean => {
    if (Array.isArray(value)) return value.some((v) => linked(v, key));
    if (typeof value === "object" && value)
      return Object.entries(value).some(([k, v]) => linked(v, k));
    if (typeof value !== "string") return false;
    if (
      doc.collection === "projects" &&
      ["featuredSlugs", "projectSlug", "showreelSlug"].includes(key) &&
      value === previous.slug
    )
      return true;
    return (
      (key === "href" || key === "url" || /Href$/.test(key)) &&
      safeLocal(value) &&
      new URL(value, "https://preview.invalid").pathname.replace(
        /\/?$/,
        "/",
      ) === path
    );
  };
  const refs = others.filter((d) => linked(d.data, ""));
  if (refs.length)
    throw new CmsError(
      "Zuerst die veröffentlichten Verweise ersetzen: " +
        refs.map((d) => d.collection + "/" + d.id).join(", "),
      409,
    );
}
export function checkPreview(collection: Collection, id: string) {
  const doc = documents().find(
    (d) => d.collection === collection && d.id === id,
  );
  if (!doc) throw new CmsError("Eintrag nicht gefunden.", 404);
  validate(doc, [
    ...publicDocs().filter((d) => d.collection !== collection || d.id !== id),
    doc,
  ]);
  return doc;
}
export function mutate(
  operation: "save" | "publish" | "delete" | "create",
  collection: Collection,
  id: string,
  revision: number,
  data?: Fields,
) {
  const db = initStore();
  db.exec("BEGIN IMMEDIATE");
  try {
    if (operation === "create") {
      if (
        !["projects", "cities"].includes(collection) ||
        !/^[\w-]{1,100}$/.test(id) ||
        !data
      )
        throw new CmsError("Eintrag kann so nicht angelegt werden.");
      if (
        db
          .prepare("SELECT 1 FROM docs WHERE collection=? AND id=?")
          .get(collection, id)
      )
        throw new CmsError("Der Eintrag existiert bereits.", 409);
      shape(data, template(collection, id), collection, collection);
      db.prepare(
        "INSERT INTO docs(collection,id,draft,revision) VALUES(?,?,?,1)",
      ).run(collection, id, JSON.stringify(data));
    } else {
      const doc = entry(collection, id, revision);
      if (operation === "save") {
        if (!data) throw new CmsError("Inhalte fehlen.");
        shape(data, template(collection, id), collection, collection);
        db.prepare(
          "UPDATE docs SET draft=?,revision=revision+1,error='' WHERE collection=? AND id=?",
        ).run(JSON.stringify(data), collection, id);
      } else {
        const others = publicDocs().filter(
          (d) => !(d.collection === collection && d.id === id),
        );
        if (operation === "publish") {
          const next = [...others, doc];
          validate(doc, next);
          // Recheck all inbound links when renaming an existing public URL.
          const old = db
            .prepare("SELECT live FROM docs WHERE collection=? AND id=?")
            .get(collection, id);
          if (
            collection === "projects" &&
            old?.live &&
            JSON.parse(String(old.live)).video &&
            !doc.data.video &&
            others.some(
              (other) =>
                other.data.showreelSlug === doc.data.slug ||
                (other.collection === "services" &&
                  (other.data.feature as Fields)?.projectSlug ===
                    doc.data.slug),
            )
          ) {
            throw new CmsError(
              "Vor dem Entfernen des Films das Showreel oder verknüpfte Leistungsbeispiel ersetzen.",
              409,
            );
          }
          if (old?.live && JSON.parse(String(old.live)).slug !== doc.data.slug)
            protectPublicReferences(doc, others);
          db.prepare(
            "UPDATE docs SET live=draft,liveRevision=revision,error='' WHERE collection=? AND id=?",
          ).run(collection, id);
        } else {
          if (!["projects", "cities"].includes(collection))
            throw new CmsError("Feste Seiten können nicht entfernt werden.");
          if (doc.liveRevision) protectPublicReferences(doc, others);
          db.prepare("DELETE FROM docs WHERE collection=? AND id=?").run(
            collection,
            id,
          );
        }
      }
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    if (operation === "publish" && error instanceof CmsError)
      db.prepare(
        "UPDATE docs SET error=? WHERE collection=? AND id=? AND revision=?",
      ).run(error.message, collection, id, revision);
    throw error;
  }
}
