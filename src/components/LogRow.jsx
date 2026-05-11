import React, { useState } from 'react';
import { Pencil, Trash2, Star } from 'lucide-react';
import { fmtTime } from '../lib/util.js';

// `showHabitName`: if true, show the habit name (used on insights / day view).
// `habitMap`: id -> habit (used to render co-habit pills)
export default function LogRow({ log, habit, showHabitName, habitMap, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  const pills = buildPills(log, habit);

  return (
    <div className="log-row" onClick={() => setOpen(!open)}>
      <div className="top">
        <span className="time tabular">{fmtTime(log.ts)}</span>
        {showHabitName && <span className="hname">{habit.name}</span>}
        {showHabitName && <span className={`pill ${habit.type}-pill`}>{habit.type === 'go' ? 'Start' : habit.type === 'st' ? 'Stop' : 'Neutral'}</span>}
      </div>
      {pills.length > 0 && (
        <div className="pills">
          {pills.map((p, i) => (
            <span key={i} className={`pill ${p.cls || ''}`}>
              {p.icon}{p.text}
            </span>
          ))}
        </div>
      )}
      {log.tags && log.tags.length > 0 && (
        <div className="pills">
          {log.tags.map((t) => <span key={t} className="pill tag">#{t}</span>)}
        </div>
      )}
      {log.withHabits && log.withHabits.length > 0 && habitMap && (
        <div className="pills">
          {log.withHabits
            .map((id) => habitMap.get(id))
            .filter(Boolean)
            .map((h) => (
              <span key={h.id} className={`pill ${h.type}-pill`}>+ {h.name}</span>
            ))}
        </div>
      )}
      {log.notes && <div className="notes">{log.notes}</div>}
      {open && (
        <div className="actions">
          <button onClick={(e) => { e.stopPropagation(); onEdit(log); }}>
            <Pencil /> Edit
          </button>
          <button className="danger" onClick={(e) => { e.stopPropagation(); onDelete(log); }}>
            <Trash2 /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

function buildPills(log, habit) {
  const out = [];
  if (habit.type === 'go') {
    if (log.ease > 0) out.push({ text: `${log.ease}★`, cls: '' });
    if (log.mood) out.push({ text: log.mood });
    if (log.energy) out.push({ text: log.energy });
    if (log.duration > 0) out.push({ text: `${log.duration}m` });
  } else if (habit.type === 'st') {
    if (log.resist === 'yes') out.push({ text: 'Resisted', cls: 'go-pill' });
    else if (log.resist === 'partial') out.push({ text: 'Partial', cls: 'amber-pill' });
    if (log.trigger) out.push({ text: `trig: ${log.trigger}` });
    if (log.mood) out.push({ text: log.mood });
    if (log.energy) out.push({ text: log.energy });
  } else if (habit.type === 'ne') {
    if (log.context) out.push({ text: log.context });
    if (log.mood) out.push({ text: log.mood });
  }
  return out;
}
