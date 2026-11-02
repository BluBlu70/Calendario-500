import { describe, it, expect } from 'vitest';
import { getSequenceForDate } from '../engine/data';
import { generateTimeline } from '../engine/astrology';

const GIORNI_PER_MESE = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

describe('Archivio dei quadrati di nascita', () => {
  it('contiene tutti i 366 giorni, ognuno con almeno 2 segni', () => {
    let totale = 0;
    GIORNI_PER_MESE.forEach((giorni, i) => {
      for (let g = 1; g <= giorni; g++) {
        const seq = getSequenceForDate(g, i + 1);
        expect(seq.length, `${g}/${i + 1}`).toBeGreaterThanOrEqual(2);
        totale++;
      }
    });
    expect(totale).toBe(366);
  });

  it('il calcolo funziona per ogni giorno fino a 100 anni', () => {
    GIORNI_PER_MESE.forEach((giorni, i) => {
      for (let g = 1; g <= giorni; g++) {
        const timeline = generateTimeline(g, i + 1, 100);
        expect(timeline.every(t => t.stella !== undefined), `${g}/${i + 1}`).toBe(true);
      }
    });
  });

  it('una data che non esiste dà errore invece di un risultato inventato', () => {
    expect(() => getSequenceForDate(31, 4)).toThrow();
  });

  it('23 febbraio corrisponde al PDF', () => {
    expect(getSequenceForDate(23, 2).slice(0, 8)).toEqual(
      ['GEMELLI', 'SCORPIONE', 'PESCE', 'SAGITTARIO', 'CAPRICORNO', 'GEMELLI', 'LIBRA', 'CANCRO']
    );
  });
});
