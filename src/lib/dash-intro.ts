/**
 * The dashboard loader plays when someone walks into the dashboard: from the website,
 * or by opening a dashboard link. It never plays on a reload, on back/forward, or when
 * moving between dashboard sections.
 *
 * The state lives on <html> so the loader can cover the very first paint:
 *   dash-intro    the loader is on screen and the dashboard waits behind it
 *   dash-leaving  the loader closes and the dashboard pieces fly into place
 * The boot script in app/[lang]/layout.tsx sets dash-intro for direct visits;
 * links from the website set it here, just before the client-side navigation.
 */

type ClickLike = { metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean; button?: number };

export function requestDashboardIntro(e?: ClickLike) {
  // A modified click opens a new tab; that tab decides for itself.
  if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button ?? 0) !== 0)) return;
  const html = document.documentElement;
  delete html.dataset.dashIntroAt;
  html.classList.remove("dash-leaving");
  html.classList.add("dash-intro");
}

/** True while the loader covers the dashboard (before it starts to close). */
export function isDashboardIntroPlaying() {
  const c = document.documentElement.classList;
  return c.contains("dash-intro") && !c.contains("dash-leaving");
}

export function subscribeDashboardIntro(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}

/**
 * Holds the loader for `holdMs` (counting the time it has already been on screen
 * since first paint on a direct visit), then closes it. Returns a cleanup.
 */
export function runDashboardIntro(holdMs: number, leaveMs: number, minHoldMs: number) {
  const html = document.documentElement;
  if (!html.classList.contains("dash-intro")) return () => {};
  const shownAt = Number(html.dataset.dashIntroAt);
  const elapsed = Number.isFinite(shownAt) ? performance.now() - shownAt : 0;
  const hold = Math.max(minHoldMs, holdMs - elapsed);
  const t1 = window.setTimeout(() => html.classList.add("dash-leaving"), hold);
  const t2 = window.setTimeout(() => {
    html.classList.remove("dash-intro", "dash-leaving");
    delete html.dataset.dashIntroAt;
  }, hold + leaveMs);
  return () => {
    window.clearTimeout(t1);
    window.clearTimeout(t2);
  };
}
