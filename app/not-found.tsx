import Link from "@/components/site-link";
export default function NotFound() {
  return (
    <section className="wrap plain-intro">
      <p className="eyebrow">404</p>
      <h1>Seite nicht gefunden.</h1>
      <Link className="button solid" href="/">
        Zur Startseite →
      </Link>
    </section>
  );
}
