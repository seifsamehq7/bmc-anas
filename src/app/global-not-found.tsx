import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import "./globals.css";

const araboto = localFont({ src: "../fonts/araboto-700.woff2", weight: "700", variable: "--font-araboto", adjustFontFallback: false });
const nexaSlab = localFont({ src: "../fonts/nexa-slab-700.woff2", weight: "700", variable: "--font-nexa" });

export const metadata: Metadata = {
  title: "404 | BMC",
};

/** Shown for URLs outside /ar and /en. Bilingual, since the language is unknown here. */
export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl" className={`${araboto.variable} ${nexaSlab.variable}`}>
      <body className="on-deep" style={{ minHeight: "100svh", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
        <main style={{ display: "grid", gap: 18, justifyItems: "center" }}>
          <p className="latin" style={{ fontSize: "clamp(5rem, 16vw, 10rem)", fontWeight: 700, lineHeight: 1 }}>
            <span className="grad-text">404</span>
          </p>
          <h1 className="h3">هذه الصفحة غير موجودة.</h1>
          <p lang="en" style={{ color: "var(--on-deep-2)" }}>
            This page does not exist.
          </p>
          <p style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
            <Link className="btn btn-light" href="/ar" style={{ paddingInline: "1.7rem" }}>
              الرئيسية
            </Link>
            <Link className="btn btn-ghost" href="/en" lang="en">
              Home
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
