import { notFound } from "next/navigation";
import ComingSoon from "@/components/dashboard/ComingSoon";
import { DASHBOARD_SECTIONS } from "@/components/dashboard/sections";
import type { IconName } from "@/components/ui/Icon";
import { getDictionary } from "@/content/dictionaries";
import { hasLocale, locales } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => DASHBOARD_SECTIONS.map((section) => ({ lang, section })));
}

const ICONS: Record<(typeof DASHBOARD_SECTIONS)[number], IconName> = {
  bookings: "ticket",
  calendar: "calendar",
  finances: "wallet",
  settings: "settings",
  clients: "users",
  admins: "shield",
};

/** Booking, calendar, finances, settings, clients and admins: coming soon. */
export default async function DashboardSectionPage({ params }: PageProps<"/[lang]/dashboard/[section]">) {
  const { lang, section } = await params;
  if (!hasLocale(lang)) notFound();
  const key = DASHBOARD_SECTIONS.find((s) => s === section);
  if (!key) notFound();
  const d = getDictionary(lang).dashboard;
  return <ComingSoon title={d.nav[key]} icon={ICONS[key]} dict={d.soon} backHref={`/${lang}/dashboard`} />;
}
