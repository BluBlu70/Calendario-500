import { describe, it, expect } from 'vitest';
import { getAstrologicalData, generateTimeline } from '../engine/astrology';

describe('Astrology Engine', () => {
  it('should calculate data for 12 April correctly', () => {
    const data = getAstrologicalData(12, 4);
    expect(data.capoStella).toBe('CANCRO');
    expect(data.stellaAvversa).toBe('SCORPIONE'); // Rutilius 1
    expect(data.rutilius2).toBe('TAURO');
    expect(data.numSegni).toBe(8);

    const timeline = generateTimeline(12, 4, 80);
    
    // The 12 April example: age 72 (73rd year)
    const age72 = timeline.find(t => t.age === 72);
    expect(age72?.stella).toBe('VIRGINIA');
    expect(age72?.isFavorevole).toBe(false); // 73 is dispari -> adverse for this period
  });

  it('should calculate data for 28 March correctly', () => {
    const timeline = generateTimeline(28, 3, 80);
    
    // The 28 March example: age 67 (68th year)
    const age67 = timeline.find(t => t.age === 67);
    expect(age67?.stella).toBe('LIBRA'); // LIBRA is BILANCIA
    expect(age67?.isFavorevole).toBe(true); // 68 is pari -> favorable since dispari are adverse for this period
  });

  it('should calculate proper durations for phases', () => {
    const timeline = generateTimeline(28, 3, 40);
    
    // 28 March has 6 signs
    // Phase 1: ages 0-9
    expect(timeline[0].stella).toBe('SAGITTARIO');
    expect(timeline[1].stella).toBe('VIRGINIA');
    
    // Phase 2: ages 10-14 (11-15th year) -> 1st star
    expect(timeline[10].stella).toBe('SAGITTARIO');
    expect(timeline[14].stella).toBe('SAGITTARIO');
    
    // Phase 2: ages 15-19 (16-20th year) -> 2nd star
    expect(timeline[15].stella).toBe('VIRGINIA');
    
    // Phase 3 starts at age 31 (32nd year)
    // 32nd year -> 2nd star
    expect(timeline[31].stella).toBe('VIRGINIA');
  });
});
