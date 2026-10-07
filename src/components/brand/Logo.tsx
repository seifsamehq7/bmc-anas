import { LETTER_PATHS, LOCKUP_VIEWBOX, MARK_PATHS, MARK_VIEWBOX, WORDMARK_PATHS } from "./paths";

type Props = {
  /** full: crescents, BMC and the wordmark. compact: crescents and BMC. mark: crescents only. */
  variant?: "full" | "compact" | "mark";
  className?: string;
  label?: string;
};

/** The BMC lockup. Letters use currentColor so the parent decides ink or white. */
export default function Logo({ variant = "full", className, label = "BMC, Barakat Medcare Center" }: Props) {
  const isMark = variant === "mark";
  return (
    <svg
      className={className}
      viewBox={isMark ? MARK_VIEWBOX : LOCKUP_VIEWBOX}
      focusable="false"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {MARK_PATHS.map((d) => (
        <path key={d.slice(0, 24)} d={d} fill="url(#bmc-grad)" />
      ))}
      {!isMark && (
        <g fill="currentColor">
          {LETTER_PATHS.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
          {variant === "full" && WORDMARK_PATHS.map((d, i) => <path key={i} d={d} />)}
        </g>
      )}
    </svg>
  );
}
