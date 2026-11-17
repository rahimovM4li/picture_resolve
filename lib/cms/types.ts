export const collections = [
  "projects",
  "cities",
  "pages",
  "settings",
  "services",
] as const;
export type Collection = (typeof collections)[number];
export type CmsSeed = { collection: Collection; id: string; data: object };
export type Value =
  string | boolean | number | Value[] | { [key: string]: Value };
export type Fields = { [key: string]: Value };
export type CmsDoc = {
  collection: Collection;
  id: string;
  data: Fields;
  revision: number;
  liveRevision: number;
  error: string;
};
export type User = { name: string; role: "admin" | "editor" };
export type Medium = {
  id: string;
  name: string;
  src: string;
  type: "image" | "video";
  alt: string;
  rights: string;
  focusX: number;
  focusY: number;
  width: number;
  height: number;
  preview: string;
};
export type MediaChoice = Pick<Medium, "id" | "src" | "name" | "type" | "alt">;
export class CmsError extends Error {
  constructor(
    message: string,
    public status = 422,
  ) {
    super(message);
  }
}
export const collectionLabels: Record<Collection, string> = {
  projects: "Projekte",
  cities: "Standorte",
  pages: "Seiten",
  settings: "Einstellungen",
  services: "Leistungen",
};
export function previewPath(collection: Collection, id: string, data: Fields) {
  if (
    collection === "projects" ||
    collection === "cities" ||
    collection === "services"
  ) {
    if (
      typeof data.slug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)
    )
      return null;
    const prefix = {
      projects: "projekte",
      cities: "standorte",
      services: "leistungen",
    }[collection];
    return "/" + prefix + "/" + data.slug + "/";
  }
  return (
    (
      {
        home: "/",
        archive: "/projekte/",
        studio: "/ueber-uns/",
        contact: "/kontakt/",
        impressum: "/impressum/",
        datenschutz: "/datenschutz/",
      } as Record<string, string>
    )[id] ?? "/"
  );
}
