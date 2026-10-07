import { notFound } from "next/navigation";
import AboutTeaser from "@/components/home/AboutTeaser";
import ContactCta from "@/components/home/ContactCta";
import Faq from "@/components/home/Faq";
import FocusMoment from "@/components/home/FocusMoment";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import Showcase from "@/components/home/Showcase";
import VisitSteps from "@/components/home/VisitSteps";
import { getDictionary } from "@/content/dictionaries";
import { getMachines } from "@/content/machines";
import { hasLocale } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const machines = getMachines(lang);
  const heroAlt = lang === "ar" ? "غرفة جهاز رنين مغناطيسي مضاءة بالأزرق" : "An MRI suite lit in soft blue";

  return (
    <>
      <Hero lang={lang} dict={dict.hero} imageAlt={heroAlt} />
      <Manifesto dict={dict.manifesto} />
      <Showcase lang={lang} dict={dict.showcase} machines={machines} />
      <VisitSteps dict={dict.steps} />
      <FocusMoment lang={lang} dict={dict.focus} imageAlt={dict.about.mission.imageAlt} />
      <AboutTeaser lang={lang} dict={dict.aboutTeaser} />
      <Faq dict={dict.faq} note={dict.footer.disclaimer} />
      <ContactCta lang={lang} dict={dict.contact} />
    </>
  );
}
