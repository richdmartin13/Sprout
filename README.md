# Sprout

A local-first habit tracker PWA. All data lives in your browser's localStorage — no accounts, no server, no network calls.

> *grow what you tend*

## Features

- **3 tabs**: Habits (list/grid with sparklines), Tap/Detail screen (per habit), Analytics, and Settings
- **Three habit types**: Start (good), Stop (bad), Neutral — each with type-specific logging fields
- **Rich logs**: ease, mood, energy, duration, trigger, outcome, context, tags, notes, co-occurrences with other habits, and **editable timestamps**
- **Analytics**: heatmap (tap a day to focus it), spider chart with five views (freq/mood/energy/ease/resistance), trends, rankings, mood & energy bars, time-of-day & day-of-week patterns, tag cloud, resistance breakdown, co-occurrence pairs, log list — all filterable by category (radio) and type (multi)
- **Apple Liquid Glass aesthetic**: layered translucency, backdrop blur, accent-driven ambient glow, film grain, soft motion
- **Light + dark, six accent schemes**: indigo, violet, ocean, ember, moss, rose — each adjusts heatmap ramp, accent, FAB gradient, and ambient glow
- **iOS PWA-ready**: manifest, apple-touch icons, status bar styling, safe-area insets, service worker for installability
- **Export / import** JSON, **clear all data**
- Long-press habit cards for options · long-press the tap zone for a context menu

## Setup

Requires Node 18+ and npm.

```bash
npm install
npm run dev      # localhost:5173
npm run build    # outputs to ./dist
npm run preview  # preview the production build
```

## Deploying

After `npm run build`, the contents of `dist/` are a fully static site. Host it on anything that serves files. No backend needed.

Because `vite.config.js` uses `base: './'`, the built `index.html` references assets relatively, so it works from any sub-path.

### GitHub → Render (static site)

1. Create a new GitHub repo and push this project to it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. On [Render](https://render.com): **New + → Static Site → Connect your repo**.
3. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Node version**: 18 or newer (set via the `NODE_VERSION` env var if needed)
4. Click **Create Static Site**. Render will build and serve it. Push to `main` to redeploy.

A `render.yaml` is included in the repo root, so on Render you can alternatively pick **Blueprint** instead of Static Site and it will pre-fill those settings.

## Data

Everything is stored under `localStorage` key `sprout_v1`. To migrate to another device, use **Settings → Export** to download a JSON file, then **Settings → Import** on the other device. Import is a merge by id — it won't duplicate existing habits or logs.

## Stack

- **Vite** + **React 18**
- **lucide-react** for vector icons (only runtime dependency apart from React)
- Hand-written CSS with backdrop-filter + CSS custom properties for the theming engine
- A tiny cache-first service worker for offline installability

## Project layout

```
src/
  App.jsx                 — orchestrator: state, sheets, tab routing
  main.jsx                — React entry + SW registration
  components/             — Heatmap, Spider, TrendsChart, BottomNav, Filters, HabitCard, LogRow
  screens/                — HomeScreen, TapScreen, AnalyticsScreen, SettingsScreen
  sheets/                 — HabitSheet, LogDetailsSheet, HabitOptionsSheet, ConfirmSheet, AlertSheet
  hooks/useLongPress.js   — 600ms hold, 10px tolerance, click suppression
  lib/
    theme.js              — color schemes, applyTheme()
    util.js               — date/time/tag/normalization helpers
    storage.js            — load/save/export/import
    stats.js              — counts, streaks, co-occurrence, hourly, trends, etc.
  styles/global.css       — the glass system, components, dark + light tokens
public/
  manifest.webmanifest, sw.js, icons/, favicon.ico
```
