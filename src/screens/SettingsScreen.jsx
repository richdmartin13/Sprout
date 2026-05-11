import React, { useRef, useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  Palette,
  LayoutGrid,
  PenLine,
  BarChart3,
  Database,
} from 'lucide-react';
import { SCHEMES } from '../lib/theme.js';
import { exportJson, importJson } from '../lib/storage.js';

export default function SettingsScreen({ data, prefs, setPrefs, setData, onAlert, onConfirm }) {
  const importInputRef = useRef(null);
  // Track which groups are open; appearance open by default.
  const [open, setOpen] = useState({
    appearance: true,
    behavior: false,
    fields: false,
    sections: false,
    data: false,
  });
  const toggleOpen = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const toggleSection = (key) => {
    setPrefs({
      ...prefs,
      sections: { ...prefs.sections, [key]: !prefs.sections[key] },
    });
  };
  const toggleTrack = (key) => {
    setPrefs({
      ...prefs,
      track: { ...prefs.track, [key]: !prefs.track[key] },
    });
  };

  const onExport = () => {
    const json = exportJson(data);
    try {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sprout-export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      onAlert(
        'Export',
        'Copy the JSON below.\n\n' + json.slice(0, 1500) + (json.length > 1500 ? '\n…(truncated)' : '')
      );
    }
  };

  const onImport = () => importInputRef.current?.click();

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const { data: next, summary } = importJson(reader.result, data);
        setData(next);
        onAlert(
          'Import complete',
          `${summary.newHabits} new habits, ${summary.newLogs} new logs added.`
        );
      } catch {
        onAlert('Import failed', 'The selected file could not be parsed as Sprout JSON.');
      }
    };
    reader.readAsText(f);
    e.target.value = '';
  };

  const onClearAll = () => {
    onConfirm(
      'Clear all data',
      'This will permanently delete all your habits and logs. This cannot be undone.',
      () => {
        const next = { ...data, habits: [] };
        setData(next);
        onAlert('Cleared', 'All habits have been removed.');
      }
    );
  };

  const ANALYTICS_SECTIONS = [
    ['spider', 'Spider chart'],
    ['hourly', 'Hourly chart'],
    ['heatmap', 'Heatmap'],
    ['trends', 'Trends'],
    ['rankings', 'Rankings'],
    ['mood', 'Mood & energy'],
    ['time', 'Time patterns'],
    ['tags', 'Tags'],
    ['resist', 'Resistance'],
    ['co', 'Co-occurrence'],
    ['log', 'Log'],
  ];

  const TRACKS = [
    ['mood', 'Mood', 'How you felt at log time'],
    ['energy', 'Energy', 'Your energy level at log time'],
    ['ease', 'Ease', 'Star-rated ease (start habits only)'],
    ['duration', 'Duration', 'Minutes spent (start habits only)'],
    ['resist', 'Resistance', 'Did you resist? (stop habits only)'],
    ['trigger', 'Trigger', 'What set it off (stop habits only)'],
    ['context', 'Context', 'Where/when it happened (neutral habits)'],
    ['tags', 'Tags', 'Free-form labels'],
    ['notes', 'Notes', 'Free-form text'],
  ];

  return (
    <div className="screen">
      <div className="topbar">
        <h1>Settings</h1>
      </div>
      <div className="settings">
        {/* ── Appearance ── */}
        <Group
          open={open.appearance}
          onToggle={() => toggleOpen('appearance')}
          icon={<Palette />}
          title="Appearance"
          sub="Theme and accent color"
        >
          <Toggle
            label="Dark mode"
            sub={prefs.dark ? 'On' : 'Off'}
            value={prefs.dark}
            onChange={(v) => setPrefs({ ...prefs, dark: v })}
            icon={prefs.dark ? <Moon /> : <Sun />}
          />
          <div className="settings-row">
            <div className="col">
              <div className="label">Color scheme</div>
              <div className="sub">{SCHEMES[prefs.scheme]?.label || 'Indigo'}</div>
            </div>
          </div>
          <div className="swatch-row">
            {Object.entries(SCHEMES).map(([key, s]) => (
              <button
                key={key}
                className={`swatch ${prefs.scheme === key ? 'on' : ''}`}
                style={{ '--c1': s.grad[0], '--c2': s.grad[2] }}
                onClick={() => setPrefs({ ...prefs, scheme: key })}
                aria-label={`Use ${s.label} scheme`}
              />
            ))}
          </div>
        </Group>

        {/* ── Layout & Behavior ── */}
        <Group
          open={open.behavior}
          onToggle={() => toggleOpen('behavior')}
          icon={<LayoutGrid />}
          title="Layout & Behavior"
          sub="Card density, tap behavior, defaults"
        >
          <Toggle
            label="Streak badges"
            sub="Show streak (start/neutral) or days-since (stop)"
            value={prefs.showStreak}
            onChange={(v) => setPrefs({ ...prefs, showStreak: v })}
          />
          <Toggle
            label="Compact cards"
            sub="Tighter padding on habit cards"
            value={prefs.compact}
            onChange={(v) => setPrefs({ ...prefs, compact: v })}
          />
          <div className="settings-row">
            <div className="col">
              <div className="label">Default view</div>
              <div className="sub">Habits list shape on launch</div>
            </div>
            <div className="seg">
              <button
                className={prefs.viewMode === 'list' ? 'on' : ''}
                onClick={() => setPrefs({ ...prefs, viewMode: 'list' })}
              >
                List
              </button>
              <button
                className={prefs.viewMode === 'grid' ? 'on' : ''}
                onClick={() => setPrefs({ ...prefs, viewMode: 'grid' })}
              >
                Grid
              </button>
            </div>
          </div>
          <Toggle
            label="Repeat last by default"
            sub="Tapping a habit auto-fills the most recent log's details"
            value={prefs.repeatLastDefault}
            onChange={(v) => setPrefs({ ...prefs, repeatLastDefault: v })}
          />
          <Toggle
            label="Open analytics in Day view"
            sub="Analytics defaults to Day instead of All-time"
            value={prefs.insDay}
            onChange={(v) => setPrefs({ ...prefs, insDay: v })}
          />
        </Group>

        {/* ── Logging Fields ── */}
        <Group
          open={open.fields}
          onToggle={() => toggleOpen('fields')}
          icon={<PenLine />}
          title="Logging Fields"
          sub="Which fields appear when logging a habit"
        >
          {TRACKS.map(([key, label, sub]) => (
            <Toggle
              key={key}
              label={label}
              sub={sub}
              value={prefs.track[key]}
              onChange={() => toggleTrack(key)}
            />
          ))}
        </Group>

        {/* ── Analytics Sections ── */}
        <Group
          open={open.sections}
          onToggle={() => toggleOpen('sections')}
          icon={<BarChart3 />}
          title="Analytics Sections"
          sub="Which insights to show on the analytics screen"
        >
          {ANALYTICS_SECTIONS.map(([key, label]) => (
            <Toggle
              key={key}
              label={label}
              value={prefs.sections[key]}
              onChange={() => toggleSection(key)}
            />
          ))}
        </Group>

        {/* ── Data ── */}
        <Group
          open={open.data}
          onToggle={() => toggleOpen('data')}
          icon={<Database />}
          title="Data"
          sub="Backup, restore, and clear"
        >
          <div className="settings-row button" onClick={onExport}>
            <Download style={{ color: 'var(--muted)' }} />
            <div className="col">
              <div className="label">Export</div>
              <div className="sub">Save a JSON backup of your habits &amp; logs</div>
            </div>
            <ChevronRight className="chev" />
          </div>
          <div className="settings-row button" onClick={onImport}>
            <Upload style={{ color: 'var(--muted)' }} />
            <div className="col">
              <div className="label">Import</div>
              <div className="sub">Merge habits &amp; logs from a JSON file</div>
            </div>
            <ChevronRight className="chev" />
          </div>
          <div className="settings-row button" onClick={onClearAll}>
            <Trash2 style={{ color: 'var(--type-st)' }} />
            <div className="col">
              <div className="label" style={{ color: 'var(--type-st)' }}>Clear all data</div>
              <div className="sub">Permanently delete every habit and log</div>
            </div>
            <ChevronRight className="chev" />
          </div>
          <input
            ref={importInputRef}
            type="file"
            accept=".json,application/json"
            onChange={onFile}
            style={{ display: 'none' }}
          />
        </Group>

        <div className="muted center" style={{ fontSize: 11, padding: '8px 0 16px' }}>
          Sprout · all data lives locally on this device
        </div>
      </div>
    </div>
  );
}

function Group({ open, onToggle, icon, title, sub, children }) {
  return (
    <div className={`settings-group collapsible ${open ? 'open' : ''}`}>
      <button className="settings-group-header" onClick={onToggle} aria-expanded={open}>
        <span className="settings-group-icon">{icon}</span>
        <span className="col">
          <span className="settings-group-title">{title}</span>
          {sub && <span className="settings-group-sub">{sub}</span>}
        </span>
        <ChevronDown className={`settings-group-chev ${open ? 'open' : ''}`} />
      </button>
      {open && <div className="settings-group-body">{children}</div>}
    </div>
  );
}

function Toggle({ label, sub, value, onChange, icon }) {
  return (
    <div className="settings-row">
      {icon && <span style={{ color: 'var(--muted)' }}>{icon}</span>}
      <div className="col">
        <div className="label">{label}</div>
        {sub && <div className="sub">{sub}</div>}
      </div>
      <button
        className={`switch ${value ? 'on' : ''}`}
        onClick={() => onChange(!value)}
        aria-pressed={value}
        aria-label={label}
      >
        <span className="knob" />
      </button>
    </div>
  );
}
