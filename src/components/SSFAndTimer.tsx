import React, { useState, useEffect, useRef } from 'react';
import { SSFLedgerBlock, SSFStatus, HabitCategory } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Zap, 
  Target, 
  Flag, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Clock, 
  Flame,
  Award,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { playChime } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SSFAndTimerProps {
  onSyncDailyHabit?: (category: HabitCategory) => void;
}

const DEFAULT_SCHEDULE_BLOCKS: SSFLedgerBlock[] = [
  {
    id: 'block-1',
    timeSlot: '03:55 – 04:45',
    title: 'Salatu Leyl, Tahajjud & Adkar',
    category: 'Spiritual',
    status: 'finish',
    notes: 'Wake up 3:55 AM on alarm, mindfulness',
    focusScore: 9,
  },
  {
    id: 'block-2',
    timeSlot: '04:45 – 05:30',
    title: 'Masjid Morning Prayer (Fajr) & Khushuuc',
    category: 'Spiritual',
    status: 'finish',
    notes: 'In congregation, deep presence',
    focusScore: 10,
  },
  {
    id: 'block-3',
    timeSlot: '05:30 – 06:15',
    title: '30m Quran Study + Juz 1 Reading',
    category: 'Spiritual',
    status: 'finish',
    notes: 'Active recitation, preventing sleep after Fajar',
    focusScore: 9,
  },
  {
    id: 'block-4',
    timeSlot: '06:15 – 07:15',
    title: '30m Running / Outdoor Walk + Pushups & Plank',
    category: 'Health',
    status: 'finish',
    notes: '20 pushups, 3 min plank completed',
    focusScore: 8,
  },
  {
    id: 'block-5',
    timeSlot: '07:30 – 08:30',
    title: 'Duha Prayer (8 Rakaat) & Meditation',
    category: 'Spiritual',
    status: 'finish',
    notes: 'Mindful stillness before market opens',
    focusScore: 9,
  },
  {
    id: 'block-6',
    timeSlot: '08:30 – 11:30',
    title: 'Trading & Prop Firm Challenge ($21k Account)',
    category: 'Trading',
    status: 'steady',
    notes: 'Bad Habit #2 Rule: Strict SL/TP, no early exit, 60/10 rhythm',
    focusScore: 10,
  },
  {
    id: 'block-7',
    timeSlot: '11:30 – 13:00',
    title: 'Crypto Trading & Backtesting 1:30',
    category: 'Trading',
    status: 'swift',
    notes: 'Testing setups and mechanical executions',
    focusScore: 8,
  },
  {
    id: 'block-8',
    timeSlot: '13:00 – 14:30',
    title: 'Somali United Trade: Sales & Accounting',
    category: 'Skills',
    status: 'pending',
    notes: 'Client follow-ups and ledger review',
    focusScore: 8,
  },
  {
    id: 'block-9',
    timeSlot: '14:30 – 15:30',
    title: 'Google Project Management & Online Training',
    category: 'Skills',
    status: 'pending',
    notes: '1-hour skill building',
    focusScore: 8,
  },
  {
    id: 'block-10',
    timeSlot: '15:30 – 16:30',
    title: 'Reading Books (1 hour) & Dev Skills',
    category: 'Skills',
    status: 'pending',
    notes: 'High leverage learning',
    focusScore: 8,
  },
  {
    id: 'block-11',
    timeSlot: '16:30 – 17:30',
    title: 'Arabic Study (15m) & AI Productivity Workflow',
    category: 'Skills',
    status: 'pending',
    notes: 'Language drills and AI prompts',
    focusScore: 8,
  },
  {
    id: 'block-12',
    timeSlot: '17:30 – 18:30',
    title: 'Family & Wife Communication (15m min - NMT applied)',
    category: 'Skills',
    status: 'pending',
    notes: 'Quality presence and connection',
    focusScore: 9,
  },
  {
    id: 'block-13',
    timeSlot: '20:30 – 21:15',
    title: 'Evening Goal Review & Next-Day List (M.O Protocol)',
    category: 'Skills',
    status: 'pending',
    notes: 'Review daily targets, set 03:55 AM alarm',
    focusScore: 9,
  },
];

