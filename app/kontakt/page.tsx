import { CineTitle } from "@/components/cine-title";
import { InquiryForm } from "@/components/inquiry-form";
import { inquiryCopy } from "@/content/inquiry";
import { pageMeta } from "@/lib/seo";
import "../contact.css";

export const metadata = pageMeta(
  "/kontakt",
  "Filmprojekt anfragen",
  "Besprechen Sie Ihren Imagefilm oder Recruitingfilm mit Picture Resolve. Kontakt per E-Mail und lokale Vorschau für Ihr Filmbriefing.",
);

export default function ContactPage() {
  return (
    <section className="inquiry-page" aria-labelledby="contact-title">
      <div className="inquiry-layout">
        <div className="inquiry-intro">
          <p className="inquiry-kicker">
            <i aria-hidden="true" /> Kontakt
          </p>
          <div id="contact-title">
            <CineTitle
              lead={"Erzählen Sie\nuns Ihre"}
              accent="Geschichte."
              className="inquiry-title"
            />
          </div>
          <div className="inquiry-direct">
            <div>
              <p className="inquiry-caption">E-Mail</p>
              <a className="inquiry-email" href={`mailto:${inquiryCopy.email}`}>
                {inquiryCopy.email}
              </a>
            </div>
            <div>
              <p className="inquiry-caption">Studio</p>
              <p className="inquiry-address">Düsseldorf, Deutschland</p>
            </div>
            <p className="inquiry-lead">
              Erzählen Sie uns von Ihrem Unternehmen, Ihrer Zielgruppe und Ihrem
              Filmvorhaben.
            </p>
          </div>
        </div>
        <div className="inquiry-panel">
          <InquiryForm />
          <noscript>
            <p>
              Die lokale Vorschau benötigt JavaScript. Sie erreichen uns per{" "}
              <a href={`mailto:${inquiryCopy.email}`}>E-Mail</a>.
            </p>
          </noscript>
        </div>
      </div>
    </section>
  );
}
