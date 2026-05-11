import React, { useMemo, useRef, useState } from 'react';
import { ChevronLeft, Undo2, Repeat, MoreHorizontal, Settings as SettingsIcon } from 'lucide-react';
import Spider from '../components/Spider.jsx';
import LogRow from '../components/LogRow.jsx';
import { useLongPress } from '../hooks/useLongPress.js';
import {
  todayCountFor,
  totalCountFor,
  streakFor,
  daysSinceLastFor,
  lastLog,
  lastLogToday,
  tagFrequencyForHabit,
  coOccurrenceFor,
} from '../lib/stats.js';
import { todayStr, fmtDateLong, uid, normLog } from '../lib/util.js';
import { TYPE_LABELS } from '../lib/theme.js';

export default function TapScreen({
  habit,
  habits,
  prefs,
  onBack,
  onLog,
  onUpdateHabit,
  onDeleteLogRequested,
  onEditLog,
  onOpenLogDetails,
  onLongPressHabit,
  onAlert,
  onConfirm,
}) {
  const [bounce, setBounce] = useState(false);
  const [spiderMode, setSpiderMode] = useState('tags');
  const tapzoneRef = useRef(null);
  const [ctxMenu, setCtxMenu] = useState(null);

  const today = todayCountFor(habit);
  const total = totalCountFor(habit);
  const streak = streakFor(habit);
  const daysSince = daysSinceLastFor(habit);

  const habitMap = useMemo(() => new Map(habits.map((h) => [h.id, h])), [habits]);

  const doTap = (e) => {
    // ripple
    if (tapzoneRef.current) {
      const rect = tapzoneRef.current.getBoundingClientRect();
      const x = (e.clientX ?? e.touches?.[0]?.clientX ?? rect.left + rect.width / 2) - rect.left;
      const y = (e.clientY ?? e.touches?.[0]?.clientY ?? rect.top + rect.height / 2) - rect.top;
      const r = document.createElement('span');
      r.className = 'ripple';
      r.style.left = `${x - 15}px`;
      r.style.top = `${y - 15}px`;
      r.style.width = '30px';
      r.style.height = '30px';
      tapzoneRef.current.appendChild(r);
      tapzoneRef.current.classList.add('flash');
      setTimeout(() => r.remove(), 560);
      setTimeout(() => tapzoneRef.current?.classList.remove('flash'), 320);
    }
    setBounce(true);
    setTimeout(() => setBounce(false), 400);

    // Build the log
    let log = {
      id: uid('l'),
      date: todayStr(),
      ts: new Date().toISOString(),
      tags: [],
      withHabits: [],
    };
    if (prefs.repeatLastDefault) {
      const last = lastLog(habit);
      if (last) {
        const { id, date, ts, ...copy } = last;
        log = { ...log, ...copy };
      }
    }
    if (habit.type === 'st' && !log.resist) log.resist = 'no';
    onLog(habit.id, normLog(log));
  };

  const lp = useLongPress((e, pos) => {
    setCtxMenu({ x: pos.x, y: pos.y });
  });

  const closeCtx = () => setCtxMenu(null);

  const onUndo = () => {
    const t = todayStr();
    const todayLogs = habit.logs.filter((l) => l.date === t);
    if (!todayLogs.length) {
      onAlert('Nothing to undo', 'No taps to remove today.');
      return;
    }
    const last = todayLogs.sort((a, b) => (a.ts < b.ts ? 1 : -1))[0];
    onUpdateHabit({ ...habit, logs: habit.logs.filter((l) => l.id !== last.id) });
  };

  const onRepeat = () => {
    const last = lastLog(habit);
    if (!last) {
      onAlert('Nothing to repeat', 'No previous taps yet.');
      return;
    }
    const { id, date, ts, ...copy } = last;
    onLog(habit.id, normLog({
      ...copy,
      id: uid('l'),
      date: todayStr(),
      ts: new Date().toISOString(),
    }));
  };

  const onPlusDetails = () => {
    const log = {
      id: uid('l'),
      date: todayStr(),
      ts: new Date().toISOString(),
      tags: [],
      withHabits: [],
      ...(habit.type === 'st' ? { resist: 'no' } : {}),
    };
    onLog(habit.id, normLog(log), { openDetails: true });
  };

  // Sort logs newest first
  const sortedLogs = useMemo(() =>
    [...habit.logs].sort((a, b) => (a.ts < b.ts ? 1 : -1)),
    [habit.logs]
  );

  // Spider data
  const spiderData = useMemo(() => {
    if (spiderMode === 'tags') {
      const tags = tagFrequencyForHabit(habit).slice(0, 8);
      if (tags.length < 3) return null;
      return {
        axes: tags.map((t) => t.tag),
        layers: [{ label: habit.name, color: 'var(--accent)', values: tags.map((t) => t.count) }],
      };
    } else {
      const co = coOccurrenceFor(habit, habits).slice(0, 8);
      if (co.length < 3) return null;
      return {
        axes: co.map((c) => c.habit.name),
        layers: [{ label: 'Co-occurrence', color: 'var(--accent)', values: co.map((c) => c.shared) }],
      };
    }
  }, [habit, habits, spiderMode]);

  const middleLabel = habit.type === 'st' ? 'Days Since' : 'Streak';
  const middleValue = habit.type === 'st'
    ? (daysSince === null ? '—' : `${daysSince}`)
    : (streak || '—');

  return (
    <div className="screen">
      <div className="topbar">
        <button className="iconbtn ghost" onClick={onBack} aria-label="Back">
          <ChevronLeft />
        </button>
        <h1 className="small">{habit.name}</h1>
        <button className="iconbtn" onClick={() => onLongPressHabit(habit)} aria-label="Habit options">
          <SettingsIcon />
        </button>
      </div>

      <div className="tap-screen">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="lbl">Today</div>
            <div className="v">{today}</div>
          </div>
          <div className="stat-card">
            <div className="lbl">{middleLabel}</div>
            <div className="v">{middleValue}</div>
          </div>
          <div className="stat-card">
            <div className="lbl">All Time</div>
            <div className="v">{total}</div>
          </div>
        </div>

        {/* Tap zone */}
        <div className="position-rel" style={{ position: 'relative' }}>
          <div
            ref={tapzoneRef}
            className={`tapzone ${habit.type}`}
            onClick={doTap}
            {...lp}
            role="button"
            aria-label="Log a tap"
          >
            <div className="label">Tap to log</div>
            <div className={`count tabular ${bounce ? 'bounce' : ''}`}>{today}</div>
            <div className="sublabel">taps today</div>
            <div className="date">{fmtDateLong(todayStr())}</div>
          </div>

          {ctxMenu && (
            <ContextMenu
              onClose={closeCtx}
              onRepeat={() => { closeCtx(); onRepeat(); }}
              onEditLast={() => {
                closeCtx();
                const last = lastLogToday(habit);
                if (!last) { onAlert('Nothing to edit', 'No taps today yet.'); return; }
                onEditLog(habit, last);
              }}
              onUndo={() => { closeCtx(); onUndo(); }}
            />
          )}
        </div>

        {/* Action row */}
        <div className="actrow">
          <button className="actbtn" onClick={onUndo} aria-label="Undo">
            <Undo2 />
            <span>Undo</span>
          </button>
          <button className="actbtn" onClick={onRepeat} aria-label="Repeat last">
            <Repeat />
            <span>Repeat</span>
          </button>
          <button className="actbtn" onClick={onPlusDetails} aria-label="Add with details">
            <MoreHorizontal />
            <span>+ Details</span>
          </button>
        </div>

        {/* Spider */}
        {spiderData && (
          <div className="section">
            <h3>
              <span className="title-text">Patterns</span>
              <div className="seg">
                <button className={spiderMode === 'tags' ? 'on' : ''} onClick={() => setSpiderMode('tags')}>Tags</button>
                <button className={spiderMode === 'co' ? 'on' : ''} onClick={() => setSpiderMode('co')}>Co-habits</button>
              </div>
            </h3>
            <Spider axes={spiderData.axes} layers={spiderData.layers} />
          </div>
        )}

        {/* Logs */}
        <div className="section">
          <h3><span className="title-text">Log</span><span className="muted" style={{ fontSize: 11 }}>{sortedLogs.length} entries</span></h3>
          {sortedLogs.length === 0 ? (
            <div className="muted" style={{ fontSize: 12, padding: '8px 0' }}>No taps yet. Tap the zone above to log one.</div>
          ) : (
            <div className="logs">
              {sortedLogs.slice(0, 60).map((l) => (
                <LogRow
                  key={l.id}
                  log={l}
                  habit={habit}
                  habitMap={habitMap}
                  onEdit={(log) => onEditLog(habit, log)}
                  onDelete={(log) => onDeleteLogRequested(habit, log)}
                />
              ))}
              {sortedLogs.length > 60 && (
                <div className="muted center" style={{ fontSize: 11, padding: 8 }}>
                  Showing 60 of {sortedLogs.length}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContextMenu({ onClose, onRepeat, onEditLast, onUndo }) {
  React.useEffect(() => {
    const onDoc = (e) => {
      if (!e.target.closest('.ctxmenu')) onClose();
    };
    setTimeout(() => document.addEventListener('click', onDoc), 0);
    return () => document.removeEventListener('click', onDoc);
  }, [onClose]);

  return (
    <div className="ctxmenu" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
      <button onClick={onRepeat}><Repeat /> Repeat last tap</button>
      <button onClick={onEditLast}><MoreHorizontal /> Edit last tap</button>
      <button onClick={onUndo} className="danger"><Undo2 /> Undo last tap</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
