"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import SplitWords from "@/components/ui/SplitWords";
import type { Dictionary } from "@/content/dictionaries";
import { clamp, onScrollFrame } from "@/lib/scroll";
import styles from "./VisitSteps.module.css";

/* Node positions on the wave, in the SVG's 1000 x 240 space. */
const NODES = [
  { x: 125, y: 168 },
  { x: 375, y: 72 },
  { x: 625, y: 168 },
  { x: 875, y: 72 },
];
const WAVE = "M -40 120 C 40 120 70 168 125 168 S 300 72 375 72 S 550 168 625 168 S 800 72 875 72 S 980 120 1040 120";

export default function VisitSteps({ dict }: { dict: Dictionary["steps"] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let last = -1;
    let stop: (() => void) | null = null;
    const arm = () => {
      stop?.();
      stop = null;
      if (reduce.matches) {
        el.style.setProperty("--draw", "1");
        return;
      }
      stop = onScrollFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = clamp((vh * 0.78 - r.top) / (r.height * 0.75));
        const v = Math.round(p * 1000) / 1000;
        if (v !== last) {
          last = v;
          el.style.setProperty("--draw", String(v));
        }
      });
    };
    arm();
    reduce.addEventListener("change", arm);
    return () => {
      stop?.();
      reduce.removeEventListener("change", arm);
    };
  }, []);

  return (
    <section ref={ref} className={`section ${styles.steps}`} aria-labelledby="steps-title">
      <div className="container">
        <header className={styles.head}>
          <p className="kicker" data-reveal>
            {dict.kicker}
          </p>
          <SplitWords id="steps-title" lines={dict.title} className="h2" />
        </header>

        <div className={styles.board}>
          <svg className={styles.wave} viewBox="0 0 1000 240" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d={WAVE} className={styles.track} pathLength={1} />
            <path d={WAVE} className={styles.line} pathLength={1} />
          </svg>

          <ol className={styles.list}>
            {dict.items.map((step, i) => (
              <li
                key={step.title}
                className={styles.step}
                style={
                  {
                    "--x": NODES[i].x / 10,
                    "--y": NODES[i].y / 2.4,
                    "--at": (NODES[i].x + 40) / 1080,
                  } as CSSProperties
                }
              >
                <span className={styles.node} aria-hidden="true">
                  <span className={`${styles.nodeNum} latin`}>{i + 1}</span>
                </span>
                <div className={styles.copy}>
                  <h3 className={styles.title}>{step.title}</h3>
                  <p className={styles.text}>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
