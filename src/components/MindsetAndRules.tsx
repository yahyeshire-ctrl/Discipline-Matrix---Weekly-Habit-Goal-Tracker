import React from 'react';
import { MatrixData } from '../types';
import { Target, Compass, Flame, ShieldAlert, Sparkles, BookCheck, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface MindsetAndRulesProps {
  data: MatrixData;
}

export const MindsetAndRules: React.FC<MindsetAndRulesProps> = ({ data }) => {
  return (
    <div className="space-y-6" id="mindset-and-rules-section">
      {/* 3 Grid Cards: Objectives, Modus Operandi, Motivational Statements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Weekly Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Weekly Objectives & Goals</h3>
                <p className="text-[11px] text-indigo-300/80">Primary Operational Targets</p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              {data.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Card 2: Modus Operandi (M.O) Protocols */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Modus Operandi (M.O)</h3>
                <p className="text-[11px] text-emerald-300/80">Execution Rules & Iron Laws</p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              {data.modusOperandi.map((mo, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-snug text-slate-200">{mo}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Card 3: Motivational Statements (MS) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Motivational Mantras</h3>
                <p className="text-[11px] text-amber-300/80">Warrior Identity & Conviction</p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              {data.motivationalStatements.map((ms, i) => (
                <li key={i} className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500/10 to-transparent p-2.5 rounded-xl border border-amber-500/20">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-amber-200 tracking-wide">"{ms}"</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Prop Firm Passing Roadmap Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold text-slate-100">$21,000 Prop Firm Challenge Blueprint</h4>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Target: 5% = $1,050.00 / 3 Weeks Roadmap
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Phase 1 (Week 1)</span>
            <p className="text-slate-200 font-medium">Risk 0.5% per trade • Enforce Bad Habit #2 rule (Strict SL/TP)</p>
            <span className="text-[11px] font-mono text-emerald-400 font-bold block pt-1">Status: Passed Phase 1 Target</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Phase 2 (Week 2)</span>
            <p className="text-slate-200 font-medium">Protect capital buffer • Never oversize on volatile news</p>
            <span className="text-[11px] font-mono text-cyan-400 font-bold block pt-1">Status: Active Execution</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Funded Account (Week 3)</span>
            <p className="text-slate-200 font-medium">Bi-weekly profit splits • Compound growth into Somali United Trade</p>
            <span className="text-[11px] font-mono text-indigo-400 font-bold block pt-1">Target: $21,000 Live Account</span>
          </div>
        </div>
      </div>
    </div>
  );
};