export const SSFAndTimer: React.FC<SSFAndTimerProps> = () => {
  // Timer States
  const [timerMode, setTimerMode] = useState<'focus' | 'rest'>('focus');
  const [focusDuration, setFocusDuration] = useState<number>(60); // minutes
  const [restDuration, setRestDuration] = useState<number>(10); // minutes
  const [timeLeft, setTimeLeft] = useState<number>(60 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // SSF Ledger States
  const [ledgerBlocks, setLedgerBlocks] = useState<SSFLedgerBlock[]>(() => {
    try {
      const saved = localStorage.getItem('discipline_matrix_ssf_blocks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SCHEDULE_BLOCKS;
  });

  const [newBlockTime, setNewBlockTime] = useState('');
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockCategory, setNewBlockCategory] = useState<HabitCategory>('Trading');
  const [showAddBlock, setShowAddBlock] = useState(false);

  // Save ledger to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('discipline_matrix_ssf_blocks', JSON.stringify(ledgerBlocks));
    } catch {}
  }, [ledgerBlocks]);

  // Timer Tick Loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timerMode, focusDuration, restDuration, soundEnabled]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (soundEnabled) {
      playChime('complete');
    }

    if (timerMode === 'focus') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      });
      setCompletedSessionsCount(prev => prev + 1);
      // Auto switch to rest
      setTimerMode('rest');
      setTimeLeft(restDuration * 60);
    } else {
      // Auto switch to focus
      setTimerMode('focus');
      setTimeLeft(focusDuration * 60);
    }
  };

  const toggleTimer = () => {
    if (!isRunning) {
      if (soundEnabled) {
        playChime(timerMode === 'focus' ? 'focus_start' : 'rest_start');
      }
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerMode === 'focus' ? focusDuration * 60 : restDuration * 60);
  };

  const switchMode = (mode: 'focus' | 'rest') => {
    setIsRunning(false);
    setTimerMode(mode);
    setTimeLeft(mode === 'focus' ? focusDuration * 60 : restDuration * 60);
    if (soundEnabled) {
      playChime(mode === 'focus' ? 'focus_start' : 'rest_start');
    }
  };

  const selectPreset = (focus: number, rest: number) => {
    setIsRunning(false);
    setFocusDuration(focus);
    setRestDuration(rest);
    setTimeLeft(timerMode === 'focus' ? focus * 60 : rest * 60);
  };

  // SSF Status Cycle: pending -> swift -> steady -> finish -> missed -> pending
  const updateBlockStatus = (id: string, newStatus: SSFStatus) => {
    setLedgerBlocks(prev =>
      prev.map(b => {
        if (b.id === id) {
          if (newStatus === 'finish') {
            if (soundEnabled) playChime('success');
            confetti({
              particleCount: 20,
              spread: 40,
              origin: { y: 0.8 },
            });
          } else {
            if (soundEnabled) playChime('tick');
          }
          return {
            ...b,
            status: newStatus,
            completedAt: newStatus === 'finish' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : b.completedAt,
          };
        }
        return b;
      })
    );
  };

  const updateBlockNotes = (id: string, notes: string) => {
    setLedgerBlocks(prev => prev.map(b => (b.id === id ? { ...b, notes } : b)));
  };

  const addNewBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockTitle.trim()) return;

    const newBlock: SSFLedgerBlock = {
      id: `block-custom-${Date.now()}`,
      timeSlot: newBlockTime || `${new Date().getHours()}:00 – ${new Date().getHours() + 1}:00`,
      title: newBlockTitle.trim(),
      category: newBlockCategory,
      status: 'pending',
      notes: '',
      focusScore: 8,
    };

    setLedgerBlocks(prev => [...prev, newBlock]);
    setNewBlockTitle('');
    setNewBlockTime('');
    setShowAddBlock(false);
  };

  const deleteBlock = (id: string) => {
    setLedgerBlocks(prev => prev.filter(b => b.id !== id));
  };

  // Format time MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalCurrentDuration = (timerMode === 'focus' ? focusDuration : restDuration) * 60;
  const progressPercent = totalCurrentDuration > 0 ? ((totalCurrentDuration - timeLeft) / totalCurrentDuration) * 100 : 0;

  // SSF Stats
  const finishCount = ledgerBlocks.filter(b => b.status === 'finish').length;
  const swiftCount = ledgerBlocks.filter(b => b.status === 'swift').length;
  const steadyCount = ledgerBlocks.filter(b => b.status === 'steady').length;
  const missedCount = ledgerBlocks.filter(b => b.status === 'missed').length;
  const totalBlocks = ledgerBlocks.length;
  const executionPercent = totalBlocks > 0 ? Math.round(((finishCount + swiftCount + steadyCount) / totalBlocks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="ssf-and-timer-section">
      {/* LEFT COLUMN: 60/10 Focus / Rest Timer (4 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-sm relative overflow-hidden" id="focus-timer-card">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">60/10 Session Timer</h3>
                <p className="text-[11px] text-slate-400">Modus Operandi: 60m Work / 10m Refuel</p>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                soundEnabled
                  ? 'bg-slate-800 border-slate-700 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
              title={soundEnabled ? 'Audio alerts active' : 'Audio muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => switchMode('focus')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                timerMode === 'focus'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Focus Mode ({focusDuration}m)
            </button>
            <button
              onClick={() => switchMode('rest')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                timerMode === 'rest'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Refuel Rest ({restDuration}m)
            </button>
          </div>

          {/* Timer Display with Dynamic Circular SVG */}
          <div className="my-6 flex flex-col items-center justify-center relative">
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Outer Ring */}
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  className={timerMode === 'focus' ? 'stroke-emerald-400' : 'stroke-cyan-400'}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 85}
                  strokeDashoffset={2 * Math.PI * 85 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-5xl font-extrabold font-mono tracking-tight ${
                  timerMode === 'focus' ? 'text-white' : 'text-cyan-300'
                }`}>
                  {formattedTime}
                </span>
                <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mt-1">
                  {timerMode === 'focus' ? 'Trading / Deep Work' : 'Refuel & Stretch'}
                </span>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Session #{completedSessionsCount + 1}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={resetTimer}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all active:scale-95"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleTimer}
                className={`px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                  isRunning
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                    : timerMode === 'focus'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    Pause Session
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    Start {timerMode === 'focus' ? '60m Focus' : '10m Rest'}
                  </>
                )}
              </button>

              <button
                onClick={() => switchMode(timerMode === 'focus' ? 'rest' : 'focus')}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all active:scale-95"
                title="Skip to next mode"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Execution Presets
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => selectPreset(60, 10)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                  focusDuration === 60 && restDuration === 10
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                60/10 (Standard)
              </button>
              <button
                onClick={() => selectPreset(30, 5)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                  focusDuration === 30 && restDuration === 5
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                30/5 (Rapid Review)
              </button>
              <button
                onClick={() => selectPreset(90, 15)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                  focusDuration === 90 && restDuration === 15
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                90/15 (Intense)
              </button>
            </div>
          </div>
        </div>

        {/* Quick Mindset / M.O Rule Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 backdrop-blur-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Target className="w-4 h-4 text-amber-400" />
            <span>M.O Focus Rule: Minimum Effective Dose</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            "Work at your best for sixty minutes straight with no interruption. Refuel for ten minutes — start again for 60 minutes. Never miss twice."
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Hourly SSF Ledger Block (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-sm" id="hourly-ssf-ledger">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Hourly SSF Execution Ledger</h3>
                  <p className="text-[11px] text-slate-400">Swift ⚡ • Steady 🎯 • Finish 🏁 Protocol</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
                {finishCount}/{totalBlocks} Complete ({executionPercent}%)
              </span>
              <button
                onClick={() => setShowAddBlock(!showAddBlock)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1 font-sans text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Block
              </button>
            </div>
          </div>

          {/* Add Block Form */}
          {showAddBlock && (
            <form onSubmit={addNewBlock} className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="text-xs font-bold text-slate-300">Add New Hourly Ledger Block</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="e.g. 14:00 – 15:00"
                  value={newBlockTime}
                  onChange={e => setNewBlockTime(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Block Title / Task..."
                  value={newBlockTitle}
                  onChange={e => setNewBlockTitle(e.target.value)}
                  className="sm:col-span-2 px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Category:</span>
                  {(['Spiritual', 'Health', 'Trading', 'Skills'] as HabitCategory[]).map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setNewBlockCategory(cat)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        newBlockCategory === cat
                          ? 'bg-slate-100 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBlock(false)}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* SSF Explanation Legend */}
          <div className="grid grid-cols-4 gap-2 my-3 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px]">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Zap className="w-3.5 h-3.5" />
              <span className="font-bold">Swift:</span>
              <span className="text-slate-400 hidden sm:inline">Zero hesitation</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Target className="w-3.5 h-3.5" />
              <span className="font-bold">Steady:</span>
              <span className="text-slate-400 hidden sm:inline">SL/TP rule</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Flag className="w-3.5 h-3.5" />
              <span className="font-bold">Finish:</span>
              <span className="text-slate-400 hidden sm:inline">Clean close</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="font-bold">Missed:</span>
              <span className="text-slate-400 hidden sm:inline">NMT recovery</span>
            </div>
          </div>

          {/* Ledger Blocks List */}
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
            {ledgerBlocks.map(block => {
              const isFinished = block.status === 'finish';
              const isSwift = block.status === 'swift';
              const isSteady = block.status === 'steady';
              const isMissed = block.status === 'missed';

              return (
                <div
                  key={block.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isFinished
                      ? 'bg-slate-900 border-emerald-500/40 shadow-sm'
                      : isSwift
                      ? 'bg-slate-900 border-amber-500/40'
                      : isSteady
                      ? 'bg-slate-900 border-cyan-500/40'
                      : isMissed
                      ? 'bg-rose-950/20 border-rose-500/40'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                        {block.timeSlot}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-slate-200 truncate">{block.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400">
                            {block.category}
                          </span>
                          {block.completedAt && (
                            <span className="text-[10px] text-emerald-400 font-mono">
                              ✓ {block.completedAt}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => updateBlockStatus(block.id, 'swift')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                          isSwift
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-amber-300 hover:bg-amber-500/20'
                        }`}
                        title="Mark as Swift (fast launch, no delay)"
                      >
                        ⚡ Swift
                      </button>

                      <button
                        onClick={() => updateBlockStatus(block.id, 'steady')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                          isSteady
                            ? 'bg-cyan-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-cyan-300 hover:bg-cyan-500/20'
                        }`}
                        title="Mark as Steady (disciplined execution)"
                      >
                        🎯 Steady
                      </button>

                      <button
                        onClick={() => updateBlockStatus(block.id, 'finish')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                          isFinished
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-emerald-300 hover:bg-emerald-500/20'
                        }`}
                        title="Mark as Finish (completed clean)"
                      >
                        🏁 Finish
                      </button>

                      <button
                        onClick={() => updateBlockStatus(block.id, 'missed')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                          isMissed
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-slate-800 text-rose-400 hover:bg-rose-500/20'
                        }`}
                        title="Mark as Missed (trigger Never Miss Twice recovery)"
                      >
                        ⚠️ Missed
                      </button>

                      <button
                        onClick={() => deleteBlock(block.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-1"
                        title="Delete block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Notes / Reflection inline input */}
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">Note:</span>
                    <input
                      type="text"
                      value={block.notes}
                      onChange={e => updateBlockNotes(block.id, e.target.value)}
                      placeholder="Add reflection, trade ticket, or key win..."
                      className="w-full text-[11px] bg-transparent text-slate-300 placeholder-slate-600 focus:outline-none focus:text-slate-100"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
