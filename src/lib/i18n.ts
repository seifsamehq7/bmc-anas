export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const dirOf = (lang: Locale) => (lang === "ar" ? "rtl" : "ltr");

export const otherLocale = (lang: Locale): Locale => (lang === "ar" ? "en" : "ar");

/** Swap the locale segment of a pathname, keeping the rest of the route. */
export function switchLocalePath(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  if (parts[1] && hasLocale(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join("/") || `/${to}`;
}

/** Western digits are the brand's number style (Nexa Slab), in both languages. */
export const pad2 = (n: number) => String(n).padStart(2, "0");
