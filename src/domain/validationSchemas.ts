import { z } from 'zod';
import { TransitType, DietType, EnergyType, ShoppingType } from './types';

export const AssessmentResponseSchema = z.object({
  transportation: z.enum(['car-gas', 'car-hybrid', 'electric', 'transit', 'none'] as const),
  weeklyMileage: z.number()
    .min(0, { message: "Mileage cannot be negative" })
    .max(10000, { message: "Mileage exceeded maximum reasonable bounds" }),
  diet: z.enum(['meat-heavy', 'balanced', 'low-meat', 'vegetarian', 'vegan'] as const),
  homeEnergy: z.enum(['coal-gas', 'grid-average', 'renewable'] as const),
  travelFrequency: z.number()
    .int()
    .min(0, { message: "Flights cannot be negative" })
    .max(100, { message: "Flights count exceeded maximum bounds" }),
  shoppingHabits: z.enum(['heavy-consumer', 'average', 'minimalist'] as const)
});

export const AccessibilitySettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'high-contrast'] as const),
  fontSize: z.enum(['normal', 'large', 'extra-large'] as const),
  reducedMotion: z.boolean()
});

export const HabitCommitmentSchema = z.object({
  habitId: z.string().min(1).max(50),
  dateCommitted: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format" }),
  completedDays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format" }))
});
