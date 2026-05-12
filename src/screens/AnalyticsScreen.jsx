import React, { useEffect, useMemo, useState } from 'react';
import { Clock, Sigma, ChevronLeft, ChevronRight } from 'lucide-react';
import Filters from '../components/Filters.jsx';
import Heatmap from '../components/Heatmap.jsx';
import Spider from '../components/Spider.jsx';
import TrendsChart, { TRENDS_PALETTE } from '../components/TrendsChart.jsx';
import LogRow from '../components/LogRow.jsx';
import {
  todayStr,
  fmtDateLong,
  shiftDate,
} from '../lib/util.js';
import {
  totalCountFor,
  todayCountFor,
  tagFrequency,
  tagFrequencyForHabit,
  coOccurrenceFor,
  hourlyBucketsFor,
  trendsFor,
  moodCounts,
  energyCounts,
  easeAvgs,
  resistRate,
  topTriggers,
  allCoOccurrences,
  timeOfDayBuckets,
  dayOfWeekBuckets,
} from '../lib/stats.js';
import { TYPE_COLORS, TYPE_LABELS } from '../lib/theme.js';

export default function AnalyticsScreen({ habits, prefs, onEditLog, onDeleteLogRequested }) {
  const [mode, setMode] = useState(prefs.insDay ? 'day' : 'all');
  const [date, setDate] = useState(todayStr());
  const [category, setCategory] = useState('');
  const [types, setTypes] = useState([]);

  // Filtered habit set (filters apply to all sections EXCEPT co-occurrence and the spider's overlays).
  const filtered = useMemo(() => {
    let list = habits.slice();
    if (category) list = list.filter((h) => h.category === category);
    if (types.length) list = list.filter((h) => types.includes(h.type));
    return list;
  }, [habits, category, types]);

  const dateFilter = mode === 'day' ? date : null;

  // Habit logs scoped to the current date if in day mode
  const scopedLogsCount = useMemo(() => {
    if (mode === 'all') return filtered.reduce((s, h) => s + h.logs.length, 0);
    return filtered.reduce((s, h) => s + h.logs.filter((l) => l.date === date).length, 0);
  }, [filtered, mode, date]);

  const habitMap = useMemo(() => new Map(habits.map((h) => [h.id, h])), [habits]);

  return (
    <div className="screen">
      <div className="topbar">
        <h1>Analytics</h1>
        <div className="seg">
          <button className={mode === 'day' ? 'on' : ''} onClick={() => setMode('day')}>
            <Clock /> Day
          </button>
          <button className={mode === 'all' ? 'on' : ''} onClick={() => setMode('all')}>
            <Sigma /> All
          </button>
        </div>
      </div>

      {mode === 'day' && (
        <div className="date-nav">
          <button className="iconbtn" onClick={() => setDate(shiftDate(date, -1))} aria-label="Previous day">
            <ChevronLeft />
          </button>
          <label className="date-label" style={{ position: 'relative' }}>
            <span>{fmtDateLong(date)}</span>
            <input
              type="date"
              value={date}
              max={todayStr()}
              onChange={(e) => setDate(e.target.value)}
              style={{ position: 'absolute', inset: 0, opacity: 0 }}
              aria-label="Pick date"
            />
          </label>
          <button
            className="iconbtn"
            onClick={() => setDate(shiftDate(date, 1))}
            disabled={date >= todayStr()}
            aria-label="Next day"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      <Filters
        habits={habits}
        category={category}
        setCategory={setCategory}
        types={types}
        setTypes={setTypes}
      />

      {scopedLogsCount === 0 && (
        <div className="empty">
          <h3>No data yet</h3>
          <p>{mode === 'day' ? 'Nothing was logged on this date.' : 'Log some habits to see analytics.'}</p>
        </div>
      )}

      <div className="analytics-content">
        {/* Quick summary */}
        {scopedLogsCount > 0 && (
          <div className="section">
            <h3><span className="title-text">{mode === 'day' ? 'This day' : 'All time'}</span></h3>
            <SummaryStrip habits={filtered} dateFilter={dateFilter} />
          </div>
        )}

        {/* Heatmap (always available — note: heatmap uses the *all-time* filtered set, but clicking a cell shifts to day mode) */}
        {prefs.sections.heatmap && filtered.length > 0 && (
          <div className="section">
            <h3><span className="title-text">Activity heatmap</span><span className="muted" style={{ fontSize: 11 }}>tap a day to focus it</span></h3>
            <Heatmap
              habits={filtered}
              prefs={prefs}
              onDateClick={(d) => { setMode('day'); setDate(d); }}
            />
          </div>
        )}

        {/* Hourly (day mode) OR Trends (all-time mode) */}
        {mode === 'day' && prefs.sections.hourly && (
          <HourlyCard habits={filtered} date={date} />
        )}
        {mode === 'all' && prefs.sections.trends && filtered.length > 0 && (
          <TrendsCard habits={filtered} />
        )}

        {/* Spider */}
        {prefs.sections.spider && scopedLogsCount > 0 && (
          <SpiderCard habits={filtered} allHabits={habits} dateFilter={dateFilter} />
        )}

        {/* Rankings */}
        {prefs.sections.rankings && filtered.length > 0 && scopedLogsCount > 0 && (
          <RankingsCard habits={filtered} dateFilter={dateFilter} />
        )}

        {/* Mood + Energy */}
        {prefs.sections.mood && scopedLogsCount > 0 && (
          <MoodEnergyCard habits={filtered} dateFilter={dateFilter} />
        )}

        {/* Time patterns (all-time only — day mode does hourly instead) */}
        {mode === 'all' && prefs.sections.time && scopedLogsCount > 0 && (
          <TimePatternsCard habits={filtered} />
        )}

        {/* Tags */}
        {prefs.sections.tags && (
          <TagsCard habits={filtered} dateFilter={dateFilter} />
        )}

        {/* Resistance */}
        {prefs.sections.resist && filtered.some((h) => h.type === 'st') && (
          <ResistanceCard habits={filtered.filter((h) => h.type === 'st')} />
        )}

        {/* Co-occurrence — note: this intentionally uses the *full* habit set so the
            relationships still show even when the user filters by category/type. */}
        {mode === 'all' && prefs.sections.co && habits.length >= 2 && (
          <CoOccurrenceCard habits={habits} />
        )}

        {/* Log */}
        {prefs.sections.log && scopedLogsCount > 0 && (
          <LogCard
            habits={filtered}
            dateFilter={dateFilter}
            habitMap={habitMap}
            onEditLog={onEditLog}
            onDeleteLog={onDeleteLogRequested}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Sub-cards ─── */

function SummaryStrip({ habits, dateFilter }) {
  const total = habits.reduce(
    (s, h) => s + (dateFilter ? h.logs.filter((l) => l.date === dateFilter).length : h.logs.length),
    0
  );
  const tagged = habits.reduce(
    (s, h) => s + h.logs.filter((l) => l.tags.length > 0 && (!dateFilter || l.date === dateFilter)).length,
    0
  );
  const habitCount = habits.filter(
    (h) => !dateFilter || h.logs.some((l) => l.date === dateFilter)
  ).length;
  return (
    <div className="stats-row">
      <div className="stat-card"><div className="lbl">Taps</div><div className="v">{total}</div></div>
      <div className="stat-card"><div className="lbl">Habits</div><div className="v">{habitCount}</div></div>
      <div className="stat-card"><div className="lbl">Tagged</div><div className="v">{tagged}</div></div>
    </div>
  );
}

function HourlyCard({ habits, date }) {
  const buckets = useMemo(() => hourlyBucketsFor(habits, date), [habits, date]);
  const max = Math.max(1, ...buckets.map((b) => b.go + b.st + b.ne));
  return (
    <div className="section">
      <h3><span className="title-text">By hour</span></h3>
      <div className="hourly" aria-label="Hourly distribution">
        {buckets.map((b, i) => {
          const total = b.go + b.st + b.ne;
          if (total === 0) return <div key={i} className="hr" style={{ height: '1px', background: 'var(--surface-solid-3)', borderRadius: 2 }} />;
          const h = (total / max) * 100;
          return (
            <div key={i} className="hr" style={{ height: `${h}%` }}>
              {b.ne > 0 && <div className="seg" style={{ height: `${(b.ne / total) * 100}%`, background: TYPE_COLORS.ne }} />}
              {b.st > 0 && <div className="seg" style={{ height: `${(b.st / total) * 100}%`, background: TYPE_COLORS.st }} />}
              {b.go > 0 && <div className="seg" style={{ height: `${(b.go / total) * 100}%`, background: TYPE_COLORS.go }} />}
            </div>
          );
        })}
      </div>
      <div className="hourly-axis">
        <span>12a</span><span>6a</span><span>12p</span><span>6p</span><span>11p</span>
      </div>
    </div>
  );
}

function TrendsCard({ habits }) {
  const allSeries = useMemo(() => trendsFor(habits, 30), [habits]);
  const [enabled, setEnabled] = useState(() => new Set(allSeries.slice(0, 5).map((s) => s.habit.id)));
  const visibleSeries = allSeries.filter((s) => enabled.has(s.habit.id));
  return (
    <div className="section">
      <h3><span className="title-text">Last 30 days</span></h3>
      <TrendsChart series={visibleSeries} />
      <div className="trends-toggles">
        {allSeries.map((s, i) => {
          const on = enabled.has(s.habit.id);
          const color = TRENDS_PALETTE[i % TRENDS_PALETTE.length];
          return (
            <button
              key={s.habit.id}
              className={on ? 'on' : ''}
              style={on ? { color: color } : {}}
              onClick={() => {
                const next = new Set(enabled);
                if (on) next.delete(s.habit.id); else next.add(s.habit.id);
                setEnabled(next);
              }}
            >
              <span className="dot" style={{ background: color }} />
              {s.habit.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SpiderCard({ habits, allHabits, dateFilter }) {
  // Top-level mode: overview of all habits (freq map) vs drill into one habit
  const [view, setView] = useState('overview'); // 'overview' | 'habit'
  const [habitId, setHabitId] = useState('');

  // Per-habit sub-mode (same as TapScreen)
  const HABIT_SUBS = [
    { id: 'tags',   label: 'Tags' },
    { id: 'mood',   label: 'Mood' },
    { id: 'energy', label: 'Energy' },
    { id: 'ease',   label: (h) => h?.type === 'st' ? 'Resistance' : 'Ease' },
    { id: 'co',     label: 'Co-habits' },
  ];
  const [habitSub, setHabitSub] = useState('tags');

  const habitOptions = useMemo(() =>
    habits.filter((h) => h.logs.length > 0),
    [habits]
  );
  const selectedHabit = useMemo(() =>
    habitOptions.find((h) => h.id === habitId) || null,
    [habitOptions, habitId]
  );

  // Reset habit picker if it leaves the filtered set
  useEffect(() => {
    if (habitId && !habits.some((h) => h.id === habitId)) setHabitId('');
  }, [habits, habitId]);

  // ── Overview: habits-as-axes frequency spider ──
  const overviewData = useMemo(() => {
    const counts = habits
      .map((h) => ({
        name: h.name,
        v: dateFilter ? h.logs.filter((l) => l.date === dateFilter).length : h.logs.length,
      }))
      .filter((x) => x.v > 0)
      .sort((a, b) => b.v - a.v)
      .slice(0, 8);
    if (counts.length < 3) return null;
    return {
      axes: counts.map((c) => c.name),
      layers: [{ label: 'Taps', color: 'var(--accent)', values: counts.map((c) => c.v) }],
    };
  }, [habits, dateFilter]);

  // ── Per-habit: same logic as TapScreen's buildSpiderData ──
  const habitData = useMemo(() => {
    if (!selectedHabit) return null;
    const h = selectedHabit;
    const df = dateFilter;

    if (habitSub === 'tags') {
      const tags = tagFrequencyForHabit(h).slice(0, 8);
      if (tags.length < 3) return null;
      return { axes: tags.map((t) => t.tag), layers: [{ label: 'Tag uses', color: 'var(--accent)', values: tags.map((t) => t.count) }] };
    }
    if (habitSub === 'mood') {
      const m = moodCounts([h], df);
      const keys = ['good', 'meh', 'low', 'stressed', 'tired', 'fired up'].filter((k) => m.has(k));
      if (keys.length < 3) return null;
      return { axes: keys, layers: [{ label: 'Mood', color: 'var(--accent)', values: keys.map((k) => m.get(k) || 0) }] };
    }
    if (habitSub === 'energy') {
      const m = energyCounts([h], df);
      const keys = ['high', 'medium', 'low energy'].filter((k) => m.has(k));
      if (keys.length < 3) return null;
      return { axes: keys, layers: [{ label: 'Energy', color: 'var(--accent)', values: keys.map((k) => m.get(k) || 0) }] };
    }
    if (habitSub === 'ease') {
      if (h.type === 'st') {
        const r = resistRate(h);
        if (!r || (r.yes + r.no + r.partial) < 3) return null;
        return { axes: ['Resisted', 'Gave in', 'Partial'], layers: [{ label: 'Resistance', color: 'var(--accent)', values: [r.yes, r.no, r.partial] }] };
      } else {
        const byTag = {};
        for (const l of h.logs) {
          if (!l.ease) continue;
          for (const t of (l.tags || [])) {
            byTag[t] = byTag[t] || [];
            byTag[t].push(l.ease);
          }
        }
        const entries = Object.entries(byTag)
          .map(([tag, vals]) => ({ tag, avg: vals.reduce((s, v) => s + v, 0) / vals.length }))
          .sort((a, b) => b.avg - a.avg).slice(0, 8);
        if (entries.length < 3) return null;
        return { axes: entries.map((e) => e.tag), layers: [{ label: 'Avg ease', color: 'var(--accent)', values: entries.map((e) => e.avg), max: 5 }] };
      }
    }
    if (habitSub === 'co') {
      const co = coOccurrenceFor(h, allHabits).slice(0, 8);
      if (co.length < 3) return null;
      return { axes: co.map((c) => c.habit.name), layers: [{ label: 'Co-logged', color: 'var(--accent)', values: co.map((c) => c.shared) }] };
    }
    return null;
  }, [selectedHabit, habitSub, dateFilter, allHabits]);

  const data = view === 'overview' ? overviewData : habitData;

  return (
    <div className="section">
      <h3><span className="title-text">Spider</span></h3>

      {/* Top-level view toggle */}
      <div className="seg" style={{ marginBottom: 12, alignSelf: 'flex-start' }}>
        <button className={view === 'overview' ? 'on' : ''} onClick={() => setView('overview')}>All habits</button>
        <button className={view === 'habit' ? 'on' : ''} onClick={() => setView('habit')}>Per habit</button>
      </div>

      {/* Habit picker (per-habit mode only) */}
      {view === 'habit' && (
        <div className="spider-filters" style={{ marginBottom: 12 }}>
          <label className="spider-filter" style={{ flex: '1 1 auto' }}>
            <span>Habit</span>
            <select
              value={habitId}
              onChange={(e) => setHabitId(e.target.value)}
            >
              <option value="">— pick a habit —</option>
              {habitOptions.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Per-habit sub-mode tabs */}
      {view === 'habit' && selectedHabit && (
        <div className="subtabs" style={{ marginBottom: 16 }}>
          {HABIT_SUBS.map((m) => (
            <button key={m.id} className={habitSub === m.id ? 'on' : ''} onClick={() => setHabitSub(m.id)}>
              {typeof m.label === 'function' ? m.label(selectedHabit) : m.label}
            </button>
          ))}
        </div>
      )}

      {/* Chart or placeholder */}
      {data ? (
        <Spider axes={data.axes} layers={data.layers} />
      ) : (
        <AnalyticsSpiderPlaceholder
          view={view}
          habitSub={habitSub}
          selectedHabit={selectedHabit}
          hasHabits={habitOptions.length > 0}
        />
      )}
    </div>
  );
}

function AnalyticsSpiderPlaceholder({ view, habitSub, selectedHabit, hasHabits }) {
  let msg;
  if (view === 'overview') {
    msg = hasHabits
      ? 'Log at least 3 different habits to see how they relate to each other.'
      : 'Add habits and start logging to see a frequency overview here.';
  } else if (!selectedHabit) {
    msg = 'Pick a habit above to drill into its patterns.';
  } else {
    const hints = {
      tags:   'Log with tags to see the tag pattern for this habit.',
      mood:   'Log with mood tracked to see mood breakdown.',
      energy: 'Log with energy tracked to see energy breakdown.',
      ease:   selectedHabit?.type === 'st'
                ? 'Log stop-habit outcomes to see resistance breakdown.'
                : 'Log with ease ratings + tags to see ease-by-tag.',
      co:     'Log alongside other habits to see co-occurrence.',
    };
    msg = hints[habitSub] || 'Log more data to see this chart.';
  }

  const N = 5, cx = 100, cy = 90, R = 70;
  const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
  const pt = (i, r) => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  const ghost = [0.55, 0.38, 0.62, 0.32, 0.50];

  return (
    <div className="spider-placeholder">
      <svg viewBox="0 0 200 180" aria-hidden="true">
        {Array.from({ length: N }, (_, i) => (
          <line key={`ax${i}`} x1={cx} y1={cy} x2={pt(i, R)[0]} y2={pt(i, R)[1]}
            stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
        ))}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon key={f}
            points={Array.from({ length: N }, (_, i) => pt(i, R * f).join(',')).join(' ')}
            fill="none" stroke="currentColor" strokeOpacity="0.10" strokeWidth="1" />
        ))}
        <polygon
          points={ghost.map((f, i) => pt(i, R * f).join(',')).join(' ')}
          fill="currentColor" fillOpacity="0.07"
          stroke="currentColor" strokeOpacity="0.20" strokeWidth="1.5" strokeDasharray="4 3"
        />
      </svg>
      <p>{msg}</p>
    </div>
  );
}

function RankingsCard({ habits, dateFilter }) {
  const ranked = useMemo(() =>
    habits
      .map((h) => ({ h, c: dateFilter ? h.logs.filter((l) => l.date === dateFilter).length : h.logs.length }))
      .filter((x) => x.c > 0)
      .sort((a, b) => b.c - a.c),
    [habits, dateFilter]
  );
  if (!ranked.length) return null;
  const max = ranked[0].c;
  return (
    <div className="section">
      <h3><span className="title-text">Rankings</span></h3>
      <div className="bars">
        {ranked.map(({ h, c }) => (
          <div key={h.id} className="bar-row">
            <span className="lbl">{h.name}</span>
            <div className="bar">
              <div
                className="fill"
                style={{ width: `${(c / max) * 100}%`, background: TYPE_COLORS[h.type] }}
              />
            </div>
            <span className="v">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoodEnergyCard({ habits, dateFilter }) {
  const moods = moodCounts(habits, dateFilter);
  const ens = energyCounts(habits, dateFilter);
  const moodArr = Array.from(moods.entries()).sort((a, b) => b[1] - a[1]);
  const enArr = Array.from(ens.entries()).sort((a, b) => b[1] - a[1]);
  if (!moodArr.length && !enArr.length) return null;
  const maxMood = Math.max(1, ...moodArr.map((m) => m[1]));
  const maxEn = Math.max(1, ...enArr.map((m) => m[1]));
  return (
    <div className="section">
      <h3><span className="title-text">Mood &amp; energy</span></h3>
      {moodArr.length > 0 && (
        <>
          <div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>Mood</div>
          <div className="bars" style={{ marginBottom: enArr.length ? 12 : 0 }}>
            {moodArr.map(([k, v]) => (
              <div key={k} className="bar-row">
                <span className="lbl">{k}</span>
                <div className="bar"><div className="fill" style={{ width: `${(v / maxMood) * 100}%` }} /></div>
                <span className="v">{v}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {enArr.length > 0 && (
        <>
          <div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>Energy</div>
          <div className="bars">
            {enArr.map(([k, v]) => (
              <div key={k} className="bar-row">
                <span className="lbl">{k}</span>
                <div className="bar"><div className="fill" style={{ width: `${(v / maxEn) * 100}%` }} /></div>
                <span className="v">{v}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TimePatternsCard({ habits }) {
  const tod = timeOfDayBuckets(habits);
  const dow = dayOfWeekBuckets(habits);
  const maxDow = Math.max(1, ...dow);
  const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return (
    <div className="section">
      <h3><span className="title-text">Time patterns</span></h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>Time of day</div>
          {Object.entries(tod).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '3px 0' }}>
              <span className="text-2">{k}</span>
              <span className="tabular" style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>Day of week</div>
          <div className="dow">
            {dow.map((v, i) => (
              <div key={i} className="col">
                <div className="b" style={{ height: `${Math.max(4, (v / maxDow) * 100)}%` }} />
                <div className="l">{DOW[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TagsCard({ habits, dateFilter }) {
  const tags = tagFrequency(habits, dateFilter);
  if (!tags.length) return null;
  return (
    <div className="section">
      <h3><span className="title-text">Tags</span></h3>
      <div className="tags-cloud">
        {tags.map((t) => (
          <span key={t.tag} className="t">#{t.tag}<span className="c">{t.count}</span></span>
        ))}
      </div>
    </div>
  );
}

function ResistanceCard({ habits }) {
  return (
    <div className="section">
      <h3><span className="title-text">Resistance</span></h3>
      {habits.map((h) => {
        const r = resistRate(h);
        if (!r) {
          return (
            <div key={h.id} className="resist-card">
              <div className="name">{h.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>No data.</div>
            </div>
          );
        }
        const yPct = (r.yes / r.total) * 100;
        const pPct = (r.partial / r.total) * 100;
        const nPct = (r.no / r.total) * 100;
        const triggers = topTriggers(h);
        return (
          <div key={h.id} className="resist-card">
            <div className="name">{h.name}</div>
            <div className="stack">
              {yPct > 0 && <div className="seg" style={{ width: `${yPct}%`, background: TYPE_COLORS.go }} />}
              {pPct > 0 && <div className="seg" style={{ width: `${pPct}%`, background: '#f59e0b' }} />}
              {nPct > 0 && <div className="seg" style={{ width: `${nPct}%`, background: TYPE_COLORS.st }} />}
            </div>
            <div className="pct">
              <span style={{ color: TYPE_COLORS.go }}>Resisted {Math.round(yPct)}%</span>
              <span style={{ color: '#f59e0b' }}>Partial {Math.round(pPct)}%</span>
              <span style={{ color: TYPE_COLORS.st }}>Gave in {Math.round(nPct)}%</span>
            </div>
            {triggers.length > 0 && (
              <div className="triggers">
                {triggers.map((t) => (
                  <span key={t.trig} className="pill">{t.trig} <span style={{ opacity: 0.6, marginLeft: 4 }}>×{t.count}</span></span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CoOccurrenceCard({ habits }) {
  const pairs = useMemo(() => allCoOccurrences(habits).slice(0, 5), [habits]);
  if (!pairs.length) return null;
  return (
    <div className="section">
      <h3><span className="title-text">Co-occurrences</span><span className="muted" style={{ fontSize: 11 }}>across all habits</span></h3>
      {pairs.map(({ a, b, shared }, i) => (
        <div key={i} className="co-row">
          <div className="pair">
            <span className="dot" style={{ background: TYPE_COLORS[a.type] }} />
            <span>{a.name}</span>
            <span className="muted">+</span>
            <span className="dot" style={{ background: TYPE_COLORS[b.type] }} />
            <span>{b.name}</span>
          </div>
          <span className="v">{shared} days</span>
        </div>
      ))}
    </div>
  );
}

function LogCard({ habits, dateFilter, habitMap, onEditLog, onDeleteLog }) {
  const allLogs = useMemo(() => {
    const out = [];
    for (const h of habits) {
      for (const l of h.logs) {
        if (dateFilter && l.date !== dateFilter) continue;
        out.push({ habit: h, log: l });
      }
    }
    out.sort((a, b) => (a.log.ts < b.log.ts ? 1 : -1));
    return dateFilter ? out : out.slice(0, 50);
  }, [habits, dateFilter]);

  return (
    <div className="section">
      <h3><span className="title-text">Log</span><span className="muted" style={{ fontSize: 11 }}>{allLogs.length}{dateFilter ? '' : ' (most recent)'}</span></h3>
      <div className="logs">
        {allLogs.map(({ habit, log }) => (
          <LogRow
            key={log.id}
            log={log}
            habit={habit}
            habitMap={habitMap}
            showHabitName
            onEdit={(l) => onEditLog(habit, l)}
            onDelete={(l) => onDeleteLog(habit, l)}
          />
        ))}
      </div>
    </div>
  );
}
