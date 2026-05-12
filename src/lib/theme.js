// Theme + color scheme tokens.
// Each scheme has its own tuned dark bg (hue-matched to accent) and text tints.
// Light mode always uses brand cream (#f4f0e8) as bg.

export const SCHEMES = {
  sprout: {
    label: 'Sprout',
    accent: '#2d6e47',
    accentSoft: '#3d8f5f',
    grad: ['#1a4a2e', '#2d6e47', '#3d8f5f'],
    glow: 'rgba(45,110,71,.45)',
    // Dark bg: deep forest green-black
    darkBg:  '#09100c',
    darkBg2: '#101a12',
    darkSurface: 'rgba(20,34,24,0.65)',
    darkSurface2: 'rgba(28,46,32,0.58)',
    darkSurfaceSolid: '#121e14',
    darkSurfaceSolid2: '#192618',
    darkSurfaceSolid3: '#213020',
    darkText: '#edf2ec',
    darkText2: '#b0c4b2',
    darkMuted: '#72907a',
    darkNavBg: 'rgba(18,30,20,0.80)',
    heat: ['#0d2b1a','#1a4a2e','#2d6e47','#3d8f5f','#4aae77','#69c994','#8ddeb0','#b4eecb','#d8f7e5','#fde68a'],
  },
  indigo: {
    label: 'Indigo',
    accent: '#7c5cec',
    accentSoft: '#a288f5',
    grad: ['#5a46c8', '#7c5cec', '#a288f5'],
    glow: 'rgba(124,92,236,.45)',
    darkBg:  '#0c0a16',
    darkBg2: '#13101e',
    darkSurface: 'rgba(28,22,48,0.65)',
    darkSurface2: 'rgba(38,32,62,0.58)',
    darkSurfaceSolid: '#171228',
    darkSurfaceSolid2: '#1f1832',
    darkSurfaceSolid3: '#28203e',
    darkText: '#f0ecfa',
    darkText2: '#c2b8e0',
    darkMuted: '#8a82aa',
    darkNavBg: 'rgba(22,18,40,0.80)',
    heat: ['#1c1650','#2d2478','#4030a8','#5a46c8','#7c5cec','#9e80f8','#c0a8ff','#ddd0ff','#eee7ff','#fde68a'],
  },
  violet: {
    label: 'Violet',
    accent: '#9b5de8',
    accentSoft: '#c084ff',
    grad: ['#7c48cc', '#9b5de8', '#c084ff'],
    glow: 'rgba(155,93,232,.45)',
    darkBg:  '#0e0916',
    darkBg2: '#15101f',
    darkSurface: 'rgba(32,20,52,0.65)',
    darkSurface2: 'rgba(42,28,66,0.58)',
    darkSurfaceSolid: '#19102a',
    darkSurfaceSolid2: '#221736',
    darkSurfaceSolid3: '#2c2042',
    darkText: '#f2edfb',
    darkText2: '#c8b8e4',
    darkMuted: '#9480b2',
    darkNavBg: 'rgba(24,14,42,0.80)',
    heat: ['#281648','#3e2270','#5c34a8','#7c48cc','#9b5de8','#bc84ff','#d8b2ff','#eeddff','#f7eaff','#fde68a'],
  },
  ocean: {
    label: 'Ocean',
    accent: '#3498e8',
    accentSoft: '#7ec0ff',
    grad: ['#2478c8', '#3498e8', '#7ec0ff'],
    glow: 'rgba(52,152,232,.45)',
    darkBg:  '#091016',
    darkBg2: '#101820',
    darkSurface: 'rgba(16,32,52,0.65)',
    darkSurface2: 'rgba(22,42,66,0.58)',
    darkSurfaceSolid: '#111e2e',
    darkSurfaceSolid2: '#172638',
    darkSurfaceSolid3: '#1e3046',
    darkText: '#eaf2fb',
    darkText2: '#b0cce4',
    darkMuted: '#6898ba',
    darkNavBg: 'rgba(14,26,44,0.80)',
    heat: ['#0c2848','#113c6c','#1858a0','#2478c8','#3498e8','#5cb8ff','#8ed4ff','#bcebff','#dff4ff','#fde68a'],
  },
  ember: {
    label: 'Ember',
    accent: '#f07030',
    accentSoft: '#ff9e6a',
    grad: ['#d45010', '#f07030', '#ff9e6a'],
    glow: 'rgba(240,112,48,.45)',
    darkBg:  '#140a04',
    darkBg2: '#1e1008',
    darkSurface: 'rgba(42,20,8,0.65)',
    darkSurface2: 'rgba(56,26,10,0.58)',
    darkSurfaceSolid: '#221408',
    darkSurfaceSolid2: '#2e1c0e',
    darkSurfaceSolid3: '#3a2416',
    darkText: '#faf0e8',
    darkText2: '#e0c4ae',
    darkMuted: '#b08060',
    darkNavBg: 'rgba(30,14,6,0.80)',
    heat: ['#461800','#6e2400','#a83800','#d45010','#f07030','#ff9050','#ffb880','#ffd8b8','#ffeed8','#fefcd0'],
  },
  moss: {
    label: 'Moss',
    accent: '#44a050',
    accentSoft: '#86d896',
    grad: ['#347c3c', '#44a050', '#86d896'],
    glow: 'rgba(68,160,80,.45)',
    darkBg:  '#080f08',
    darkBg2: '#0e160e',
    darkSurface: 'rgba(16,30,16,0.65)',
    darkSurface2: 'rgba(22,40,22,0.58)',
    darkSurfaceSolid: '#101c10',
    darkSurfaceSolid2: '#172418',
    darkSurfaceSolid3: '#1e2e1e',
    darkText: '#edf5ed',
    darkText2: '#aec8ae',
    darkMuted: '#6a9870',
    darkNavBg: 'rgba(12,22,12,0.80)',
    heat: ['#122818','#1c4020','#285c2c','#347c3c','#44a050','#62c070','#88dc98','#b8f0c8','#dcf5e2','#fde68a'],
  },
  rose: {
    label: 'Rose',
    accent: '#e04888',
    accentSoft: '#f594bd',
    grad: ['#be3870', '#e04888', '#f594bd'],
    glow: 'rgba(224,72,136,.45)',
    darkBg:  '#140810',
    darkBg2: '#1e0e18',
    darkSurface: 'rgba(42,12,32,0.65)',
    darkSurface2: 'rgba(56,16,42,0.58)',
    darkSurfaceSolid: '#220e1c',
    darkSurfaceSolid2: '#2e1426',
    darkSurfaceSolid3: '#3a1a30',
    darkText: '#faedf5',
    darkText2: '#e0b8d4',
    darkMuted: '#b07090',
    darkNavBg: 'rgba(28,10,22,0.80)',
    heat: ['#40142e','#621c42','#902858','#be3870','#e04888','#f270a8','#f898c4','#fcc4de','#ffe2ee','#fde68a'],
  },
};

