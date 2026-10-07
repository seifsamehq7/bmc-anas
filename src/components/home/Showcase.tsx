"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import OrbitRings from "@/components/brand/OrbitRings";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import SplitWords from "@/components/ui/SplitWords";
import type { Dictionary } from "@/content/dictionaries";
import type { Machine } from "@/content/machines";
import { pad2, type Locale } from "@/lib/i18n";
import { clamp, onScrollFrame, scrollToTarget, smoothstep } from "@/lib/scroll";
import styles from "./Showcase.module.css";

type Props = { lang: Locale; dict: Dictionary["showcase"]; machines: Machine[] };

/* The five static-layout gates. These strings match the media query in Showcase.module.css exactly. */
const GATES = [
  "(max-width: 720px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
  "(prefers-reduced-motion: reduce)",
];

/** Half-width of each hand-over between machines, in machine units (1 unit = 100vh of scroll). */
const W = 0.14;

export default function Showcase({ lang, dict, machines }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const N = machines.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = [...track.querySelectorAll<HTMLElement>("[data-item]")];
    const glows = [...track.querySelectorAll<HTMLElement>("[data-glow]")];
    const rail = [...track.querySelectorAll<HTMLElement>("[data-rail]")];
    const ring = track.querySelector<HTMLElement>("[data-ring]");
    const hud = track.querySelector<HTMLElement>("[data-hud]");
    const counter = track.querySelector<HTMLElement>("[data-counter]");
    const cache = items.map(() => ({ e: -1, x: -1, live: false }));
    let active = -1;
    let lastF = -1;
    let stop: (() => void) | null = null;

    const frame = () => {
      const r = track.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      if (range <= 0) return;
      const f = clamp(-r.top / range) * N;
      if (Math.abs(f - lastF) < 0.0005) return;
      lastF = f;
      ring?.style.setProperty("--f", f.toFixed(4));
      hud?.style.setProperty("--p", (f / N).toFixed(4));

      items.forEach((el, i) => {
        const e = i === 0 ? 1 : smoothstep(i - W, i + W, f);
        const x = i === N - 1 ? 0 : smoothstep(i + 1 - W, i + 1 + W, f);
        const c = cache[i];
        if (Math.abs(c.e - e) < 0.002 && Math.abs(c.x - x) < 0.002) return;
        c.e = e;
        c.x = x;
        el.style.setProperty("--e", e.toFixed(3));
        el.style.setProperty("--x", x.toFixed(3));
        glows[i]?.style.setProperty("opacity", (e * (1 - x)).toFixed(3));
        const live = e * (1 - x) > 0.5;
        if (live !== c.live) {
          c.live = live;
          el.toggleAttribute("data-live", live);
        }
      });

      const a = Math.min(N - 1, Math.floor(f));
      if (a !== active) {
        active = a;
        rail.forEach((btn, i) => btn.toggleAttribute("data-active", i === a));
        if (counter) counter.textContent = pad2(a + 1);
      }
    };

    const enable = () => {
      if (stop) return;
      track.dataset.mode = "pinned";
      cache.forEach((c) => {
        c.e = -1;
        c.x = -1;
      });
      active = -1;
      lastF = -1;
      stop = onScrollFrame(frame);
    };
    const disable = () => {
      if (!stop) return;
      stop();
      stop = null;
      track.dataset.mode = "static";
      items.forEach((el) => {
        el.style.removeProperty("--e");
        el.style.removeProperty("--x");
        el.removeAttribute("data-live");
      });
    };

    const queries = GATES.map((q) => matchMedia(q));
    const apply = () => (queries.some((m) => m.matches) ? disable() : enable());
    queries.forEach((m) => m.addEventListener("change", apply));
    apply();

    // Keyboard users tabbing into a machine are carried to it.
    const onFocus = (e: FocusEvent) => {
      if (!stop) return;
      const item = (e.target as HTMLElement).closest<HTMLElement>("[data-item]");
      if (!item) return;
      goTo(items.indexOf(item), true);
    };
    track.addEventListener("focusin", onFocus);

    return () => {
      queries.forEach((m) => m.removeEventListener("change", apply));
      track.removeEventListener("focusin", onFocus);
      stop?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N]);

  /** Scroll to the calm middle of a machine's plateau. */
  function goTo(i: number, immediate = false) {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const range = track.offsetHeight - window.innerHeight;
    scrollToTarget(top + ((i + 0.45) / N) * range, { immediate });
  }

  return (
    <section id="machines" className={`${styles.section} on-deep`} aria-labelledby="machines-title">
      <div className={`container ${styles.intro}`}>
        <p className="kicker" data-reveal>
          {dict.kicker}
        </p>
        <SplitWords id="machines-title" lines={dict.title} className={`h2 ${styles.title}`} />
        <p className="lead" data-reveal style={{ "--d": 200 } as CSSProperties}>
          {dict.lead}
        </p>
      </div>

      <div ref={trackRef} className={styles.track} style={{ "--n": N } as CSSProperties}>
        <div className={styles.stage}>
          <div className={styles.glows} aria-hidden="true">
            {machines.map((m) => (
              <span key={m.slug} data-glow className={styles.glow} style={{ "--tone": `var(--c-${m.tone})` } as CSSProperties} />
            ))}
          </div>

          <div className={styles.ringLayer} aria-hidden="true">
            <div className={styles.ringSlot}>
              <div className={styles.sharedDisc} />
              <div data-ring className={styles.ring}>
                <OrbitRings className={styles.ringSvg} />
              </div>
            </div>
          </div>

          {machines.map((m, i) => (
            <article
              key={m.slug}
              data-item
              className={styles.item}
              style={{ "--tone": `var(--c-${m.tone})`, "--e": i === 0 ? 1 : 0 } as CSSProperties}
              aria-labelledby={`machine-${m.slug}`}
            >
              <div className={styles.media} data-reveal="fade">
                <div className={styles.lens}>
                  <OrbitRings className={styles.ownRings} />
                  <div className={styles.disc}>
                    <Image
                      src={m.image}
                      alt={`${m.name}. ${dict.photo}`}
                      sizes="(max-width: 720px) 80vw, 46vw"
                      quality={85}
                      className={styles.img}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.text} data-reveal="fade">
                <p className={`${styles.ln} ${styles.meta}`} style={{ "--j": 0 } as CSSProperties}>
                  <span className={`${styles.idx} latin`}>{pad2(i + 1)}</span>
                  <span className={`${styles.abbr} latin`}>{m.abbr}</span>
                </p>
                <h3 id={`machine-${m.slug}`} className={`${styles.ln} ${styles.name}`} style={{ "--j": 1 } as CSSProperties}>
                  {m.name}
                </h3>
                <p className={`${styles.ln} ${styles.tagline}`} style={{ "--j": 2 } as CSSProperties}>
                  {m.tagline}
                </p>
                <p className={`${styles.ln} ${styles.desc}`} style={{ "--j": 3 } as CSSProperties}>
                  {m.description}
                </p>
                <ul className={`${styles.ln} ${styles.facts}`} style={{ "--j": 4 } as CSSProperties}>
                  <li>
                    <Icon name="timer" />
                    <span>
                      <small>{dict.duration}</small>
                      {m.duration}
                    </span>
                  </li>
                  <li>
                    <Icon name="wave" />
                    <span>
                      <small>{dict.radiation}</small>
                      {m.radiation}
                    </span>
                  </li>
                  <li>
                    <Icon name="list" />
                    <span>
                      <small>{dict.prep}</small>
                      {m.prep}
                    </span>
                  </li>
                </ul>
                <div className={styles.ln} style={{ "--j": 5 } as CSSProperties}>
                  <Button href={`/${lang}/machines/${m.slug}`} variant="light">
                    {dict.more}
                  </Button>
                </div>
              </div>
            </article>
          ))}

          <div data-hud className={styles.hud}>
            <div className={styles.counter} aria-hidden="true">
              <svg viewBox="0 0 100 100" className={styles.counterRing}>
                <circle cx="50" cy="50" r="46" pathLength={1} className={styles.counterTrack} />
                <circle cx="50" cy="50" r="46" pathLength={1} className={styles.counterBar} />
              </svg>
              <span className="latin">
                <span data-counter>01</span>
                <small>/{pad2(N)}</small>
              </span>
            </div>
            <ul className={styles.rail}>
              {machines.map((m, i) => (
                <li key={m.slug}>
                  <button
                    type="button"
                    data-rail
                    data-active={i === 0 || undefined}
                    className={`${styles.railBtn} latin`}
                    onClick={() => goTo(i)}
                    aria-label={`${dict.jump} ${m.name}`}
                  >
                    {m.abbr}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
