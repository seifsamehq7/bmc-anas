"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getLenis, setLenis, whenReady } from "@/lib/scroll";

/**
 * One client island for the whole site's motion plumbing:
 * smoothed scrolling, the fade-in observer, and pausing loops on hidden tabs.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const create = () => {
      if (lenis || reduce.matches) return;
      lenis = new Lenis({ autoRaf: true, lerp: 0.085, anchors: { offset: -24 }, stopInertiaOnNavigate: true });
      setLenis(lenis);
      if (!root.classList.contains("is-ready")) lenis.stop();
    };
    const destroy = () => {
      lenis?.destroy();
      lenis = null;
      setLenis(null);
    };

    create();
    const onReduce = () => (reduce.matches ? destroy() : create());
    const onReady = () => getLenis()?.start();
    const onVisibility = () => document.body.classList.toggle("paused", document.hidden);

    reduce.addEventListener("change", onReduce);
    window.addEventListener("bmc:ready", onReady);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      reduce.removeEventListener("change", onReduce);
      window.removeEventListener("bmc:ready", onReady);
      document.removeEventListener("visibilitychange", onVisibility);
      destroy();
    };
  }, []);

  // New page: start at the top (unless a hash asks otherwise) and arm the fade-ins.
  useEffect(() => {
    if (!window.location.hash) getLenis()?.scrollTo(0, { immediate: true, force: true });

    let io: IntersectionObserver | null = null;
    const arm = () => {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).setAttribute("data-in", "");
            io?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0 },
      );
      document.querySelectorAll("[data-reveal]:not([data-in])").forEach((el) => io?.observe(el));
    };
    const cancel = whenReady(arm);
    return () => {
      cancel();
      io?.disconnect();
    };
  }, [pathname]);

  return null;
}
