import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;

/** Smooth-scroll to a position or element, falling back to native scrolling. */
export function scrollToTarget(target: number | HTMLElement, opts: { immediate?: boolean; offset?: number } = {}) {
  if (instance) {
    instance.scrollTo(target, { offset: opts.offset ?? 0, immediate: opts.immediate, force: true });
    return;
  }
  const top =
    typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
  window.scrollTo({ top, behavior: opts.immediate ? "auto" : "smooth" });
}

/** Run `fn` at most once per animation frame while the page scrolls or resizes. */
export function onScrollFrame(fn: () => void) {
  let raf = 0;
  const schedule = () => {
    if (!raf) {
      raf = requestAnimationFrame(() => {
        raf = 0;
        fn();
      });
    }
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  schedule();
  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (raf) cancelAnimationFrame(raf);
  };
}

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Fires once the intro loader has handed the page over (or immediately if it already has). */
export function whenReady(fn: () => void) {
  if (document.documentElement.classList.contains("is-ready")) {
    fn();
    return () => {};
  }
  window.addEventListener("bmc:ready", fn, { once: true });
  return () => window.removeEventListener("bmc:ready", fn);
}
