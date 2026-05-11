import React, { useEffect, useMemo, useState } from 'react';
import { uid } from '../lib/util.js';
import { TYPE_LABELS } from '../lib/theme.js';

export default function HabitSheet({ habit, allHabits, onClose, onSave }) {
  const editing = !!habit;
  const [name, setName] = useState(habit?.name || '');
  const [category, setCategory] = useState(habit?.category || '');
  const [type, setType] = useState(habit?.type || 'go');

  const suggestions = useMemo(() => {
    const cats = Array.from(new Set(allHabits.map((h) => h.category).filter(Boolean)));
    return cats.slice(0, 8);
  }, [allHabits]);

  const valid = name.trim().length > 0 && category.trim().length > 0;

  const onSubmit = () => {
    if (!valid) return;
    const next = {
      id: habit?.id || uid('h'),
      name: name.trim().slice(0, 40),
      category: category.trim().slice(0, 30),
      type,
      created: habit?.created || new Date().toISOString().slice(0, 10),
      logs: habit?.logs || [],
    };
    onSave(next);
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-grab" />
        <h2>{editing ? 'Edit habit' : 'New habit'}</h2>

        <div className="field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 40))}
            placeholder="e.g. Meditation"
            autoFocus={!editing}
          />
        </div>

        <div className="field">
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value.slice(0, 30))}
            placeholder="e.g. Wellness"
          />
          {suggestions.length > 0 && (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
              {suggestions.map((c) => (
                <button
                  key={c}
                  className="chip"
                  type="button"
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="field">
          <label>Type</label>
          <div className="btn-row type">
            {['go', 'st', 'ne'].map((t) => (
              <button
                key={t}
                type="button"
                className={`${type === t ? 'on ' + t : ''}`}
                onClick={() => setType(t)}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="sheet-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={onSubmit} disabled={!valid}>
            {editing ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </>
  );
}
