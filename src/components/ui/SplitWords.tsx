import type { CSSProperties, ElementType } from "react";

type Props = {
  /** One string per visual line. */
  lines: string | string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  id?: string;
};

/**
 * Splits a heading into word masks so each word can rise into place.
 * Words only, never characters: splitting Arabic letters would break their joins.
 */
export default function SplitWords({ lines, as: Tag = "h2", className = "", delay = 0, id }: Props) {
  const list = Array.isArray(lines) ? lines : [lines];
  let i = 0;
  return (
    <Tag id={id} className={`split ${className}`} data-reveal="split" style={{ "--d": delay } as CSSProperties}>
      {list.map((line, li) => (
        <span className="line" key={li}>
          {line.split(" ").map((word, wi, arr) => {
            const index = i++;
            return (
              <span key={wi}>
                <span className="w">
                  <span className="wi" style={{ "--i": index } as CSSProperties}>
                    {word}
                  </span>
                </span>
                {wi < arr.length - 1 ? " " : null}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
