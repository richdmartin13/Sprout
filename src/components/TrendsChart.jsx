import React, { useMemo } from 'react';
import { fmtDate } from '../lib/util.js';

const PALETTE = ['var(--accent)', '#fb7185', '#34d399', '#60a5fa', '#f59e0b', '#a78bfa'];

export default function TrendsChart({ series, height = 140 }) {
  const data = useMemo(() => {
    if (!series.length) return null;
    const days = series[0].points.length;
    const w = 320;
    const h = height;
    const padL = 6;
    const padR = 6;
    const padT = 8;
    const padB = 6;
    let maxV = 0;
    for (const s of series) for (const p of s.points) if (p.count > maxV) maxV = p.count;
    if (maxV === 0) maxV = 1;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;
    const lines = series.map((s, i) => {
      const pts = s.points.map((p, idx) => {
        const x = padL + (idx / (days - 1)) * innerW;
        const y = padT + innerH - (p.count / maxV) * innerH;
        return [x, y];
      });
      return { ...s, pts, color: PALETTE[i % PALETTE.length] };
    });
    return { w, h, lines, days };
  }, [series, height]);

  if (!data) return null;

  return (
    <svg viewBox={`0 0 ${data.w} ${data.h}`} style={{ width: '100%', height: 'auto' }}>
      {data.lines.map((l, i) => (
        <polyline
          key={i}
          points={l.pts.map((p) => p.join(',')).join(' ')}
          fill="none"
          stroke={l.color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.95}
        />
      ))}
    </svg>
  );
}

export { PALETTE as TRENDS_PALETTE };
