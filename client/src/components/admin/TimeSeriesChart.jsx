import { useState } from 'react';

const W = 640;
const H = 220;
const P = { l: 40, r: 12, t: 12, b: 26 };

function niceStep(raw) {
  const p = 10 ** Math.floor(Math.log10(raw));
  const f = raw / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}

const fmtDay = (iso) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });

/** Dependency-free SVG line chart. series: [{ key, label, color }] */
export default function TimeSeriesChart({ title, data, series }) {
  const [hover, setHover] = useState(null);
  if (!data?.length) return null;

  const max = Math.max(1, ...data.flatMap((d) => series.map((s) => d[s.key] || 0)));
  const step = Math.max(1, niceStep(max / 4));
  const top = step * 4;
  const x = (i) => P.l + (data.length === 1 ? 0 : (i * (W - P.l - P.r)) / (data.length - 1));
  const y = (v) => P.t + (1 - v / top) * (H - P.t - P.b);

  const active = hover ?? data.length - 1;
  const point = data[active];

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - P.l) / (W - P.l - P.r)) * (data.length - 1));
    setHover(Math.min(data.length - 1, Math.max(0, i)));
  };

  const labelIdx = [0, Math.floor((data.length - 1) / 2), data.length - 1];

  return (
    <figure className="panel p-4">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <p className="text-xs text-ink-soft dark:text-mist-soft" aria-live="polite">
          {fmtDay(point.date)}:{' '}
          {series.map((s) => `${s.label} ${point[s.key] || 0}`).join(' · ')}
        </p>
      </figcaption>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-3 h-auto w-full text-ink dark:text-mist"
        role="img"
        aria-label={`${title} chart`}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line x1={P.l} x2={W - P.r} y1={y(step * i)} y2={y(step * i)} stroke="currentColor" strokeOpacity="0.12" />
            <text x={P.l - 6} y={y(step * i) + 4} textAnchor="end" fontSize="11" fill="currentColor" fillOpacity="0.6">
              {step * i}
            </text>
          </g>
        ))}

        {labelIdx.map((i, k) => (
          <text
            key={i}
            x={x(i)}
            y={H - 6}
            fontSize="11"
            fill="currentColor"
            fillOpacity="0.6"
            textAnchor={k === 0 ? 'start' : k === 2 ? 'end' : 'middle'}
          >
            {fmtDay(data[i].date)}
          </text>
        ))}

        {series.map((s) => (
          <path
            key={s.key}
            d={data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d[s.key] || 0).toFixed(1)}`).join('')}
            fill="none"
            stroke={s.color}
            strokeWidth="2.25"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        <line x1={x(active)} x2={x(active)} y1={P.t} y2={H - P.b} stroke="currentColor" strokeOpacity="0.25" strokeDasharray="3 3" />
        {series.map((s) => (
          <circle key={s.key} cx={x(active)} cy={y(point[s.key] || 0)} r="4" fill={s.color} />
        ))}
      </svg>

      <div className="mt-2 flex flex-wrap gap-4 text-xs">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </figure>
  );
}