import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function HabitOptionsSheet({ habit, onClose, onEdit, onDelete }) {
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-grab" />
        <h2>{habit.name}</h2>
        <div className="muted" style={{ fontSize: 12, marginTop: -8, marginBottom: 14 }}>
          {habit.category}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            className="settings-row button"
            style={{ borderTop: 'none', borderRadius: 12, background: 'var(--surface-2)' }}
            onClick={onEdit}
          >
            <Pencil style={{ color: 'var(--muted)' }} />
            <div className="col">
              <div className="label">Edit habit</div>
              <div className="sub">Change name, category, or type</div>
            </div>
          </button>
          <button
            className="settings-row button"
            style={{ borderTop: 'none', borderRadius: 12, background: 'color-mix(in oklab, var(--type-st) 10%, var(--surface-2))' }}
            onClick={onDelete}
          >
            <Trash2 style={{ color: 'var(--type-st)' }} />
            <div className="col">
              <div className="label" style={{ color: 'var(--type-st)' }}>Delete habit</div>
              <div className="sub">Removes the habit and all its logs</div>
            </div>
          </button>
        </div>
        <div className="sheet-actions" style={{ gridTemplateColumns: '1fr' }}>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </>
  );
}
