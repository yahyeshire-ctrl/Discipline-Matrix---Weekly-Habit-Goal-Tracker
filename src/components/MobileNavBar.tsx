import React from 'react';
import { ActiveTab } from '../types';
import { LayoutDashboard, Clock, Compass, ShieldCheck } from 'lucide-react';

interface MobileNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-lg px-3 py-2 pb-safe" id="mobile-nav-bar">
      <div className="grid grid-cols-3 gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-emerald-400 font-bold border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-1" />
          <span className="text-[10px]">Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('timer')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === 'timer'
              ? 'bg-slate-900 text-cyan-400 font-bold border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-5 h-5 mb-1" />
          <span className="text-[10px]">60/10 SSF</span>
        </button>

        <button
          onClick={() => setActiveTab('mindset')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
            activeTab === 'mindset'
              ? 'bg-slate-900 text-amber-400 font-bold border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5 mb-1" />
          <span className="text-[10px]">M.O Rules</span>
        </button>
      </div>
    </nav>
  );
};
