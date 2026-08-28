import React from 'react';
import { ActiveTab, MatrixData } from '../types';
import { 
  ShieldCheck, 
  Activity, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  Grid, 
  TrendingUp, 
  Compass,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  data: MatrixData;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  data,
  activeTab,
  setActiveTab,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding & Status Row */}
        <div className="flex items-center justify-between py-3.5 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                  DISCIPLINE MATRIX
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE SYNC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden xs:block">
                Trading Operation & Habit Consistency • <span className="text-slate-300 font-mono">Week {data.dateRange || '15-08-21-2026'}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics & Refresh Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Prop firm pass indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Prop Firm: 100% (5/5 M–F)</span>
            </div>

            {/* Fajar Bottleneck warning pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Fajar Sleep: 42.8%</span>
            </div>

            {/* Execution Score Pill */}
            <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-200">
              <span className="text-slate-400 text-[11px] font-sans font-normal hidden sm:inline">Score:</span>
              <span className="text-emerald-400">{data.weeklyExecutionScore}%</span>
            </div>

            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 text-xs font-medium"
              title="Refresh from Google Apps Script endpoint"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 border-t border-slate-800/80 pt-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-emerald-400 text-white bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Dashboard & Matrix
          </button>

          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'timer'
                ? 'border-cyan-400 text-white bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            60/10 Timer & SSF Ledger
          </button>

          <button
            onClick={() => setActiveTab('mindset')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'mindset'
                ? 'border-amber-400 text-white bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            M.O Protocols & Objectives
          </button>
        </div>
      </div>
    </header>
  );
};
