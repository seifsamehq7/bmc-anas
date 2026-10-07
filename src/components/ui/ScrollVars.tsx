"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clamp, onScrollFrame } from "@/lib/scroll";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  id?: string;
  /**
   * Where progress starts and ends, as fractions of the viewport height
   * measured against the element's top and bottom edges.
   * "exit": 0 while the element's top is at the viewport top, 1 once it has scrolled one height past.
   * "pass": 0 when the element enters from below, 1 when it leaves at the top.
   */
  mode?: "exit" | "pass";
  ariaLabelledby?: string;
};

/**
 * Writes one scroll-progress variable (--sp, 0 to 1) onto its element,
 * only when it changes, so CSS can drive transform and opacity from it.
 */
export default function ScrollVars({ children, className, as: Tag = "div", id, mode = "pass", ariaLabelledby }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = -1;
    return onScrollFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = mode === "exit" ? clamp(-r.top / r.height) : clamp((vh - r.top) / (vh + r.height));
      const v = Math.round(p * 1000) / 1000;
      if (v === last) return;
      last = v;
      el.style.setProperty("--sp", String(v));
    });
  }, [mode]);

  return (
    <Tag ref={ref as never} className={className} id={id} aria-labelledby={ariaLabelledby}>
      {children}
    </Tag>
  );
}
