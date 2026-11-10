import { servicePreviews, type ServiceSlug } from "./service-index";

export interface ServicePageContent {
  slug: ServiceSlug;
  name: string;
  reviewStatus: "draft";
  eyebrow: string;
  headline: string;
  intro: string;
  image: string;
  alt: string;
  why: [title: string, description: string][];
  feature: { image: string; alt: string; title: string; text: string };
  formats: [length: string, title: string, description: string][];
  faq: [question: string, answer: string][];
  cta: string;
  seoTitle: string;
  seoDescription: string;
}

const editorial: Record<
  ServiceSlug,
  Omit<ServicePageContent, "slug" | "name">
> = {
  imagefilme: {
    reviewStatus: "draft",
    eyebrow: "Leistung · Imagefilm",
    headline: "Image\nfilme.",
    intro:
      "Wer steht hinter Ihrem Produkt? Wer lebt Ihre Dienstleistung? Wir machen sichtbar, was Ihr Unternehmen ausmacht – und schaffen Vertrauen, bevor das erste Gespräch beginnt.",
    image: "/assets/images/interview.webp",
    alt: "Ein Mann im Licht eines Scheinwerfers bei einer Interviewaufnahme.",
    why: [
      [
        "Vertrauen",
        "Menschen kaufen von Menschen. Ein Imagefilm zeigt Gesichter, Haltung und Handwerk.",
      ],
      [
        "Wiedererkennung",
        "Eine eigene Bildsprache, die Ihre Marke unverwechselbar macht – auf allen Kanälen.",
      ],
      [
        "Reichweite",
        "Website, Social, Messe, Pitch: ein Dreh, viele Schnittfassungen, maximale Nutzung.",
      ],
    ],
    feature: {
      image: "/assets/projects/hopp-werkstatt.webp",
      alt: "Blick zwischen Reifenregale in der Werkstatt HOPP.",
      title: "Das Detail entscheidet.",
      text: "Mit Cinema-Kameras, präzisem Licht und ruhiger Kameraführung zeigen wir Ihr Handwerk so, wie es gesehen werden will.",
    },
    formats: [
      [
        "90–180 Sek.",
        "Hauptfilm",
        "Die große Erzählung Ihres Unternehmens für Website und Präsentationen.",
      ],
      [
        "15–30 Sek.",
        "Social Cut-downs",
        "Hochkant und quer, optimiert für Instagram, LinkedIn und YouTube.",
      ],
      [
        "Stills",
        "Set-Fotografie",
        "Hochwertige Fotos vom Dreh für Presse, Web und Print.",
      ],
    ],
    faq: [
      [
        "Wie lange dauert eine Produktion?",
        "In der Regel 4–6 Wochen vom Erstgespräch bis zur finalen Abnahme.",
      ],
      [
        "Was kostet ein Imagefilm?",
        "Das hängt von Umfang, Drehtagen und Formaten ab. Nach dem Erstgespräch erhalten Sie ein transparentes Angebot.",
      ],
      [
        "Drehen Sie auch außerhalb von Düsseldorf?",
        "Ja – deutschlandweit und auf Anfrage international.",
      ],
    ],
    cta: "Ihr Unternehmen.\nIhr Film.",
    seoTitle: "Imagefilm Düsseldorf – Picture Resolve",
    seoDescription:
      "Cinematische Imagefilme aus Düsseldorf: Konzept, Dreh und Postproduktion für Unternehmen, Marken und Meisterbetriebe.",
  },
  recruitingfilme: {
    reviewStatus: "draft",
    eyebrow: "Leistung · Recruitingfilm",
    headline: "Recruiting\nfilme.",
    intro:
      "Die besten Talente bewerben sich dort, wo sie sich wiedererkennen. Wir zeigen echte Kolleg:innen, echte Arbeit und eine Kultur, die man spürt.",
    image: "/assets/images/recruiting.webp",
    alt: "Eine Filmkamera begleitet ein Gespräch am Tisch vor einer Fensterfront.",
    why: [
      [
        "Authentizität",
        "Keine Stockbilder, keine Floskeln. Ihr Team erzählt – wir sorgen für die Bühne.",
      ],
      [
        "Passende Bewerbungen",
        "Ehrliche Einblicke ziehen Menschen an, die wirklich zu Ihnen passen.",
      ],
      [
        "Schneller besetzt",
        "Video-Stellenanzeigen erzielen messbar mehr Aufmerksamkeit auf Jobportalen und Social Media.",
      ],
    ],
    feature: {
      image: "/assets/images/raman-kamera.webp",
      alt: "Raman Seddik richtet eine Filmkamera am Set ein.",
      title: "Arbeitgeber, inszeniert wie Kino.",
      text: "Wir begleiten Ihr Team mit kleiner Crew durch den Alltag – unaufdringlich, respektvoll, nah dran.",
    },
    formats: [
      [
        "60–120 Sek.",
        "Employer Film",
        "Ihre Arbeitgebermarke in einem starken, emotionalen Film.",
      ],
      [
        "30–60 Sek.",
        "Job-Spots",
        "Konkrete Stellen, erklärt von den Menschen, die sie heute schon machen.",
      ],
      [
        "9:16",
        "Azubi-Content",
        "Social-first Formate für TikTok und Instagram – in der Sprache Ihrer Zielgruppe.",
      ],
    ],
    faq: [
      [
        "Müssen unsere Mitarbeitenden vor die Kamera?",
        "Nur wer möchte. Wir bereiten Interviews behutsam vor und sorgen für eine entspannte Atmosphäre.",
      ],
      [
        "Stört der Dreh den Betrieb?",
        "Wir arbeiten mit kleiner Crew und planen so, dass der Alltag weiterläuft.",
      ],
      [
        "Bekommen wir auch Social-Formate?",
        "Ja, Hochkant- und Kurzversionen sind auf Wunsch fester Bestandteil des Pakets.",
      ],
    ],
    cta: "Finden Sie Menschen,\ndie bleiben.",
    seoTitle: "Recruitingfilm Düsseldorf – Picture Resolve",
    seoDescription:
      "Recruitingfilme und Employer-Branding-Videos aus Düsseldorf, die Fachkräfte und Azubis überzeugen.",
  },
};

export const services: ServicePageContent[] = servicePreviews.map(
  ({ slug, title }) => ({
    slug,
    name: title,
    ...editorial[slug],
  }),
);
