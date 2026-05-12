# Sprout Web — sproutWeb_2025.05.12#1

A local-first habit tracker PWA built with React + Vite.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Deploy

### Render
The `render.yaml` file is included for one-click Render deployment.

### Vercel / Netlify
Build command: `npm run build`  
Output directory: `dist`

## Features

- **Three-tab navigation**: Habits, Analytics, Settings
- **Liquid Glass UI**: iOS 26-inspired glass morphism (used sparingly on nav)
- **7 color schemes** × light/dark mode
- **Brand Sprout theme** (default): deep greens + cream palette
- **Desktop side navigation** at ≥768px viewport width
- **Analytics**: heatmap, trends, spider charts, time patterns, tags, co-occurrence
- **Data export/import**: JSON format compatible with sproutNative
- **PWA**: installable, works offline, service worker included

## Data

All data is stored in `localStorage`. No server calls are made. Export uses the naming convention:

```
sproutData_yyyy.mm.dd#hh.mm.json
```

This format is interoperable with the native app.

## Tech Stack

- React 18
- Vite 5
- Lucide React (icons)
- CSS Custom Properties (theming)
- Service Worker (PWA/offline)
