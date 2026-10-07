"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import BookingTrigger from "@/components/booking/BookingTrigger";
import Logo from "@/components/brand/Logo";
import type { Dictionary } from "@/content/dictionaries";
import { otherLocale, switchLocalePath, type Locale } from "@/lib/i18n";
import SideNav, { type NavMachine } from "./SideNav";
import styles from "./Header.module.css";

type Props = { lang: Locale; nav: Dictionary["nav"]; machines: NavMachine[]; brandName: string };

export default function Header({ lang, nav, machines, brandName }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const other = otherLocale(lang);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled || undefined} data-open={open || undefined}>
        <div className={styles.bar}>
          <Link href={`/${lang}`} className={styles.brand} aria-label={brandName} onClick={() => close(false)}>
            <Logo variant="compact" className={styles.logo} label={brandName} />
          </Link>

          <div className={styles.actions}>
            <Link
              href={switchLocalePath(pathname, other)}
              className={styles.lang}
              hrefLang={other}
              lang={other}
              aria-label={nav.langName}
            >
              <span className={other === "en" ? "latin" : undefined}>{nav.langShort}</span>
            </Link>
            <BookingTrigger className={styles.cta}>{nav.booking}</BookingTrigger>
            <button
              ref={buttonRef}
              type="button"
              className={styles.menu}
              aria-expanded={open}
              aria-controls="side-nav"
              aria-label={open ? nav.close : nav.menu}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={styles.dash} />
              <span className={styles.dash} />
              <span className={styles.dash} />
            </button>
          </div>
        </div>
      </header>
      <SideNav lang={lang} nav={nav} machines={machines} open={open} onClose={close} />
    </>
  );
}
