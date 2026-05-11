import React, { useMemo } from 'react';
import { todayStr, dateStr, parseDate, fmtDate } from '../lib/util.js';
import { heatColor } from '../lib/theme.js';

export default function Heatmap({ habits, prefs, onDateClick, weeks = 26 }) {
  const data = useMemo(() => buildGrid(habits, weeks), [habits, weeks]);

  return (
    <div className="heatmap">
      {data.cols.map((col, ci) => (
        <div key={ci} className="col">
          {col.map((cell, ri) => (
            <button
              key={ri}
              className={`cell ${cell.today ? 'today' : ''} ${cell.future ? 'future' : ''}`}
              style={{
                background: cell.count > 0 ? heatColor(cell.count, data.max, prefs) : undefined,
              }}
              title={`${cell.count} taps · ${fmtDate(cell.date)}`}
              onClick={() => cell.count > 0 && !cell.future && onDateClick && onDateClick(cell.date)}
              aria-label={`${cell.count} taps on ${fmtDate(cell.date)}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function buildGrid(habits, weeks) {
  const today = new Date();
  const todayD = parseDate(todayStr());
  // anchor so rightmost column ends on today
  // The last column may have fewer than 7 days if today isn't Saturday.
  // Actually we'll do: each column is Sun-Sat. Last column's Saturday >= today.
  const dayOfWeek = todayD.getDay();
  const endOfWeek = new Date(todayD);
  endOfWeek.setDate(endOfWeek.getDate() + (6 - dayOfWeek)); // upcoming Saturday

  const cols = [];
  const countByDate = new Map();
  for (const h of habits) {
    for (const l of h.logs) {
      countByDate.set(l.date, (countByDate.get(l.date) || 0) + 1);
    }
  }
  let max = 0;
  for (const v of countByDate.values()) if (v > max) max = v;

  for (let w = weeks - 1; w >= 0; w--) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(endOfWeek);
      day.setDate(day.getDate() - (w * 7 + (6 - d)));
      const ds = dateStr(day);
      const isToday = ds === todayStr();
      const isFuture = day > todayD;
      col.push({
        date: ds,
        count: countByDate.get(ds) || 0,
        today: isToday,
        future: isFuture,
      });
    }
    cols.push(col);
  }
  return { cols, max };
}
