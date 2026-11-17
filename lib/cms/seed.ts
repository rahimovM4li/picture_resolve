import { projects } from "@/content/projects";
import { services } from "@/content/services";
import {
  archivePage,
  cityPages,
  homePage,
  settings,
  studioPage,
} from "@/content/editorial";
import { contactPage } from "@/content/inquiry";
import { legalPages } from "@/content/studio";
import type { CmsSeed } from "./types";

export const seedDocuments: CmsSeed[] = [
  ...projects.map((p) => ({
    collection: "projects" as const,
    id: p.slug,
    data: {
      ...p,
      services: p.services ?? ["imagefilme"],
      seoTitle: p.seoTitle ?? p.title,
      seoDescription: p.seoDescription ?? p.summary,
    },
  })),
  ...services.map((data) => ({
    collection: "services" as const,
    id: data.slug,
    data,
  })),
  ...cityPages.map((data) => ({
    collection: "cities" as const,
    id: data.slug,
    data,
  })),
  { collection: "settings", id: "site", data: settings },
  { collection: "pages", id: "home", data: homePage },
  { collection: "pages", id: "archive", data: archivePage },
  { collection: "pages", id: "studio", data: studioPage },
  { collection: "pages", id: "contact", data: contactPage },
  ...Object.entries(legalPages).map(([id, legal]) => ({
    collection: "pages" as const,
    id,
    data: { ...legal, seoTitle: legal.title, seoDescription: legal.lead },
  })),
];
