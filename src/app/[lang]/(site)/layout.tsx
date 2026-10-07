import BookingProvider from "@/components/booking/BookingProvider";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Loader from "@/components/layout/Loader";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { getDictionary } from "@/content/dictionaries";
import { getMachines } from "@/content/machines";
import { site } from "@/content/site";
import { hasLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

/** The public website: intro loader, smooth scrolling, header, side menu, footer, booking chooser. */
export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const machines = getMachines(lang);

  return (
    <BookingProvider lang={lang} dict={dict.booking.chooser}>
      <Loader label={dict.loader.label} name={site.name[lang]} />
      <div className="ambient" aria-hidden="true" />
      <SmoothScroll />
      <Header
        lang={lang}
        nav={dict.nav}
        brandName={site.name[lang]}
        machines={machines.map(({ slug, abbr, name }) => ({ slug, abbr, name }))}
      />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer lang={lang} dict={dict} machines={machines} />
    </BookingProvider>
  );
}
