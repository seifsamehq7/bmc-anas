"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import CrescentPattern from "@/components/brand/CrescentPattern";
import Icon from "@/components/ui/Icon";
import type { Dictionary } from "@/content/dictionaries";
import { site } from "@/content/site";
import { pad2, switchLocalePath, type Locale } from "@/lib/i18n";
import { requestDashboardIntro } from "@/lib/dash-intro";
import { getLenis } from "@/lib/scroll";
import styles from "./SideNav.module.css";

export type NavMachine = { slug: string; abbr: string; name: string };

type Props = {
  lang: Locale;
  nav: Dictionary["nav"];
  machines: NavMachine[];
  open: boolean;
  onClose: (restoreFocus?: boolean) => void;
};

export default function SideNav({ lang, nav, machines, open, onClose }: Props) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLElement>(null);

  // Lock the page behind the panel, close on Escape, keep focus inside.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("nav-open");
    getLenis()?.stop();
    const first = panelRef.current?.querySelector<HTMLElement>("a[href]");
    const focusTimer = window.setTimeout(() => first?.focus({ preventScroll: true }), 120);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      const menuButton = document.querySelector<HTMLElement>('[aria-controls="side-nav"]');
      if (menuButton) items.push(menuButton);
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
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      root.classList.remove("nav-open");
      getLenis()?.start();
    };
  }, [open, onClose]);

  const links = [
    { href: `/${lang}`, label: nav.home },
    { href: `/${lang}/machines`, label: nav.machines },
    { href: `/${lang}/about`, label: nav.about },
    { href: `/${lang}#contact`, label: nav.contact },
    { href: `/${lang}/booking`, label: nav.booking },
  ];
  const isActive = (href: string) => !href.includes("#") && pathname === href;
  const closeQuietly = () => onClose(false);

  return (
    <div id="side-nav" className={styles.root} data-open={open || undefined} inert={!open}>
      <div className={styles.scrim} onClick={() => onClose()} aria-hidden="true" />
      {/* data-lenis-prevent: the page's smooth scroll is paused while the menu is open;
          without it, swipes on a short screen could not reach the bottom of the menu. */}
      <nav ref={panelRef} className={styles.panel} aria-label={nav.navLabel} data-lenis-prevent="">
        <CrescentPattern id="nav-pattern" className={styles.pattern} size={54} />
        <div className={styles.glow} aria-hidden="true" />

        <ol className={styles.primary}>
          {links.map((link, i) => (
            <li key={link.href} style={{ "--i": i } as CSSProperties}>
              <Link
                href={link.href}
                className={styles.link}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={closeQuietly}
              >
                <span className={`${styles.num} latin`}>{pad2(i + 1)}</span>
                <span className={styles.label}>{link.label}</span>
              </Link>
            </li>
          ))}
        </ol>

        <div className={styles.group} style={{ "--i": 6 } as CSSProperties}>
          <p className={styles.groupLabel}>{nav.machinesLabel}</p>
          <ul className={styles.chips}>
            {machines.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/${lang}/machines/${m.slug}`}
                  className={`${styles.chip} latin`}
                  title={m.name}
                  aria-label={m.name}
                  onClick={closeQuietly}
                >
                  {m.abbr}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.foot} style={{ "--i": 7 } as CSSProperties}>
          <div>
            <p className={styles.groupLabel}>{nav.reachLabel}</p>
            <a href={site.phoneHref} className={styles.footLink}>
              <Icon name="phone" />
              <span className="latin" dir="ltr">
                {site.phoneDisplay}
              </span>
            </a>
            <a href={site.whatsappHref} className={styles.footLink} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" />
              <span>WhatsApp</span>
            </a>
          </div>
          <div>
            <p className={styles.groupLabel}>{nav.langLabel}</p>
            <Link href={switchLocalePath(pathname, "ar")} className={styles.footLink} lang="ar" hrefLang="ar" aria-current={lang === "ar" ? "true" : undefined}>
              العربية
            </Link>
            <Link href={switchLocalePath(pathname, "en")} className={`${styles.footLink} latin`} lang="en" hrefLang="en" aria-current={lang === "en" ? "true" : undefined}>
              English
            </Link>
            <Link
              href={`/${lang}/dashboard`}
              className={`${styles.footLink} ${styles.dashLink}`}
              onClick={(e) => {
                requestDashboardIntro(e);
                closeQuietly();
              }}
            >
              <Icon name="grid" />
              <span>{nav.dashboard}</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
