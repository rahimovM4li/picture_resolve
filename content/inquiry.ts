import { site } from "./site";

export const inquiryCopy = {
  review: "draft-for-client-review",
  title: "Projekt anfragen",
  intro:
    "Was möchten Sie mit Ihrem Film zeigen? Ein paar Sätze zu Ihrem Unternehmen, Ihrer Zielgruppe und Ihrem Vorhaben genügen.",
  demo: "Demo-Modus · Ihre Angaben bleiben in diesem Browser. Das Formular erstellt eine Vorschau. Für eine Anfrage erreichen Sie uns direkt per E-Mail.",
  email: site.email,
  services: [
    ...site.services.map(({ slug, title }) => ({ value: slug, label: title })),
    { value: "beratung", label: "Ich möchte mich beraten lassen" },
    { value: "anderes", label: "Anderes Filmprojekt" },
  ],
  budgets: [
    "Unter 5.000 €",
    "5.000–10.000 €",
    "10.000–25.000 €",
    "Ab 25.000 €",
  ],
} as const;
