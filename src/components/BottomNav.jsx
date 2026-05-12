import React from 'react';
import { Home, BarChart3, Settings as SettingsIcon, Plus } from 'lucide-react';

/**
 * Floating Liquid Glass nav bar.
 * When `onFab` is provided, the nav pill sits on the LEFT and a FAB pill sits on the RIGHT.
 * When `onFab` is absent (other screens), the nav pill is centered.
 */
export default function BottomNav({ tab, onChange, onFab }) {
  const tabs = [
    { id: 'home',     label: 'Habits',    icon: Home },
    { id: 'insights', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings',  icon: SettingsIcon },
  ];

  return (
    <div className={`bnav-row ${onFab ? 'with-fab' : ''}`}>
      {/* Nav pill */}
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

      {/* FAB pill — only on home screen */}
      {onFab && (
        <button className="fab-pill" onClick={onFab} aria-label="New habit">
          <Plus strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
