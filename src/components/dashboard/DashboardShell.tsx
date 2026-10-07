"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { createContext, useEffect, useState, useSyncExternalStore } from "react";
import Logo from "@/components/brand/Logo";
import { LETTER_PATHS, LOCKUP_VIEWBOX, MARK_PATHS } from "@/components/brand/paths";
import Icon, { type IconName } from "@/components/ui/Icon";
import type { Dictionary } from "@/content/dictionaries";
import { isDashboardIntroPlaying, runDashboardIntro, subscribeDashboardIntro } from "@/lib/dash-intro";
import { otherLocale, switchLocalePath, type Locale } from "@/lib/i18n";
import { DASHBOARD_SECTIONS } from "./sections";
import styles from "./DashboardShell.module.css";

/** True once the intro (if any) has handed over, so sections can start their count-ups. */
export const DashboardReady = createContext(true);


const ICONS: Record<string, IconName> = {
  overview: "grid",
  bookings: "ticket",
  calendar: "calendar",
  finances: "wallet",
  settings: "settings",
  clients: "users",
  admins: "shield",
};

type Props = { lang: Locale; dict: Dictionary["dashboard"]; langShort: string; children: ReactNode };

const INTRO_MS = 1900;
const LEAVE_MS = 900;
/** Once the dashboard has loaded, the loader still stays at least this long so it never just flickers. */
const MIN_HOLD_MS = 900;

export default function DashboardShell({ lang, dict, langShort, children }: Props) {
  const pathname = usePathname();
  // The loader state lives on <html> (see lib/dash-intro), so it can cover the very first paint.
  const playing = useSyncExternalStore(subscribeDashboardIntro, isDashboardIntroPlaying, () => false);
  const [navOpen, setNavOpen] = useState(false);
  const ready = !playing;

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    return reduce ? runDashboardIntro(150, 300, 150) : runDashboardIntro(INTRO_MS, LEAVE_MS, MIN_HOLD_MS);
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNavOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const base = `/${lang}/dashboard`;
  const items = [
    { key: "overview", href: base },
    ...DASHBOARD_SECTIONS.map((key) => ({ key, href: `${base}/${key}` })),
  ];
  const activeIndex = Math.max(
    0,
    items.findIndex((it) => (it.key === "overview" ? pathname === base : pathname.startsWith(it.href))),
  );

  return (
    <div className={styles.shell} data-ready={ready || undefined} data-nav-open={navOpen || undefined}>
      {/* Always in the page, shown only while <html> carries dash-intro. */}
      <div className={styles.intro} role="status" aria-label={dict.loader}>
        <div className={styles.introCore} aria-hidden="true">
          <svg className={styles.introRing} viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="96" pathLength={1} />
          </svg>
          <svg className={styles.introLogo} viewBox={LOCKUP_VIEWBOX}>
            {MARK_PATHS.map((d, i) => (
              <path key={i} className={styles.introCrescent} style={{ "--i": i } as CSSProperties} d={d} fill="url(#bmc-grad)" />
            ))}
            <g fill="#fff">
              {LETTER_PATHS.map((d, i) => (
                <path key={i} className={styles.introLetter} style={{ "--i": i } as CSSProperties} d={d} />
              ))}
            </g>
          </svg>
        </div>
        <p className={styles.introText}>
          <span>{dict.loader}</span>
          <span className={styles.introBar} aria-hidden="true" />
        </p>
      </div>

      <div className={styles.scrim} onClick={() => setNavOpen(false)} aria-hidden="true" />

      <aside className={styles.sidebar} aria-label={dict.brand}>
        <div className={styles.side}>
          <Link href={base} className={styles.brand} onClick={() => setNavOpen(false)}>
            <Logo variant="compact" className={styles.brandLogo} label="BMC" />
            <span className={styles.brandLabel}>{dict.brand}</span>
          </Link>

          <nav className={styles.nav}>
            <span className={styles.indicator} style={{ "--y": activeIndex } as CSSProperties} aria-hidden="true" />
            <ul>
              {items.map((it, i) => (
                <li key={it.key} style={{ "--i": i } as CSSProperties}>
                  <Link
                    href={it.href}
                    className={styles.navItem}
                    aria-current={i === activeIndex ? "page" : undefined}
                    onClick={() => setNavOpen(false)}
                  >
                    <Icon name={ICONS[it.key]} />
                    <span>{dict.nav[it.key as keyof typeof dict.nav]}</span>
                    {it.key !== "overview" && <em className={styles.soon}>{dict.soon.badge}</em>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.sideFoot}>
            <div className={styles.me}>
              <span className={styles.avatar} aria-hidden="true">
                <Icon name="user" />
              </span>
              <span>
                <strong>{dict.admin}</strong>
                <small>{dict.role}</small>
              </span>
            </div>
            <Link href={`/${lang}`} className={styles.back}>
              <Icon name="door" />
              <span>{dict.backToSite}</span>
            </Link>
          </div>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setNavOpen(true)}
            aria-label={dict.menu}
            aria-expanded={navOpen}
          >
            <Icon name="menu" />
          </button>
          <label className={styles.search}>
            <Icon name="search" />
            <input type="search" placeholder={dict.search} aria-label={dict.search} />
          </label>
          <div className={styles.topActions}>
            <span className={styles.demo}>
              <span className={styles.demoDot} aria-hidden="true" />
              {dict.demo}
            </span>
            <Link
              href={switchLocalePath(pathname, otherLocale(lang))}
              className={styles.iconBtn}
              hrefLang={otherLocale(lang)}
              lang={otherLocale(lang)}
            >
              <span className={otherLocale(lang) === "en" ? "latin" : undefined}>{langShort}</span>
            </Link>
            <button type="button" className={styles.iconBtn} aria-label={dict.notifications}>
              <Icon name="bell" />
              <span className={styles.bellDot} aria-hidden="true" />
            </button>
          </div>
        </header>
        <main id="main" tabIndex={-1} className={styles.content}>
          <DashboardReady.Provider value={ready}>{children}</DashboardReady.Provider>
        </main>
      </div>
    </div>
  );
}
