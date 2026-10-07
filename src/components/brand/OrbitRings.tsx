type Props = { className?: string };

/**
 * Three open arcs in the shape of the logo's crescents, used as the frame
 * ("the lens") around every machine. Each arc is a circle with a dash gap,
 * so CSS can spin them independently.
 */
export default function OrbitRings({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <g className="orbit orbit-1">
        <circle cx="100" cy="100" r="97" pathLength="100" strokeDasharray="72 28" strokeDashoffset="-14" />
      </g>
      <g className="orbit orbit-2">
        <circle cx="100" cy="100" r="91" pathLength="100" strokeDasharray="58 42" strokeDashoffset="-21" />
      </g>
      <g className="orbit orbit-3">
        <circle cx="100" cy="100" r="85.5" pathLength="100" strokeDasharray="44 56" strokeDashoffset="-28" />
      </g>
    </svg>
  );
}
