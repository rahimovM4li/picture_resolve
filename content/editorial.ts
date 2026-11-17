import { homeCopy } from "./home";
import { homeEditorial } from "./home-editorial";
import { filmWalkthrough } from "./film-walkthrough";
import { site, processSteps, testimonials } from "./site";
import { locations } from "./studio";

export const settings = {
  name: site.name,
  email: site.email,
  logo: "/assets/brand/signatur-navigation.webp",
  navigation: [...site.navigation],
  contact: { label: "Projekt anfragen", href: "/kontakt/" },
  footerIntro:
    "Filmproduktion für Unternehmen. Imagefilme und Recruitingfilme aus Düsseldorf.",
  footerCredit: "Gedreht in Düsseldorf",
  studioLinks: [
    { label: "Über uns", href: "/ueber-uns/" },
    { label: "Kontakt", href: "/kontakt/" },
    { label: "Impressum", href: "/impressum/" },
  ],
};
export const homePage = {
  title: "Startseite",
  seoTitle: homeCopy.seo.title,
  seoDescription: homeCopy.seo.description,
  headline: [...homeCopy.headline],
  eyebrow: "Filmproduktion · Düsseldorf",
  intro: homeCopy.proposition.join(" "),
  image: "/assets/images/raman-kamera.webp",
  alt: "Raman Seddik am Set mit seiner Filmkamera.",
  showreelSlug: "kamerastudie",
  featuredSlugs: [
    "kamerastudie",
    "vom-entwurf-zum-einzelstueck",
    "deine-erste-schicht",
    "hopp",
    "ein-produkt-drei-einstellungen",
  ],
  serviceSlugs: ["imagefilme", "recruitingfilme"],
  manifesto: homeEditorial.manifesto,
  work: homeEditorial.work,
  serviceHeading: {
    lead: homeEditorial.services.lead,
    accent: homeEditorial.services.accent,
  },
  processHeading: {
    lead: homeEditorial.process.lead,
    accent: homeEditorial.process.accent,
  },
  steps: homeEditorial.process.images.map((image, i) => ({
    ...image,
    title: processSteps[i][0],
    text:
      i === 3
        ? "Schnitt, Farbe und Ton geben dem Film seine endgültige Form. Sie erhalten die vereinbarten Fassungen für Ihre Kanäle."
        : processSteps[i][1],
  })),
  walkthrough: {
    ...filmWalkthrough,
    heading: "Eine Nacht in",
    accent: "drei Einstellungen.",
  },
  testimonials: testimonials.map((t) => ({
    ...t,
    image: "/assets/projects/hopp-portraet.webp",
    alt: "Porträt aus der Düsseldorfer Werkstatt HOPP",
  })),
  partnersImage: "/assets/brand/zusammenarbeit.webp",
  partnersStill: "/assets/brand/zusammenarbeit-ruhig.webp",
  partnersAlt:
    "Deutscher Sparkassenverlag, Mercedes-Benz, Bosch, Xotic Moves, HOPP, Carglass und Zahnimpuls",
  contactHeading: "Wann dürfen wir Ihre Geschichte",
  contactAccent: "erzählen?",
};

export const archivePage = {
  title: "Projekte.",
  eyebrow: "Referenzen",
  intro:
    "Filmstudien, Werkstattporträts und eigene Konzepte. Entdecken Sie die Bilder hinter den Projekten.",
  image: "/assets/images/duesseldorf-skyline.webp",
  alt: "Düsseldorfer Skyline bei Nacht mit Rheinturm und Lichtern am Ufer.",
  seoTitle: "Projekte & Referenzen",
  seoDescription:
    "Studiofilm, Werkstattreportage, Porträts und Filmkonzepte. Ausgewählte Arbeiten von Picture Resolve.",
  contactTitle: "Ihr Projekt\nals Nächstes?",
};

export const studioPage = {
  title: "Über\nuns.",
  eyebrow: "Studio",
  intro:
    "Wir begleiten Menschen bei der Arbeit. Aus Gesprächen, Beobachtungen und präzise gesetztem Licht entwickeln wir Filme für Unternehmen.",
  image: "/assets/images/studio-fotograf-banner.webp",
  alt: "Ein Fotograf von Picture Resolve blickt durch den Sucher.",
  seoTitle: "Über uns – das Studio",
  seoDescription:
    "Lernen Sie Picture Resolve und die Arbeitsweise des Studios für Film und Fotografie kennen.",
  team: [
    {
      name: "Raman Seddik",
      role: "Gründer · Film und Fotografie",
      image: "/assets/images/raman-kamera.webp",
      alt: "Raman Seddik am Set mit seiner Filmkamera.",
    },
  ],
  chapter: "Film ist Vertrauenssache.",
  text: "Am Anfang sprechen wir darüber, wer Ihren Film sehen soll. Wir schauen uns die Abläufe in Ihrem Betrieb an, wählen Motive aus und klären gemeinsam, welche Menschen vor die Kamera treten. Daraus entstehen Drehplan und Bildsprache.",
  valuesHeading: "Hohe Standards.\nKlare Werte.",
  values: [
    ["Präzision", "Jedes Bild ist eine Entscheidung."],
    ["Nähe", "Wir hören zu, bevor wir drehen."],
    ["Technik", "Licht und Ton machen auch leise Arbeitsabläufe sichtbar."],
    [
      "Verlässlichkeit",
      "Sie wissen vor dem Dreh, was wir aufnehmen und welche Fassungen Sie erhalten.",
    ],
  ],
  regionalTitle: "Drehen in Düsseldorf.",
  regionalImage: "/assets/images/duesseldorf-skyline.webp",
  regionalAlt: "Der Rheinturm und die Düsseldorfer Uferpromenade bei Nacht.",
  contactTitle: "Wann dürfen wir\nIhre Geschichte erzählen?",
};

export const cityPages = locations.map((location) => ({
  ...location,
  city: "Düsseldorf",
  projectSlug: "hopp",
  contact: { label: "Dreh vor Ort anfragen", href: "/kontakt/" },
}));
export type CityPage = (typeof cityPages)[number];