// Light mode is shared across all schemes (brand cream base)
const LIGHT_BASE = {
  bg: '#f4f0e8',
  bg2: '#ece8df',
  surface: 'rgba(255,255,255,0.70)',
  surface2: 'rgba(255,255,255,0.52)',
  surfaceSolid: '#ffffff',
  surfaceSolid2: '#f7f4ee',
  surfaceSolid3: '#ede9e0',
  border: 'rgba(26,74,46,0.10)',
  border2: 'rgba(26,74,46,0.18)',
  text: '#0e2a1a',
  text2: '#2d4e38',
  muted: '#5a7a62',
  glassTint: 'rgba(255,255,255,0.55)',
  glassHighlight: 'rgba(255,255,255,0.90)',
  overlay: 'rgba(14,42,26,0.30)',
  glassNavBg: 'rgba(244,240,232,0.85)',
  glassNavBorder: 'rgba(26,74,46,0.12)',
  glassNavActiveBg: 'rgba(255,255,255,0.88)',
  glassNavInnerTop: 'rgba(255,255,255,0.85)',
  glassNavInnerBottom: 'rgba(26,74,46,0.04)',
};

export const TYPE_COLORS = { go: '#34d399', st: '#fb7185', ne: '#60a5fa' };
export const TYPE_LABELS = { go: 'Start', st: 'Stop', ne: 'Neutral' };

