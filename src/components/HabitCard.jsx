import React from 'react';
import { Flame, Clock } from 'lucide-react';
import { todayCountFor, totalCountFor, streakFor, daysSinceLastFor, dailyCountsFor } from '../lib/stats.js';
import { TYPE_LABELS } from '../lib/theme.js';
import { useLongPress } from '../hooks/useLongPress.js';

export default function HabitCard({ habit, viewMode, prefs, onTap, onLongPress }) {
  const today = todayCountFor(habit);
  const total = totalCountFor(habit);
  const days = viewMode === 'grid' ? 14 : 28;
  const sparks = dailyCountsFor(habit, days);
  const maxSpark = Math.max(1, ...sparks.map((s) => s.count));

  const showBadge = prefs.showStreak;
  const streak = showBadge ? streakFor(habit) : 0;
  const daysSince = showBadge ? daysSinceLastFor(habit) : null;

  const lp = useLongPress(() => onLongPress && onLongPress(habit));

  if (viewMode === 'grid') {
    return (
      <div
        className={`habit-card in-grid ${habit.type} ${prefs.compact ? 'compact' : ''}`}
        {...lp}
        onClick={() => onTap(habit)}
        role="button"
        tabIndex={0}
      >
        <span className="habit-accent" />
        <div className="habit-name">{habit.name}</div>
        <div className={`big-count ${today === 0 ? 'zero' : ''}`}>{today}</div>
        <div className="spark">
          {sparks.map((s, i) => (
            <div
              key={i}
              className={`b ${s.count > 0 ? 'on' : ''}`}
              style={{ height: `${Math.max(2, (s.count / maxSpark) * 100)}%` }}
            />
          ))}
        </div>
        <div className="habit-foot">{total} taps · {habit.category}</div>
      </div>
    );
  }

  return (
    <div
      className={`habit-card ${habit.type} ${prefs.compact ? 'compact' : ''}`}
      {...lp}
      onClick={() => onTap(habit)}
      role="button"
      tabIndex={0}
    >
      <span className="habit-accent" />
      <div className="habit-head">
        <div className="habit-name">{habit.name}</div>
        <span className={`today-pill ${today > 0 ? 'has' : ''}`}>
          {today > 0 ? `${today} today` : 'tap to log'}
        </span>
      </div>
      <div className="habit-meta">
        <span className={`badge type-${habit.type}`}>{TYPE_LABELS[habit.type]}</span>
        {habit.category && <span className="badge">{habit.category}</span>}
        {showBadge && habit.type !== 'st' && streak > 1 && (
          <span className="badge"><Flame /> {streak}</span>
        )}
        {showBadge && habit.type === 'st' && daysSince !== null && (
          <span className="badge"><Clock /> {daysSince}d</span>
        )}
      </div>
      <div className="spark">
        {sparks.map((s, i) => (
          <div
            key={i}
            className={`b ${s.count > 0 ? 'on' : ''}`}
            style={{ height: `${Math.max(2, (s.count / maxSpark) * 100)}%` }}
          />
        ))}
      </div>
      <div className="habit-foot">{total} total taps</div>
    </div>
  );
}
