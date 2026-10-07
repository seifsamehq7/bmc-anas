import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DepartmentCards from "@/components/booking/DepartmentCards";
import PageHero from "@/components/ui/PageHero";
import { getDictionary } from "@/content/dictionaries";
import { hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/booking">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang).booking.chooser;
  return { title: `${d.kicker} | BMC`, description: d.lead };
}

export default async function BookingPage({ params }: PageProps<"/[lang]/booking">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang).booking.chooser;
  return (
    <>
      <PageHero patternId="booking-hero" kicker={d.kicker} title={d.title} lead={d.lead} />
      <section className="section" aria-label={d.title}>
        <div className="container" data-reveal>
          <DepartmentCards lang={lang} dict={d} />
        </div>
      </section>
    </>
  );
}
