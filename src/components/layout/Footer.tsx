import Link from "next/link";
import type { CSSProperties } from "react";
import CrescentPattern from "@/components/brand/CrescentPattern";
import Logo from "@/components/brand/Logo";
import Icon from "@/components/ui/Icon";
import DashboardLink from "./DashboardLink";
import type { Dictionary } from "@/content/dictionaries";
import type { Machine } from "@/content/machines";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import styles from "./Footer.module.css";

type Props = { lang: Locale; dict: Dictionary; machines: Machine[] };

export default function Footer({ lang, dict, machines }: Props) {
  const year = 2026;
  return (
    <footer className={`${styles.footer} on-deep`}>
      <CrescentPattern id="footer-pattern" className={styles.pattern} size={70} />
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandCol} data-reveal>
          <Logo variant="full" className={styles.logo} label={dict.hero.eyebrow} />
          <p className={styles.tagline}>{dict.footer.tagline}</p>
        </div>

        <nav className={styles.col} aria-label={dict.footer.pages} data-reveal style={{ "--d": 80 } as CSSProperties}>
          <p className={styles.colTitle}>{dict.footer.pages}</p>
          <ul>
            <li><Link href={`/${lang}`}>{dict.nav.home}</Link></li>
            <li><Link href={`/${lang}/machines`}>{dict.nav.machines}</Link></li>
            <li><Link href={`/${lang}/about`}>{dict.nav.about}</Link></li>
            <li><Link href={`/${lang}#contact`}>{dict.nav.contact}</Link></li>
          </ul>
        </nav>

        <nav className={styles.col} aria-label={dict.footer.machines} data-reveal style={{ "--d": 160 } as CSSProperties}>
          <p className={styles.colTitle}>{dict.footer.machines}</p>
          <ul>
            {machines.map((m) => (
              <li key={m.slug}>
                <Link href={`/${lang}/machines/${m.slug}`}>{m.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col} data-reveal style={{ "--d": 240 } as CSSProperties}>
          <p className={styles.colTitle}>{dict.footer.reach}</p>
          <ul className={styles.reach}>
            <li>
              <a href={site.phoneHref}>
                <Icon name="phone" />
                <span className="latin" dir="ltr">{site.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" />
                <span>WhatsApp</span>
              </a>
            </li>
            <li>
              <span>
                <Icon name="pin" />
                <span>{site.address[lang]}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          <span className="latin">© {year} BMC.</span> {dict.footer.rights} {dict.footer.credit}
        </p>
        <p className={styles.disclaimer}>{dict.footer.disclaimer}</p>
        <DashboardLink href={`/${lang}/dashboard`} className={styles.admin}>
          <Icon name="grid" />
          {dict.nav.dashboard}
        </DashboardLink>
      </div>
    </footer>
  );
}
