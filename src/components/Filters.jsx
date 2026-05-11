import React from 'react';

export default function Filters({ habits, category, setCategory, types, setTypes }) {
  const cats = Array.from(new Set(habits.map((h) => h.category).filter(Boolean)));
  const toggleType = (t) => {
    setTypes(types.includes(t) ? types.filter((x) => x !== t) : [...types, t]);
  };
  return (
    <div className="filters">
      <div className="filter-row" role="group" aria-label="Category filter">
        <button
          className={`chip ${!category ? 'on' : ''}`}
          onClick={() => setCategory('')}
        >
          All
        </button>
        {cats.map((c) => (
          <button
            key={c}
            className={`chip ${category === c ? 'on' : ''}`}
            onClick={() => setCategory(category === c ? '' : c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="filter-row" role="group" aria-label="Type filter">
        <button className={`chip type-go ${types.includes('go') ? 'on' : ''}`} onClick={() => toggleType('go')}>Start</button>
        <button className={`chip type-st ${types.includes('st') ? 'on' : ''}`} onClick={() => toggleType('st')}>Stop</button>
        <button className={`chip type-ne ${types.includes('ne') ? 'on' : ''}`} onClick={() => toggleType('ne')}>Neutral</button>
      </div>
    </div>
  );
}
