'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfileState, 
  AssessmentResponse, 
  UserHabitCommitment, 
  AccessibilitySettings,
  TransitType,
  DietType,
  EnergyType,
  ShoppingType
} from '../domain/types';
import { 
  AssessmentResponseSchema, 
  AccessibilitySettingsSchema, 
  HabitCommitmentSchema 
} from '../domain/validationSchemas';

// Default initial state
const DEFAULT_ASSESSMENT: AssessmentResponse = {
  transportation: 'transit',
  weeklyMileage: 50,
  diet: 'balanced',
  homeEnergy: 'grid-average',
  travelFrequency: 1,
  shoppingHabits: 'average',
};

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  theme: 'light',
  fontSize: 'normal',
  reducedMotion: false,
};

const DEFAULT_STATE: UserProfileState = {
  hasCompletedAssessment: false,
  assessment: DEFAULT_ASSESSMENT,
  commitments: [],
  simulatedAssessmentOverrides: {},
  accessibilitySettings: DEFAULT_ACCESSIBILITY,
};

interface AppContextType {
  state: UserProfileState;
  submitAssessment: (assessment: AssessmentResponse) => void;
  toggleHabitCommitment: (habitId: string) => void;
  logHabitToday: (habitId: string, dateStr: string) => void;
  updateSimulatedOverrides: (overrides: Partial<AssessmentResponse>) => void;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  resetData: () => void;
  isHydrated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'carbon_compass_profile_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserProfileState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state on mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const rawJson = JSON.parse(stored);
        
        // Secure sanitization and validation using Zod
        let hasCompletedAssessment = false;
        let assessment = DEFAULT_ASSESSMENT;
        let commitments: UserHabitCommitment[] = [];
        let accessibilitySettings = DEFAULT_ACCESSIBILITY;

        if (typeof rawJson.hasCompletedAssessment === 'boolean') {
          hasCompletedAssessment = rawJson.hasCompletedAssessment;
        }

        // Validate assessment
        const assessmentVal = AssessmentResponseSchema.safeParse(rawJson.assessment);
        if (assessmentVal.success) {
          assessment = assessmentVal.data;
        }

        // Validate accessibility settings
        const accessibilityVal = AccessibilitySettingsSchema.safeParse(rawJson.accessibilitySettings);
        if (accessibilityVal.success) {
          accessibilitySettings = accessibilityVal.data;
        }

        // Validate habit commitments array
        if (Array.isArray(rawJson.commitments)) {
          commitments = rawJson.commitments
            .map((c: unknown) => {
              const res = HabitCommitmentSchema.safeParse(c);
              return res.success ? res.data : null;
            })
            .filter((c): c is UserHabitCommitment => c !== null);
        }

        const validatedState: UserProfileState = {
          hasCompletedAssessment,
          assessment,
          commitments,
          simulatedAssessmentOverrides: {},
          accessibilitySettings,
        };

        setState(validatedState);
      }
    } catch (e) {
      console.error("Failed to hydrate Carbon Compass state from localStorage:", e);
      // fallback quietly to DEFAULT_STATE
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync state to localStorage on state changes (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        hasCompletedAssessment: state.hasCompletedAssessment,
        assessment: state.assessment,
        commitments: state.commitments,
        accessibilitySettings: state.accessibilitySettings
      }));

      // Apply accessibility DOM changes
      const root = document.documentElement;
      
      // Theme
      root.setAttribute('data-theme', state.accessibilitySettings.theme);
      
      // Font scale
      root.setAttribute('data-font-size', state.accessibilitySettings.fontSize);
      
      // Motion
      if (state.accessibilitySettings.reducedMotion) {
        root.classList.add('reduced-motion');
      } else {
        root.classList.remove('reduced-motion');
      }
    } catch (e) {
      console.error("Failed to save Carbon Compass state to localStorage:", e);
    }
  }, [state, isHydrated]);

  const submitAssessment = (assessmentData: AssessmentResponse) => {
    // Validate before saving
    const parsed = AssessmentResponseSchema.safeParse(assessmentData);
    if (!parsed.success) {
      throw new Error("Invalid assessment responses: " + parsed.error.message);
    }
    
    setState(prev => ({
      ...prev,
      hasCompletedAssessment: true,
      assessment: parsed.data,
      simulatedAssessmentOverrides: {}, // reset simulator overrides on new assessment
    }));
  };

  const toggleHabitCommitment = (habitId: string) => {
    setState(prev => {
      const exists = prev.commitments.some(c => c.habitId === habitId);
      let nextCommitments: UserHabitCommitment[];

      if (exists) {
        nextCommitments = prev.commitments.filter(c => c.habitId !== habitId);
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        const newCommitment: UserHabitCommitment = {
          habitId,
          dateCommitted: todayStr,
          completedDays: []
        };
        nextCommitments = [...prev.commitments, newCommitment];
      }

      return {
        ...prev,
        commitments: nextCommitments
      };
    });
  };

  const logHabitToday = (habitId: string, dateStr: string) => {
    setState(prev => {
      const commitmentIndex = prev.commitments.findIndex(c => c.habitId === habitId);
      if (commitmentIndex === -1) return prev; // habit not active

      const commitment = prev.commitments[commitmentIndex];
      const hasLogged = commitment.completedDays.includes(dateStr);
      let nextCompleted: string[];

      if (hasLogged) {
        nextCompleted = commitment.completedDays.filter(d => d !== dateStr);
      } else {
        nextCompleted = [...commitment.completedDays, dateStr];
      }

      const updatedCommitment: UserHabitCommitment = {
        ...commitment,
        completedDays: nextCompleted
      };

      const nextCommitments = [...prev.commitments];
      nextCommitments[commitmentIndex] = updatedCommitment;

      return {
        ...prev,
        commitments: nextCommitments
      };
    });
  };

  const updateSimulatedOverrides = (overrides: Partial<AssessmentResponse>) => {
    setState(prev => ({
      ...prev,
      simulatedAssessmentOverrides: overrides
    }));
  };

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    const validated = AccessibilitySettingsSchema.partial().safeParse(settings);
    if (!validated.success) return;

    setState(prev => ({
      ...prev,
      accessibilitySettings: {
        ...prev.accessibilitySettings,
        ...validated.data
      }
    }));
  };

  const resetData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setState({
      ...DEFAULT_STATE,
      accessibilitySettings: state.accessibilitySettings // preserve accessibility settings
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        submitAssessment,
        toggleHabitCommitment,
        logHabitToday,
        updateSimulatedOverrides,
        updateAccessibility,
        resetData,
        isHydrated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
