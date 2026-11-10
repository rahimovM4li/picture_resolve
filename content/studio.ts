export interface StudioStory {
  reviewStatus: "draft";
  eyebrow: string;
  title: [string, string];
  detail: { image: string; alt: string; caption: string };
  lead: string;
  image: string;
  alt: string;
  chapter: string;
  paragraphs: string[];
  source: string;
  caption: string;
  seoTitle: string;
  seoDescription: string;
}

export interface LocationStory extends StudioStory {
  slug: string;
}

export const studioStory: StudioStory = {
  reviewStatus: "draft",
  eyebrow: "Über das Studio",
  title: ["Hinter der", "Kamera."],
  detail: {
    image: "/assets/projects/kamerastudie-kiosk.webp",
    alt: "Ein Kiosk strahlt im warmen Licht aus der Nacht.",
    caption: "Filmstill · Kamerastudie bei Nacht",
  },
  lead: "Raman Seddik gründete Picture Resolve aus seiner Leidenschaft für Fotografie und Film. Sein Blick für Menschen und ihre Arbeit prägt das Studio.",
  image: "/assets/images/raman-kamera.webp",
  alt: "Raman Seddik richtet eine Filmkamera ein.",
  chapter: "Die Arbeit beginnt mit Zuhören.",
  paragraphs: [
    "Wer einen Betrieb zum ersten Mal betritt, sieht ihn mit anderen Augen als die Menschen, die jeden Tag dort arbeiten. Im ersten Gespräch kommen beide Perspektiven zusammen. Welche Details fallen Außenstehenden auf? Was schätzen die Menschen vor Ort besonders?",
    "Aus solchen Beobachtungen entwickelt Picture Resolve die Bildsprache für einen Film. Bei der Aufnahme zählen Nähe und Geduld, im Schnitt die Entscheidung, welcher Moment die Geschichte weiterträgt.",
  ],
  source: "https://pictureresolve.com/ueberuns",
  caption: "Raman Seddik · Picture Resolve",
  seoTitle: "Über Picture Resolve und Gründer Raman Seddik",
  seoDescription:
    "Lernen Sie die Arbeitsweise von Picture Resolve kennen. Gründer Raman Seddik und sein Blick auf Menschen, Handwerk und Bilder prägen die Filmproduktion.",
};

export const locations: LocationStory[] = [
  {
    reviewStatus: "draft",
    eyebrow: "Düsseldorf und Umgebung",
    title: ["Filmdreh", "am Rhein."],
    detail: {
      image: "/assets/projects/hopp-werkstatt.webp",
      alt: "Blick zwischen die Regale der Werkstatt HOPP.",
      caption: "Fotoarchiv · HOPP in Düsseldorf",
    },
    lead: "Ein Film über Ihr Unternehmen entsteht dort, wo Ihre Arbeit stattfindet. Picture Resolve begleitet Imagefilm- und Recruitingfilmprojekte in Düsseldorf und der Region.",
    image: "/assets/images/duesseldorf-panorama.webp",
    alt: "Schwarzweißes Panorama von Düsseldorf bei Nacht mit Rhein und Rheinturm.",
    chapter: "Ein Blick in eine Düsseldorfer Werkstatt.",
    paragraphs: [
      "Bei HOPP in Düsseldorf erzählen Werkzeug, Reifenlager und die Menschen am Fahrzeug vom Alltag im Kfz-Betrieb. Die veröffentlichten Werkstattbilder zeigen, wie viel ein konkreter Handgriff über ein Unternehmen vermitteln kann.",
      "Für einen Dreh in Ihrem Betrieb besprechen wir vorab Zugang, Arbeitszeiten, Geräuschkulisse und geeignete Gesprächsorte. So lässt sich planen, welche Motive sich im laufenden Betrieb aufnehmen lassen.",
    ],
    source: "https://pictureresolve.com/hopp",
    slug: "duesseldorf",
    caption: "Stadtansicht · Düsseldorf am Rhein",
    seoTitle: "Filmproduktion für Unternehmen in Düsseldorf",
    seoDescription:
      "Imagefilm und Recruitingfilm in Düsseldorf und Umgebung. Entdecken Sie eine Düsseldorfer Werkstattreportage und erfahren Sie, wie ein Dreh vor Ort geplant wird.",
  },
];

export type LegalSlug = "impressum" | "datenschutz";
interface LegalPageContent {
  reviewStatus: "needs-legal-review";
  title: string;
  status: string;
  lead: string;
  groups: [string, ...string[]][];
}

export const legalPages: Record<LegalSlug, LegalPageContent> = {
  impressum: {
    reviewStatus: "needs-legal-review",
    title: "Impressum",
    status: "Entwurf zur Freigabe",
    lead: "Die Anschrift des Anbieters ist vor Veröffentlichung zu bestätigen. Die bisherige Website führt unterschiedliche Adressen in Düsseldorf und Neuss.",
    groups: [
      [
        "Anbieter",
        "Picture Resolve",
        "Raman Seddik, im bisherigen Impressum als Inhaber genannt.",
      ],
      ["Kontakt", "info@pictureresolve.de"],
      [
        "Anschrift in Prüfung",
        "Das bisherige Impressum nennt Flurstr. 46, 40235 Düsseldorf. Auf der bisherigen Studioseite steht Heerdterbuschstr. 15, 41460 Neuss. Die gültige ladungsfähige Anschrift ist noch offen.",
      ],
    ],
  },
  datenschutz: {
    reviewStatus: "needs-legal-review",
    title: "Datenschutz",
    status: "Entwurf zur Freigabe",
    lead: "Diese Hinweise beschreiben die lokale Vorschau. Die Angaben zum künftigen Hosting, zum Verantwortlichen und zur Kontaktverarbeitung sind vor Veröffentlichung zu vervollständigen.",
    groups: [
      [
        "Lokale Projektanfrage",
        "Das Formular prüft Ihre Angaben im Browser und erzeugt dort eine Vorschau. Es übermittelt die eingegebenen Daten in dieser Version nicht an Picture Resolve. Beim Verlassen der Vorschau können die Angaben verloren gehen.",
      ],
      [
        "Kontakt per E-Mail",
        "Ein E-Mail-Link öffnet Ihr E-Mail-Programm. Wenn Sie dort eine Nachricht senden, werden die von Ihnen eingetragenen Daten über Ihren E-Mail-Anbieter übermittelt.",
      ],
      [
        "Bilder, Schriften und Film",
        "Die Vorschau verwendet lokal gespeicherte Medien und Schriften. Für das Abspielen des hinterlegten Films ist kein Konto bei einem Videodienst erforderlich.",
      ],
      [
        "Ansprechpartner",
        "Fragen zum Datenschutz können Sie an info@pictureresolve.de richten. Die vollständigen Angaben zu Verantwortlichem, Rechtsgrundlagen, Speicherfristen und Betroffenenrechten sind für den späteren Betrieb noch zu prüfen.",
      ],
    ],
  },
};

