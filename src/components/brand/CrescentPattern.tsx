type Props = { id: string; className?: string; size?: number };

/**
 * The brand pattern (guide page 8): rows of the crescent mark,
 * each row stepping sideways so the field reads as a gentle diagonal.
 */
export default function CrescentPattern({ id, className, size = 64 }: Props) {
  const w = size;
  const h = size * 1.2;
  const col = size * 1.55;
  const row = size * 1.3;
  const shift = col / 3;
  return (
    <svg className={className} aria-hidden="true" focusable="false" width="100%" height="100%">
      <defs>
        <pattern id={id} width={col} height={row * 3} patternUnits="userSpaceOnUse">
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <use href="#bmc-mark" x={r * shift} y={r * row} width={w} height={h} />
              <use href="#bmc-mark" x={r * shift - col} y={r * row} width={w} height={h} />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
