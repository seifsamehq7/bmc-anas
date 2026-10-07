import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import ContactCta from "@/components/home/ContactCta";
import Icon from "@/components/ui/Icon";
import MachineLens from "@/components/ui/MachineLens";
import PageHero from "@/components/ui/PageHero";
import { getDictionary } from "@/content/dictionaries";
import { getMachines } from "@/content/machines";
import { hasLocale, pad2 } from "@/lib/i18n";
import styles from "./machines.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/machines">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.meta.machinesTitle,
    description: dict.meta.machinesDescription,
    alternates: { languages: { ar: "/ar/machines", en: "/en/machines" } },
  };
}

export default async function MachinesPage({ params }: PageProps<"/[lang]/machines">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const machines = getMachines(lang);

  return (
    <>
      <PageHero patternId="machines-hero" kicker={dict.machinesPage.kicker} title={dict.machinesPage.title} lead={dict.machinesPage.lead} />

      <section className={`section ${styles.gridSection}`} aria-label={dict.machinesPage.kicker}>
        <ul className={`container ${styles.grid}`}>
          {machines.map((m, i) => (
            <li key={m.slug} data-reveal style={{ "--d": (i % 3) * 90 } as CSSProperties}>
              <Link href={`/${lang}/machines/${m.slug}`} className={styles.card}>
                <MachineLens
                  image={m.image}
                  alt={`${m.name}. ${dict.showcase.photo}`}
                  tone={m.tone}
                  sizes="(max-width: 700px) 80vw, (max-width: 1100px) 40vw, 26vw"
                  className={styles.lens}
                  preload={i < 3}
                />
                <div className={styles.cardText}>
                  <p className={styles.cardMeta}>
                    <span className="latin">{pad2(i + 1)}</span>
                    <span className={`${styles.abbr} latin`}>{m.abbr}</span>
                  </p>
                  <h2 className={styles.cardTitle}>{m.name}</h2>
                  <p className={styles.cardTag}>{m.tagline}</p>
                </div>
                <span className={styles.arrow} aria-hidden="true">
                  <Icon name="arrow" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ContactCta lang={lang} dict={dict.contact} />
    </>
  );
}
