/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MatrixData, HabitItem, DayKey, ActiveTab, DAY_KEYS } from './types';
import { fetchHabitMatrixData, parseMatrixResponse, FALLBACK_RAW_DATA } from './services/api';
import { Header } from './components/Header';
import { TopSummaryCards } from './components/TopSummaryCards';
import { DailyMatrixTable } from './components/DailyMatrixTable';
import { SSFAndTimer } from './components/SSFAndTimer';
import { MindsetAndRules } from './components/MindsetAndRules';
import { MobileNavBar } from './components/MobileNavBar';
import { Activity, RefreshCw, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [data, setData] = useState<MatrixData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [hasLocalChanges, setHasLocalChanges] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch Live Data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchHabitMatrixData();
      setData(result);
    } catch (err) {
      console.error('Failed to load matrix data:', err);
      setErrorMessage('Using cached matrix data. Could not establish live Google Apps Script connection.');
      setData(parseMatrixResponse(FALLBACK_RAW_DATA));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchHabitMatrixData();
      setData(result);
      setHasLocalChanges(false);
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Interactive toggle handler for habits in the matrix
  const handleUpdateHabit = (habitId: string, day: DayKey, newValue: number | '' | 0 | 1) => {
    if (!data) return;

    const updatedHabits = data.habits.map(h => {
      if (h.id === habitId) {
        const newDayValues = { ...h.dayValues, [day]: newValue };
        
        // Recalculate weekly actual for this habit
        let actual = 0;
        DAY_KEYS.forEach(k => {
          if (newDayValues[k] === 1) actual += 1;
        });

        const target = h.weeklyTarget || 7;
        const percentage = target > 0 ? Number(((actual / target) * 100).toFixed(1)) : 100;

        return {
          ...h,
          dayValues: newDayValues,
          weeklyActual: actual,
          percentage,
        };
      }
      return h;
    });

    // Recalculate daily totals
    const updatedDailyTotals = data.dailyTotals.map(dt => {
      let dayAchieved = 0;
      updatedHabits.forEach(h => {
        if (h.dayValues[dt.day] === 1) dayAchieved += 1;
      });
      const pct = dt.target > 0 ? Number(((dayAchieved / dt.target) * 100).toFixed(1)) : 0;
      return {
        ...dt,
        actual: dayAchieved,
        percentage: pct,
      };
    });

    const totalActual = updatedHabits.reduce((sum, h) => sum + h.weeklyActual, 0);
    const totalTarget = updatedHabits.reduce((sum, h) => sum + h.weeklyTarget, 0);
    const score = totalTarget > 0 ? Number(((totalActual / totalTarget) * 100).toFixed(1)) : 86.9;

    // Recalculate Bad Habit #2
    const bad2 = updatedHabits.find(h => h.name.toLowerCase().includes('bad habit 2') || h.badHabitNumber === 2);
    const bad2Days: DayKey[] = [];
    if (bad2) {
      DAY_KEYS.forEach(k => {
        if (bad2.dayValues[k] === 1) bad2Days.push(k);
      });
    }

    // Recalculate Bad Habit #3
    const bad3 = updatedHabits.find(h => h.name.toLowerCase().includes('bad habit 3') || h.badHabitNumber === 3);

    setData({
      ...data,
      habits: updatedHabits,
      dailyTotals: updatedDailyTotals,
      weeklyActualTotal: totalActual,
      weeklyTargetTotal: totalTarget,
      weeklyExecutionScore: score,
      badHabit2Compliance: {
        name: bad2?.name || 'Bad Habit 2 - SL/TP Discipline',
        actual: bad2?.weeklyActual ?? 5,
        target: bad2?.weeklyTarget ?? 5,
        percentage: bad2?.percentage ?? 100,
        compliantDays: bad2Days,
        passed: (bad2?.percentage ?? 100) >= 100,
      },
      badHabit3Bottleneck: {
        name: bad3?.name || 'Bad Habit 3 - Sleeping after Fajar',
        actual: bad3?.weeklyActual ?? 3,
        target: bad3?.weeklyTarget ?? 7,
        percentage: bad3?.percentage ?? 42.86,
        isCritical: (bad3?.percentage ?? 42.86) < 70,
      },
    });

    setHasLocalChanges(true);
  };

  const handleResetToLive = () => {
    loadData();
    setHasLocalChanges(false);
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-4">
        <div className="relative w-16 h-16 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center animate-pulse">
            <Activity className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-slate-100 tracking-tight">Syncing Discipline Matrix...</h2>
        <p className="text-xs text-slate-400 mt-1 text-center max-w-sm">
          Connecting to live Google Apps Script endpoint & parsing weekly habit protocols
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 pb-20 sm:pb-8">
      {/* Top Header */}
      <Header
        data={data}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8 space-y-6">
        {/* Sync notification if local changes */}
        {hasLocalChanges && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Interactive mode active — habits toggled are recalculated locally.</span>
            </div>
            <button
              onClick={handleResetToLive}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 ml-2"
            >
              Re-sync Live Data
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Feature 1: Top Summary Cards */}
              <TopSummaryCards
                data={data}
                onOpenTimer={() => setActiveTab('timer')}
              />

              {/* Feature 2: Daily Matrix Table */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
                      Weekly Discipline Schedule (Saturday – Friday)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Categorized by Spiritual, Health, Trading & Skills • Click any cell to toggle
                    </p>
                  </div>
                </div>

                <DailyMatrixTable
                  data={data}
                  onUpdateHabit={handleUpdateHabit}
                  onResetToLive={handleResetToLive}
                  hasLocalChanges={hasLocalChanges}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'timer' && (
            <motion.div
              key="timer-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Feature 3: SSF & 60/10 Focus/Rest Timer */}
              <SSFAndTimer />
            </motion.div>
          )}

          {activeTab === 'mindset' && (
            <motion.div
              key="mindset-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <MindsetAndRules data={data} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Discipline Matrix • Live Trading & Habit Command Center</span>
          <span className="font-mono text-[11px] text-slate-400">
            Last live sync: {data.lastSynced} • Script API Connected
          </span>
        </div>
      </footer>

      {/* Feature 4: Mobile Optimization Bottom Navigation (Samsung S25 Ultra) */}
      <MobileNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
<button 
  id="native-install-btn" 
  style={{ display: 'none', position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, background: '#00ff88', color: '#000', padding: '12px 20px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
  onClick={() => (window as any).triggerInstall()}
>
  Install App Natively
</button>
