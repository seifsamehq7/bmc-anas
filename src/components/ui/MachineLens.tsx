import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import OrbitRings from "@/components/brand/OrbitRings";
import styles from "./MachineLens.module.css";

type Props = {
  image: StaticImageData;
  alt: string;
  tone: string;
  sizes: string;
  preload?: boolean;
  className?: string;
  /** Spin the rings slowly on their own (a whisper-level living element). */
  idle?: boolean;
};

/** A machine photo held inside the brand's crescent orbit: the site's signature lens. */
export default function MachineLens({ image, alt, tone, sizes, preload, className = "", idle = true }: Props) {
  return (
    <div
      className={`${styles.lens} ${idle ? styles.idle : ""} ${className}`}
      style={{ "--tone": `var(--c-${tone})` } as CSSProperties}
    >
      <OrbitRings className={styles.rings} />
      <div className={styles.disc}>
        <Image
          src={image}
          alt={alt}
          sizes={sizes}
          quality={85}
          className={styles.img}
          {...(preload ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
        />
      </div>
    </div>
  );
}
