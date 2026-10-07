import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getDictionary } from "@/content/dictionaries";
import { hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: LayoutProps<"/[lang]/dashboard">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: getDictionary(lang).dashboard.meta, robots: { index: false, follow: false } };
}

/** The admin dashboard: its own shell, no site header, footer or smooth scrolling. */
export default async function DashboardLayout({ children, params }: LayoutProps<"/[lang]/dashboard">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <DashboardShell lang={lang} dict={dict.dashboard} langShort={dict.nav.langShort}>
      {children}
    </DashboardShell>
  );
}
