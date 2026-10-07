import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import "lenis/dist/lenis.css";
import "../globals.css";
import BrandDefs from "@/components/brand/BrandDefs";
import { getDictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import { dirOf, hasLocale, locales } from "@/lib/i18n";

/* Brand fonts, self-hosted and subset (see README).
   Araboto carries only Arabic, so Latin letters and digits fall through to Nexa Slab,
   the brand's English and number face, even inside Arabic sentences. */
const araboto = localFont({
  src: [
    { path: "../../fonts/araboto-400.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/araboto-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-araboto",
  display: "swap",
  adjustFontFallback: false,
});

const nexaSlab = localFont({
  src: [
    { path: "../../fonts/nexa-slab-400.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/nexa-slab-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-nexa",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#061a2e",
  colorScheme: "light",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  // DEPLOY STEP: set metadataBase to the live domain so og:url and og:image become absolute.
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    applicationName: "BMC",
    alternates: { languages: { ar: "/ar", en: "/en" } },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: site.name[lang],
      locale: lang === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
  };
}

/* Runs before first paint: marks JS as available and decides which intro plays.
   The site intro plays once per session, and never when the visit starts inside the dashboard.
   The dashboard loader plays on a fresh visit to the dashboard, but not on a reload,
   on back/forward, or when the page was opened from the dashboard itself (lib/dash-intro). */
const BOOT = `(function(){var d=document.documentElement;d.classList.add('js');var re=/\\/dashboard(\\/|$)/,dash=re.test(location.pathname),skip=dash;try{if(sessionStorage.getItem('bmc-intro'))skip=true}catch(e){}if(skip)d.classList.add('intro-skip','is-ready');if(dash){var t='navigate';try{var n=performance.getEntriesByType('navigation')[0];if(n)t=n.type}catch(e){}var own=false;try{var r=new URL(document.referrer);own=r.host===location.host&&re.test(r.pathname)}catch(e){}if(t==='navigate'&&!own){d.classList.add('dash-intro');d.dataset.dashIntroAt=String(performance.now())}}})();`;

/** The shared shell for the website and the dashboard: language, direction, fonts. */
export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang} dir={dirOf(lang)} className={`${araboto.variable} ${nexaSlab.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <noscript>
          <style>{`.loader{display:none!important}[data-reveal]{opacity:1!important;transform:none!important}.split .wi{transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a className="skip" href="#main">
          {dict.nav.skip}
        </a>
        <BrandDefs />
        {children}
      </body>
    </html>
  );
}
