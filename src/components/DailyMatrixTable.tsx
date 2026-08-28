import React, { useState } from 'react';
import { HabitItem, HabitCategory, DayKey, DAY_KEYS, DAY_NAMES, MatrixData } from '../types';
import { 
  Check, 
  X, 
  Minus, 
  Sparkles, 
  Activity, 
  TrendingUp, 
  BookOpen, 
  Filter, 
  RotateCcw,
  CheckCircle,
  Calendar,
  Layers,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChime } from '../utils/audio';

interface DailyMatrixTableProps {
  data: MatrixData;
  onUpdateHabit?: (habitId: string, day: DayKey, newValue: number | '' | 0 | 1) => void;
  onResetToLive?: () => void;
  hasLocalChanges?: boolean;
}

const CATEGORY_CONFIG: Record<HabitCategory, { label: string; icon: React.ReactNode; color: string; badgeBg: string; borderColor: string }> = {
  Spiritual: {
    label: 'Spiritual Discipline',
    icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    borderColor: 'border-purple-500/30',
  },
  Health: {
    label: 'Health & Toughness',
    icon: <Activity className="w-4 h-4 text-cyan-400" />,
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    borderColor: 'border-cyan-500/30',
  },
  Trading: {
    label: 'Trading & Prop Firm Operation',
    icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    borderColor: 'border-emerald-500/30',
  },
  Skills: {
    label: 'Skills, Work & Relationships',
    icon: <BookOpen className="w-4 h-4 text-amber-400" />,
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    borderColor: 'border-amber-500/30',
  },
};

