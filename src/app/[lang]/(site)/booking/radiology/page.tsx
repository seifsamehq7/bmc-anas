import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingFlow from "@/components/booking/BookingFlow";
import PageHero from "@/components/ui/PageHero";
import { getDictionary } from "@/content/dictionaries";
import { getMachine } from "@/content/machines";
import { getScanGroups } from "@/content/scans";
import { site } from "@/content/site";
import { hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/booking/radiology">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang).booking.radiology;
  return { title: `${d.kicker} | BMC`, description: d.lead };
}

export default async function RadiologyBookingPage({ params }: PageProps<"/[lang]/booking/radiology">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang).booking.radiology;
  // Each scan department borrows its timing, radiation and prep notes from its machine.
  const groups = getScanGroups(lang).map((g) => {
    const m = getMachine(lang, g.slug);
    return {
      ...g,
      duration: m?.duration ?? "",
      radiation: m?.radiation ?? "",
      prep: m?.prep ?? "",
      before: m?.before ?? [],
    };
  });
  return (
    <>
      <PageHero patternId="radiology-hero" kicker={d.kicker} title={d.title} lead={d.lead} />
      <section className="section" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }} aria-label={d.kicker}>
        <BookingFlow lang={lang} dict={d} groups={groups} demo={site.bookingDemo} />
      </section>
    </>
  );
}
