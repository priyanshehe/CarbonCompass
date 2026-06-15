import { describe, it, expect } from 'vitest';
import { AssessmentResponseSchema, AccessibilitySettingsSchema } from '../domain/validationSchemas';

describe('Zod Validation Boundary Rules', () => {
  it('passes valid assessment inputs', () => {
    const payload = {
      transportation: 'car-hybrid',
      weeklyMileage: 250,
      diet: 'vegetarian',
      homeEnergy: 'renewable',
      travelFrequency: 3,
      shoppingHabits: 'minimalist',
    };

    const res = AssessmentResponseSchema.safeParse(payload);
    expect(res.success).toBe(true);
  });

  it('rejects negative commute mileage', () => {
    const payload = {
      transportation: 'electric',
      weeklyMileage: -10,
      diet: 'balanced',
      homeEnergy: 'grid-average',
      travelFrequency: 1,
      shoppingHabits: 'average',
    };

    const res = AssessmentResponseSchema.safeParse(payload);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toContain('Mileage cannot be negative');
    }
  });

  it('rejects extreme overflow mileage (safety boundary)', () => {
    const payload = {
      transportation: 'car-gas',
      weeklyMileage: 25000, // beyond 10,000 max bound
      diet: 'balanced',
      homeEnergy: 'grid-average',
      travelFrequency: 1,
      shoppingHabits: 'average',
    };

    const res = AssessmentResponseSchema.safeParse(payload);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toContain('Mileage exceeded maximum reasonable bounds');
    }
  });

  it('rejects negative flight frequency', () => {
    const payload = {
      transportation: 'none',
      weeklyMileage: 0,
      diet: 'vegan',
      homeEnergy: 'renewable',
      travelFrequency: -2,
      shoppingHabits: 'average',
    };

    const res = AssessmentResponseSchema.safeParse(payload);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toContain('Flights cannot be negative');
    }
  });

  it('passes valid accessibility settings', () => {
    const payload = {
      theme: 'high-contrast',
      fontSize: 'large',
      reducedMotion: true
    };

    const res = AccessibilitySettingsSchema.safeParse(payload);
    expect(res.success).toBe(true);
  });

  it('rejects invalid theme options', () => {
    const payload = {
      theme: 'sepia', // invalid option
      fontSize: 'normal',
      reducedMotion: false
    };

    const res = AccessibilitySettingsSchema.safeParse(payload);
    expect(res.success).toBe(false);
  });
});
