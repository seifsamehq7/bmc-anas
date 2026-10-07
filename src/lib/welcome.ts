/**
 * The welcome popup ("which department do you need?") shows once per browser session.
 * A session cookie (no expiry date) is shared by every tab and cleared when the browser
 * closes, so new tabs stay quiet and a fresh browser session asks again.
 */
const COOKIE = "bmc-welcome";

export function hasWelcomed() {
  return document.cookie.split("; ").some((c) => c === `${COOKIE}=1`);
}

export function markWelcomed() {
  document.cookie = `${COOKIE}=1; path=/; SameSite=Lax`;
}

/** Booking pages already know the department, so the question would only get in the way. */
export const skipsWelcome = (pathname: string) => /\/booking(\/|$)/.test(pathname);
