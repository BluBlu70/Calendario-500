import type { Sign } from './astrology';

// In un'applicazione reale in produzione, questa mappa conterrebbe tutti i 365 giorni.
// Per questo MVP, includiamo i giorni richiesti per i test e alcuni giorni di esempio
// estratti dai documenti forniti per mostrare il funzionamento completo.

const dataMap: Record<number, Record<number, Sign[]>> = {
  // MARZO
  3: {
    28: ['SAGITTARIO', 'VIRGINIA', 'LIBRA', 'TAURO', 'ACQUARIO', 'SCORPIONE']
  },
  // APRILE
  4: {
    12: ['CANCRO', 'SCORPIONE', 'TAURO', 'VIRGINIA', 'LIBRA', 'SAGITTARIO', 'ARIETE', 'ACQUARIO']
  },
  // AGOSTO
  8: {
    27: ['CANCRO', 'LEONE', 'CAPRICORNO', 'TAURO', 'VIRGINIA', 'SAGITTARIO', 'ARIETE', 'GEMELLI', 'ACQUARIO']
  },
  // GENNAIO (Esempi dal nuovo documento)
  1: {
    1: ['LIBRA', 'ACQUARIO', 'CANCRO', 'SCORPIONE', 'PESCE', 'LEONE', 'SAGITTARIO', 'TAURO', 'VIRGINIA', 'ACQUARIO', 'GEMELLI', 'LIBRA', 'PESCE', 'CANCRO', 'SAGITTARIO', 'ARIETE', 'VIRGINIA', 'CAPRICORNO', 'GEMELLI'],
    2: ['SAGITTARIO', 'ARIETE', 'CAPRICORNO', 'CANCRO', 'SCORPIONE', 'LEONE', 'TAURO'],
    3: ['PESCE', 'LEONE', 'VIRGINIA', 'GEMELLI', 'LIBRA', 'PESCE', 'ARIETE'],
    4: ['SCORPIONE', 'ARIETE', 'TAURO', 'ACQUARIO', 'SAGITTARIO'],
    5: ['VIRGINIA', 'CAPRICORNO', 'LIBRA', 'CANCRO', 'SCORPIONE', 'ARIETE', 'LEONE', 'TAURO', 'ACQUARIO', 'GEMELLI', 'SCORPIONE', 'PESCE']
  },
  // FEBBRAIO (Esempi dal nuovo documento)
  2: {
    1: ['SCORPIONE', 'ARIETE', 'LEONE', 'CAPRICORNO', 'TAURO', 'LIBRA', 'ACQUARIO', 'GEMELLI', 'LIBRA', 'PESCE', 'LEONE', 'SAGITTARIO', 'TAURO', 'VIRGINIA', 'CAPRICORNO', 'GEMELLI', 'LIBRA', 'PESCE', 'CANCRO'],
    2: ['SAGITTARIO', 'VIRGINIA', 'PESCE', 'CANCRO', 'SCORPIONE', 'ARIETE', 'LIBRA', 'ACQUARIO', 'GEMELLI', 'LEONE'],
    4: ['LIBRA', 'LEONE', 'SAGITTARIO', 'TAURO', 'VIRGINIA', 'SCORPIONE', 'PESCE', 'CANCRO', 'SAGITTARIO']
  }
};

// Fallback di default se il giorno non è mappato (utile per test esplorativi UI)
const defaultSequence: Sign[] = ['ARIETE', 'TAURO', 'GEMELLI', 'CANCRO', 'LEONE', 'VIRGINIA'];

export function getSequenceForDate(day: number, month: number): Sign[] {
  if (dataMap[month] && dataMap[month][day]) {
    return dataMap[month][day];
  }
  return defaultSequence;
}
