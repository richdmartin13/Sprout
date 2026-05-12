import React from 'react';
import { Home, BarChart3, Settings as SettingsIcon, Plus } from 'lucide-react';

/**
 * Floating Liquid Glass nav bar.
 * The nav pill is always left-anchored, and the FAB is right when on home.
 * On desktop/tablet (>=768px) this is hidden; side nav takes over.
 */
export default function BottomNav({ tab, onChange, onFab }) {
  const tabs = [
    { id: 'home',     label: 'Habits',    icon: Home },
    { id: 'insights', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings',  icon: SettingsIcon },
  ];

  return (
    <div className="bnav-row with-fab">
      {/* Nav pill — always left side */}
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
              aria-label={t.label}
            >
              <Icon strokeWidth={2} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* FAB pill — always rendered so nav stays left; invisible when not on home */}
      <button
        className="fab-pill"
        onClick={onFab || undefined}
        aria-label="New habit"
        style={onFab ? undefined : { opacity: 0, pointerEvents: 'none' }}
      >
        <Plus strokeWidth={2.5} />
      </button>
    </div>
  );
}
