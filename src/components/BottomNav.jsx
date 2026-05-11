import React from 'react';
import { Home, BarChart3, Settings as SettingsIcon } from 'lucide-react';

export default function BottomNav({ tab, onChange }) {
  const tabs = [
    { id: 'home', label: 'Habits', icon: Home },
    { id: 'insights', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];
  return (
    <div className="bnav" role="tablist">
      {tabs.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            className={tab === t.id ? 'on' : ''}
            onClick={() => onChange(t.id)}
            role="tab"
            aria-selected={tab === t.id}
          >
            <Icon strokeWidth={2} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
