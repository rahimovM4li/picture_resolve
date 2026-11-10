import type { Metadata } from "next";
import localFont from "next/font/local";
import { ScrollMotion } from "@/components/motion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { indexable, origin } from "@/lib/seo";
import "./font-subsets.css";
import "./globals.css";
import "./responsive.css";
import "./cinema.css";
const serif = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  preload: false,
  variable: "--font-display",
  display: "swap",
});
const display = localFont({
  src: "../node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2",
  weight: "100 900",
  preload: false,
  variable: "--font-archivo",
  display: "swap",
});
const sans = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  preload: false,
  variable: "--font-text",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: origin,
  robots: { index: indexable, follow: indexable },
  icons: { icon: "/assets/brand/signet-rot.webp" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang="de-DE"
      className={serif.variable + " " + sans.variable + " " + display.variable}
    >
      <head>
        <link
          rel="preload"
          href="/assets/fonts/archivo-de.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/fonts/instrument-serif-italic-de.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/fonts/manrope-de.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a href="#inhalt" className="skip">
          Zum Inhalt
        </a>
        <Header />
        <main id="inhalt" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ScrollMotion />
      </body>
    </html>
  );
}