export function applyTheme(prefs) {
  const isDark = prefs.dark !== false;
  const scheme = SCHEMES[prefs.scheme] || SCHEMES.sprout;
  const root = document.documentElement;

  // Choose base tokens
  const bg           = isDark ? scheme.darkBg            : LIGHT_BASE.bg;
  const bg2          = isDark ? scheme.darkBg2           : LIGHT_BASE.bg2;
  const surface      = isDark ? scheme.darkSurface       : LIGHT_BASE.surface;
  const surface2     = isDark ? scheme.darkSurface2      : LIGHT_BASE.surface2;
  const surfSolid    = isDark ? scheme.darkSurfaceSolid  : LIGHT_BASE.surfaceSolid;
  const surfSolid2   = isDark ? scheme.darkSurfaceSolid2 : LIGHT_BASE.surfaceSolid2;
  const surfSolid3   = isDark ? scheme.darkSurfaceSolid3 : LIGHT_BASE.surfaceSolid3;
  const border       = isDark ? 'rgba(255,255,255,0.08)'  : LIGHT_BASE.border;
  const border2      = isDark ? 'rgba(255,255,255,0.14)'  : LIGHT_BASE.border2;
  const text         = isDark ? scheme.darkText          : LIGHT_BASE.text;
  const text2        = isDark ? scheme.darkText2         : LIGHT_BASE.text2;
  const muted        = isDark ? scheme.darkMuted         : LIGHT_BASE.muted;
  const glassTint    = isDark ? 'rgba(255,255,255,0.04)' : LIGHT_BASE.glassTint;
  const glassHL      = isDark ? 'rgba(255,255,255,0.10)' : LIGHT_BASE.glassHighlight;
  const overlay      = isDark ? 'rgba(0,0,0,0.60)'       : LIGHT_BASE.overlay;
  const navBg        = isDark ? scheme.darkNavBg         : LIGHT_BASE.glassNavBg;
  const navBorder    = isDark ? 'rgba(255,255,255,0.12)' : LIGHT_BASE.glassNavBorder;
  const navActive    = isDark ? 'rgba(255,255,255,0.10)' : LIGHT_BASE.glassNavActiveBg;
  const navInTop     = isDark ? 'rgba(255,255,255,0.18)' : LIGHT_BASE.glassNavInnerTop;
  const navInBot     = isDark ? 'rgba(255,255,255,0.04)' : LIGHT_BASE.glassNavInnerBottom;

  root.style.setProperty('--bg',                bg);
  root.style.setProperty('--bg2',               bg2);
  root.style.setProperty('--surface',           surface);
  root.style.setProperty('--surface-2',         surface2);
  root.style.setProperty('--surface-solid',     surfSolid);
  root.style.setProperty('--surface-solid-2',   surfSolid2);
  root.style.setProperty('--surface-solid-3',   surfSolid3);
  root.style.setProperty('--border',            border);
  root.style.setProperty('--border-2',          border2);
  root.style.setProperty('--text',              text);
  root.style.setProperty('--text-2',            text2);
  root.style.setProperty('--muted',             muted);
  root.style.setProperty('--glass-tint',        glassTint);
  root.style.setProperty('--glass-highlight',   glassHL);
  root.style.setProperty('--overlay',           overlay);
  root.style.setProperty('--glass-nav-bg',      navBg);
  root.style.setProperty('--glass-nav-border',  navBorder);
  root.style.setProperty('--glass-nav-active-bg', navActive);
  root.style.setProperty('--glass-nav-inner-top', navInTop);
  root.style.setProperty('--glass-nav-inner-bottom', navInBot);

  root.style.setProperty('--accent',        scheme.accent);
  root.style.setProperty('--accent-soft',   scheme.accentSoft);
  root.style.setProperty('--accent-dim',    hexA(scheme.accent, 0.18));
  root.style.setProperty('--accent-border', hexA(scheme.accent, 0.40));
  root.style.setProperty('--accent-glow',   scheme.glow);
  root.style.setProperty('--grad-1',        scheme.grad[0]);
  root.style.setProperty('--grad-2',        scheme.grad[1]);
  root.style.setProperty('--grad-3',        scheme.grad[2]);

  root.style.setProperty('--type-go', TYPE_COLORS.go);
  root.style.setProperty('--type-st', TYPE_COLORS.st);
  root.style.setProperty('--type-ne', TYPE_COLORS.ne);

  root.style.setProperty('--brand-green',       '#1a4a2e');
  root.style.setProperty('--brand-green-mid',   '#2d6e47');
  root.style.setProperty('--brand-green-light', '#3d8f5f');
  root.style.setProperty('--brand-cream',       '#f4f0e8');
  root.style.setProperty('--brand-ink',         '#0e2a1a');

  scheme.heat.forEach((c, i) => root.style.setProperty(`--heat-${i}`, c));

  document.body.classList.toggle('theme-dark', isDark);
  document.body.classList.toggle('theme-light', !isDark);

  const meta = document.getElementById('theme-color');
  if (meta) meta.setAttribute('content', bg);
}

function hexA(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function heatColor(count, max, prefs) {
  if (!count) return null;
  const scheme = SCHEMES[prefs.scheme] || SCHEMES.sprout;
  const idx = Math.min(9, Math.max(0, Math.ceil((count / Math.max(1, max)) * 10) - 1));
  return scheme.heat[idx];
}
