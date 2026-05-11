import React, { useRef } from 'react';
import { ChevronRight, Download, Upload, Trash2, Moon, Sun } from 'lucide-react';
import { SCHEMES, TYPE_LABELS } from '../lib/theme.js';
import { exportJson, importJson, saveData } from '../lib/storage.js';

export default function SettingsScreen({ data, prefs, setPrefs, setData, onAlert, onConfirm }) {
  const importInputRef = useRef(null);

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
      // iOS PWA fallback: show export sheet
      onAlert('Export', 'Copy the JSON below.\n\n' + json.slice(0, 1500) + (json.length > 1500 ? '\n…(truncated)' : ''));
    }
  };

  const onImport = () => {
    importInputRef.current?.click();
  };

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
      } catch (err) {
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

  const SECTIONS = [
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
    ['mood', 'Mood'],
    ['energy', 'Energy'],
    ['ease', 'Ease (start habits)'],
    ['duration', 'Duration (start habits)'],
    ['resist', 'Resistance (stop habits)'],
    ['trigger', 'Trigger (stop habits)'],
    ['context', 'Context (neutral habits)'],
    ['tags', 'Tags'],
    ['notes', 'Notes'],
  ];

  return (
    <div className="screen">
      <div className="topbar">
        <h1>Settings</h1>
      </div>
      <div className="settings">
        {/* Appearance */}
        <div className="settings-group">
          <h2>Appearance</h2>
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
        </div>

        {/* Layout */}
        <div className="settings-group">
          <h2>Layout</h2>
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
        </div>

        {/* Habits behavior */}
        <div className="settings-group">
          <h2>Tap behavior</h2>
          <Toggle
            label="Repeat last by default"
            sub="Tapping a habit auto-fills the most recent log's details"
            value={prefs.repeatLastDefault}
            onChange={(v) => setPrefs({ ...prefs, repeatLastDefault: v })}
          />
        </div>

        {/* Analytics */}
        <div className="settings-group">
          <h2>Analytics defaults</h2>
          <Toggle
            label="Open in Day view"
            sub="Analytics defaults to Day instead of All-time"
            value={prefs.insDay}
            onChange={(v) => setPrefs({ ...prefs, insDay: v })}
          />
        </div>

        {/* Sections */}
        <div className="settings-group">
          <h2>Analytics — show sections</h2>
          {SECTIONS.map(([key, label]) => (
            <Toggle
              key={key}
              label={label}
              value={prefs.sections[key]}
              onChange={() => toggleSection(key)}
            />
          ))}
        </div>

        {/* Track */}
        <div className="settings-group">
          <h2>Loggable fields</h2>
          {TRACKS.map(([key, label]) => (
            <Toggle
              key={key}
              label={label}
              value={prefs.track[key]}
              onChange={() => toggleTrack(key)}
            />
          ))}
        </div>

        {/* Data */}
        <div className="settings-group">
          <h2>Data</h2>
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
        </div>

        <div className="muted center" style={{ fontSize: 11, padding: '8px 0 16px' }}>
          Sprout · all data lives locally on this device
        </div>
      </div>
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
