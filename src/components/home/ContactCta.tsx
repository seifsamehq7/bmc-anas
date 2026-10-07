import type { CSSProperties } from "react";
import BookingTrigger from "@/components/booking/BookingTrigger";
import CrescentPattern from "@/components/brand/CrescentPattern";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import SplitWords from "@/components/ui/SplitWords";
import type { Dictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import styles from "./ContactCta.module.css";

/** The single call to action every page funnels to. */
export default function ContactCta({ lang, dict }: { lang: Locale; dict: Dictionary["contact"] }) {
  return (
    <section id="contact" className={`section ${styles.wrap}`} aria-labelledby="contact-title">
      <div className="container">
        <div className={`${styles.card} on-deep`} data-reveal="scale">
          <CrescentPattern id="contact-pattern" className={styles.pattern} size={60} />
          <div className={styles.glow} aria-hidden="true" />

          <div className={styles.main}>
            <p className="kicker">{dict.kicker}</p>
            <SplitWords id="contact-title" lines={dict.title} className={`h2 ${styles.title}`} />
            <p className="lead">{dict.lead}</p>
            <div className={styles.actions}>
              <Button href={site.phoneHref} variant="light" icon="phone">
                {dict.call}
              </Button>
              <Button href={site.whatsappHref} variant="ghost" external>
                {dict.whatsapp}
              </Button>
            </div>
            <BookingTrigger className={styles.online}>
              <span className={styles.dot} aria-hidden="true" />
              {dict.bookOnline}
              <Icon name="arrow" />
            </BookingTrigger>
          </div>

          <ul className={styles.info}>
            <li style={{ "--d": 0 } as CSSProperties}>
              <span className={styles.ico}>
                <Icon name="phone" />
              </span>
              <span>
                <small>{dict.phoneLabel}</small>
                <a href={site.phoneHref} className="latin" dir="ltr">
                  {site.phoneDisplay}
                </a>
              </span>
            </li>
            <li>
              <span className={styles.ico}>
                <Icon name="pin" />
              </span>
              <span>
                <small>{dict.addressLabel}</small>
                {site.address[lang]}
              </span>
            </li>
            <li>
              <span className={styles.ico}>
                <Icon name="clock" />
              </span>
              <span>
                <small>{dict.hoursLabel}</small>
                {site.hours[lang]}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
