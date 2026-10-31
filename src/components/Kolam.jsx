// Hand-drawn feeling muggu / kolam patterns generated as single continuous strokes,
// so they can "draw themselves" with stroke-dashoffset.

const pt = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`;

/** Rose-curve rosette: one unbroken line, like a muggu drawn without lifting the hand. */
export function rosettePath(cx = 100, cy = 100, R = 82, petals = 8) {
  const k = petals / 2;
  const steps = 200;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = R * (0.18 + 0.82 * Math.abs(Math.cos(k * t)));
    d += (i ? 'L' : 'M') + pt(cx + r * Math.cos(t), cy + r * Math.sin(t));
  }
  return d + 'Z';
}

/** Wavy outer ring. */
export function ringPath(cx = 100, cy = 100, R = 92, waves = 16, amp = 4) {
  const steps = 240;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = R + amp * Math.sin(waves * t);
    d += (i ? 'L' : 'M') + pt(cx + r * Math.cos(t), cy + r * Math.sin(t));
  }
  return d + 'Z';
}

/** Looping chain (prolate cycloid) used for section dividers. */
export function chainPath(width = 600, loops = 12, r = 9, cy = 16) {
  const s = width / (loops * Math.PI * 2);
  const steps = loops * 24;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * loops * Math.PI * 2;
    d += (i ? 'L' : 'M') + pt(s * t - r * Math.sin(t) + r, cy + r * Math.cos(t));
  }
  return d;
}

export function Rosette({ className = '', strokeWidth = 1.6, dots = true, ...rest }) {
  const tips = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    return [100 + 58 * Math.cos(a), 100 + 58 * Math.sin(a)];
  });
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path className="kolam-stroke" d={ringPath()} />
        <path className="kolam-stroke" d={rosettePath()} />
        <path className="kolam-stroke" d={rosettePath(100, 100, 34, 8)} />
      </g>
      {dots && (
        <g fill="currentColor">
          <circle cx="100" cy="100" r="2.6" />
          {tips.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.2" />
          ))}
        </g>
      )}
    </svg>
  );
}

export function KolamDivider({ className = '', loops = 14 }) {
  const width = 600;
  const s = width / (loops * Math.PI * 2);
  const dots = Array.from({ length: loops }, (_, i) => s * (i + 0.5) * Math.PI * 2 + 9);
  return (
    <svg viewBox={`0 0 ${width + 18} 32`} preserveAspectRatio="none" className={`kolam-divider ${className}`} aria-hidden="true">
      <path className="kolam-stroke" d={chainPath(width, loops)} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <g fill="currentColor">
        {dots.map((x, i) => (
          <circle key={i} cx={x} cy="16" r="1.6" />
        ))}
      </g>
    </svg>
  );
}

/** Dot-grid kolam pattern used as a footer texture. */
export function KolamField({ className = '' }) {
  return (
    <svg className={className} aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id="kolam-field" width="80" height="80" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M40 8 C 62 8, 72 18, 72 40 C 72 62, 62 72, 40 72 C 18 72, 8 62, 8 40 C 8 18, 18 8, 40 8 Z" />
            <path d="M40 8 C 52 28, 52 52, 40 72 M40 8 C 28 28, 28 52, 40 72 M8 40 C 28 28, 52 28, 72 40 M8 40 C 28 52, 52 52, 72 40" />
          </g>
          <g fill="currentColor">
            <circle cx="40" cy="40" r="1.6" /><circle cx="0" cy="0" r="1.6" /><circle cx="80" cy="0" r="1.6" />
            <circle cx="0" cy="80" r="1.6" /><circle cx="80" cy="80" r="1.6" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kolam-field)" />
    </svg>
  );
}
