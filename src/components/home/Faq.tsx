import type { CSSProperties } from "react";
import Icon from "@/components/ui/Icon";
import SplitWords from "@/components/ui/SplitWords";
import type { Dictionary } from "@/content/dictionaries";
import styles from "./Faq.module.css";

export default function Faq({ dict, note }: { dict: Dictionary["faq"]; note: string }) {
  return (
    <section className={`section ${styles.faq}`} aria-labelledby="faq-title">
      <div className={`container ${styles.inner}`}>
        <header className={styles.head}>
          <p className="kicker" data-reveal>
            {dict.kicker}
          </p>
          <SplitWords id="faq-title" lines={dict.title} className="h2" />
        </header>

        <div className={styles.list}>
          {dict.items.map((item, i) => (
            <details key={item.q} className={styles.item} data-reveal style={{ "--d": i * 70 } as CSSProperties}>
              <summary className={styles.q}>
                <span>{item.q}</span>
                <span className={styles.icon} aria-hidden="true">
                  <Icon name="plus" />
                </span>
              </summary>
              <div className={styles.a}>
                <p>{item.a}</p>
              </div>
            </details>
          ))}
          <p className={styles.note} data-reveal>
            {note}
          </p>
        </div>
      </div>
    </section>
  );
}
