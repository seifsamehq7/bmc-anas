import Link from "next/link";
import type { CSSProperties } from "react";
import OrbitRings from "@/components/brand/OrbitRings";
import Icon, { type IconName } from "@/components/ui/Icon";
import type { Dictionary } from "@/content/dictionaries";
import styles from "./ComingSoon.module.css";

type Props = { title: string; icon: IconName; dict: Dictionary["dashboard"]["soon"]; backHref: string };

/** Placeholder for dashboard sections that wait on the backend. */
export default function ComingSoon({ title, icon, dict, backHref }: Props) {
  return (
    <div className={styles.page}>
      <h1 className={`${styles.title} enter`} style={{ "--i": 0 } as CSSProperties}>
        {title}
      </h1>
      <section className={`${styles.card} enter`} style={{ "--i": 1 } as CSSProperties}>
        <div className={styles.lens} aria-hidden="true">
          <OrbitRings className={styles.rings} />
          <span className={styles.core}>
            <Icon name={icon} />
          </span>
        </div>
        <span className={styles.badge}>{dict.badge}</span>
        <h2 className={styles.heading}>{dict.title}</h2>
        <p className={styles.text}>{dict.text}</p>
        <Link href={backHref} className="btn btn-primary">
          <span>{dict.back}</span>
          <span className="btn-ico">
            <Icon name="arrow" />
          </span>
        </Link>
      </section>
    </div>
  );
}
