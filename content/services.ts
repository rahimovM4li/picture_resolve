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
  feature: { projectSlug: string; title: string; text: string };
  formats: [label: string, title: string, description: string][];
  faq: [question: string, answer: string][];
  inquiryLabel: string;
  inquiryShortLabel: string;
  cta: string;
  seoTitle: string;
  seoDescription: string;
}

const editorial: Record<ServiceSlug, Omit<ServicePageContent, "slug" | "name">> = {
  imagefilme: {
    reviewStatus: "draft",
    eyebrow: "Für Unternehmen · Marketing und Vertrieb",
    headline: "Image\nfilme.",
    intro: "Was macht Ihr Produkt besonders? Zeigen Sie Ihren Kunden, wie es entsteht und woran sie die Qualität Ihrer Arbeit erkennen.",
    image: "/assets/images/interview.webp",
    alt: "Ein Mann im Licht eines Scheinwerfers bei einer Interviewaufnahme.",
    why: [
      ["Die Kundenfrage", "Welche Entscheidung soll der Film erleichtern? Im Erstgespräch sammeln wir die Fragen, die Ihr Vertrieb im Alltag hört."],
      ["Der Dreh", "Gemeinsam wählen wir einen Arbeitsgang, den wir vom Anfang bis zum Ergebnis verfolgen. Ihr Team gibt uns Einblick in die entscheidenden Handgriffe."],
      ["Der Schnitt", "Wir ordnen die Aufnahmen so, dass auch Außenstehende den Zusammenhang verstehen. Ihre fachliche Rückmeldung fließt in die vereinbarte Endfassung ein."],
    ],
    feature: {
      projectSlug: "vom-entwurf-zum-einzelstueck",
      title: "Ein Bauteil erzählt die Geschichte.",
      text: "Woran erkennt ein Einkäufer präzise Fertigung? Unser Storyboard folgt einem Aluminiumwinkel von der Zeichnung über die Fräsbahn bis zur fertigen Kante.",
    },
    formats: [
      ["Website", "Der Hauptfilm", "Ein zusammenhängender Film führt Interessierte in Ihr Unternehmen und begleitet sie bis zum fertigen Produkt."],
      ["Vertrieb", "Die Präsentation", "Für Messegespräche oder Angebote wählen wir die Einstellungen aus, an denen Ihr Team einen konkreten Arbeitsschritt erklären möchte."],
      ["Social Media", "Der Ausschnitt", "Eine einzelne Frage aus dem Hauptfilm wird zum kurzen Beitrag. Format, Untertitel und Länge legen wir für Ihren Kanal fest."],
    ],
    faq: [
      ["Was brauchen Sie von uns?", "Eine Ansprechperson, die Ihr Produkt kennt, Zugang zum vereinbarten Drehort und die Freigabe der mitwirkenden Personen. Die Motive und Zeitfenster stimmen wir vorher mit Ihrem Team ab."],
      ["Was erhalten wir am Ende?", "Im Angebot halten wir Hauptfilm, zusätzliche Schnittfassungen, Seitenverhältnisse, Untertitel und Nutzungsumfang fest. Sie bekommen die vereinbarten Dateien für Ihre Kanäle."],
      ["Wie entsteht das Angebot?", "Nennen Sie uns Produkt, Zielgruppe und Einsatzort des Films. Daraus leiten wir Konzeption, Drehtage und Schnittumfang ab und besprechen den Zeitplan mit Ihnen."],
    ],
    inquiryLabel: "Angebot für Imagefilm anfragen",
    inquiryShortLabel: "Imagefilm anfragen",
    cta: "Was sollen Ihre Kunden\nvon Ihnen sehen?",
    seoTitle: "Imagefilme für Unternehmen aus Düsseldorf",
    seoDescription: "Machen Sie Produkte, Arbeitsweise und Qualität mit einem Imagefilm verständlich. Filmbeispiel ansehen und ein individuelles Angebot bei Picture Resolve anfragen.",
  },
  recruitingfilme: {
    reviewStatus: "draft",
    eyebrow: "Für Arbeitgeber · Personal und Ausbildung",
    headline: "Recruiting\nfilme.",
    intro: "Wer arbeitet hier mit mir? Zeigen Sie Bewerbenden eine Schicht mit Ihrem Team und die Aufgaben, die sie in Ihrer offenen Stelle erwarten.",
    image: "/assets/images/recruiting.webp",
    alt: "Eine Filmkamera begleitet ein Gespräch am Tisch vor einer Fensterfront.",
    why: [
      ["Die Stelle", "Wir sprechen mit der Person, die den Job kennt. Was passiert am ersten Tag? Mit wem arbeitet man zusammen? Daraus entwickeln wir den Drehablauf."],
      ["Die Schicht", "Die Kamera begleitet eine typische Aufgabe und die Menschen, die sie gemeinsam lösen. Wir planen die Aufnahmen rund um Ihren Betrieb."],
      ["Die Bewerbung", "Der Schnitt verbindet den Arbeitseinblick mit der konkreten Stelle. Gemeinsam legen wir fest, wo der Film zur Ausschreibung führt."],
    ],
    feature: {
      projectSlug: "deine-erste-schicht",
      title: "Die erste Schicht beginnt zu zweit.",
      text: "Eine Auszubildende kommt an die Werkbank. Ihre Ausbilderin erklärt die Maschine, dann misst die Neue ihr erstes Teil. Unser Storyboard macht die Einarbeitung für Bewerbende sichtbar.",
    },
    formats: [
      ["Karriereseite", "Der Teamfilm", "Eine zusammenhängende Geschichte zeigt Arbeitsumfeld, Zusammenarbeit und die Menschen hinter einer Stelle."],
      ["Stellenanzeige", "Das Jobporträt", "Eine Kollegin oder ein Kollege erklärt eine konkrete Aufgabe und zeigt, wie sie im Team gelöst wird."],
      ["Social Media", "Der Hochkantfilm", "Eine Szene aus dem Arbeitsalltag führt aus einer Anzeige zur offenen Stelle. Wir stimmen Länge und Untertitel auf den Kanal ab."],
    ],
    faq: [
      ["Wer muss vor die Kamera?", "Sie schlagen freiwillige Mitwirkende vor, die den Job selbst ausüben. Wir bereiten die Gespräche gemeinsam vor und klären mit Ihnen die Freigaben."],
      ["Wie viel Zeit braucht unser Team?", "Eine Ansprechperson stimmt die Aufgaben und Drehfenster mit uns ab. Im Ablaufplan steht, wann jede Person gebraucht wird und welche Bereiche zugänglich sein müssen."],
      ["Was gehört zum Angebot?", "Wir vereinbaren Drehumfang, Hauptfilm und gewünschte Kurzfassungen für Stellenanzeigen oder Social Media. Nennen Sie uns die offene Rolle, den Standort und Ihre geplanten Kanäle."],
    ],
    inquiryLabel: "Angebot für Recruitingfilm anfragen",
    inquiryShortLabel: "Recruitingfilm anfragen",
    cta: "Wen sucht\nIhr Team?",
    seoTitle: "Recruitingfilme für Arbeitgeber aus Düsseldorf",
    seoDescription: "Zeigen Sie Bewerbenden eine echte Aufgabe und das Team dahinter. Recruitingfilm-Beispiel ansehen und ein Angebot für Ihre offene Stelle anfragen.",
  },
};

export const services: ServicePageContent[] = servicePreviews.map(({ slug, title }) => ({
  slug,
  name: title,
  ...editorial[slug],
}));
