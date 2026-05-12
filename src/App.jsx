import React, { useEffect, useState, useCallback } from 'react';
import HomeScreen from './screens/HomeScreen.jsx';
import TapScreen from './screens/TapScreen.jsx';
import AnalyticsScreen from './screens/AnalyticsScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';
import BottomNav from './components/BottomNav.jsx';
import HabitSheet from './sheets/HabitSheet.jsx';
import LogDetailsSheet from './sheets/LogDetailsSheet.jsx';
import HabitOptionsSheet from './sheets/HabitOptionsSheet.jsx';
import ConfirmSheet from './sheets/ConfirmSheet.jsx';
import AlertSheet from './sheets/AlertSheet.jsx';
import SettingsModals from './sheets/SettingsModals.jsx';
import { loadData, saveData } from './lib/storage.js';
import { applyTheme } from './lib/theme.js';
import { normLog } from './lib/util.js';
import { Home, BarChart3, Settings as SettingsIcon, Plus } from 'lucide-react';

const SproutSymbol = ({ size = 36, color = '#f4f0e8' }) => (
  <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="77" y="96" width="6" height="34" rx="3" fill={color} opacity="0.92"/>
    <path d="M80 95 C60 85 44 62 52 40 C60 18 80 30 80 52 Z" fill={color} opacity="0.92"/>
    <path d="M80 95 C100 82 116 58 106 38 C96 18 80 32 80 54 Z" fill={color} opacity="0.55"/>
    <circle cx="80" cy="122" r="20" stroke={color} strokeWidth="2.5" opacity="0.16"/>
    <circle cx="80" cy="122" r="30" stroke={color} strokeWidth="1.2" opacity="0.07"/>
  </svg>
);

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [tab, setTab] = useState('home');
  const [currentHabitId, setCurrentHabitId] = useState(null);
  const [backTab, setBackTab] = useState('home');
  const [sheet, setSheet] = useState(null);
  const [splashHidden, setSplashHidden] = useState(false);
  // Settings modal state — lifted to root so it renders above nav layers
  const [settingsModal, setSettingsModal] = useState(null);   // string | null
  const [settingsModalMeta, setSettingsModalMeta] = useState(null); // extra callbacks for Data modal

  useEffect(() => { saveData(data); }, [data]);
  useEffect(() => { applyTheme(data.prefs); }, [data.prefs]);
  useEffect(() => {
    const t = setTimeout(() => setSplashHidden(true), 320);
    return () => clearTimeout(t);
  }, []);

  const setPrefs = useCallback((next) => setData((d) => ({ ...d, prefs: next })), []);

  const upsertHabit = useCallback((next) => {
    setData((d) => {
      const exists = d.habits.some((h) => h.id === next.id);
      const habits = exists ? d.habits.map((h) => (h.id === next.id ? next : h)) : [...d.habits, next];
      return { ...d, habits };
    });
  }, []);

  const deleteHabit = useCallback((id) => {
    setData((d) => ({ ...d, habits: d.habits.filter((h) => h.id !== id) }));
  }, []);

  const addLog = useCallback((habitId, log, opts = {}) => {
    const normed = normLog(log);
    setData((d) => ({
      ...d,
      habits: d.habits.map((h) => h.id === habitId ? { ...h, logs: [...h.logs, normed] } : h),
    }));
    if (opts.openDetails) {
      setTimeout(() => {
        setSheet((prev) => prev ? prev : { kind: 'logDetails', habitId, logId: normed.id });
      }, 30);
    }
  }, []);

  const updateLog = useCallback((habitId, nextLog) => {
    setData((d) => ({
      ...d,
      habits: d.habits.map((h) =>
        h.id === habitId ? { ...h, logs: h.logs.map((l) => (l.id === nextLog.id ? nextLog : l)) } : h
      ),
    }));
  }, []);

  const deleteLog = useCallback((habitId, logId) => {
    setData((d) => ({
      ...d,
      habits: d.habits.map((h) =>
        h.id === habitId ? { ...h, logs: h.logs.filter((l) => l.id !== logId) } : h
      ),
    }));
  }, []);

  const onAlert = useCallback((title, body) => setSheet({ kind: 'alert', title, body }), []);
  const onConfirm = useCallback((title, body, fn) => setSheet({ kind: 'confirm', title, body, fn }), []);

  const goTab = (t) => { setTab(t); setCurrentHabitId(null); };
  const openHabit = (h) => { setBackTab(tab); setCurrentHabitId(h.id); setTab('tap'); };
  const goBackFromTap = () => { setCurrentHabitId(null); setTab(backTab || 'home'); };

  const currentHabit = currentHabitId ? data.habits.find((h) => h.id === currentHabitId) : null;

  useEffect(() => {
    if (tab === 'tap' && !currentHabit) setTab(backTab || 'home');
  }, [tab, currentHabit, backTab]);

  const handleOpenSettingsModal = useCallback((modalId, meta) => {
    setSettingsModal(modalId);
    setSettingsModalMeta(meta || null);
  }, []);

  const handleCloseSettingsModal = useCallback(() => {
    setSettingsModal(null);
    setSettingsModalMeta(null);
  }, []);

  const key = tab + (currentHabitId || '');
  let screen;
  if (tab === 'home') {
    screen = (
      <HomeScreen key={key}
        habits={data.habits} prefs={data.prefs} setPrefs={setPrefs}
        onOpenHabit={openHabit}
        onLongPressHabit={(h) => setSheet({ kind: 'habitOptions', habit: h })}
        onNewHabit={() => setSheet({ kind: 'habit', habit: null })}
      />
    );
  } else if (tab === 'tap' && currentHabit) {
    screen = (
      <TapScreen key={key}
        habit={currentHabit} habits={data.habits} prefs={data.prefs}
        onBack={goBackFromTap} onLog={addLog} onUpdateHabit={upsertHabit}
        onEditLog={(habit, log) => setSheet({ kind: 'logDetails', habit, log })}
        onDeleteLogRequested={(habit, log) =>
          onConfirm('Delete log', 'Remove this entry? This cannot be undone.', () => deleteLog(habit.id, log.id))
        }
        onLongPressHabit={(h) => setSheet({ kind: 'habitOptions', habit: h })}
        onAlert={onAlert} onConfirm={onConfirm}
      />
    );
  } else if (tab === 'insights') {
    screen = (
      <AnalyticsScreen key={key}
        habits={data.habits} prefs={data.prefs}
        onEditLog={(habit, log) => setSheet({ kind: 'logDetails', habit, log })}
        onDeleteLogRequested={(habit, log) =>
          onConfirm('Delete log', 'Remove this entry?', () => deleteLog(habit.id, log.id))
        }
      />
    );
  } else if (tab === 'settings') {
    screen = (
      <SettingsScreen key={key}
        data={data} prefs={data.prefs} setPrefs={setPrefs} setData={setData}
        onAlert={onAlert} onConfirm={onConfirm}
        onOpenModal={handleOpenSettingsModal}
        onCloseModal={handleCloseSettingsModal}
      />
    );
  }

  const SIDE_TABS = [
    { id: 'home',     label: 'Habits',    icon: Home },
    { id: 'insights', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings',  icon: SettingsIcon },
  ];

  return (
    <>
      <Splash hidden={splashHidden} />

      {/* Desktop Side Nav */}
      <nav className="side-nav" aria-label="Main navigation">
        <div className="side-nav-logo">
          <div className="side-nav-logo-icon">
            <SproutSymbol size={22} color="#f4f0e8" />
          </div>
          <span className="side-nav-logo-name">Sprout</span>
        </div>
        {SIDE_TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id}
              className={`side-nav-btn ${tab === t.id ? 'on' : ''}`}
              onClick={() => goTab(t.id)}
              aria-label={t.label}
              aria-current={tab === t.id ? 'page' : undefined}
            >
              <Icon strokeWidth={2} />
              {t.label}
            </button>
          );
        })}
        <button className="side-nav-fab"
          onClick={() => setSheet({ kind: 'habit', habit: null })}
          aria-label="New habit"
        >
          <Plus strokeWidth={2.5} />
          New Habit
        </button>
      </nav>

      <div className="app">
        <div className="screen-transition" key={key}>{screen}</div>
        {tab !== 'tap' && (
          <BottomNav tab={tab} onChange={goTab}
            onFab={tab === 'home' ? () => setSheet({ kind: 'habit', habit: null }) : undefined}
          />
        )}
      </div>

      {/* ── All sheets/modals rendered at root — always above nav ── */}

      {sheet?.kind === 'habit' && (
        <HabitSheet habit={sheet.habit} allHabits={data.habits}
          onClose={() => setSheet(null)}
          onSave={(next) => { upsertHabit(next); setSheet(null); }}
        />
      )}

      {sheet?.kind === 'logDetails' && (() => {
        const habit = sheet.habit
          ? data.habits.find((h) => h.id === sheet.habit.id) || sheet.habit
          : data.habits.find((h) => h.id === sheet.habitId);
        const log = sheet.log
          ? habit?.logs.find((l) => l.id === sheet.log.id) || sheet.log
          : habit?.logs.find((l) => l.id === sheet.logId);
        if (!habit || !log) return null;
        return (
          <LogDetailsSheet habit={habit} log={log} prefs={data.prefs} allHabits={data.habits}
            onClose={() => setSheet(null)}
            onSave={(nextLog) => { updateLog(habit.id, nextLog); setSheet(null); }}
          />
        );
      })()}

      {sheet?.kind === 'habitOptions' && (
        <HabitOptionsSheet habit={sheet.habit}
          onClose={() => setSheet(null)}
          onEdit={() => setSheet({ kind: 'habit', habit: sheet.habit })}
          onDelete={() => setSheet({
            kind: 'confirm',
            title: 'Delete habit',
            body: `Permanently delete "${sheet.habit.name}" and all its logs?`,
            fn: () => { deleteHabit(sheet.habit.id); if (currentHabitId === sheet.habit.id) goBackFromTap(); },
          })}
        />
      )}

      {sheet?.kind === 'confirm' && (
        <ConfirmSheet title={sheet.title} body={sheet.body}
          onClose={() => setSheet(null)}
          onConfirm={() => { sheet.fn?.(); setSheet(null); }}
        />
      )}

      {sheet?.kind === 'alert' && (
        <AlertSheet title={sheet.title} body={sheet.body} onClose={() => setSheet(null)} />
      )}

      {/* Settings modals — rendered last so they're on top of everything */}
      <SettingsModals
        modal={settingsModal}
        modalMeta={settingsModalMeta}
        onClose={handleCloseSettingsModal}
        prefs={data.prefs}
        setPrefs={setPrefs}
      />
    </>
  );
}

function Splash({ hidden }) {
  return (
    <div className={`splash ${hidden ? 'hide' : ''}`}>
      <div className="splash-icon">
        <svg width="60" height="60" viewBox="0 0 160 160" fill="none">
          <rect x="77" y="96" width="6" height="34" rx="3" fill="#f4f0e8" opacity="0.92"/>
          <path d="M80 95 C60 85 44 62 52 40 C60 18 80 30 80 52 Z" fill="#f4f0e8" opacity="0.92"/>
          <path d="M80 95 C100 82 116 58 106 38 C96 18 80 32 80 54 Z" fill="#f4f0e8" opacity="0.55"/>
          <circle cx="80" cy="122" r="20" stroke="#f4f0e8" strokeWidth="2.5" opacity="0.16"/>
          <circle cx="80" cy="122" r="30" stroke="#f4f0e8" strokeWidth="1.2" opacity="0.07"/>
        </svg>
      </div>
      <div className="splash-name">Sprout</div>
      <div className="splash-tag">grow what you tend</div>
    </div>
  );
}
