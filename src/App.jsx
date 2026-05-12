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
import { loadData, saveData } from './lib/storage.js';
import { applyTheme } from './lib/theme.js';
import { normLog } from './lib/util.js';

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [tab, setTab] = useState('home');
  const [currentHabitId, setCurrentHabitId] = useState(null);
  const [backTab, setBackTab] = useState('home');
  const [sheet, setSheet] = useState(null);
  const [splashHidden, setSplashHidden] = useState(false);

  // Persist on changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Apply theme on pref changes
  useEffect(() => {
    applyTheme(data.prefs);
  }, [data.prefs]);

  // Splash fade out
  useEffect(() => {
    const t = setTimeout(() => setSplashHidden(true), 280);
    return () => clearTimeout(t);
  }, []);

  const setPrefs = useCallback((next) => {
    setData((d) => ({ ...d, prefs: next }));
  }, []);

  // ── Habit operations ──
  const upsertHabit = useCallback((next) => {
    setData((d) => {
      const exists = d.habits.some((h) => h.id === next.id);
      const habits = exists
        ? d.habits.map((h) => (h.id === next.id ? next : h))
        : [...d.habits, next];
      return { ...d, habits };
    });
  }, []);

  const deleteHabit = useCallback((id) => {
    setData((d) => ({ ...d, habits: d.habits.filter((h) => h.id !== id) }));
  }, []);

  // ── Logging ──
  const addLog = useCallback((habitId, log, opts = {}) => {
    const normed = normLog(log);
    setData((d) => ({
      ...d,
      habits: d.habits.map((h) =>
        h.id === habitId ? { ...h, logs: [...h.logs, normed] } : h
      ),
    }));
    if (opts.openDetails) {
      // Open the details sheet on next tick so state has settled.
      // We pass the normalized log directly; the latest habit will be picked up
      // by the sheet from props since App re-renders.
      setTimeout(() => {
        setSheet((prev) => {
          // Don't stomp an already-open sheet.
          if (prev) return prev;
          // We need the up-to-date habit for the sheet's allHabits, but it will
          // get the freshest copy from App's state via the prop passed below.
          // So we just stash the ids and resolve at render time.
          return { kind: 'logDetails', habitId, logId: normed.id };
        });
      }, 30);
    }
  }, []);

  const updateLog = useCallback((habitId, nextLog) => {
    setData((d) => ({
      ...d,
      habits: d.habits.map((h) =>
        h.id === habitId
          ? { ...h, logs: h.logs.map((l) => (l.id === nextLog.id ? nextLog : l)) }
          : h
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

  // ── Sheet helpers ──
  const onAlert = useCallback((title, body) => {
    setSheet({ kind: 'alert', title, body });
  }, []);
  const onConfirm = useCallback((title, body, fn) => {
    setSheet({ kind: 'confirm', title, body, fn });
  }, []);

  // ── Tab navigation ──
  const goTab = (t) => {
    setTab(t);
    setCurrentHabitId(null);
  };
  const openHabit = (h) => {
    setBackTab(tab);
    setCurrentHabitId(h.id);
    setTab('tap');
  };
  const goBackFromTap = () => {
    setCurrentHabitId(null);
    setTab(backTab || 'home');
  };

  const currentHabit = currentHabitId
    ? data.habits.find((h) => h.id === currentHabitId)
    : null;

  // If we navigated to tap but the habit was deleted, bounce back
  useEffect(() => {
    if (tab === 'tap' && !currentHabit) {
      setTab(backTab || 'home');
    }
  }, [tab, currentHabit, backTab]);

  // ── Render the active screen ──
  let screen;
  if (tab === 'home') {
    screen = (
      <HomeScreen
        habits={data.habits}
        prefs={data.prefs}
        setPrefs={setPrefs}
        onOpenHabit={openHabit}
        onLongPressHabit={(h) => setSheet({ kind: 'habitOptions', habit: h })}
        onNewHabit={() => setSheet({ kind: 'habit', habit: null })}
      />
    );
  } else if (tab === 'tap' && currentHabit) {
    screen = (
      <TapScreen
        habit={currentHabit}
        habits={data.habits}
        prefs={data.prefs}
        onBack={goBackFromTap}
        onLog={addLog}
        onUpdateHabit={upsertHabit}
        onEditLog={(habit, log) => setSheet({ kind: 'logDetails', habit, log })}
        onDeleteLogRequested={(habit, log) =>
          onConfirm(
            'Delete log',
            'Remove this entry? This cannot be undone.',
            () => deleteLog(habit.id, log.id)
          )
        }
        onLongPressHabit={(h) => setSheet({ kind: 'habitOptions', habit: h })}
        onAlert={onAlert}
        onConfirm={onConfirm}
      />
    );
  } else if (tab === 'insights') {
    screen = (
      <AnalyticsScreen
        habits={data.habits}
        prefs={data.prefs}
        onEditLog={(habit, log) => setSheet({ kind: 'logDetails', habit, log })}
        onDeleteLogRequested={(habit, log) =>
          onConfirm('Delete log', 'Remove this entry?', () => deleteLog(habit.id, log.id))
        }
      />
    );
  } else if (tab === 'settings') {
    screen = (
      <SettingsScreen
        data={data}
        prefs={data.prefs}
        setPrefs={setPrefs}
        setData={setData}
        onAlert={onAlert}
        onConfirm={onConfirm}
      />
    );
  }

  return (
    <>
      <Splash hidden={splashHidden} />
      <div className="app">
        {screen}
        {tab !== 'tap' && (
          <BottomNav
            tab={tab}
            onChange={goTab}
            onFab={tab === 'home' ? () => setSheet({ kind: 'habit', habit: null }) : undefined}
          />
        )}
      </div>

      {/* Sheets */}
      {sheet?.kind === 'habit' && (
        <HabitSheet
          habit={sheet.habit}
          allHabits={data.habits}
          onClose={() => setSheet(null)}
          onSave={(next) => {
            upsertHabit(next);
            setSheet(null);
          }}
        />
      )}

      {sheet?.kind === 'logDetails' && (() => {
        // The sheet stores either {habit, log} (legacy direct refs from edits) or
        // {habitId, logId} (post-tap with deferred resolution). Resolve to fresh refs.
        const habit = sheet.habit
          ? data.habits.find((h) => h.id === sheet.habit.id) || sheet.habit
          : data.habits.find((h) => h.id === sheet.habitId);
        const log = sheet.log
          ? habit?.logs.find((l) => l.id === sheet.log.id) || sheet.log
          : habit?.logs.find((l) => l.id === sheet.logId);
        if (!habit || !log) return null;
        return (
          <LogDetailsSheet
            habit={habit}
            log={log}
            prefs={data.prefs}
            allHabits={data.habits}
            onClose={() => setSheet(null)}
            onSave={(nextLog) => {
              updateLog(habit.id, nextLog);
              setSheet(null);
            }}
          />
        );
      })()}

      {sheet?.kind === 'habitOptions' && (
        <HabitOptionsSheet
          habit={sheet.habit}
          onClose={() => setSheet(null)}
          onEdit={() => setSheet({ kind: 'habit', habit: sheet.habit })}
          onDelete={() =>
            setSheet({
              kind: 'confirm',
              title: 'Delete habit',
              body: `Permanently delete "${sheet.habit.name}" and all its logs?`,
              fn: () => {
                deleteHabit(sheet.habit.id);
                if (currentHabitId === sheet.habit.id) goBackFromTap();
              },
            })
          }
        />
      )}

      {sheet?.kind === 'confirm' && (
        <ConfirmSheet
          title={sheet.title}
          body={sheet.body}
          onClose={() => setSheet(null)}
          onConfirm={() => sheet.fn && sheet.fn()}
        />
      )}

      {sheet?.kind === 'alert' && (
        <AlertSheet
          title={sheet.title}
          body={sheet.body}
          onClose={() => setSheet(null)}
        />
      )}
    </>
  );
}

function Splash({ hidden }) {
  return (
    <div className={`splash ${hidden ? 'hide' : ''}`}>
      <img src="./icons/splash-logo.png" alt="Sprout" />
      <div className="splash-name">Sprout</div>
      <div className="splash-tag">grow what you tend</div>
    </div>
  );
}
