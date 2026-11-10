import { servicePreviews } from "./service-index";

export const site = {
  name: "Picture Resolve",
  language: "de-DE",
  email: "info@pictureresolve.de",
  copyStatus: "draft-for-client-review",
  navigation: [
    ...servicePreviews.map((service) => ({
      label: service.title,
      href: "/leistungen/" + service.slug + "/",
    })),
    { label: "Projekte", href: "/projekte/" },
    { label: "Über uns", href: "/ueber-uns/" },
  ],
  services: servicePreviews,
} as const;

export interface Testimonial {
  quote: string;
  attribution: string;
  source: string;
  review: "approved" | "pending";
}
export const testimonials: readonly Testimonial[] = [
  {
    quote:
      "Super professionelles Team! Sowohl die Planung als auch die Umsetzung.",
    attribution: "Kfz-Werkstatt HOPP, Düsseldorf",
    source: "https://pictureresolve.com/hopp",
    review: "pending",
  },
];
export const processSteps = [
  [
    "Erstgespräch",
    "Wir sprechen über Ihre Zielgruppe, den Anlass und darüber, wo der Film später zu sehen sein soll.",
  ],
  [
    "Konzept",
    "Aus dem Gespräch entwickeln wir die Erzählidee, die Bildsprache und einen Ablauf für den Dreh.",
  ],
  [
    "Dreharbeiten",
    "Wir begleiten Ihr Team am Arbeitsplatz und nehmen uns Zeit für Beobachtungen und Gespräche.",
  ],
  [
    "Postproduktion",
    "Im Schnitt entsteht der Rhythmus. Farbe, Ton und Ihre Rückmeldung geben dem Film seine endgültige Form.",
  ],
  [
    "Übergabe",
    "Sie erhalten die vereinbarten Fassungen für Ihre Website, die Präsentation oder Ihre Social-Media-Kanäle.",
  ],
] as const;
