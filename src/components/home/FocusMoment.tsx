"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import scanImg from "@/assets/brand/about-scan.jpg";
import Button from "@/components/ui/Button";
import type { Dictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import styles from "./FocusMoment.module.css";

const FILL_MS = 1500;
const DRAIN_MS = 900;

/**
 * The site's one interactive moment: press and hold, and a lens opens
 * until the blurred scan comes into sharp focus. Releasing early eases back.
 */
export default function FocusMoment({ lang, dict, imageAlt }: { lang: Locale; dict: Dictionary["focus"]; imageAlt: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "holding" | "done">("idle");
  const progress = useRef(0);
  const holding = useRef(false);
  const raf = useRef(0);
  const last = useRef(0);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    // The lens is sized to the frame's diagonal, so fully open it covers every corner.
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      frame.style.setProperty("--fw", `${width}px`);
      frame.style.setProperty("--fh", `${height}px`);
      frame.style.setProperty("--L", `${Math.hypot(width, height)}px`);
    });
    ro.observe(frame);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progress.current = 1;
      frame.style.setProperty("--h", "1");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState("done");
    }
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const tick = (now: number) => {
    const dt = Math.min(64, now - (last.current || now));
    last.current = now;
    const delta = holding.current ? dt / FILL_MS : -dt / DRAIN_MS;
    progress.current = Math.min(1, Math.max(0, progress.current + delta));
    frameRef.current?.style.setProperty("--h", progress.current.toFixed(4));

    if (progress.current >= 1) {
      holding.current = false;
      setState("done");
      raf.current = 0;
      return;
    }
    if (!holding.current && progress.current <= 0) {
      setState("idle");
      raf.current = 0;
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const start = () => {
    if (state === "done") return;
    holding.current = true;
    setState("holding");
    if (!raf.current) {
      last.current = 0;
      raf.current = requestAnimationFrame(tick);
    }
  };

  const release = () => {
    if (!holding.current) return;
    holding.current = false;
    if (!raf.current) {
      last.current = 0;
      raf.current = requestAnimationFrame(tick);
    }
  };

  const reset = () => {
    progress.current = 0;
    frameRef.current?.style.setProperty("--h", "0");
    setState("idle");
  };

  return (
    <section className={`section ${styles.section}`} aria-labelledby="focus-title">
      <div className="container">
        <div ref={frameRef} className={styles.frame} data-state={state} data-reveal="scale" style={{ "--h": 0 } as CSSProperties}>
          {/* The blurred field: a static blur, never an animated filter. */}
          <div className={styles.blurred} aria-hidden="true">
            <Image src={scanImg} alt="" fill sizes="(max-width: 1320px) 92vw, 1320px" quality={60} className={styles.img} />
          </div>
          <div className={styles.lensWrap}>
            <div className={styles.lens}>
              <div className={styles.sharp}>
                <Image src={scanImg} alt={imageAlt} fill sizes="(max-width: 1320px) 92vw, 1320px" quality={85} className={styles.img} />
              </div>
            </div>
            <svg className={styles.edge} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
              <circle cx="50" cy="50" r="49.6" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className={styles.shade} aria-hidden="true" />

          <div className={styles.top}>
            <p className="kicker">{dict.kicker}</p>
            <h2 id="focus-title" className={`h2 ${styles.title}`}>
              {dict.title}
            </h2>
            <p className={styles.lead}>{dict.lead}</p>
          </div>

          <button
            type="button"
            className={styles.hold}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              start();
            }}
            onPointerUp={release}
            onPointerCancel={release}
            onLostPointerCapture={release}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                e.preventDefault();
                start();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === " " || e.key === "Enter") release();
            }}
            onContextMenu={(e) => e.preventDefault()}
            disabled={state === "done"}
            aria-describedby="focus-title"
          >
            <svg viewBox="0 0 120 120" className={styles.holdRing} aria-hidden="true">
              <circle cx="60" cy="60" r="56" pathLength={1} className={styles.holdTrack} />
              <circle cx="60" cy="60" r="56" pathLength={1} className={styles.holdBar} />
            </svg>
            <span className={styles.holdCore} aria-hidden="true" />
            <span className={styles.holdLabel}>{state === "holding" ? dict.holding : dict.hold}</span>
          </button>

          <div className={styles.done} aria-live="polite">
            {state === "done" && (
              <>
                <p className={styles.doneTitle}>{dict.doneTitle}</p>
                <p className={styles.doneText}>{dict.doneText}</p>
                <div className={styles.doneActions}>
                  <Button href={`/${lang}#contact`} variant="light">
                    {dict.cta}
                  </Button>
                  <button type="button" className={`btn btn-ghost ${styles.reset}`} onClick={reset}>
                    {dict.reset}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
