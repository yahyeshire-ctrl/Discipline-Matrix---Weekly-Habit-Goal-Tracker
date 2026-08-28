export type DayKey = 'Sa' | 'Su' | 'Mo' | 'tu' | 'we' | 'th' | 'fr';

export const DAY_KEYS: DayKey[] = ['Sa', 'Su', 'Mo', 'tu', 'we', 'th', 'fr'];

export const DAY_NAMES: Record<DayKey, string> = {
  Sa: 'Saturday',
  Su: 'Sunday',
  Mo: 'Monday',
  tu: 'Tuesday',
  we: 'Wednesday',
  th: 'Thursday',
  fr: 'Friday',
};

export type HabitCategory = 'Spiritual' | 'Health' | 'Trading' | 'Skills';

export interface HabitItem {
  id: string;
  name: string;
  category: HabitCategory;
  dayValues: Record<DayKey, number | '' | 0 | 1>;
  weeklyActual: number;
  weeklyTarget: number;
  percentage: number;
  isBadHabit?: boolean;
  badHabitNumber?: number;
  isCustom?: boolean;
}

export interface CategorySummary {
  category: HabitCategory;
  actual: number;
  target: number;
  percentage: number;
  habitsCount: number;
}

export interface DailySummary {
  day: DayKey;
  label: string;
  actual: number;
  target: number;
  percentage: number;
}

export interface MatrixData {
  dateRange: string;
  objectives: string[];
  modusOperandi: string[];
  motivationalStatements: string[];
  habits: HabitItem[];
  dailyTotals: DailySummary[];
  weeklyActualTotal: number;
  weeklyTargetTotal: number;
  weeklyExecutionScore: number;
  badHabit2Compliance: {
    name: string;
    actual: number;
    target: number;
    percentage: number;
    compliantDays: DayKey[];
    passed: boolean;
  };
  badHabit3Bottleneck: {
    name: string;
    actual: number;
    target: number;
    percentage: number;
    isCritical: boolean;
  };
  lastSynced: string;
}

export type SSFStatus = 'pending' | 'swift' | 'steady' | 'finish' | 'missed';

export interface SSFLedgerBlock {
  id: string;
  timeSlot: string;
  title: string;
  category: HabitCategory;
  status: SSFStatus;
  notes: string;
  completedAt?: string;
  focusScore?: number; // 1-10
}

export type ActiveTab = 'overview' | 'matrix' | 'timer' | 'ledger' | 'mindset';
