import React, { useRef } from 'react';
import {
  ChevronRight, Download, Upload, Trash2,
  Palette, LayoutGrid, PenLine, BarChart3, Database, ScrollText,
} from 'lucide-react';
import { exportJson, importJson } from '../lib/storage.js';

/**
 * SettingsScreen — flat list of group rows. Modal state lives in App.jsx.
 * onOpenModal(id, meta?) — opens the named settings modal at root level.
 * onCloseModal() — closes the settings modal (used before firing alerts so
 *                  the alert sheet isn't obscured by the modal backdrop).
 */
export default function SettingsScreen({ data, prefs, setPrefs, setData, onAlert, onConfirm, onOpenModal, onCloseModal }) {
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
      onCloseModal();
      onAlert('Export', 'Copy the JSON below.\n\n' + json.slice(0, 1500) + (json.length > 1500 ? '\n…(truncated)' : ''));
    }
  };

  const onImport = () => importInputRef.current?.click();

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      // Close the settings modal FIRST so the result alert is visible on top
      onCloseModal();
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
    onCloseModal();
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
    { id: 'data',       label: 'Data',               sub: 'Backup, restore, and clear',        icon: <Database size={17} /> },
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
              onClick={() => onOpenModal(g.id, g.id === 'data' ? { onExport, onImport, onClearAll } : null)}
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
