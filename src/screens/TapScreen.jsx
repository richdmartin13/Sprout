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
  moodCounts,
  energyCounts,
  easeAvgs,
  resistRate,
} from '../lib/stats.js';
import { todayStr, fmtDateLong, uid, normLog } from '../lib/util.js';

const SPIDER_MODES = [
  { id: 'tags',   label: 'Tags' },
  { id: 'mood',   label: 'Mood' },
  { id: 'energy', label: 'Energy' },
  { id: 'ease',   label: (h) => h.type === 'st' ? 'Resistance' : 'Ease' },
  { id: 'co',     label: 'Co-habits' },
];

function buildSpiderData(habit, habits, mode) {
  if (mode === 'tags') {
    const tags = tagFrequencyForHabit(habit).slice(0, 8);
    if (tags.length < 3) return null;
    return {
      axes: tags.map((t) => t.tag),
      layers: [{ label: 'Tag uses', color: 'var(--accent)', values: tags.map((t) => t.count) }],
    };
  }
  if (mode === 'mood') {
    const m = moodCounts([habit], null);
    const keys = ['good', 'meh', 'low', 'stressed', 'tired', 'fired up'].filter((k) => m.has(k));
    if (keys.length < 3) return null;
    return {
      axes: keys,
      layers: [{ label: 'Mood', color: 'var(--accent)', values: keys.map((k) => m.get(k) || 0) }],
    };
  }
  if (mode === 'energy') {
    const m = energyCounts([habit], null);
    const keys = ['high', 'medium', 'low energy'].filter((k) => m.has(k));
    if (keys.length < 3) return null;
    return {
      axes: keys,
      layers: [{ label: 'Energy', color: 'var(--accent)', values: keys.map((k) => m.get(k) || 0) }],
    };
  }
  if (mode === 'ease') {
    if (habit.type === 'st') {
      const r = resistRate(habit);
      if (!r || (r.yes + r.no + r.partial) < 3) return null;
      return {
        axes: ['Resisted', 'Gave in', 'Partial'],
        layers: [{ label: 'Resistance', color: 'var(--accent)', values: [r.yes, r.no, r.partial] }],
      };
    } else {
      // Ease breakdown by tag
      const byTag = {};
      for (const l of habit.logs) {
        if (!l.ease) continue;
        for (const t of (l.tags || [])) {
          byTag[t] = byTag[t] || [];
          byTag[t].push(l.ease);
        }
      }
      const entries = Object.entries(byTag)
        .map(([tag, vals]) => ({ tag, avg: vals.reduce((s, v) => s + v, 0) / vals.length }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 8);
      if (entries.length < 3) return null;
      return {
        axes: entries.map((e) => e.tag),
        layers: [{ label: 'Avg ease', color: 'var(--accent)', values: entries.map((e) => e.avg), max: 5 }],
      };
    }
  }
  if (mode === 'co') {
    const co = coOccurrenceFor(habit, habits).slice(0, 8);
    if (co.length < 3) return null;
    return {
      axes: co.map((c) => c.habit.name),
      layers: [{ label: 'Co-logged', color: 'var(--accent)', values: co.map((c) => c.shared) }],
    };
  }
  return null;
}

export default function TapScreen({
  habit,
  habits,
  prefs,
  onBack,
  onLog,
  onUpdateHabit,
  onDeleteLogRequested,
  onEditLog,
  onLongPressHabit,
  onAlert,
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
    if (tapzoneRef.current) {
      const rect = tapzoneRef.current.getBoundingClientRect();
      const x = (e.clientX ?? e.touches?.[0]?.clientX ?? rect.left + rect.width / 2) - rect.left;
      const y = (e.clientY ?? e.touches?.[0]?.clientY ?? rect.top + rect.height / 2) - rect.top;
      const r = document.createElement('span');
      r.className = 'ripple';
      r.style.cssText = `left:${x - 15}px;top:${y - 15}px;width:30px;height:30px`;
      tapzoneRef.current.appendChild(r);
      tapzoneRef.current.classList.add('flash');
      setTimeout(() => r.remove(), 560);
      setTimeout(() => tapzoneRef.current?.classList.remove('flash'), 320);
    }
    setBounce(true);
    setTimeout(() => setBounce(false), 400);

    let log = { id: uid('l'), date: todayStr(), ts: new Date().toISOString(), tags: [], withHabits: [] };
    if (prefs.repeatLastDefault) {
      const last = lastLog(habit);
      if (last) { const { id, date, ts, ...copy } = last; log = { ...log, ...copy }; }
    }
    if (habit.type === 'st' && !log.resist) log.resist = 'no';
    onLog(habit.id, normLog(log));
  };

  const lp = useLongPress((e, pos) => setCtxMenu({ x: pos.x, y: pos.y }));

  const onUndo = () => {
    const t = todayStr();
    const todayLogs = habit.logs.filter((l) => l.date === t);
    if (!todayLogs.length) { onAlert('Nothing to undo', 'No taps to remove today.'); return; }
    const last = todayLogs.sort((a, b) => (a.ts < b.ts ? 1 : -1))[0];
    onUpdateHabit({ ...habit, logs: habit.logs.filter((l) => l.id !== last.id) });
  };

  const onRepeat = () => {
    const last = lastLog(habit);
    if (!last) { onAlert('Nothing to repeat', 'No previous taps yet.'); return; }
    const { id, date, ts, ...copy } = last;
    onLog(habit.id, normLog({ ...copy, id: uid('l'), date: todayStr(), ts: new Date().toISOString() }));
  };

  const onPlusDetails = () => {
    const log = {
      id: uid('l'), date: todayStr(), ts: new Date().toISOString(), tags: [], withHabits: [],
      ...(habit.type === 'st' ? { resist: 'no' } : {}),
    };
    onLog(habit.id, normLog(log), { openDetails: true });
  };

  const sortedLogs = useMemo(() =>
    [...habit.logs].sort((a, b) => (a.ts < b.ts ? 1 : -1)),
    [habit.logs]
  );

  const spiderData = useMemo(() =>
    buildSpiderData(habit, habits, spiderMode),
    [habit, habits, spiderMode]
  );

  const middleLabel = habit.type === 'st' ? 'Days Since' : 'Streak';
  const middleValue = habit.type === 'st'
    ? (daysSince === null ? '—' : `${daysSince}`)
    : (streak || '—');

  return (
    <div className="screen">
      <div className="topbar">
        <button className="iconbtn ghost" onClick={onBack} aria-label="Back"><ChevronLeft /></button>
        <h1 className="small">{habit.name}</h1>
        <button className="iconbtn" onClick={() => onLongPressHabit(habit)} aria-label="Options"><SettingsIcon /></button>
      </div>

      <div className="tap-screen">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card"><div className="lbl">Today</div><div className="v">{today}</div></div>
          <div className="stat-card"><div className="lbl">{middleLabel}</div><div className="v">{middleValue}</div></div>
          <div className="stat-card"><div className="lbl">All Time</div><div className="v">{total}</div></div>
        </div>

        {/* Tap zone */}
        <div style={{ position: 'relative' }}>
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
              onClose={() => setCtxMenu(null)}
              onRepeat={() => { setCtxMenu(null); onRepeat(); }}
              onEditLast={() => {
                setCtxMenu(null);
                const last = lastLogToday(habit);
                if (!last) { onAlert('Nothing to edit', 'No taps today yet.'); return; }
                onEditLog(habit, last);
              }}
              onUndo={() => { setCtxMenu(null); onUndo(); }}
            />
          )}
        </div>

        {/* Action row */}
        <div className="actrow">
          <button className="actbtn" onClick={onUndo}><Undo2 /><span>Undo</span></button>
          <button className="actbtn" onClick={onRepeat}><Repeat /><span>Repeat</span></button>
          <button className="actbtn" onClick={onPlusDetails}><MoreHorizontal /><span>+ Details</span></button>
        </div>

        {/* Spider — always visible, placeholder when insufficient data */}
        <div className="section">
          <h3><span className="title-text">Patterns</span></h3>
          <div className="subtabs" style={{ marginBottom: 16 }}>
            {SPIDER_MODES.map((m) => (
              <button
                key={m.id}
                className={spiderMode === m.id ? 'on' : ''}
                onClick={() => setSpiderMode(m.id)}
              >
                {typeof m.label === 'function' ? m.label(habit) : m.label}
              </button>
            ))}
          </div>
          {spiderData
            ? <Spider axes={spiderData.axes} layers={spiderData.layers} />
            : <SpiderPlaceholder mode={spiderMode} habit={habit} />
          }
        </div>

        {/* Logs */}
        <div className="section">
          <h3>
            <span className="title-text">Log</span>
            <span className="muted" style={{ fontSize: 11 }}>{sortedLogs.length} entries</span>
          </h3>
          {sortedLogs.length === 0 ? (
            <div className="muted" style={{ fontSize: 12, padding: '8px 0' }}>No taps yet. Tap the zone above to log one.</div>
          ) : (
            <div className="logs">
              {sortedLogs.slice(0, 60).map((l) => (
                <LogRow
                  key={l.id} log={l} habit={habit} habitMap={habitMap}
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

function SpiderPlaceholder({ mode, habit }) {
  const hints = {
    tags:   'Log with tags to see your tag pattern here.',
    mood:   'Log with mood tracked to see your mood profile here.',
    energy: 'Log with energy tracked to see your energy pattern here.',
    ease:   habit?.type === 'st'
              ? 'Log stop-habit outcomes to see resistance breakdown here.'
              : 'Log with ease ratings + tags to see ease-by-tag here.',
    co:     'Log alongside other habits to see co-occurrence here.',
  };
  // Ghost radar SVG
  const N = 5;
  const cx = 100, cy = 90, R = 70;
  const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
  const pt = (i, r) => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  const rings = [0.25, 0.5, 0.75, 1];
  const ghost = [0.55, 0.38, 0.62, 0.32, 0.50];

  return (
    <div className="spider-placeholder">
      <svg viewBox="0 0 200 180" aria-hidden="true">
        {Array.from({ length: N }, (_, i) => (
          <line key={`ax${i}`}
            x1={cx} y1={cy} x2={pt(i, R)[0]} y2={pt(i, R)[1]}
            stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
        ))}
        {rings.map((f) => (
          <polygon key={`ring${f}`}
            points={Array.from({ length: N }, (_, i) => pt(i, R * f).join(',')).join(' ')}
            fill="none" stroke="currentColor" strokeOpacity="0.10" strokeWidth="1" />
        ))}
        <polygon
          points={ghost.map((f, i) => pt(i, R * f).join(',')).join(' ')}
          fill="currentColor" fillOpacity="0.07"
          stroke="currentColor" strokeOpacity="0.20" strokeWidth="1.5" strokeDasharray="4 3"
        />
      </svg>
      <p>{hints[mode] || 'Log more data to see this chart.'}</p>
    </div>
  );
}

function ContextMenu({ onClose, onRepeat, onEditLast, onUndo }) {
  React.useEffect(() => {
    const h = (e) => { if (!e.target.closest('.ctxmenu')) onClose(); };
    setTimeout(() => document.addEventListener('click', h), 0);
    return () => document.removeEventListener('click', h);
  }, [onClose]);
  return (
    <div className="ctxmenu" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
      <button onClick={onRepeat}><Repeat /> Repeat last tap</button>
      <button onClick={onEditLast}><MoreHorizontal /> Edit last tap</button>
      <button onClick={onUndo} className="danger"><Undo2 /> Undo last tap</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
