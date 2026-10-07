import Image from "next/image";
import type { CSSProperties } from "react";
import buildingImg from "@/assets/brand/about-building.jpg";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/Button";
import SplitWords from "@/components/ui/SplitWords";
import type { Dictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import styles from "./AboutTeaser.module.css";

export default function AboutTeaser({ lang, dict }: { lang: Locale; dict: Dictionary["aboutTeaser"] }) {
  return (
    <section className={`section ${styles.about}`} aria-labelledby="about-teaser-title">
      <div className={`container ${styles.grid}`}>
        <figure className={styles.media} data-reveal="scale">
          <div className={styles.photo}>
            <Image src={buildingImg} alt={dict.imageAlt} fill sizes="(max-width: 900px) 92vw, 50vw" className={styles.img} />
          </div>
          <span className={styles.badgeOrb} aria-hidden="true">
            <Logo variant="mark" className={styles.orbMark} label="" />
          </span>
        </figure>

        <div className={styles.copy}>
          <p className="kicker" data-reveal>
            {dict.kicker}
          </p>
          <SplitWords id="about-teaser-title" lines={dict.title} className="h2" />
          <p className="lead" data-reveal style={{ "--d": 150 } as CSSProperties}>
            {dict.text}
          </p>
          <p className={styles.soon} data-reveal style={{ "--d": 250 } as CSSProperties}>
            <span className={styles.pulse} aria-hidden="true" />
            {dict.badge}
          </p>
          <div data-reveal style={{ "--d": 350 } as CSSProperties}>
            <Button href={`/${lang}/about`}>{dict.cta}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
