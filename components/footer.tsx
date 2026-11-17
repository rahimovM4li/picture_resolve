import Image from "next/image";
import Link from "@/components/site-link";
import { getCities, getSettings, getServices } from "@/lib/public-content";

export async function Footer() {
  const [site, cities, services] = await Promise.all([
    getSettings(),
    getCities(),
    getServices(),
  ]);
  return (
    <footer id="footer" className="footer">
      <div className="footer-cols">
        <div className="footer-id">
          <Link href="/" aria-label="Picture Resolve – Startseite">
            <Image
              unoptimized
              alt="Picture Resolve"
              src={site.logo}
              width={500}
              height={209}
            />
          </Link>
          <p>{site.footerIntro}</p>
        </div>
        <div>
          <p className="footer-label">Leistungen</p>
          <ul>
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={"/leistungen/" + service.slug + "/"}>
                  {service.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/projekte/">Projekte</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="footer-label">Studio</p>
          <ul>
            {site.studioLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-label">Standort</p>
          <ul>
            {cities.map((c) => (
              <li key={c.slug}>
                <Link href={`/standorte/${c.slug}/`}>{c.city}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="footer-wordmark" inert aria-hidden="true">
        PICTURE RESOLVE
      </p>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} Picture Resolve</span>
        <Link href="/datenschutz/">Datenschutz</Link>
        <span>{site.footerCredit}</span>
      </div>
    </footer>
  );
}
