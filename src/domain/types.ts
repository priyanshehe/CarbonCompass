export type TransitType = 'car-gas' | 'car-hybrid' | 'electric' | 'transit' | 'none';
export type DietType = 'meat-heavy' | 'balanced' | 'low-meat' | 'vegetarian' | 'vegan';
export type EnergyType = 'coal-gas' | 'grid-average' | 'renewable';
export type ShoppingType = 'heavy-consumer' | 'average' | 'minimalist';

export interface AssessmentResponse {
  transportation: TransitType;
  weeklyMileage: number; // in km per week
  diet: DietType;
  homeEnergy: EnergyType;
  travelFrequency: number; // flights per year
  shoppingHabits: ShoppingType;
}

export type HabitCategory = 'transportation' | 'diet' | 'energy' | 'consumption';
export type DifficultyType = 'easy' | 'medium' | 'hard';
export type ImpactLevelType = 'low' | 'medium' | 'high';

export interface Habit {
  id: string;
  category: HabitCategory;
  title: string;
  description: string;
  difficulty: DifficultyType;
  impact: ImpactLevelType;
  co2ReductionPerWeek: number; // in kg CO2 saved per week
  metricAnalogy: string; // descriptive text
}

export interface UserHabitCommitment {
  habitId: string;
  dateCommitted: string; // ISO Date YYYY-MM-DD
  completedDays: string[]; // array of ISO Dates YYYY-MM-DD
}

export interface AccessibilitySettings {
  theme: 'light' | 'dark' | 'high-contrast';
  fontSize: 'normal' | 'large' | 'extra-large';
  reducedMotion: boolean;
}

export interface UserProfileState {
  hasCompletedAssessment: boolean;
  assessment: AssessmentResponse;
  commitments: UserHabitCommitment[];
  simulatedAssessmentOverrides: Partial<AssessmentResponse>;
  accessibilitySettings: AccessibilitySettings;
}
