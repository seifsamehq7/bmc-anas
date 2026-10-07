"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import mriImg from "@/assets/machines/mri.jpg";
import CrescentPattern from "@/components/brand/CrescentPattern";
import OrbitRings from "@/components/brand/OrbitRings";
import Icon from "@/components/ui/Icon";
import type { Dictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import styles from "./DepartmentCards.module.css";

type Props = {
  lang: Locale;
  dict: Dictionary["booking"]["chooser"];
  onNavigate?: () => void;
  /** In the popup, oncology opens its coming-soon note in place instead of a page. */
  onSoon?: () => void;
  /** Cards rise in when this turns true (the modal opening). Pages leave it on. */
  shown?: boolean;
};

/** The two departments a patient can book with. Used in the modal and on /booking. */
export default function DepartmentCards({ lang, dict, onNavigate, onSoon, shown = true }: Props) {
  const oncology = (
    <>
      <CrescentPattern id={`onco-pattern-${onNavigate ? "m" : "p"}`} className={styles.pattern} size={48} />
      <span className={styles.lens} aria-hidden="true">
        <OrbitRings className={styles.rings} />
        <span className={`${styles.disc} ${styles.discSoon}`}>
          <svg viewBox="0 0 24 24" className={styles.soonIcon}>
            <circle cx="12" cy="12" r="7.5" />
            <path d="M12 8v4l2.6 1.6" />
          </svg>
        </span>
      </span>
      <span className={`${styles.badge} ${styles.badgeSoon}`}>{dict.oncology.badge}</span>
      <span className={styles.name}>{dict.oncology.title}</span>
      <span className={styles.text}>{dict.oncology.text}</span>
      <span className={styles.go} aria-hidden="true">
        <Icon name="arrow" />
      </span>
    </>
  );
  return (
    <ul className={styles.grid} data-shown={shown || undefined}>
      <li style={{ "--i": 0 } as CSSProperties}>
        <Link href={`/${lang}/booking/radiology`} className={`${styles.card} ${styles.radiology}`} onClick={onNavigate}>
          <span className={styles.lens} aria-hidden="true">
            <OrbitRings className={styles.rings} />
            <span className={styles.disc}>
              <Image src={mriImg} alt="" sizes="200px" className={styles.img} />
            </span>
          </span>
          <span className={styles.badge}>
            <span className={styles.dot} aria-hidden="true" />
            {dict.radiology.badge}
          </span>
          <span className={styles.name}>{dict.radiology.title}</span>
          <span className={styles.text}>{dict.radiology.text}</span>
          <span className={styles.go} aria-hidden="true">
            <Icon name="arrow" />
          </span>
        </Link>
      </li>
      <li style={{ "--i": 1 } as CSSProperties}>
        {onSoon ? (
          <button type="button" className={`${styles.card} ${styles.oncology}`} onClick={onSoon}>
            {oncology}
          </button>
        ) : (
          <Link href={`/${lang}/booking/oncology`} className={`${styles.card} ${styles.oncology}`} onClick={onNavigate}>
            {oncology}
          </Link>
        )}
      </li>
    </ul>
  );
}
