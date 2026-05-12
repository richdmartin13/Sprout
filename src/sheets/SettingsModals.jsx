import React from 'react';
import { X, Download, Upload, Trash2, ChevronRight } from 'lucide-react';
import { SCHEMES } from '../lib/theme.js';

/** Thin wrapper that gives modals a consistent header + close button */
function SettingsModal({ title, onClose, children }) {
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-grab" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <h2 style={{ flex: 1, marginBottom: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'var(--surface-solid-3)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--muted)', flexShrink: 0,
            }}
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>
        <div className="settings-modal-content">{children}</div>
      </div>
    </>
  );
}

/** A row inside a settings modal — label/sub on left, control on right */
function MRow({ label, sub, children, style }) {
  return (
    <div className="settings-modal-row" style={style}>
      <div className="col">
        <div className="label">{label}</div>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, sub, value, onChange }) {
  return (
    <MRow label={label} sub={sub}>
      <button
        className={`switch ${value ? 'on' : ''}`}
        onClick={() => onChange(!value)}
        aria-pressed={value}
        aria-label={label}
      >
        <span className="knob" />
      </button>
    </MRow>
  );
}

const ANALYTICS_SECTIONS = [
  ['spider','Spider chart'],['hourly','Hourly chart'],['heatmap','Heatmap'],
  ['trends','Trends'],['rankings','Rankings'],['mood','Mood & energy'],
  ['time','Time patterns'],['tags','Tags'],['resist','Resistance'],
  ['co','Co-occurrence'],['log','Log'],
];

const TRACKS = [
  ['mood','Mood','How you felt at log time'],
  ['energy','Energy','Your energy level at log time'],
  ['ease','Ease','Star-rated ease (start habits only)'],
  ['duration','Duration','Minutes spent (start habits only)'],
  ['resist','Resistance','Did you resist? (stop habits only)'],
  ['trigger','Trigger','What set it off (stop habits only)'],
  ['context','Context','Where/when it happened (neutral habits)'],
  ['tags','Tags','Free-form labels'],
  ['notes','Notes','Free-form text'],
];

const CHANGELOG = [
  {
    version: 'sprout_2025.05.12#1',
    changes: [
      'Brand guide applied: Playfair Display + DM Mono, brand greens + cream palette.',
      'New "Sprout" color scheme as default (brand greens #1a4a2e / #2d6e47 / #3d8f5f).',
      'Each color scheme now has its own tuned dark-mode background color.',
      'Text color subtly shifts to match the active color scheme\'s hue.',
      'Light mode background: brand cream (#f4f0e8).',
      'Settings redesigned: each group opens as a modal above all nav layers.',
      'Bottom nav always left-anchored; ghost FAB prevents layout jump.',
      'Screen transitions: 0.22s fade + translate between tabs.',
      'Heatmap auto-scrolls to today\'s column on mount.',
      'Tag suggestions: 18 common presets + habit-specific history in log details.',
      'Desktop/tablet side navigation (≥768px) with glass sidebar.',
      'Sheets become centered modals on desktop (≥768px).',
      'Data export filename follows convention: sproutData_yyyy.mm.dd#hh.mm.json.',
      'React Native app created (Expo SDK 54.0.0, full feature parity).',
      'Apple Watch companion app included (src/watch/WatchApp.js).',
      'npm dependency conflict fixed: expo-constants pinned to ~17.0.8.',
    ],
  },
  {
    version: 'Sprout.2026.05.12#2',
    changes: [
      'Bottom nav shifted down 28px from screen edge for better thumb reach.',
      'Added changelog section to Settings.',
    ],
  },
  {
    version: 'Sprout.2026.05.12#1',
    changes: [
      'Spider graph expanded to 5 modes.',
      'Bottom nav and FAB split into two separate floating glass pills.',
      'Nav stays left-anchored on all screens.',
    ],
  },
  {
    version: 'Sprout.2026.05.11#1',
    changes: [
      'Initial build: Vite + React 18 PWA.',
      'Three-tab navigation: Habits, Analytics, Settings.',
      'Liquid Glass design system with 6 color schemes × light/dark.',
      'Fully local: all data in localStorage, no network calls.',
    ],
  },
];

/**
 * SettingsModals — rendered at App root level so z-index is never clipped by
 * the screen or nav stacking contexts.
 */
