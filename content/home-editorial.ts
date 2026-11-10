export const homeEditorial = {
  review: "draft-for-client-review",
  manifesto:
    "Ein Film ist Vertrauenssache. Wir zeigen, wer hinter Ihrem Produkt steht, wer Ihre Dienstleistung lebt und warum Menschen bei Ihnen arbeiten wollen.",
  services: {
    lead: "Zwei Disziplinen.",
    accent: "Ein Anspruch.",
    images: {
      imagefilme: "/assets/images/interview.webp",
      recruitingfilme: "/assets/images/recruiting.webp",
    },
  },
  work: { lead: "Bilder, die", accent: "bleiben." },
  process: {
    lead: "Vom ersten Gespräch",
    accent: "zur Premiere.",
    images: [
      {
        src: "/assets/projects/hopp-portraet.webp",
        alt: "Schwarzweißporträt aus der HOPP-Werkstatt",
        credit: "HOPP · Werkstattporträt",
      },
      {
        src: "/assets/projects/kamerastudie-ufer.webp",
        alt: "Der Fotograf steht im Licht einer Uferlaterne",
        credit: "Kamerastudie · 01:22",
      },
      {
        src: "/assets/images/raman-kamera.webp",
        alt: "Raman Seddik arbeitet an der Filmkamera",
        credit: "Picture Resolve · Am Set",
      },
      {
        src: "/assets/projects/kamerastudie-handgriff.webp",
        alt: "Nahaufnahme der Hände des Fotografen an seiner Kamera",
        credit: "Kamerastudie · 01:30",
      },
    ],
  },
} as const;

