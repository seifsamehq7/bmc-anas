import Button from "@/components/ui/Button";

/* Rendered inside the locale layout for unknown paths under /ar or /en.
   Uses only global styles so nothing extra loads on every page. */
export default function NotFound() {
  return (
    <section style={{ padding: "clamp(8px, 1vw, 14px)" }}>
      <div className="on-deep" style={{ borderRadius: "var(--r-xl)", minHeight: "78vh", display: "grid", alignItems: "end" }}>
        <div className="container" style={{ display: "grid", gap: 18, paddingBlock: "150px 80px" }}>
          <p className="kicker latin">404</p>
          <h1 className="display" style={{ maxWidth: "16ch", fontSize: "clamp(2.4rem, 5vw, 4.8rem)" }}>
            هذه الصفحة غير موجودة.
          </h1>
          <p className="lead" lang="en">
            This page does not exist.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <Button href="/ar" variant="light">
              الرئيسية
            </Button>
            <Button href="/en" variant="ghost">
              Home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
