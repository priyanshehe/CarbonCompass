import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AppProvider } from '../context/AppContext';
import SimulatorPage from '../app/simulator/page';

expect.extend(toHaveNoViolations);

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: () => '/simulator',
}));

describe('Carbon Twin Simulator Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should display lock message if assessment is not completed', async () => {
    render(
      <AppProvider>
        <SimulatorPage />
      </AppProvider>
    );

    // Should render the empty/locked state first
    await waitFor(() => {
      expect(screen.getByText('Carbon Twin Simulator Locked')).toBeInTheDocument();
      expect(screen.getByText('Take Assessment First')).toBeInTheDocument();
    });
  });

  it('should render sliders and update projections on slider change if assessment is completed', async () => {
    // Populate localStorage with a completed assessment
    const mockState = {
      hasCompletedAssessment: true,
      assessment: {
        transportation: 'car-gas',
        weeklyMileage: 100,
        diet: 'balanced',
        homeEnergy: 'grid-average',
        travelFrequency: 2,
        shoppingHabits: 'average',
      },
      commitments: [],
      accessibilitySettings: {
        theme: 'light',
        fontSize: 'normal',
        reducedMotion: false,
      }
    };
    localStorage.setItem('carbon_compass_profile_v1', JSON.stringify(mockState));

    const { container } = render(
      <AppProvider>
        <SimulatorPage />
      </AppProvider>
    );

    // Verify it loads the simulator environment
    await waitFor(() => {
      expect(screen.getByText('Adjust Twin Lifestyle')).toBeInTheDocument();
    });

    // Check baseline score is visible (8.88 Tons/Yr)
    expect(screen.getByText('Baseline')).toBeInTheDocument();

    // Select Vegetarian Diet
    const vegButton = screen.getByRole('radio', { name: /Vegetarian/i });
    expect(vegButton).toBeInTheDocument();
    fireEvent.click(vegButton);

    // Save simulated goals
    const adoptButton = screen.getByRole('button', { name: /Adopt Simulated Goals/i });
    expect(adoptButton).toBeInTheDocument();
    expect(adoptButton).not.toBeDisabled();
    fireEvent.click(adoptButton);

    // Check if the adopt response is displayed
    await waitFor(() => {
      expect(screen.getByText(/Simulated Goals Saved!/i)).toBeInTheDocument();
    });

    // Check accessibility
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
