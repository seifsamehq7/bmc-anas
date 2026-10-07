import type { CSSProperties, ReactNode } from "react";
import CrescentPattern from "@/components/brand/CrescentPattern";
import SplitWords from "@/components/ui/SplitWords";
import styles from "./PageHero.module.css";

type Props = {
  kicker: string;
  title: string | string[];
  lead?: string;
  children?: ReactNode;
  patternId: string;
  /** Fill the whole first screen (used by pages whose content is still to come). */
  fill?: boolean;
};

/** The dark rounded opener used by inner pages without a photo. */
export default function PageHero({ kicker, title, lead, children, patternId, fill }: Props) {
  return (
    <section className={styles.wrap} aria-labelledby={`${patternId}-title`}>
      <div className={`${styles.frame} ${fill ? styles.fill : ""} on-deep`}>
        <CrescentPattern id={patternId} className={styles.pattern} size={66} />
        <div className={styles.glow} aria-hidden="true" />
        <div className={`container ${styles.content}`}>
          <p className="kicker" data-reveal>
            {kicker}
          </p>
          <SplitWords as="h1" id={`${patternId}-title`} lines={title} className={`display ${styles.title}`} delay={80} />
          {lead && (
            <p className="lead" data-reveal style={{ "--d": 320 } as CSSProperties}>
              {lead}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
