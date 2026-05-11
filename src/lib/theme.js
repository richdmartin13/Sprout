// Theme + color scheme tokens. Six accent schemes plus light/dark base.
// Each scheme carries: accent, accent-dim (alpha), accent-border (alpha),
// FAB gradient stops + glow, and a 10-step heatmap ramp.

export const SCHEMES = {
  indigo: {
    label: 'Indigo',
    accent: '#7c5cec',
    accentSoft: '#a288f5',
    grad: ['#5a46c8', '#7c5cec', '#a288f5'],
    glow: 'rgba(124,92,236,.45)',
    heat: ['#1c1650', '#2d2478', '#4030a8', '#5a46c8', '#7c5cec', '#9e80f8', '#c0a8ff', '#ddd0ff', '#eee7ff', '#fde68a'],
  },
  violet: {
    label: 'Violet',
    accent: '#9b5de8',
    accentSoft: '#c084ff',
    grad: ['#7c48cc', '#9b5de8', '#c084ff'],
    glow: 'rgba(155,93,232,.45)',
    heat: ['#281648', '#3e2270', '#5c34a8', '#7c48cc', '#9b5de8', '#bc84ff', '#d8b2ff', '#eeddff', '#f7eaff', '#fde68a'],
  },
  ocean: {
    label: 'Ocean',
    accent: '#3498e8',
    accentSoft: '#7ec0ff',
    grad: ['#2478c8', '#3498e8', '#7ec0ff'],
    glow: 'rgba(52,152,232,.45)',
    heat: ['#0c2848', '#113c6c', '#1858a0', '#2478c8', '#3498e8', '#5cb8ff', '#8ed4ff', '#bcebff', '#dff4ff', '#fde68a'],
  },
  ember: {
    label: 'Ember',
    accent: '#f07030',
    accentSoft: '#ff9e6a',
    grad: ['#d45010', '#f07030', '#ff9e6a'],
    glow: 'rgba(240,112,48,.45)',
    heat: ['#461800', '#6e2400', '#a83800', '#d45010', '#f07030', '#ff9050', '#ffb880', '#ffd8b8', '#ffeed8', '#fefcd0'],
  },
  moss: {
    label: 'Moss',
    accent: '#44a050',
    accentSoft: '#86d896',
    grad: ['#347c3c', '#44a050', '#86d896'],
    glow: 'rgba(68,160,80,.45)',
    heat: ['#122818', '#1c4020', '#285c2c', '#347c3c', '#44a050', '#62c070', '#88dc98', '#b8f0c8', '#dcf5e2', '#fde68a'],
  },
  rose: {
    label: 'Rose',
    accent: '#e04888',
    accentSoft: '#f594bd',
    grad: ['#be3870', '#e04888', '#f594bd'],
    glow: 'rgba(224,72,136,.45)',
    heat: ['#40142e', '#621c42', '#902858', '#be3870', '#e04888', '#f270a8', '#f898c4', '#fcc4de', '#ffe2ee', '#fde68a'],
  },
};

export const BASE = {
  dark: {
    bg: '#0a0a14',
    bg2: '#11111c',
    surface: 'rgba(28,28,42,0.62)',
    surface2: 'rgba(40,40,60,0.55)',
    surfaceSolid: '#161620',
    surfaceSolid2: '#1f1f2e',
    surfaceSolid3: '#28283c',
    border: 'rgba(255,255,255,0.08)',
    border2: 'rgba(255,255,255,0.14)',
    text: '#f0ecfa',
    text2: '#bcb6d6',
    muted: '#8a86aa',
    glassTint: 'rgba(255,255,255,0.04)',
    glassHighlight: 'rgba(255,255,255,0.10)',
    overlay: 'rgba(8,8,16,0.55)',
    glassNavBg: 'rgba(28,28,42,0.55)',
    glassNavBorder: 'rgba(255,255,255,0.14)',
    glassNavActiveBg: 'rgba(255,255,255,0.10)',
    glassNavInnerTop: 'rgba(255,255,255,0.18)',
    glassNavInnerBottom: 'rgba(255,255,255,0.04)',
  },
  light: {
    bg: '#f4f1fa',
    bg2: '#ebe7f5',
    surface: 'rgba(255,255,255,0.66)',
    surface2: 'rgba(255,255,255,0.50)',
    surfaceSolid: '#ffffff',
    surfaceSolid2: '#f0eef8',
    surfaceSolid3: '#e6e2f2',
    border: 'rgba(20,16,40,0.08)',
    border2: 'rgba(20,16,40,0.14)',
    text: '#15122c',
    text2: '#3e3962',
    muted: '#6e6892',
    glassTint: 'rgba(255,255,255,0.55)',
    glassHighlight: 'rgba(255,255,255,0.85)',
    overlay: 'rgba(20,16,40,0.30)',
    glassNavBg: 'rgba(255,255,255,0.62)',
    glassNavBorder: 'rgba(20,16,40,0.10)',
    glassNavActiveBg: 'rgba(255,255,255,0.85)',
    glassNavInnerTop: 'rgba(255,255,255,0.80)',
    glassNavInnerBottom: 'rgba(20,16,40,0.04)',
  },
};

