import { notFound } from "next/navigation";
import Overview from "@/components/dashboard/Overview";
import { getDictionary } from "@/content/dictionaries";
import { getMachines } from "@/content/machines";
import { getScanGroups } from "@/content/scans";
import { hasLocale } from "@/lib/i18n";

export default async function DashboardOverviewPage({ params }: PageProps<"/[lang]/dashboard">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const groups = getScanGroups(lang);
  const exams = getMachines(lang).map(({ slug, abbr, name }) => ({
    slug,
    abbr,
    name,
    scans: (groups.find((g) => g.slug === slug)?.types ?? []).map(({ id, name: scanName }) => ({ id, name: scanName })),
  }));
  return <Overview lang={lang} dict={dict.dashboard} exams={exams} />;
}
