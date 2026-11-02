import { describe, it, expect } from 'vitest';
import { calculateAge } from '../engine/age';

describe('calculateAge', () => {
  // Attenzione: in new Date(anno, mese, giorno) il mese parte da 0 (9 = ottobre)
  const oggi = new Date(2026, 9, 16); // 16 ottobre 2026

  it('compleanno già passato quest\'anno', () => {
    expect(calculateAge(12, 4, 1950, oggi)).toBe(76);
  });

  it('compleanno non ancora arrivato quest\'anno', () => {
    expect(calculateAge(25, 12, 1950, oggi)).toBe(75);
  });

  it('il giorno del compleanno conta come compiuto', () => {
    expect(calculateAge(16, 10, 1950, oggi)).toBe(76);
  });

  it('il giorno prima del compleanno non è ancora compiuto', () => {
    expect(calculateAge(17, 10, 1950, oggi)).toBe(75);
  });

  it('data nel futuro dà un\'età negativa', () => {
    expect(calculateAge(1, 1, 2030, oggi)).toBeLessThan(0);
  });
});
