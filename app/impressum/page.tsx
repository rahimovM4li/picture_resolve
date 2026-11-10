import { LegalText } from "@/components/LegalText";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/impressum",
  "Impressum",
  "Angaben zum Anbieter Picture Resolve und zur Kontaktaufnahme. Die Anschrift befindet sich in dieser lokalen Vorschau noch in Prüfung.",
);

export default function LegalPage() {
  return <LegalText slug="impressum" />;
}
