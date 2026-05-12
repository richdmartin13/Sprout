import React, { useMemo, useState } from 'react';
import { Plus, List, Grid as GridIcon } from 'lucide-react';
import HabitCard from '../components/HabitCard.jsx';
import Filters from '../components/Filters.jsx';
import { totalCountFor } from '../lib/stats.js';

export default function HomeScreen({ habits, prefs, setPrefs, onOpenHabit, onLongPressHabit, onNewHabit }) {
  const [category, setCategory] = useState('');
  const [types, setTypes] = useState([]);

  const filtered = useMemo(() => {
    let list = habits.slice();
    if (category) list = list.filter((h) => h.category === category);
    if (types.length) list = list.filter((h) => types.includes(h.type));
    return list.sort((a, b) => totalCountFor(b) - totalCountFor(a));
  }, [habits, category, types]);

  return (
    <div className="screen">
      <div className="topbar">
        <h1>Habits</h1>
        <div className="seg" role="tablist" aria-label="View mode">
          <button
            className={prefs.viewMode === 'list' ? 'on' : ''}
            onClick={() => setPrefs({ ...prefs, viewMode: 'list' })}
            aria-label="List view"
          >
            <List />
          </button>
          <button
            className={prefs.viewMode === 'grid' ? 'on' : ''}
            onClick={() => setPrefs({ ...prefs, viewMode: 'grid' })}
            aria-label="Grid view"
          >
            <GridIcon />
          </button>
        </div>
      </div>

      <Filters
        habits={habits}
        category={category}
        setCategory={setCategory}
        types={types}
        setTypes={setTypes}
      />

      {filtered.length === 0 ? (
        <div className="empty">
          <h3>{habits.length === 0 ? 'No habits yet' : 'Nothing matches'}</h3>
          <p>
            {habits.length === 0
              ? 'Tap the + button to create your first habit and start mapping your days.'
              : 'Try clearing your filters.'}
          </p>
        </div>
      ) : (
        <div className={`habit-list ${prefs.viewMode === 'grid' ? 'grid' : ''}`}>
          {filtered.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              viewMode={prefs.viewMode}
              prefs={prefs}
              onTap={onOpenHabit}
              onLongPress={onLongPressHabit}
            />
          ))}
        </div>
      )}

      <button className="fab" onClick={onNewHabit} aria-label="New habit" style={{display:'none'}} />
    </div>
  );
}
