import { CineTitle } from "@/components/cine-title";
import { InquiryForm } from "@/components/inquiry-form";
import type { contactPage } from "@/content/inquiry";
import { getPage, getSettings } from "@/lib/public-content";
import { pageMeta } from "@/lib/seo";
import { customerDemo } from "@/lib/demo";
import "../contact.css";

export async function generateMetadata() {
  const page = await getPage<typeof contactPage>("contact");
  return pageMeta("/kontakt", page.seoTitle, page.seoDescription);
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    getPage<typeof contactPage>("contact"),
    getSettings(),
  ]);
  return (
    <section className="inquiry-page" aria-labelledby="contact-title">
      <div className="inquiry-layout">
        <div className="inquiry-intro">
          <p className="inquiry-kicker">
            <i aria-hidden="true" /> Kontakt
          </p>
          <div id="contact-title">
            <CineTitle
              lead={page.title}
              accent={page.accent}
              className="inquiry-title"
            />
          </div>
          <div className="inquiry-direct">
            <div>
              <p className="inquiry-caption">E-Mail</p>
              <a className="inquiry-email" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </div>
            <div>
              <p className="inquiry-caption">{page.regionLabel}</p>
              <p className="inquiry-address">{page.region}</p>
            </div>
            <p className="inquiry-lead">{page.intro}</p>
          </div>
        </div>
        <div className="inquiry-panel" id="anfrage" tabIndex={-1}>
          <InquiryForm
            demo={customerDemo}
            submitLabel={page.submitLabel}
            privacyText={page.privacyText}
          />
          <noscript>
            <p>
              Das Formular benötigt JavaScript. Sie erreichen uns per{" "}
              <a href={`mailto:${settings.email}`}>E-Mail</a>.
            </p>
          </noscript>
        </div>
      </div>
    </section>
  );
}