export default function SettingsModals({ modal, modalMeta, onClose, prefs, setPrefs }) {
  if (!modal) return null;

  const toggleSection = (key) =>
    setPrefs({ ...prefs, sections: { ...prefs.sections, [key]: !prefs.sections[key] } });
  const toggleTrack = (key) =>
    setPrefs({ ...prefs, track: { ...prefs.track, [key]: !prefs.track[key] } });

  if (modal === 'appearance') {
    return (
      <SettingsModal title="Appearance" onClose={onClose}>
        <Toggle label="Dark mode" sub={prefs.dark ? 'On' : 'Off'}
          value={prefs.dark} onChange={(v) => setPrefs({ ...prefs, dark: v })} />
        <div className="settings-modal-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
          <div>
            <div className="label">Color scheme</div>
            <div className="sub">{SCHEMES[prefs.scheme]?.label || 'Sprout'}</div>
          </div>
          <div className="swatch-row" style={{ padding: 0, width: '100%' }}>
            {Object.entries(SCHEMES).map(([key, s]) => (
              <button
                key={key}
                className={`swatch ${prefs.scheme === key ? 'on' : ''}`}
                style={{ '--c1': s.grad[0], '--c2': s.grad[2] }}
                onClick={() => setPrefs({ ...prefs, scheme: key })}
                aria-label={`Use ${s.label} scheme`}
                title={s.label}
              />
            ))}
          </div>
        </div>
      </SettingsModal>
    );
  }

  if (modal === 'behavior') {
    return (
      <SettingsModal title="Layout & Behavior" onClose={onClose}>
        <Toggle label="Streak badges" sub="Show streak (start/neutral) or days-since (stop)"
          value={prefs.showStreak} onChange={(v) => setPrefs({ ...prefs, showStreak: v })} />
        <Toggle label="Compact cards" sub="Tighter padding on habit cards"
          value={prefs.compact} onChange={(v) => setPrefs({ ...prefs, compact: v })} />
        <MRow label="Default view" sub="Habits list shape on launch">
          <div className="seg">
            <button className={prefs.viewMode === 'list' ? 'on' : ''}
              onClick={() => setPrefs({ ...prefs, viewMode: 'list' })}>List</button>
            <button className={prefs.viewMode === 'grid' ? 'on' : ''}
              onClick={() => setPrefs({ ...prefs, viewMode: 'grid' })}>Grid</button>
          </div>
        </MRow>
        <Toggle label="Repeat last by default" sub="Auto-fill most recent log's details on tap"
          value={prefs.repeatLastDefault} onChange={(v) => setPrefs({ ...prefs, repeatLastDefault: v })} />
        <Toggle label="Open analytics in Day view" sub="Analytics defaults to Day instead of All-time"
          value={prefs.insDay} onChange={(v) => setPrefs({ ...prefs, insDay: v })} />
      </SettingsModal>
    );
  }

  if (modal === 'fields') {
    return (
      <SettingsModal title="Logging Fields" onClose={onClose}>
        {TRACKS.map(([key, label, sub]) => (
          <Toggle key={key} label={label} sub={sub}
            value={prefs.track[key]} onChange={() => toggleTrack(key)} />
        ))}
      </SettingsModal>
    );
  }

  if (modal === 'sections') {
    return (
      <SettingsModal title="Analytics Sections" onClose={onClose}>
        {ANALYTICS_SECTIONS.map(([key, label]) => (
          <Toggle key={key} label={label}
            value={prefs.sections[key]} onChange={() => toggleSection(key)} />
        ))}
      </SettingsModal>
    );
  }

  if (modal === 'data') {
    const { onExport, onImport, onClearAll } = modalMeta || {};
    return (
      <SettingsModal title="Data" onClose={onClose}>
        <div className="settings-modal-row" style={{ cursor: 'pointer' }} onClick={onExport}>
          <div className="col">
            <div className="label" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Download size={15} style={{ color: 'var(--accent)' }} /> Export
            </div>
            <div className="sub">Save a JSON backup of your habits &amp; logs</div>
          </div>
          <ChevronRight size={16} className="chev" />
        </div>
        <div className="settings-modal-row" style={{ cursor: 'pointer' }} onClick={onImport}>
          <div className="col">
            <div className="label" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Upload size={15} style={{ color: 'var(--accent)' }} /> Import
            </div>
            <div className="sub">Merge habits &amp; logs from a JSON file</div>
          </div>
          <ChevronRight size={16} className="chev" />
        </div>
        <div className="settings-modal-row" style={{ cursor: 'pointer' }} onClick={onClearAll}>
          <div className="col">
            <div className="label" style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--type-st)' }}>
              <Trash2 size={15} /> Clear all data
            </div>
            <div className="sub">Permanently delete every habit and log</div>
          </div>
          <ChevronRight size={16} className="chev" />
        </div>
      </SettingsModal>
    );
  }

  if (modal === 'changelog') {
    return (
      <SettingsModal title="Changelog" onClose={onClose}>
        {CHANGELOG.map((build) => (
          <div key={build.version} className="changelog-build" style={{ padding: '12px 0' }}>
            <div className="changelog-version">{build.version}</div>
            <ul className="changelog-list">
              {build.changes.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        ))}
      </SettingsModal>
    );
  }

  return null;
}
