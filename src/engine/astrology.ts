export type Sign = 'ARIETE' | 'TAURO' | 'GEMELLI' | 'CANCRO' | 'LEONE' | 'VIRGINIA' | 'LIBRA' | 'SCORPIONE' | 'SAGITTARIO' | 'CAPRICORNO' | 'ACQUARIO' | 'PESCE';

export interface AstrologicalData {
  capoStella: Sign;
  stellaAvversa: Sign; // Rutilius 1
  rutilius2: Sign;
  numSegni: number;
  sequence: Sign[];
}

export interface AgePrediction {
  age: number;      // 0-indexed age
  yearOfLife: number; // 1-indexed year (age + 1)
  stella: Sign;
  isFavorevole: boolean;
}

import { getSequenceForDate } from './data';

export function getAstrologicalData(day: number, month: number): AstrologicalData {
  const sequence = getSequenceForDate(day, month);
  if (!sequence || sequence.length === 0) {
    throw new Error(`No sequence found for ${day}/${month}`);
  }
  
  return {
    capoStella: sequence[0],
    stellaAvversa: sequence.length > 1 ? sequence[1] : sequence[0],
    rutilius2: sequence.length > 2 ? sequence[2] : (sequence.length > 1 ? sequence[1] : sequence[0]),
    numSegni: sequence.length,
    sequence
  };
}

export function calculateStellaForAge(sequence: Sign[], age: number): Sign {
  const N = sequence.length;
  const yearOfLife = age + 1; // year 1 = age 0

  // Phase 1: 0-10 years (years 1 to 10)
  if (yearOfLife >= 1 && yearOfLife <= 10) {
    const index = (yearOfLife - 1) % N;
    return sequence[index];
  }

  // Phase 2: 11+ years
  // First 3 stars get 5 years each
  const phase2StartYear = 11;
  const first3Duration = 5;
  const remainingDuration = 2;

  let currentYear = phase2StartYear;
  
  for (let i = 0; i < N; i++) {
    const duration = i < 3 ? first3Duration : remainingDuration;
    if (yearOfLife >= currentYear && yearOfLife < currentYear + duration) {
      return sequence[i];
    }
    currentYear += duration;
  }

  // Phase 3: Cycles through remaining stars (skipping Capo Stella)
  const phase3StartYear = currentYear; 
  const phase3YearOffset = yearOfLife - phase3StartYear;
  
  // Cycle through stars 1 to N-1 (0-indexed, so index 1 to N-1)
  const cycleLength = N - 1;
  const cycleIndex = phase3YearOffset % cycleLength;
  
  return sequence[cycleIndex + 1];
}

export function getPeriodAdverseIsPari(day: number, month: number): boolean {
  if ((month === 12 && day >= 23) || (month === 1 && day <= 21)) return false; // dispari are adverse
  if ((month === 1 && day >= 22) || (month === 2 && day <= 21)) return true; // pari are adverse
  if ((month === 2 && day >= 22) || (month === 3 && day <= 21)) return false;
  if ((month === 3 && day >= 22) || (month === 4 && day <= 21)) return false;
  if ((month === 4 && day >= 22) || (month === 5 && day <= 21)) return false;
  if ((month === 5 && day >= 22) || (month === 6 && day <= 21)) return true;
  if ((month === 6 && day >= 22) || (month === 7 && day <= 23)) return true;
  if ((month === 7 && day >= 24) || (month === 8 && day <= 23)) return false;
  if ((month === 8 && day >= 24) || (month === 9 && day <= 23)) return false;
  if ((month === 9 && day >= 24) || (month === 10 && day <= 23)) return false;
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return false;
  if ((month === 11 && day >= 23) || (month === 12 && day <= 22)) return false;
  return false;
}

export function isFavorable(month: number, day: number, age: number): boolean {
  const yearOfLife = age + 1;
  const isPari = yearOfLife % 2 === 0;

  const adverseIsPari = getPeriodAdverseIsPari(day, month);

  // If year is pari, and adverse is pari, it's NOT favorable.
  if (isPari && adverseIsPari) return false;
  if (!isPari && !adverseIsPari) return false;

  return true; // otherwise it is favorable
}

export function generateTimeline(day: number, month: number, maxAge: number = 100): AgePrediction[] {
  const data = getAstrologicalData(day, month);
  const timeline: AgePrediction[] = [];
  
  for (let age = 0; age <= maxAge; age++) {
    timeline.push({
      age,
      yearOfLife: age + 1,
      stella: calculateStellaForAge(data.sequence, age),
      isFavorevole: isFavorable(month, day, age)
    });
  }
  
  return timeline;
}
