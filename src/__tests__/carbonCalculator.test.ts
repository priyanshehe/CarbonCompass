import { describe, it, expect } from 'vitest';
import { calculateCarbonFootprint } from '../domain/carbonCalculator';
import { AssessmentResponse } from '../domain/types';

describe('Carbon Calculator Domain Math', () => {
  it('correctly calculates baseline emission vectors', () => {
    // Standard middle-developed-world profile
    const profile: AssessmentResponse = {
      transportation: 'car-gas',
      weeklyMileage: 100, // 100km * 52 weeks * 0.00017 tons = 0.884 tons
      diet: 'balanced', // 2.2 tons
      homeEnergy: 'grid-average', // 2.8 tons
      travelFrequency: 2, // 2 * 0.9 = 1.8 tons
      shoppingHabits: 'average', // 1.2 tons
    };

    const res = calculateCarbonFootprint(profile);

    // Sum: 0.884 (0.88) + 2.2 + 2.8 + 1.8 + 1.2 = 8.88 tons
    expect(res.total).toBeCloseTo(8.88, 1);
    expect(res.breakdown.transportation).toBeCloseTo(0.88, 1);
    expect(res.breakdown.diet).toBe(2.2);
    expect(res.breakdown.energy).toBe(2.8);
    expect(res.breakdown.travel).toBe(1.8);
    expect(res.breakdown.shopping).toBe(1.2);
    
    // Check highest source
    expect(res.highestSource.name).toBe('Home Energy');
    expect(res.highestSource.value).toBe(2.8);
    
    // Check ratings
    expect(res.rating.title).toBe('Climate Conscious');
  });

  it('handles low emission green champions profile', () => {
    const profile: AssessmentResponse = {
      transportation: 'none',
      weeklyMileage: 0,
      diet: 'vegan', // 0.9 tons
      homeEnergy: 'renewable', // 0.5 tons
      travelFrequency: 0, // 0 tons
      shoppingHabits: 'minimalist', // 0.4 tons
    };

    const res = calculateCarbonFootprint(profile);

    // Sum: 0 + 0.9 + 0.5 + 0 + 0.4 = 1.8 tons
    expect(res.total).toBe(1.8);
    expect(res.rating.title).toBe('Green Champion');
    expect(res.equivalents.treesSaved).toBe(81); // 1.8 * 45 = 81
  });

  it('handles high emission profiles', () => {
    const profile: AssessmentResponse = {
      transportation: 'car-gas',
      weeklyMileage: 500, // 500 * 52 * 0.00017 = 4.42 tons
      diet: 'meat-heavy', // 3.3 tons
      homeEnergy: 'coal-gas', // 4.5 tons
      travelFrequency: 6, // 6 * 0.9 = 5.4 tons
      shoppingHabits: 'heavy-consumer', // 2.5 tons
    };

    const res = calculateCarbonFootprint(profile);

    // Sum: 4.42 + 3.3 + 4.5 + 5.4 + 2.5 = 20.12 tons
    expect(res.total).toBeCloseTo(20.12, 1);
    expect(res.rating.title).toBe('Eco-Learner');
  });
});
