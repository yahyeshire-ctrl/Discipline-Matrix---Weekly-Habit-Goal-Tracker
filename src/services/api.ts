import { HabitItem, HabitCategory, MatrixData, DayKey, DAY_KEYS, DailySummary } from '../types';

export const SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzt0X9TwjJ4iSrzPCVVK29ByKKNBh-HDLrv5cn9r6UGhQew0D5gy3wVFfNnNg870HAw/exec';

// Robust local fallback dataset matching sheet exactly in case of network or rate limits
export const FALLBACK_RAW_DATA: (string | number)[][] = [
  ["Weekly Objectives (Goals)","","","","Modus Operandi (M.O)","","","","","","MS Motivational statements (MS)"],
  ["finanical freedom: my business, trading, cyprto trading and","","work at your best for sixty minutes straight no intruption","","","","","","","","I am a fighter for my family"],
  ["good health/body fitness, mental toughness","","refuel for ten minutes- start again for 60 minutes:Use timer for activities","","","","","","","","I am cappable Discipline"],
  ["skills building: online tradining, investment, management, finance","","Review down dialy goals and list- every evening or night","","","","","","","","I have Burning Desire"],
  ["skills building/Akhiro -- quran study","","communicate: Making calls to shareholders, colegues, Mentor","","","","","","","","I have Determination"],
  ["workiing effectively","","Use minimum effective dose MED and Never mise twice NMT: mise one day, do the next day","","","","","","","","I am contimues learner"],
  ["online training, reading 1-hour every day","","waking up 4 AM set Alarm,","","","","","","","","I embrace challenges"],
  ["achieving 5% of 21000 profarm and is 1050= one account of 5k passed in Phase 1, 8%","","Reset recover and rebuild-- Passing chanllenge each week (3 weeks)","","","","","","","",""],
  ["Date and month","","","","","","","","15-08-21-2026","",""],
  ["Days of the week","Sa","Su","Mo","tu","we","th","fr","Weeklyactual","Weeklytarget","Percentage"],
  ["Wake up at 3:55: prayer salatu leyl and Adkar",1,1,1,1,1,"",1,6,7,85.71],
  ["Go to Masjid: Morning prayer: mindfullnes and Khushuuc",1,1,1,1,1,"",1,6,7,85.71],
  ["30 minutes Quraan study","","",1,1,1,1,1,5,7,71.43],
  ["Running 30 minutes, 30 minutesoutdoor walking","",1,1,1,1,1,1,6,7,85.71],
  ["Body Exericse 15 minutes(Pushups20, plunk 3: minute","",1,"",1,1,1,1,5,7,71.43],
  ["Digri and adkar: meditation, mindfullnes",1,1,1,1,1,1,1,7,7,100],
  ["Work: sales and account: Somali United trade",1,1,1,1,1,1,1,7,7,100],
  ["Duha prayer 8 rakaat",1,1,1,"",1,1,1,6,7,85.71],
  ["Work: Crypto/ trading/ invesment training: practice. Back testing1:30","",1,"","","","","",1,2,50],
  ["Unlearning Bad Habit 1","",1,1,1,"",1,1,5,7,71.43],
  ["Reading the quran Juz 1 (20 minutes)","",1,1,1,1,1,1,6,7,85.71],
  ["Meditate 5 minutes",1,1,1,1,1,1,1,7,7,100],
  ["1 hour of reading: books","",1,1,1,1,1,1,6,7,85.71],
  ["1-hour online training; Project Management-Google (30 minutes)","",1,1,1,1,1,1,6,7,85.71],
  ["study and learning traning: intensive training unlearning bad habits and dev skills",1,1,1,1,1,1,1,7,7,100],
  ["Arabic study (15 minutes)","",1,1,1,1,1,1,6,7,85.71],
  ["trading learning 6 hours per day/ trading/challenge account",0,0,1,1,1,1,1,5,5,100],
  ["Going to the town, socila meeting and communication",1,1,1,1,1,1,1,7,7,100],
  ["Bad Habit 2- closing profit early and runing losing trade more, no SL/TP",0,0,1,1,1,1,1,5,5,100],
  ["Bad Habit 3--- sleeping after Fajar","","",1,1,"","",1,3,7,42.86],
  ["communication with my wife (15 minutes daily minimum) (applyied Never mise Twice)",1,1,1,1,1,1,1,7,7,100],
  ["Learning and using AI",1,1,1,1,1,1,1,7,7,100],
  ["Actual daily achive",10,18,20,20,19,18,21,126,145,""],
  ["daily Target",20,20,21,21,21,21,21,145,"",""],
  ["Daily Percentage",50,90,95.2,95,90,85.7,100,86.9,"",""]
];

