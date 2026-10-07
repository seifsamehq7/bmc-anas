"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import OrbitRings from "@/components/brand/OrbitRings";
import Icon from "@/components/ui/Icon";
import type { Dictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";
import { getLenis } from "@/lib/scroll";
import { hasWelcomed, markWelcomed, skipsWelcome } from "@/lib/welcome";
import DepartmentCards from "./DepartmentCards";
import styles from "./BookingProvider.module.css";

type Origin = { x: number; y: number };
const BookingContext = createContext<(origin?: Origin) => void>(() => {});

/** Opens the department chooser from anywhere on the site. */
export const useOpenBooking = () => useContext(BookingContext);

type Props = { lang: Locale; dict: Dictionary["booking"]["chooser"]; children: ReactNode };

/** After the intro curtain lifts (1.25s), let the hero settle before asking. */
const AFTER_LOADER_MS = 1600;
const AFTER_SKIP_MS = 900;

export default function BookingProvider({ lang, dict, children }: Props) {
  const [open, setOpen] = useState(false);
  /** "book" from a booking button; "welcome" the first time the site opens in a browser session. */
  const [mode, setMode] = useState<"book" | "welcome">("book");
  /** Oncology was picked: the panel shows its coming-soon note instead of the cards. */
  const [soon, setSoon] = useState(false);
  const [origin, setOrigin] = useState<Origin>({ x: 50, y: 50 });
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const show = useCallback((from?: Origin, as: "book" | "welcome" = "book") => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    // The panel grows out of the button that opened it, as a circle.
    setOrigin(from ? { x: (from.x / window.innerWidth) * 100, y: (from.y / window.innerHeight) * 100 } : { x: 50, y: 50 });
    setMode(as);
    setSoon(false);
    setOpen(true);
  }, []);

  const openBooking = useCallback((from?: Origin) => show(from, "book"), [show]);

  const close = useCallback((restore = true) => {
    setOpen(false);
    if (restore) returnFocus.current?.focus({ preventScroll: true });
  }, []);

  // The welcome question: once per browser session, after the intro loader has lifted.
  useEffect(() => {
    if (hasWelcomed()) return;
    const root = document.documentElement;
    let timer = 0;
    const ask = (delay: number) => {
      timer = window.setTimeout(() => {
        if (hasWelcomed()) return;
        markWelcomed();
        if (skipsWelcome(location.pathname) || root.classList.contains("modal-open")) return;
        show(undefined, "welcome");
      }, delay);
    };
    if (root.classList.contains("is-ready")) {
      ask(root.classList.contains("intro-skip") ? AFTER_SKIP_MS : AFTER_LOADER_MS);
      return () => window.clearTimeout(timer);
    }
    const onReady = () => ask(AFTER_LOADER_MS);
    window.addEventListener("bmc:ready", onReady, { once: true });
    return () => {
      window.removeEventListener("bmc:ready", onReady);
      window.clearTimeout(timer);
    };
  }, [show]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("modal-open");
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button")];
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        items[items.length - 1]?.focus();
      } else if (!e.shiftKey && i === items.length - 1) {
        e.preventDefault();
        items[0]?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.classList.remove("modal-open");
      getLenis()?.start();
    };
  }, [open, close]);

  // Move focus into whatever the panel is showing: the cards, or the coming-soon note.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      const scope = panelRef.current?.querySelector<HTMLElement>("[data-focus-scope]");
      scope?.querySelector<HTMLElement>("a[href], button")?.focus({ preventScroll: true });
    }, 160);
    return () => window.clearTimeout(t);
  }, [open, soon]);

  const head = mode === "welcome" ? dict.welcome : dict;

  return (
    <BookingContext.Provider value={openBooking}>
      {children}
      <div
        className={styles.root}
        data-open={open || undefined}
        inert={!open}
        style={{ "--ox": `${origin.x}%`, "--oy": `${origin.y}%` } as CSSProperties}
      >
        <div className={styles.scrim} onClick={() => close()} aria-hidden="true" />
        {/* data-lenis-prevent: smooth scroll is paused while this is open, and would otherwise
            swallow the swipe, so a panel taller than a small phone could never scroll. */}
        <div
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chooser-title"
          data-lenis-prevent=""
        >
          <button type="button" className={styles.close} onClick={() => close()} aria-label={dict.close}>
            <Icon name="plus" />
          </button>

          {soon ? (
            <div className={styles.soon} data-focus-scope="">
              <span className={styles.soonLens} aria-hidden="true">
                <OrbitRings className={styles.soonRings} />
                <svg viewBox="0 0 24 24" className={styles.soonIcon}>
                  <circle cx="12" cy="12" r="7.5" />
                  <path d="M12 8v4l2.6 1.6" />
                </svg>
              </span>
              <span className={`${styles.soonBadge} latin`}>{dict.soon.badge}</span>
              <h2 id="chooser-title" className={styles.soonTitle}>
                {dict.soon.title}
              </h2>
              <p className={styles.soonText}>{dict.soon.text}</p>
              <div className={styles.soonActions}>
                <Link href={`/${lang}/booking/radiology`} className="btn btn-primary" onClick={() => close(false)}>
                  <span>{dict.soon.radiology}</span>
                  <span className="btn-ico">
                    <Icon name="arrow" />
                  </span>
                </Link>
                <button type="button" className="btn btn-ghost on-light" onClick={() => setSoon(false)}>
                  {dict.soon.back}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.choose} data-focus-scope="">
              <div className={styles.head}>
                <p className="kicker">{head.kicker}</p>
                <h2 id="chooser-title" className={styles.title}>
                  {head.title}
                </h2>
                <p className={styles.lead}>{head.lead}</p>
              </div>
              <DepartmentCards
                lang={lang}
                dict={dict}
                onNavigate={() => close(false)}
                onSoon={() => setSoon(true)}
                shown={open}
              />
              {mode === "welcome" && (
                <button type="button" className={styles.browse} onClick={() => close()}>
                  {dict.welcome.browse}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </BookingContext.Provider>
  );
}
