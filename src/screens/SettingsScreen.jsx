import React, { useRef } from 'react';
import {
  ChevronRight, Download, Upload, Trash2,
  Palette, LayoutGrid, PenLine, BarChart3, Database, ScrollText,
} from 'lucide-react';
import { SCHEMES } from '../lib/theme.js';
import { exportJson, importJson } from '../lib/storage.js';

/**
 * SettingsScreen — renders a flat list of group rows.
 * Modal state lives in App.jsx so modals render at the root level,
 * above the bottom nav / side nav (no stacking-context conflicts).
 */
export default function SettingsScreen({ data, prefs, setPrefs, setData, onAlert, onConfirm, onOpenModal }) {
  const importInputRef = useRef(null);

  const onExport = () => {
    const json = exportJson(data);
    try {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const fname = `sproutData_${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())}#${pad(now.getHours())}.${pad(now.getMinutes())}.json`;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      onAlert('Export', 'Copy the JSON below.\n\n' + exportJson(data).slice(0, 1500));
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
        onAlert('Import complete', `${summary.newHabits} new habits, ${summary.newLogs} new logs added.`);
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
        setData({ ...data, habits: [] });
        onAlert('Cleared', 'All habits have been removed.');
      }
    );
  };

  const GROUPS = [
    { id: 'appearance', label: 'Appearance',        sub: 'Theme and accent color',           icon: <Palette size={17} /> },
    { id: 'behavior',   label: 'Layout & Behavior',  sub: 'Card density, tap behavior',        icon: <LayoutGrid size={17} /> },
    { id: 'fields',     label: 'Logging Fields',     sub: 'Which fields appear when logging',  icon: <PenLine size={17} /> },
    { id: 'sections',   label: 'Analytics Sections', sub: 'Which insights to show',            icon: <BarChart3 size={17} /> },
    { id: 'data',       label: 'Data',               sub: 'Backup, restore, and clear',        icon: <Database size={17} />, action: true },
    { id: 'changelog',  label: 'Changelog',          sub: "What's changed between builds",     icon: <ScrollText size={17} /> },
  ];

  return (
    <div className="screen">
      <div className="topbar"><h1>Settings</h1></div>
      <div className="settings">
        <div className="settings-group">
          <h2>Preferences</h2>
          {GROUPS.map((g, i) => (
            <div
              key={g.id}
              className="settings-row"
              onClick={() => {
                if (g.id === 'data') {
                  // Data group opens a modal that also needs import/export wired
                  onOpenModal(g.id, { onExport, onImport, onClearAll });
                } else {
                  onOpenModal(g.id);
                }
              }}
              style={i === 0 ? { borderTop: 'none' } : undefined}
            >
              <div className="settings-row-icon">{g.icon}</div>
              <div className="col">
                <div className="label">{g.label}</div>
                <div className="sub">{g.sub}</div>
              </div>
              <ChevronRight size={18} className="chev" />
            </div>
          ))}
        </div>
        <div className="muted center" style={{ fontSize: 11, padding: '8px 0 16px' }}>
          Sprout · all data lives locally on this device
        </div>
      </div>
      <input ref={importInputRef} type="file" accept=".json,application/json" onChange={onFile} style={{ display: 'none' }} />
    </div>
  );
}
