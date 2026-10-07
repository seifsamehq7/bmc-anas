import { MARK_PATHS, MARK_VIEWBOX } from "./paths";

/**
 * Shared SVG definitions, rendered once in the layout and never hidden,
 * so every logo, pattern and ring can reference the brand gradient safely.
 */
export default function BrandDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {/* Same direction as the logo: blue on the outer edge, mint at the tips. */}
        <linearGradient id="bmc-grad" gradientUnits="userSpaceOnUse" x1="516" y1="530" x2="803" y2="530">
          <stop offset="0" stopColor="#0c81e4" />
          <stop offset="0.45" stopColor="#11c4d4" />
          <stop offset="1" stopColor="#4fe7af" />
        </linearGradient>
        <linearGradient id="bmc-ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0c81e4" />
          <stop offset="0.5" stopColor="#11c4d4" />
          <stop offset="1" stopColor="#4fe7af" />
        </linearGradient>
        <symbol id="bmc-mark" viewBox={MARK_VIEWBOX}>
          {MARK_PATHS.map((d) => (
            <path key={d.slice(0, 24)} d={d} fill="url(#bmc-grad)" />
          ))}
        </symbol>
      </defs>
    </svg>
  );
}
