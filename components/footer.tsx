import Image from "next/image";
import Link from "@/components/site-link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="footer-cols">
        <div className="footer-id">
          <Link href="/" aria-label="Picture Resolve – Startseite">
            <Image
              unoptimized
              alt="Picture Resolve"
              src="/assets/brand/signatur-navigation.webp"
              width={500}
              height={209}
            />
          </Link>
          <p>
            Filmproduktion aus Düsseldorf. Imagefilme und Recruitingfilme, die Vertrauen schaffen.
          </p>
        </div>
        <div>
          <p className="footer-label">Leistungen</p>
          <ul>
            {site.services.map((service) => (
              <li key={service.slug}>
                <Link href={"/leistungen/" + service.slug + "/"}>{service.title}</Link>
              </li>
            ))}
            <li><Link href="/projekte/">Projekte</Link></li>
          </ul>
        </div>
        <div>
          <p className="footer-label">Studio</p>
          <ul>
            <li><Link href="/ueber-uns/">Über uns</Link></li>
            <li><Link href="/kontakt/">Kontakt</Link></li>
            <li><Link href="/impressum/">Impressum</Link></li>
          </ul>
        </div>
        <div>
          <p className="footer-label">Standort</p>
          <p><Link href="/standorte/duesseldorf/">Düsseldorf</Link><br />Deutschland</p>
        </div>
      </div>
      <p className="footer-wordmark" inert aria-hidden="true">PICTURE RESOLVE</p>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} Picture Resolve</span>
        <Link href="/datenschutz/">Datenschutz</Link>
        <span>Gedreht in Düsseldorf</span>
      </div>
    </footer>
  );
}