// Fixed type colors (do not vary by scheme).
export const TYPE_COLORS = {
  go: '#34d399',
  st: '#fb7185',
  ne: '#60a5fa',
};

export const TYPE_LABELS = {
  go: 'Start',
  st: 'Stop',
  ne: 'Neutral',
};

export function applyTheme(prefs) {
  const isDark = prefs.dark !== false;
  const base = isDark ? BASE.dark : BASE.light;
  const scheme = SCHEMES[prefs.scheme] || SCHEMES.indigo;
  const root = document.documentElement;

  root.style.setProperty('--bg', base.bg);
  root.style.setProperty('--bg2', base.bg2);
  root.style.setProperty('--surface', base.surface);
  root.style.setProperty('--surface-2', base.surface2);
  root.style.setProperty('--surface-solid', base.surfaceSolid);
  root.style.setProperty('--surface-solid-2', base.surfaceSolid2);
  root.style.setProperty('--surface-solid-3', base.surfaceSolid3);
  root.style.setProperty('--border', base.border);
  root.style.setProperty('--border-2', base.border2);
  root.style.setProperty('--text', base.text);
  root.style.setProperty('--text-2', base.text2);
  root.style.setProperty('--muted', base.muted);
  root.style.setProperty('--glass-tint', base.glassTint);
  root.style.setProperty('--glass-highlight', base.glassHighlight);
  root.style.setProperty('--overlay', base.overlay);
  root.style.setProperty('--glass-nav-bg', base.glassNavBg);
  root.style.setProperty('--glass-nav-border', base.glassNavBorder);
  root.style.setProperty('--glass-nav-active-bg', base.glassNavActiveBg);
  root.style.setProperty('--glass-nav-inner-top', base.glassNavInnerTop);
  root.style.setProperty('--glass-nav-inner-bottom', base.glassNavInnerBottom);

  root.style.setProperty('--accent', scheme.accent);
  root.style.setProperty('--accent-soft', scheme.accentSoft);
  root.style.setProperty('--accent-dim', hexA(scheme.accent, 0.18));
  root.style.setProperty('--accent-border', hexA(scheme.accent, 0.40));
  root.style.setProperty('--accent-glow', scheme.glow);
  root.style.setProperty('--grad-1', scheme.grad[0]);
  root.style.setProperty('--grad-2', scheme.grad[1]);
  root.style.setProperty('--grad-3', scheme.grad[2]);

  root.style.setProperty('--type-go', TYPE_COLORS.go);
  root.style.setProperty('--type-st', TYPE_COLORS.st);
  root.style.setProperty('--type-ne', TYPE_COLORS.ne);

  // Heat ramp variables
  scheme.heat.forEach((c, i) => root.style.setProperty(`--heat-${i}`, c));

  document.body.classList.toggle('theme-dark', isDark);
  document.body.classList.toggle('theme-light', !isDark);

  // theme-color meta
  const meta = document.getElementById('theme-color');
  if (meta) meta.setAttribute('content', base.bg);
}

function hexA(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function heatColor(count, max, prefs) {
  if (!count) return null;
  const scheme = SCHEMES[prefs.scheme] || SCHEMES.indigo;
  const idx = Math.min(9, Math.max(0, Math.ceil((count / Math.max(1, max)) * 10) - 1));
  return scheme.heat[idx];
}
