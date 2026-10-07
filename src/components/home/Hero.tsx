import Image from "next/image";
import type { CSSProperties } from "react";
import heroImg from "@/assets/brand/hero-mri.jpg";
import BookingTrigger from "@/components/booking/BookingTrigger";
import { MARK_PATHS, MARK_VIEWBOX } from "@/components/brand/paths";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import ScrollVars from "@/components/ui/ScrollVars";
import SplitWords from "@/components/ui/SplitWords";
import type { Dictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import styles from "./Hero.module.css";

type Props = { lang: Locale; dict: Dictionary["hero"]; imageAlt: string };

export default function Hero({ lang, dict, imageAlt }: Props) {
  return (
    <ScrollVars as="section" mode="exit" className={styles.hero} ariaLabelledby="hero-title">
      <div className={styles.frame}>
        <div className={styles.media}>
          <Image
            src={heroImg}
            alt={imageAlt}
            fill
            preload
            quality={85}
            sizes="100vw"
            placeholder="blur"
            className={styles.img}
            data-hero=""
          />
        </div>
        <div className={styles.scrim} aria-hidden="true" />

        {/* The logo's crescents, drawn large, orbit the corner as the page moves. */}
        <svg className={styles.crescents} viewBox={MARK_VIEWBOX} aria-hidden="true" focusable="false">
          {MARK_PATHS.map((d, i) => (
            <path key={i} d={d} fill="url(#bmc-grad)" style={{ "--i": i } as CSSProperties} />
          ))}
        </svg>

        <div className={`container ${styles.content}`}>
          <p className={styles.eyebrow} data-reveal style={{ "--d": 60 } as CSSProperties}>
            <span className={styles.dot} aria-hidden="true" />
            {dict.eyebrow}
          </p>
          <SplitWords as="h1" id="hero-title" lines={dict.title} className={`display ${styles.title}`} delay={120} />
          <p className={styles.lead} data-reveal style={{ "--d": 520 } as CSSProperties}>
            {dict.lead}
          </p>
          <div className={styles.ctas} data-reveal style={{ "--d": 680 } as CSSProperties}>
            <BookingTrigger className="btn btn-light">
              <span>{dict.primary}</span>
              <span className="btn-ico">
                <Icon name="arrow" />
              </span>
            </BookingTrigger>
            <Button href={`/${lang}#contact`} variant="ghost">
              {dict.secondary}
            </Button>
          </div>
        </div>

        <ul className={styles.chips} data-reveal="fade" style={{ "--d": 900 } as CSSProperties}>
          {dict.chips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>

        <a className={styles.cue} href={`/${lang}#why`} aria-label={dict.scroll}>
          <span className={styles.cueRing} aria-hidden="true">
            <span className={styles.cueDot} />
          </span>
          <span className={styles.cueLabel}>{dict.scroll}</span>
        </a>
      </div>
    </ScrollVars>
  );
}
