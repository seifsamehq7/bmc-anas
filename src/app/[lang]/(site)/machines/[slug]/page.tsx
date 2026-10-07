import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import CrescentPattern from "@/components/brand/CrescentPattern";
import ContactCta from "@/components/home/ContactCta";
import Icon from "@/components/ui/Icon";
import MachineLens from "@/components/ui/MachineLens";
import SplitWords from "@/components/ui/SplitWords";
import { getDictionary } from "@/content/dictionaries";
import { getMachine, getMachines, machineSlugs } from "@/content/machines";
import { hasLocale, locales, pad2 } from "@/lib/i18n";
import styles from "./machine.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => machineSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/machines/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const m = getMachine(lang, slug);
  if (!m) return {};
  return {
    title: `${m.name} (${m.abbr}) | BMC`,
    description: `${m.tagline} ${m.description}`,
    alternates: { languages: { ar: `/ar/machines/${slug}`, en: `/en/machines/${slug}` } },
  };
}

export default async function MachinePage({ params }: PageProps<"/[lang]/machines/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const m = getMachine(lang, slug);
  if (!m) notFound();
  const dict = getDictionary(lang);
  const all = getMachines(lang);
  const prev = all[(m.index - 1 + all.length) % all.length];
  const next = all[(m.index + 1) % all.length];
  const tone = { "--tone": `var(--c-${m.tone})` } as CSSProperties;

  return (
    <>
      <section className={styles.heroWrap} aria-labelledby="machine-title">
        <div className={`${styles.hero} on-deep`} style={tone}>
          <CrescentPattern id="machine-pattern" className={styles.pattern} size={60} />
          <div className={styles.glow} aria-hidden="true" />
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroText}>
              <Link href={`/${lang}/machines`} className={styles.back} data-reveal>
                <Icon name="arrow" />
                {dict.machine.back}
              </Link>
              <p className={styles.meta} data-reveal style={{ "--d": 60 } as CSSProperties}>
                <span className="latin">
                  {pad2(m.index + 1)}
                  <small>/{pad2(all.length)}</small>
                </span>
                <span className={`${styles.abbr} latin`}>{m.abbr}</span>
              </p>
              <SplitWords as="h1" id="machine-title" lines={m.name} className={`display ${styles.title}`} delay={100} />
              <p className={styles.tagline} data-reveal style={{ "--d": 360 } as CSSProperties}>
                {m.tagline}
              </p>
              <ul className={styles.facts} data-reveal style={{ "--d": 480 } as CSSProperties}>
                <li>
                  <Icon name="timer" />
                  <span>
                    <small>{dict.showcase.duration}</small>
                    {m.duration}
                  </span>
                </li>
                <li>
                  <Icon name="wave" />
                  <span>
                    <small>{dict.showcase.radiation}</small>
                    {m.radiation}
                  </span>
                </li>
                <li>
                  <Icon name="list" />
                  <span>
                    <small>{dict.showcase.prep}</small>
                    {m.prep}
                  </span>
                </li>
              </ul>
            </div>
            <div className={styles.heroLens} data-reveal="scale" style={{ "--d": 200 } as CSSProperties}>
              <MachineLens
                image={m.image}
                alt={`${m.name}. ${dict.showcase.photo}`}
                tone={m.tone}
                sizes="(max-width: 900px) 84vw, 44vw"
                preload
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.about}`} aria-labelledby="what-title">
        <div className={`container ${styles.aboutGrid}`}>
          <div className={styles.what}>
            <p className="kicker" data-reveal>
              {m.abbr}
            </p>
            <SplitWords id="what-title" lines={dict.machine.what} className="h2" />
            <p className={styles.bigText} data-reveal style={{ "--d": 150 } as CSSProperties}>
              {m.description}
            </p>
          </div>
          <div className={styles.uses} data-reveal style={{ "--d": 200 } as CSSProperties}>
            <h2 className={styles.usesTitle}>{dict.machine.uses}</h2>
            <ul className={styles.usesList}>
              {m.uses.map((u) => (
                <li key={u}>
                  <span className={styles.check} aria-hidden="true">
                    <Icon name="check" />
                  </span>
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`section ${styles.prep}`} aria-label={`${dict.machine.before}, ${dict.machine.during}`}>
        <div className={`container ${styles.prepGrid}`}>
          {[
            { title: dict.machine.before, items: m.before, icon: "list" as const },
            { title: dict.machine.during, items: m.during, icon: "spark" as const },
          ].map((block, b) => (
            <article key={block.title} className={styles.prepCard} data-reveal style={{ "--d": b * 120 } as CSSProperties}>
              <span className={styles.prepIcon} aria-hidden="true">
                <Icon name={block.icon} />
              </span>
              <h2 className={styles.prepTitle}>{block.title}</h2>
              <ol className={styles.prepList}>
                {block.items.map((item, i) => (
                  <li key={item}>
                    <span className={`${styles.prepNum} latin`}>{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <nav className={`container ${styles.pager}`} aria-label={dict.machine.all}>
        {[
          { label: dict.machine.prev, m: prev, dir: "prev" },
          { label: dict.machine.next, m: next, dir: "next" },
        ].map(({ label, m: item, dir }) => (
          <Link key={dir} href={`/${lang}/machines/${item.slug}`} className={styles.pageLink} data-dir={dir} data-reveal>
            <MachineLens image={item.image} alt="" tone={item.tone} sizes="120px" className={styles.pageLens} idle={false} />
            <span>
              <small>{label}</small>
              <strong>{item.name}</strong>
            </span>
            <span className={styles.pageArrow} aria-hidden="true">
              <Icon name="arrow" />
            </span>
          </Link>
        ))}
      </nav>

      <ContactCta lang={lang} dict={dict.contact} />
    </>
  );
}
