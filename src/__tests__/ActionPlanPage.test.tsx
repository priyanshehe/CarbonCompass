import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AppProvider } from '../context/AppContext';
import ActionPlanPage from '../app/action-plan/page';

expect.extend(toHaveNoViolations);

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: () => '/action-plan',
}));

describe('Action Plan Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should display lock message if assessment is not completed', async () => {
    render(
      <AppProvider>
        <ActionPlanPage />
      </AppProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Action Plan Locked')).toBeInTheDocument();
    });
  });

  it('should render catalog and support committing to habits and logging completions', async () => {
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
        <ActionPlanPage />
      </AppProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Weekly Action Plan')).toBeInTheDocument();
    });

    // Check empty commitments message
    expect(screen.getByText('No active commitments yet.')).toBeInTheDocument();

    // Verify category tab clicks work (e.g. Diet)
    const dietTab = screen.getByRole('tab', { name: 'Diet' });
    fireEvent.click(dietTab);

    // Commit to 'Meatless Mondays'
    const commitButtons = screen.getAllByRole('button', { name: /Commit to Habit/i });
    fireEvent.click(commitButtons[0]); // Commit to the first filtered habit

    // Now it should show in active commitments
    expect(screen.queryByText('No active commitments yet.')).not.toBeInTheDocument();
    
    // Log habit completed today
    const logButton = screen.getByRole('button', { name: /Mark "Meatless Mondays" completed today/i });
    fireEvent.click(logButton);

    // Verify it updates button text to Completed
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Mark "Meatless Mondays" completed today/i })).toHaveTextContent('Completed');
      expect(screen.getByText(/Your Cumulative Impact/i)).toBeInTheDocument();
    });

    // Verify accessibility
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
