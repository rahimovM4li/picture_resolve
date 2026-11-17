import { LegalText } from "@/components/LegalText";
import { legalMeta } from "@/components/LegalText";

export const generateMetadata = () => legalMeta("datenschutz");

export default function LegalPage() {
  return <LegalText slug="datenschutz" />;
}
