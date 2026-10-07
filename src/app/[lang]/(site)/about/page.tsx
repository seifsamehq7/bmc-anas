import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import buildingImg from "@/assets/brand/about-building.jpg";
import identityImg from "@/assets/brand/about-identity.jpg";
import scanImg from "@/assets/brand/about-scan.jpg";
import Logo from "@/components/brand/Logo";
import ContactCta from "@/components/home/ContactCta";
import Button from "@/components/ui/Button";
import ScrollVars from "@/components/ui/ScrollVars";
import SplitWords from "@/components/ui/SplitWords";
import { getDictionary } from "@/content/dictionaries";
import { hasLocale } from "@/lib/i18n";
import styles from "./about.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.meta.aboutTitle,
    description: dict.meta.aboutDescription,
    alternates: { languages: { ar: "/ar/about", en: "/en/about" } },
  };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const a = dict.about;

  return (
    <>
      {/* Guide page 9: the building at dusk. */}
      <ScrollVars as="section" mode="exit" className={styles.hero} ariaLabelledby="about-title">
        <div className={styles.heroFrame}>
          <div className={styles.heroMedia}>
            <Image src={buildingImg} alt={a.hero.imageAlt} fill preload sizes="100vw" quality={85} placeholder="blur" className={styles.cover} data-hero="" />
          </div>
          <div className={styles.heroScrim} aria-hidden="true" />
          <div className={`container ${styles.heroContent}`}>
            <p className="kicker" data-reveal>
              {a.hero.kicker}
            </p>
            <SplitWords as="h1" id="about-title" lines={a.hero.title} className={`display ${styles.heroTitle}`} delay={100} />
            <p className={styles.heroLead} data-reveal style={{ "--d": 420 } as CSSProperties}>
              {a.hero.lead}
            </p>
          </div>
        </div>
      </ScrollVars>

      <section className={`section ${styles.story}`} aria-labelledby="story-title">
        <div className={`container ${styles.storyGrid}`}>
          <div className={styles.storyHead}>
            <p className="kicker" data-reveal>
              {a.story.kicker}
            </p>
            <SplitWords id="story-title" lines={a.story.title} className="h2" />
          </div>
          <div className={styles.storyBody}>
            {a.story.text.map((t, i) => (
              <p key={i} className={i === 0 ? styles.storyLead : styles.storyText} data-reveal style={{ "--d": 120 + i * 120 } as CSSProperties}>
                {t}
              </p>
            ))}
          </div>
        </div>
        <ul className={`container ${styles.facts}`}>
          {a.story.facts.map((f, i) => (
            <li key={f.label} className={styles.fact} data-reveal style={{ "--d": i * 120 } as CSSProperties}>
              <span className={`${styles.factValue} latin`}>{f.value}</span>
              <span className={styles.factLabel}>{f.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Guide page 10: technology in a caring hand. */}
      <section className={`section ${styles.missionWrap}`} aria-labelledby="mission-title">
        <div className="container">
          <ScrollVars className={styles.mission}>
            <div className={styles.missionMedia}>
              <Image src={scanImg} alt={a.mission.imageAlt} fill sizes="(max-width: 1320px) 92vw, 1320px" className={styles.cover} />
            </div>
            <div className={styles.missionScrim} aria-hidden="true" />
            <div className={styles.missionContent}>
              <p className="kicker" data-reveal>
                {a.mission.kicker}
              </p>
              <SplitWords id="mission-title" lines={a.mission.title} className={`h2 ${styles.missionTitle}`} />
              <p className={styles.missionText} data-reveal style={{ "--d": 200 } as CSSProperties}>
                {a.mission.text}
              </p>
            </div>
          </ScrollVars>
        </div>
      </section>

      <section className={`section ${styles.values}`} aria-labelledby="values-title">
        <div className="container">
          <header className={styles.valuesHead}>
            <p className="kicker" data-reveal>
              {a.values.kicker}
            </p>
            <SplitWords id="values-title" lines={a.values.title} className="h2" />
          </header>

          {/* Five values orbit the mark, the way care surrounds one patient. */}
          <div className={styles.orbit}>
            <div className={styles.orbitRing} aria-hidden="true" />
            <div className={styles.orbitRing2} aria-hidden="true" />
            <div className={styles.orbitCore} data-reveal="scale">
              <Logo variant="mark" className={styles.orbitMark} label="" />
            </div>
            <ol className={styles.orbitList}>
              {a.values.items.map((v, i) => (
                <li
                  key={v.title}
                  className={styles.value}
                  style={{ "--a": `${-90 + i * 72}deg`, "--d": 200 + i * 110 } as CSSProperties}
                >
                  <div className={styles.valueInner} data-reveal="scale" style={{ "--d": 200 + i * 110 } as CSSProperties}>
                    <h3 className={styles.valueTitle}>{v.title}</h3>
                    <p className={styles.valueText}>{v.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Guide page 12: the identity at every touchpoint. */}
      <section className={`section ${styles.nextWrap}`} aria-labelledby="next-title">
        <div className="container">
          <div className={styles.next}>
            <div className={styles.nextMedia}>
              <Image src={identityImg} alt={a.next.imageAlt} fill sizes="(max-width: 1320px) 92vw, 1320px" className={styles.cover} />
            </div>
            <div className={styles.nextScrim} aria-hidden="true" />
            <div className={styles.nextContent}>
              <p className="kicker" data-reveal>
                <span className={styles.soonDot} aria-hidden="true" />
                {a.next.kicker}
              </p>
              <SplitWords id="next-title" lines={a.next.title} className={`h2 ${styles.nextTitle}`} />
              <p className={styles.nextText} data-reveal style={{ "--d": 200 } as CSSProperties}>
                {a.next.text}
              </p>
              <div data-reveal style={{ "--d": 320 } as CSSProperties}>
                <Button href={`/${lang}/machines`} variant="light">
                  {dict.nav.machines}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactCta lang={lang} dict={dict.contact} />
    </>
  );
}
