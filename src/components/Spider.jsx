import React, { useMemo } from 'react';

// Generic radar/spider chart.
// layers: [{ label, color, values: number[], max?: number }]
// axes: string[] (labels)
export default function Spider({ axes, layers, size = 280 }) {
  const data = useMemo(() => {
    if (!axes || axes.length < 3) return null;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.36;
    const n = axes.length;

    // Compute global max across layers, or per-layer if max provided
    const layerPolys = layers.map((layer) => {
      const max = layer.max ?? (Math.max(...layer.values, 0) || 1);
      const points = layer.values.map((v, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        const r = (Math.max(0, v) / max) * radius;
        return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
      });
      return { ...layer, points };
    });

    // Axis endpoints + labels
    const axisLines = axes.map((label, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return {
        label: label.length > 12 ? label.slice(0, 11) + '…' : label,
        x: cx + radius * Math.cos(ang),
        y: cy + radius * Math.sin(ang),
        lx: cx + (radius + 14) * Math.cos(ang),
        ly: cy + (radius + 14) * Math.sin(ang),
      };
    });

    // Grid rings (4 rings)
    const rings = [0.25, 0.5, 0.75, 1].map((t) => {
      return axes.map((_, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        return [cx + radius * t * Math.cos(ang), cy + radius * t * Math.sin(ang)];
      });
    });

    return { cx, cy, radius, axisLines, layerPolys, rings };
  }, [axes, layers, size]);

  if (!data) return null;
  const { axisLines, layerPolys, rings } = data;

  return (
    <div className="spider-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: 320 }}>
        {/* Rings */}
        {rings.map((ring, i) => (
          <polygon
            key={i}
            points={ring.map((p) => p.join(',')).join(' ')}
            fill="none"
            stroke="var(--border-2)"
            strokeWidth="1"
            opacity={0.6}
          />
        ))}
        {/* Axis lines */}
        {axisLines.map((a, i) => (
          <line key={i} x1={data.cx} y1={data.cy} x2={a.x} y2={a.y} stroke="var(--border-2)" strokeWidth="1" opacity={0.5} />
        ))}
        {/* Layers (filled polygons) */}
        {layerPolys.map((layer, i) => (
          <g key={i}>
            <polygon
              points={layer.points.map((p) => p.join(',')).join(' ')}
              fill={layer.color}
              fillOpacity={i === 0 ? 0.28 : 0.14}
              stroke={layer.color}
              strokeWidth="2"
            />
            {layer.points.map((p, j) => (
              <circle key={j} cx={p[0]} cy={p[1]} r={2.5} fill={layer.color} />
            ))}
          </g>
        ))}
        {/* Axis labels */}
        {axisLines.map((a, i) => (
          <text
            key={i}
            x={a.lx}
            y={a.ly}
            fontSize="9.5"
            fontWeight="600"
            textAnchor={Math.abs(a.lx - data.cx) < 4 ? 'middle' : a.lx > data.cx ? 'start' : 'end'}
            dominantBaseline="middle"
            fill="var(--muted)"
          >
            {a.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
