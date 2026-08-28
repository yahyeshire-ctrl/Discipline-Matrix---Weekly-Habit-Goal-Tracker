import React from 'react';
import { MatrixData } from '../types';
import { ShieldCheck, AlertTriangle, Flame, TrendingUp, CheckCircle2, Award, Zap, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface TopSummaryCardsProps {
  data: MatrixData;
  onFilterBadHabit?: (habitNum: number) => void;
  onOpenTimer?: () => void;
}

export const TopSummaryCards: React.FC<TopSummaryCardsProps> = ({
  data,
  onFilterBadHabit,
  onOpenTimer,
}) => {
  const score = data.weeklyExecutionScore;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Grade classification
  const getGrade = (val: number) => {
    if (val >= 90) return { grade: 'ELITE (A+)', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
    if (val >= 80) return { grade: 'SOLID (A-)', color: 'text-teal-400', border: 'border-teal-500/30', bg: 'bg-teal-500/10' };
    if (val >= 70) return { grade: 'ACCEPTABLE (B)', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
    return { grade: 'AT RISK (C)', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' };
  };

  const gradeInfo = getGrade(score);
  const bad2 = data.badHabit2Compliance;
  const bad3 = data.badHabit3Bottleneck;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="top-summary-cards">
      {/* 1. Weekly Execution Score Card with Dynamic Circular Ring */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl shadow-slate-950/40 backdrop-blur-sm flex flex-col justify-between"
        id="weekly-execution-score-card"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">Weekly Execution</h3>
              <p className="text-sm font-semibold text-slate-200">Consistency Score</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border ${gradeInfo.bg} ${gradeInfo.color} ${gradeInfo.border}`}>
            {gradeInfo.grade}
          </span>
        </div>

        <div className="my-3 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-4xl font-extrabold tracking-tight text-white font-mono">{score}</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">%</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-emerald-400 font-semibold font-mono">{data.weeklyActualTotal}</span> completed out of{' '}
              <span className="text-slate-300 font-semibold font-mono">{data.weeklyTargetTotal}</span> target habits
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(score, 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">Target: 85%+</span>
            </div>
          </div>

          {/* SVG Animated Circular Progress Ring */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="7"
                fill="transparent"
              />
              <motion.circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-emerald-400"
                strokeWidth="7"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Award className="w-5 h-5 text-emerald-400/90 mb-0.5" />
              <span className="text-[10px] font-mono font-bold text-slate-300">WEEK 33</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Schedule: Sat – Fri</span>
          <span className="text-emerald-400 flex items-center gap-1 font-medium">
            <Zap className="w-3.5 h-3.5" /> NMT Active
          </span>
        </div>
      </motion.div>

      {/* 2. Prop Firm Risk Compliance Badge (Bad Habit #2) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-emerald-500/30 p-5 shadow-xl shadow-slate-950/40 backdrop-blur-sm flex flex-col justify-between"
        id="prop-firm-compliance-card"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">Prop Firm Risk Compliance</h3>
              <p className="text-sm font-semibold text-slate-100">Bad Habit #2: SL/TP Discipline</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> PASSING (100%)
          </span>
        </div>

        <div className="my-3 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center gap-2">
                5 / 5 Trading Days
                <span className="text-xs font-normal text-slate-400 font-sans">(Mon–Fri)</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Zero early cut wins • Strict stop loss attached • No revenge trades
              </p>
            </div>
          </div>

          {/* Days pill badge row */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Trading Log:</span>
            {['Mo', 'tu', 'we', 'th', 'fr'].map((d) => (
              <span
                key={d}
                className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold flex items-center gap-1 shadow-sm"
              >
                {d.toUpperCase()} ✓
              </span>
            ))}
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80 text-[11px] space-y-1 text-slate-300">
            <div className="flex justify-between items-center text-slate-400">
              <span>Target 5% of $21k Profarm:</span>
              <span className="font-mono text-emerald-400 font-bold">$1,050.00</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Phase 1 Passing Goal:</span>
              <span className="font-mono text-slate-200">5k Account (8% Phase 1)</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Status: Capital Protected</span>
          <button
            onClick={() => onFilterBadHabit && onFilterBadHabit(2)}
            className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold underline underline-offset-2 transition-colors"
          >
            View in Matrix →
          </button>
        </div>
      </motion.div>

      {/* 3. Bottleneck Alert Card (Bad Habit #3: Sleep after Fajar) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-rose-500/40 p-5 shadow-xl shadow-slate-950/40 backdrop-blur-sm flex flex-col justify-between"
        id="bottleneck-alert-card"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-rose-400">Critical Bottleneck</h3>
              <p className="text-sm font-semibold text-slate-100">Bad Habit #3: Sleep after Fajar</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border bg-rose-500/10 text-rose-400 border-rose-500/30 flex items-center gap-1">
            CRITICAL ({bad3.percentage}%)
          </span>
        </div>

        <div className="my-3 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold font-mono text-rose-400 flex items-baseline gap-1.5">
                {bad3.actual} / {bad3.target} Days
                <span className="text-xs font-normal text-rose-300">({bad3.percentage}% Score)</span>
              </div>
              <p className="text-xs text-rose-200/90 mt-0.5 font-medium">
                ⚠️ Sluggish wakefulness post-Fajar hurts 08:00 AM London open focus & morning momentum.
              </p>
            </div>
          </div>

          <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-2.5 text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-300 font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Tactical Recovery Protocol (M.O):</span>
            </div>
            <ul className="text-slate-300 space-y-1 pl-4 list-disc marker:text-rose-400">
              <li>03:55 AM Alarm + Salatu Leyl & Masjid Fajr</li>
              <li>Post-Fajar: 30m Quran + Outdoor Walk (No lying down)</li>
              <li>Engage SSF 60/10 timer immediately at 06:00 AM</li>
            </ul>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-rose-400 font-medium">Action: Rebuild habit</span>
          <button
            onClick={() => onOpenTimer && onOpenTimer()}
            className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            Launch 60/10 Timer ⏱
          </button>
        </div>
      </motion.div>
    </div>
  );
};
