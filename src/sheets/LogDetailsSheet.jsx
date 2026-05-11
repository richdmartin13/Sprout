import React, { useEffect, useRef, useState } from 'react';
import { X, Star } from 'lucide-react';
import { MOOD_OPTS, ENERGY_OPTS, slugTag, pad, normLog } from '../lib/util.js';

// When editing, we receive { habit, log }. When new, log has minimal fields.
export default function LogDetailsSheet({ habit, log, prefs, allHabits, onClose, onSave }) {
  const track = prefs.track;
  const [ease, setEase] = useState(log.ease || 0);
  const [mood, setMood] = useState(log.mood || '');
  const [energy, setEnergy] = useState(log.energy || '');
  const [duration, setDuration] = useState(log.duration || '');
  const [trigger, setTrigger] = useState(log.trigger || '');
  const [resist, setResist] = useState(log.resist || (habit.type === 'st' ? 'no' : ''));
  const [context, setContext] = useState(log.context || '');
  const [tags, setTags] = useState(log.tags || []);
  const [tagDraft, setTagDraft] = useState('');
  const [notes, setNotes] = useState(log.notes || '');
  const [withHabits, setWithHabits] = useState(log.withHabits || []);

  // Editable timestamp
  const ts0 = log.ts ? new Date(log.ts) : new Date();
  const [dateVal, setDateVal] = useState(
    `${ts0.getFullYear()}-${pad(ts0.getMonth() + 1)}-${pad(ts0.getDate())}`
  );
  const [timeVal, setTimeVal] = useState(`${pad(ts0.getHours())}:${pad(ts0.getMinutes())}`);

  const tagInputRef = useRef(null);

  const commitTag = () => {
    const t = slugTag(tagDraft);
    if (!t) {
      setTagDraft('');
      return;
    }
    if (!tags.includes(t)) setTags([...tags, t]);
    setTagDraft('');
  };

  const onTagKey = (e) => {
    if (e.key === ' ' || e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      commitTag();
    } else if (e.key === 'Backspace' && !tagDraft && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  const toggleWith = (id) => {
    setWithHabits(withHabits.includes(id) ? withHabits.filter((x) => x !== id) : [...withHabits, id]);
  };

  const onSubmit = () => {
    // Combine date + time
    const [hh, mm] = timeVal.split(':').map(Number);
    const [y, mo, d] = dateVal.split('-').map(Number);
    const dt = new Date(y, mo - 1, d, hh || 0, mm || 0);
    const finalTs = dt.toISOString();
    const finalDate = `${y}-${pad(mo)}-${pad(d)}`;

    // Auto-add trigger as tag for stop habits
    let finalTags = [...tags];
    if (habit.type === 'st' && trigger.trim()) {
      const t = slugTag(trigger);
      if (t && !finalTags.includes(t)) finalTags.push(t);
    }

    const next = normLog({
      ...log,
      date: finalDate,
      ts: finalTs,
      ease: habit.type === 'go' ? ease : 0,
      mood: track.mood ? mood : '',
      energy: track.energy ? energy : '',
      duration: habit.type === 'go' && track.duration ? Number(duration) || 0 : 0,
      trigger: habit.type === 'st' && track.trigger ? trigger.trim() : '',
      resist: habit.type === 'st' ? resist : '',
      context: habit.type === 'ne' && track.context ? context.trim() : '',
      tags: track.tags ? finalTags : [],
      notes: track.notes ? notes : '',
      withHabits,
    });
    onSave(next);
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-grab" />
        <h2>Log details</h2>
        <div className="muted" style={{ fontSize: 12, marginTop: -8, marginBottom: 14 }}>
          {habit.name}
        </div>

        {/* Time + date */}
        <div className="field">
          <label>When</label>
          <div className="time-input">
            <input
              type="date"
              value={dateVal}
              onChange={(e) => setDateVal(e.target.value)}
            />
            <input
              type="time"
              value={timeVal}
              onChange={(e) => setTimeVal(e.target.value)}
            />
          </div>
        </div>

        {/* Start-specific: ease */}
        {habit.type === 'go' && track.ease && (
          <div className="field">
            <label>Ease</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n <= ease ? 'on' : ''}
                  onClick={() => setEase(ease === n ? 0 : n)}
                  aria-label={`${n} of 5`}
                >
                  <Star fill={n <= ease ? '#f5b942' : 'none'} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start-specific: duration */}
        {habit.type === 'go' && track.duration && (
          <div className="field">
            <label>Duration (minutes)</label>
            <input
              type="number"
              min="0"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 20"
            />
          </div>
        )}

        {/* Stop-specific: outcome */}
        {habit.type === 'st' && track.resist && (
          <div className="field">
            <label>Outcome</label>
            <div className="btn-row outcome">
              {[
                ['no', 'Gave in'],
                ['partial', 'Partial'],
                ['yes', 'Resisted'],
              ].map(([k, lbl]) => (
                <button
                  key={k}
                  type="button"
                  className={resist === k ? 'on ' + k : ''}
                  onClick={() => setResist(k)}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stop-specific: trigger */}
        {habit.type === 'st' && track.trigger && (
          <div className="field">
            <label>Trigger</label>
            <input
              type="text"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="e.g. stress, boredom"
            />
          </div>
        )}

        {/* Neutral-specific: context */}
        {habit.type === 'ne' && track.context && (
          <div className="field">
            <label>Context</label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. with coffee"
            />
          </div>
        )}

        {/* Mood */}
        {track.mood && (
          <div className="field">
            <label>Mood</label>
            <div className="btn-row" style={{ '--cols': 3 }}>
              {MOOD_OPTS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={mood === m ? 'on' : ''}
                  onClick={() => setMood(mood === m ? '' : m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Energy */}
        {track.energy && (
          <div className="field">
            <label>Energy</label>
            <div className="btn-row" style={{ '--cols': 3 }}>
              {ENERGY_OPTS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={energy === m ? 'on' : ''}
                  onClick={() => setEnergy(energy === m ? '' : m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {track.tags && (
          <div className="field">
            <label>Tags</label>
            <div className="tag-input" onClick={() => tagInputRef.current?.focus()}>
              {tags.map((t) => (
                <span key={t} className="tag-chip">
                  #{t}
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeTag(t); }} aria-label={`Remove ${t}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                ref={tagInputRef}
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={onTagKey}
                onBlur={commitTag}
                placeholder={tags.length === 0 ? 'add tag…' : ''}
              />
            </div>
          </div>
        )}

        {/* With other habits */}
        {allHabits.length > 1 && (
          <div className="field">
            <label>Along with</label>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {allHabits
                .filter((h) => h.id !== habit.id)
                .map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    className={`chip ${withHabits.includes(h.id) ? 'on' : ''}`}
                    onClick={() => toggleWith(h.id)}
                  >
                    {h.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {track.notes && (
          <div className="field">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="anything else…"
            />
          </div>
        )}

        <div className="sheet-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={onSubmit}>Save</button>
        </div>
      </div>
    </>
  );
}