export const DailyMatrixTable: React.FC<DailyMatrixTableProps> = ({
  data,
  onUpdateHabit,
  onResetToLive,
  hasLocalChanges = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDayFocus, setSelectedDayFocus] = useState<DayKey | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleCellClick = (habit: HabitItem, day: DayKey) => {
    if (!onUpdateHabit) return;

    const currentVal = habit.dayValues[day];
    let nextVal: number | '' | 0 | 1;

    // Cycle: '' / 0 -> 1 -> ''
    if (currentVal === 1) {
      nextVal = '';
      playChime('tick');
    } else {
      nextVal = 1;
      playChime('success');
      // Confetti burst for high achievement
      if (habit.weeklyActual + 1 >= habit.weeklyTarget) {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#10b981', '#38bdf8', '#fbbf24'],
        });
      }
    }

    onUpdateHabit(habit.id, day, nextVal);
  };

  // Group habits
  const categories: HabitCategory[] = ['Spiritual', 'Health', 'Trading', 'Skills'];

  const filteredHabits = data.habits.filter(habit => {
    const matchesCategory = selectedCategory === 'all' || habit.category === selectedCategory;
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4" id="daily-matrix-container">
      {/* Controls Bar: Search, Category Filters, Day selector, Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 backdrop-blur-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All Disciplines ({data.habits.length})
          </button>

          {categories.map(cat => {
            const count = data.habits.filter(h => h.category === cat).length;
            const config = CATEGORY_CONFIG[cat];
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-100 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {config.icon}
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Reset */}
        <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search habits..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {hasLocalChanges && (
            <button
              onClick={onResetToLive}
              title="Reset matrix back to Google Sheet live data"
              className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[760px]" id="matrix-table">
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="py-3.5 px-4 sticky left-0 z-20 bg-slate-950/95 backdrop-blur w-72">
                  Habit / Operation Item
                </th>
                {DAY_KEYS.map(dayKey => (
                  <th key={dayKey} className="py-3.5 px-2 text-center w-14">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-slate-200">{dayKey.toUpperCase()}</span>
                      <span className="text-[9px] text-slate-500 font-mono lowercase">{DAY_NAMES[dayKey].slice(0, 3)}</span>
                    </div>
                  </th>
                ))}
                <th className="py-3.5 px-2 text-center w-16 text-slate-300">Actual</th>
                <th className="py-3.5 px-2 text-center w-16 text-slate-400">Target</th>
                <th className="py-3.5 px-3 text-right w-24 text-emerald-400">Score %</th>
              </tr>
            </thead>

            {/* Table Body Grouped by Category */}
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {categories.map(cat => {
                const catHabits = filteredHabits.filter(h => h.category === cat);
                if (catHabits.length === 0) return null;

                const catConfig = CATEGORY_CONFIG[cat];
                const isCollapsed = collapsedCategories[cat];
                const catActual = catHabits.reduce((sum, h) => sum + h.weeklyActual, 0);
                const catTarget = catHabits.reduce((sum, h) => sum + h.weeklyTarget, 0);
                const catScore = catTarget > 0 ? ((catActual / catTarget) * 100).toFixed(1) : '100';

                return (
                  <React.Fragment key={cat}>
                    {/* Category Header Row */}
                    <tr className="bg-slate-950/60 border-y border-slate-800/80">
                      <td colSpan={11} className="py-2 px-4">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleCategoryCollapse(cat)}
                            className="flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white transition-colors"
                          >
                            {catConfig.icon}
                            <span>{catConfig.label}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({catHabits.length} habits)</span>
                          </button>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400">
                              {catActual} / {catTarget} pts
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${catConfig.badgeBg}`}>
                              {catScore}%
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Habit Rows */}
                    {!isCollapsed &&
                      catHabits.map((habit, idx) => {
                        const isScoreHigh = habit.percentage >= 85;
                        const isScoreLow = habit.percentage < 60;
                        const isBad = habit.isBadHabit;

                        return (
                          <tr
                            key={habit.id}
                            className={`hover:bg-slate-800/40 transition-colors group ${
                              isBad ? 'bg-slate-950/30' : ''
                            }`}
                          >
                            {/* Habit Name Column (Sticky left on horizontal scroll) */}
                            <td className="py-3 px-4 sticky left-0 z-10 bg-slate-900/95 group-hover:bg-slate-850 backdrop-blur border-r border-slate-800/40">
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {isBad && (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                        Bad #{habit.badHabitNumber || ''}
                                      </span>
                                    )}
                                    <span className={`font-medium ${isBad ? 'text-rose-200' : 'text-slate-200'}`}>
                                      {habit.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Daily Checkbox Indicators (Sa -> Fr) */}
                            {DAY_KEYS.map(dayKey => {
                              const val = habit.dayValues[dayKey];
                              const isCompleted = val === 1;
                              const isExplicitZero = val === 0;
                              const isEmpty = val === '' || val === undefined;

                              return (
                                <td
                                  key={dayKey}
                                  onClick={() => handleCellClick(habit, dayKey)}
                                  className="py-2.5 px-2 text-center cursor-pointer hover:bg-slate-800/80 transition-colors"
                                  title={`Click to toggle ${habit.name} for ${DAY_NAMES[dayKey]}`}
                                >
                                  <div className="flex items-center justify-center">
                                    {isCompleted ? (
                                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20 transition-transform active:scale-90">
                                        <Check className="w-4 h-4 stroke-[3]" />
                                      </div>
                                    ) : isExplicitZero ? (
                                      <div className="w-7 h-7 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500">
                                        <Minus className="w-3.5 h-3.5" />
                                      </div>
                                    ) : (
                                      <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400/80 hover:border-rose-500 hover:text-rose-300 transition-all">
                                        <X className="w-4 h-4 stroke-[2.5]" />
                                      </div>
                                    )}
                                  </div>
                                </td>
                              );
                            })}

                            {/* Actual */}
                            <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-200">
                              {habit.weeklyActual}
                            </td>

                            {/* Target */}
                            <td className="py-2.5 px-2 text-center font-mono text-slate-400">
                              {habit.weeklyTarget}
                            </td>

                            {/* Percentage with visual bar badge */}
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <span
                                  className={`font-mono font-bold text-xs ${
                                    isScoreHigh
                                      ? 'text-emerald-400'
                                      : isScoreLow
                                      ? 'text-rose-400'
                                      : 'text-amber-400'
                                  }`}
                                >
                                  {habit.percentage}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </tbody>

            {/* Table Footer: Daily Achieved, Daily Target, and Daily Percentage Totals */}
            <tfoot className="border-t-2 border-slate-700 bg-slate-950 font-semibold text-xs">
              {/* Row 1: Daily Achieved */}
              <tr className="border-b border-slate-800">
                <td className="py-3 px-4 sticky left-0 z-20 bg-slate-950 text-slate-300 font-bold uppercase tracking-wider text-[11px] border-r border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Actual Daily Achieved</span>
                  </div>
                </td>
                {data.dailyTotals.map(dt => (
                  <td key={dt.day} className="py-3 px-2 text-center font-mono font-bold text-emerald-400">
                    {dt.actual}
                  </td>
                ))}
                <td className="py-3 px-2 text-center font-mono font-bold text-emerald-400 bg-slate-900/50">
                  {data.weeklyActualTotal}
                </td>
                <td className="py-3 px-2 text-center font-mono text-slate-400 bg-slate-900/50">
                  {data.weeklyTargetTotal}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400 bg-slate-900/50">
                  {data.weeklyExecutionScore}%
                </td>
              </tr>

              {/* Row 2: Daily Target */}
              <tr className="border-b border-slate-800 text-slate-400">
                <td className="py-2.5 px-4 sticky left-0 z-20 bg-slate-950 text-slate-400 text-[11px] border-r border-slate-800/50">
                  Daily Target
                </td>
                {data.dailyTotals.map(dt => (
                  <td key={dt.day} className="py-2.5 px-2 text-center font-mono text-slate-400">
                    {dt.target}
                  </td>
                ))}
                <td className="py-2.5 px-2 text-center font-mono text-slate-400 bg-slate-900/50">
                  {data.weeklyTargetTotal}
                </td>
                <td className="py-2.5 px-2 text-center font-mono text-slate-400 bg-slate-900/50">-</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-400 bg-slate-900/50">-</td>
              </tr>

              {/* Row 3: Daily Execution Percentage */}
              <tr className="bg-slate-900/90 text-slate-100">
                <td className="py-3 px-4 sticky left-0 z-20 bg-slate-950 text-slate-100 font-bold uppercase tracking-wider text-[11px] border-r border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>Daily Execution %</span>
                  </div>
                </td>
                {data.dailyTotals.map(dt => {
                  const pct = dt.percentage;
                  const isHigh = pct >= 90;
                  const isMid = pct >= 75 && pct < 90;
                  return (
                    <td key={dt.day} className="py-3 px-2 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded font-mono font-bold text-[11px] ${
                          isHigh
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : isMid
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {pct}%
                      </span>
                    </td>
                  );
                })}
                <td colSpan={3} className="py-3 px-3 text-right bg-slate-950 font-mono font-extrabold text-sm text-emerald-400">
                  Weekly Avg: {data.weeklyExecutionScore}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
