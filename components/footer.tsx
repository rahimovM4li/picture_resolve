import Image from "next/image";
import Link from "@/components/site-link";
import { site } from "@/content/site";
export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-cols">
        <div className="footer-id">
          <Link href="/" aria-label="Picture Resolve – Startseite">
            <Image
              unoptimized
              alt="Picture Resolve"
              src="/assets/brand/signatur-weiss.webp"
              width="720"
              height="247"
            />
          </Link>
          <p>
            Filmproduktion für Unternehmen
            <br />
            in Düsseldorf und NRW.
          </p>
        </div>
        <div>
          <strong>Leistungen</strong>
          {site.services.map((s) => (
            <Link key={s.slug} href={"/leistungen/" + s.slug + "/"}>
              {s.title}
            </Link>
          ))}
        </div>
        <div>
          <strong>Studio</strong>
          <Link href="/projekte/">Projekte</Link>
          <Link href="/ueber-uns/">Über uns</Link>
          <Link href="/standorte/duesseldorf/">Düsseldorf</Link>
        </div>
        <div>
          <strong>Kontakt</strong>
          <a href={"mailto:" + site.email}>{site.email}</a>
          <Link href="/kontakt/">Projekt anfragen ↗</Link>
        </div>
      </div>
      <div className="wrap footer-base">
        <span>© Picture Resolve</span>
        <Link href="/impressum/">Impressum</Link>
        <Link href="/datenschutz/">Datenschutz</Link>
      </div>
    </footer>
  );
}
