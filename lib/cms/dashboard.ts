import { database } from "./accounts.mjs";
import { listMedia } from "./media";
import { documents, template, projectTemplate } from "./model";
import type { User, Fields, MediaChoice } from "./types";
import { seedDocuments } from "./seed";

function existingMedia() {
  const media = new Map<string, MediaChoice>();
  function visit(input: unknown, parent: Record<string, unknown> = {}) {
    if (input && typeof input === "object") {
      for (const child of Object.values(input))
        visit(child, input as Record<string, unknown>);
    } else if (
      typeof input === "string" &&
      /^\/assets\/.+\.(?:webp|jpe?g|png|mp4|webm)$/.test(input)
    ) {
      const alt = typeof parent.alt === "string" ? parent.alt : "";
      if (!media.has(input) || (alt && !media.get(input)?.alt))
        media.set(input, {
          id: input,
          src: input,
          name: "Bestand · " + input.split("/").at(-1),
          alt,
          type: /\.(mp4|webm)$/.test(input) ? "video" : "image",
        });
    }
  }
  for (const doc of seedDocuments) visit(doc.data);
  return [...media.values()];
}

export function editorState(actor: User) {
  const docs = documents();
  const templates: Record<string, Fields> = {};
  for (const d of docs)
    templates[d.collection + "/" + d.id] = template(d.collection, d.id);
  templates.projects = template("projects", "");
  templates.cities = template("cities", "");
  function blank(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(blank);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, blank(v)]),
      );
    return typeof value === "string" ? "" : value;
  }
  const city = blank(templates.cities) as Fields;
  city.contact = { label: "Dreh vor Ort anfragen", href: "/kontakt/" };
  city.reviewStatus = "draft";
  const accounts =
    actor.role === "admin"
      ? database()
          .prepare("SELECT name,role,enabled FROM users ORDER BY name")
          .all()
          .map((r) => ({
            name: String(r.name),
            role: String(r.role),
            enabled: Boolean(r.enabled),
          }))
      : [];
  return {
    docs,
    media: listMedia(),
    existingMedia: existingMedia(),
    accounts,
    templates,
    newProject: { ...projectTemplate, concept: true },
    newCity: city,
  };
}
export type EditorState = ReturnType<typeof editorState>;
