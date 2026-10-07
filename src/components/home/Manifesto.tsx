import type { CSSProperties } from "react";
import type { Dictionary } from "@/content/dictionaries";
import WordFill from "./WordFill";
import styles from "./Manifesto.module.css";

export default function Manifesto({ dict }: { dict: Dictionary["manifesto"] }) {
  return (
    <section id="why" className={`section ${styles.manifesto}`} aria-label={dict.kicker}>
      <div className="container">
        <p className="kicker" data-reveal>
          {dict.kicker}
        </p>
        <WordFill text={dict.text} />
        <ol className={styles.pillars}>
          {dict.pillars.map((p, i) => (
            <li key={p.title} className={styles.pillar} data-reveal style={{ "--d": i * 120 } as CSSProperties}>
              <span className={styles.orb} aria-hidden="true">
                <span className={`${styles.orbNum} latin`}>{String(i + 1).padStart(2, "0")}</span>
              </span>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
              <p className={styles.pillarText}>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
