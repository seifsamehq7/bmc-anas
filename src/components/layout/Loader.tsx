"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { LETTER_PATHS, LOCKUP_VIEWBOX, MARK_PATHS, WORDMARK_PATHS } from "@/components/brand/paths";

const MIN_MS = 1500;
const MAX_MS = 5000;

/**
 * The first-visit intro. Server-rendered so it paints with the very first frame,
 * then driven by real signals: fonts ready, the hero photo decoded, the window loaded.
 * Shown once per session; later visits skip straight to the page.
 */
export default function Loader({ label, name }: { label: string; name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!el) return;

    const announce = () => window.dispatchEvent(new Event("bmc:ready"));
    if (root.classList.contains("intro-skip")) {
      el.dataset.state = "done";
      announce();
      return;
    }

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = reduce ? 300 : MIN_MS;
    const start = performance.now();
    const done = { fonts: false, hero: false, load: false };
    let target = 0.1;
    let shown = 0;
    let lastPct = -1;
    let raf = 0;
    let finished = false;
    let leaveTimer = 0;

    const recompute = () => {
      const n = Number(done.fonts) + Number(done.hero) + Number(done.load);
      target = 0.1 + (0.9 * n) / 3;
    };

    document.fonts?.ready.then(() => {
      done.fonts = true;
      recompute();
    });

    const hero = document.querySelector<HTMLImageElement>("img[data-hero]");
    if (!hero || hero.complete) done.hero = true;
    else {
      const ok = () => {
        done.hero = true;
        recompute();
      };
      hero.addEventListener("load", ok, { once: true });
      hero.addEventListener("error", ok, { once: true });
    }

    const onLoad = () => {
      done.load = true;
      recompute();
    };
    if (document.readyState === "complete") done.load = true;
    else window.addEventListener("load", onLoad, { once: true });
    recompute();

    const write = (v: number) => {
      const pct = Math.round(v * 100);
      if (pct === lastPct) return;
      lastPct = pct;
      if (countRef.current) countRef.current.textContent = String(pct).padStart(3, "0");
      barRef.current?.style.setProperty("--ld", String(1 - v));
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      write(1);
      try {
        sessionStorage.setItem("bmc-intro", "1");
      } catch {}
      root.classList.add("is-ready");
      el.dataset.state = "leaving";
      announce();
      leaveTimer = window.setTimeout(() => {
        el.dataset.state = "done";
      }, 1350);
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      // The bar never outruns the brand animation, and never fakes completion.
      const goal = Math.min(target, elapsed / minMs);
      shown += (goal - shown) * 0.14;
      if (goal >= 1 && shown > 0.985) shown = 1;
      write(shown);
      if (shown >= 1 || elapsed > MAX_MS) finish();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(leaveTimer);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div ref={ref} className="loader" role="status" aria-label={label} suppressHydrationWarning>
      <div className="loader__glow" aria-hidden="true" />
      <div className="loader__inner" aria-hidden="true">
        <svg className="loader__ring" viewBox="0 0 200 200">
          <circle className="loader__track" cx="100" cy="100" r="98" />
          <circle ref={barRef} className="loader__bar" cx="100" cy="100" r="98" pathLength={1} />
        </svg>
        <svg className="loader__logo" viewBox={LOCKUP_VIEWBOX}>
          {MARK_PATHS.map((d, i) => (
            <path key={i} className="loader__crescent" style={{ "--i": i } as CSSProperties} d={d} fill="url(#bmc-grad)" />
          ))}
          <g fill="#ffffff">
            {LETTER_PATHS.map((d, i) => (
              <path key={i} className="loader__letter" style={{ "--i": i } as CSSProperties} d={d} />
            ))}
          </g>
          <g className="loader__word" fill="#a9bed3">
            {WORDMARK_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </svg>
      </div>
      <div className="loader__meta" aria-hidden="true">
        <span ref={countRef} className="loader__count latin">
          000
        </span>
        <span>{name}</span>
      </div>
    </div>
  );
}
