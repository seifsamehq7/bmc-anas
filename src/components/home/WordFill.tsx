"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { clamp, onScrollFrame } from "@/lib/scroll";
import styles from "./Manifesto.module.css";

/** A statement whose words light up one by one as it travels up the screen. */
export default function WordFill({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

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
        el.style.setProperty("--p", "1");
        return;
      }
      stop = onScrollFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // Starts filling as the text enters the lower fifth, finishes above the middle.
        const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
        const v = Math.round(p * 1000) / 1000;
        if (v !== last) {
          last = v;
          el.style.setProperty("--p", String(v));
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
    <p ref={ref} className={styles.statement} style={{ "--n": words.length } as CSSProperties}>
      {words.map((w, i) => (
        <span key={i}>
          <span className={styles.word} style={{ "--i": i } as CSSProperties}>
            {w}
          </span>{" "}
        </span>
      ))}
    </p>
  );
}
