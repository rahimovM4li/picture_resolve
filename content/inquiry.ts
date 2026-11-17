import { site } from "./site";

export const contactPage = {
  title: "Erzählen Sie\nuns Ihre",
  accent: "Geschichte.",
  intro:
    "Was sollen Kunden über Ihr Unternehmen erfahren? Welche Stelle möchten Sie besetzen? Ein paar Sätze zur Zielgruppe und zum geplanten Einsatz genügen für das erste Gespräch.",
  regionLabel: "Einsatzgebiet",
  region: "Düsseldorf und Umgebung",
  submitLabel: "Anfrage senden",
  privacyText:
    "Ich bin damit einverstanden, dass Picture Resolve meine Angaben zur Bearbeitung der Anfrage verwendet.",
  seoTitle: "Imagefilm oder Recruitingfilm anfragen",
  seoDescription:
    "Fragen Sie ein Angebot für Ihren Imagefilm oder Recruitingfilm an. Beschreiben Sie kurz Ihr Unternehmen, die Zielgruppe und wo Sie den Film zeigen möchten.",
};

export const inquiryCopy = {
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
};
