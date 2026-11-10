import { LegalText } from "@/components/LegalText";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/datenschutz",
  "Datenschutz",
  "Datenschutzhinweise zur lokalen Picture-Resolve-Vorschau, zum Anfrageformular, zur E-Mail-Kontaktaufnahme und zu den verwendeten Medien.",
);

export default function LegalPage() {
  return <LegalText slug="datenschutz" />;
}