export function categorizeHabit(name: string): HabitCategory {
  const lower = name.toLowerCase();
  
  if (
    lower.includes('prayer') ||
    lower.includes('quran') ||
    lower.includes('quraan') ||
    lower.includes('masjid') ||
    lower.includes('digri') ||
    lower.includes('adkar') ||
    lower.includes('duha') ||
    lower.includes('meditate') ||
    lower.includes('salatu')
  ) {
    return 'Spiritual';
  }
  
  if (
    lower.includes('running') ||
    lower.includes('walking') ||
    lower.includes('body exercise') ||
    lower.includes('pushups') ||
    lower.includes('sleeping after fajar') ||
    lower.includes('fitness')
  ) {
    return 'Health';
  }
  
  if (
    lower.includes('trading') ||
    lower.includes('crypto') ||
    lower.includes('back testing') ||
    lower.includes('bad habit 2') ||
    lower.includes('sl/tp') ||
    lower.includes('challenge account') ||
    lower.includes('propfarm') ||
    lower.includes('profarm')
  ) {
    return 'Trading';
  }
  
  return 'Skills';
}

export function parseMatrixResponse(rawData: (string | number)[][]): MatrixData {
  const objectives: string[] = [];
  const modusOperandi: string[] = [];
  const motivationalStatements: string[] = [];

  // Parse Header Blocks (rows 1-7)
  for (let i = 1; i <= 7; i++) {
    const row = rawData[i] || [];
    const obj = String(row[0] || '').trim();
    if (obj) objectives.push(obj);

    // M.O might be in col 2 or col 4
    const mo = String(row[2] || row[4] || '').trim();
    if (mo) modusOperandi.push(mo);

    const ms = String(row[10] || '').trim();
    if (ms) motivationalStatements.push(ms);
  }

  // Date range from row 8
  const dateRangeRow = rawData[8] || [];
  const dateRange = String(dateRangeRow[8] || '15-08-21-2026').trim();

  // Habits start after Days header (index 9) up until "Actual daily achive"
  const habits: HabitItem[] = [];
  let actualRow: (string | number)[] | undefined;
  let targetRow: (string | number)[] | undefined;
  let percentageRow: (string | number)[] | undefined;

  for (let r = 10; r < rawData.length; r++) {
    const row = rawData[r];
    if (!row || row.length === 0) continue;
    const title = String(row[0] || '').trim();
    if (!title) continue;

    if (title.toLowerCase().includes('actual daily')) {
      actualRow = row;
      continue;
    }
    if (title.toLowerCase().includes('daily target')) {
      targetRow = row;
      continue;
    }
    if (title.toLowerCase().includes('daily percentage')) {
      percentageRow = row;
      continue;
    }

    const dayValues: Record<DayKey, number | '' | 0 | 1> = {
      Sa: normalizeDayValue(row[1]),
      Su: normalizeDayValue(row[2]),
      Mo: normalizeDayValue(row[3]),
      tu: normalizeDayValue(row[4]),
      we: normalizeDayValue(row[5]),
      th: normalizeDayValue(row[6]),
      fr: normalizeDayValue(row[7]),
    };

    const weeklyActual = Number(row[8]) || 0;
    const weeklyTarget = Number(row[9]) || 0;
    const rawPct = row[10];
    const percentage = typeof rawPct === 'number' ? rawPct : Number(String(rawPct).replace('%', '')) || (weeklyTarget > 0 ? (weeklyActual / weeklyTarget) * 100 : 0);

    const isBadHabit = title.toLowerCase().includes('bad habit');
    let badHabitNumber: number | undefined;
    if (isBadHabit) {
      if (title.includes('1')) badHabitNumber = 1;
      else if (title.includes('2')) badHabitNumber = 2;
      else if (title.includes('3')) badHabitNumber = 3;
    }

    habits.push({
      id: `habit-${r}-${title.slice(0, 10).replace(/\s+/g, '')}`,
      name: title,
      category: categorizeHabit(title),
      dayValues,
      weeklyActual,
      weeklyTarget,
      percentage: Number(percentage.toFixed(1)),
      isBadHabit,
      badHabitNumber,
    });
  }

  // Parse Daily Totals
  const dailyTotals: DailySummary[] = DAY_KEYS.map((key, index) => {
    const colIdx = index + 1;
    const actual = Number(actualRow?.[colIdx]) || 0;
    const target = Number(targetRow?.[colIdx]) || 21;
    const pctVal = Number(percentageRow?.[colIdx]) || (target > 0 ? (actual / target) * 100 : 0);

    return {
      day: key,
      label: key.toUpperCase(),
      actual,
      target,
      percentage: Number(pctVal.toFixed(1)),
    };
  });

  const weeklyActualTotal = Number(actualRow?.[8]) || habits.reduce((acc, h) => acc + h.weeklyActual, 0);
  const weeklyTargetTotal = Number(actualRow?.[9]) || habits.reduce((acc, h) => acc + h.weeklyTarget, 0);
  const weeklyScore = Number(percentageRow?.[8]) || (weeklyTargetTotal > 0 ? (weeklyActualTotal / weeklyTargetTotal) * 100 : 86.9);

  // Prop Firm Risk Compliance (Bad Habit #2)
  const badHabit2 = habits.find(h => h.name.toLowerCase().includes('bad habit 2') || (h.badHabitNumber === 2));
  const badHabit2CompliantDays: DayKey[] = [];
  if (badHabit2) {
    DAY_KEYS.forEach(day => {
      if (badHabit2.dayValues[day] === 1) {
        badHabit2CompliantDays.push(day);
      }
    });
  }

  // Bottleneck (Bad Habit #3: Sleep after Fajar)
  const badHabit3 = habits.find(h => h.name.toLowerCase().includes('bad habit 3') || (h.badHabitNumber === 3));

  return {
    dateRange,
    objectives,
    modusOperandi,
    motivationalStatements,
    habits,
    dailyTotals,
    weeklyActualTotal,
    weeklyTargetTotal,
    weeklyExecutionScore: Number(weeklyScore.toFixed(1)),
    badHabit2Compliance: {
      name: badHabit2?.name || 'Bad Habit 2 - SL/TP Discipline & Risk Management',
      actual: badHabit2?.weeklyActual ?? 5,
      target: badHabit2?.weeklyTarget ?? 5,
      percentage: badHabit2?.percentage ?? 100,
      compliantDays: badHabit2CompliantDays.length ? badHabit2CompliantDays : ['Mo', 'tu', 'we', 'th', 'fr'],
      passed: (badHabit2?.percentage ?? 100) >= 100,
    },
    badHabit3Bottleneck: {
      name: badHabit3?.name || 'Bad Habit 3 - Sleeping after Fajar',
      actual: badHabit3?.weeklyActual ?? 3,
      target: badHabit3?.weeklyTarget ?? 7,
      percentage: badHabit3?.percentage ?? 42.86,
      isCritical: (badHabit3?.percentage ?? 42.86) < 70,
    },
    lastSynced: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

function normalizeDayValue(val: unknown): number | '' | 0 | 1 {
  if (val === 1 || val === '1' || val === true) return 1;
  if (val === 0 || val === '0') return 0;
  return '';
}

export async function fetchHabitMatrixData(): Promise<MatrixData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(SCRIPT_ENDPOINT, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const json = await response.json();
    if (Array.isArray(json) && json.length > 0) {
      const parsed = parseMatrixResponse(json);
      // Cache to localStorage
      try {
        localStorage.setItem('discipline_matrix_cached_data', JSON.stringify(json));
        localStorage.setItem('discipline_matrix_cached_time', new Date().toISOString());
      } catch {
        // ignore storage errors
      }
      return parsed;
    }
    throw new Error('Invalid array response structure');
  } catch (error) {
    console.warn('Live fetch failed or timed out, loading cached or fallback dataset:', error);
    
    // Try localStorage cached raw data
    try {
      const cached = localStorage.getItem('discipline_matrix_cached_data');
      if (cached) {
        const parsedJson = JSON.parse(cached);
        if (Array.isArray(parsedJson)) {
          return parseMatrixResponse(parsedJson);
        }
      }
    } catch {
      // ignore
    }

    // Default to verified structure
    return parseMatrixResponse(FALLBACK_RAW_DATA);
  }
}
