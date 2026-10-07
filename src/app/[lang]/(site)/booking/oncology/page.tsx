import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import { getDictionary } from "@/content/dictionaries";
import { hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/booking/oncology">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = getDictionary(lang).booking.oncology;
  return { title: `${d.kicker} | BMC` };
}

/** The oncology department: the page exists, its content comes later. */
export default async function OncologyPage({ params }: PageProps<"/[lang]/booking/oncology">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang).booking.oncology;
  return (
    <PageHero patternId="oncology-hero" kicker={d.kicker} title={d.title} fill>
      <div data-reveal style={{ marginTop: 12 }}>
        <Button href={`/${lang}`} variant="light">
          {d.back}
        </Button>
      </div>
    </PageHero>
  );
}
