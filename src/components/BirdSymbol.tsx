// The JA symbol in its monochrome form: the right side of each bird is solid,
// the left side is the same colour at exactly 50% (per the brand guidelines).
// Geometry taken from the official JA Zambia logo file. Decorative only.

const birds = [
  [517.0859, 42.208436],
  [517.0859, 234.76532],
  [363.0758, 158.38352],
  [209.4589, 274.55873],
  [363.0216, 350.94053],
  [517.0317, 427.32234],
];

type Props = {
  color?: string;
  className?: string;
};

export function BirdSymbol({ color = "#ffffff", className }: Props) {
  return (
    <svg viewBox="53.5 40 466 582" className={className} aria-hidden="true" focusable="false">
      {birds.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <path
            transform={`matrix(1,0,0,-1,${x},${y})`}
            d="M0 0-57.586-115.904-153.563-116.175Z"
            fill={color}
            fillOpacity={0.5}
          />
          <path transform={`matrix(1,0,0,-1,${x + 0.0833},${y})`} d="M0 0-57.586-115.904 .025-192.557Z" fill={color} />
        </g>
      ))}
    </svg>
  );
}
