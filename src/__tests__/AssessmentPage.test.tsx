import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AppProvider } from '../context/AppContext';
import AssessmentPage from '../app/assessment/page';

expect.extend(toHaveNoViolations);

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/assessment',
}));

describe('Assessment Page Integration & Accessibility', () => {
  it('should guide user through 6 questions and submit assessment successfully', async () => {
    const { container } = render(
      <AppProvider>
        <AssessmentPage />
      </AppProvider>
    );

    // Step 1: Daily Commute
    expect(screen.getByText('What is your primary mode of transportation?')).toBeInTheDocument();
    const evButton = screen.getByRole('radio', { name: /Electric EV/i });
    fireEvent.click(evButton);
    
    // Accessibility check on step 1
    const results = await axe(container);
    expect(results).toHaveNoViolations();

    // Click Next
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 2: Commute Distance
    expect(screen.getByText('How many kilometers do you commute/travel in a typical week?')).toBeInTheDocument();
    const distanceSlider = screen.getByRole('slider', { name: /Weekly Travel Distance/i });
    expect(distanceSlider).toBeInTheDocument();
    
    // Change value
    fireEvent.change(distanceSlider, { target: { value: '200' } });

    // Click Next
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 3: Food & Diet
    expect(screen.getByText('What best describes your typical food consumption habits?')).toBeInTheDocument();
    const veganButton = screen.getByRole('radio', { name: /Vegan/i });
    fireEvent.click(veganButton);
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 4: Home Energy Source
    expect(screen.getByText('What power grid mix or fuel heats/cools your residence?')).toBeInTheDocument();
    const renewableButton = screen.getByRole('radio', { name: /100% Renewables/i });
    fireEvent.click(renewableButton);
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 5: Annual Flights
    expect(screen.getByText('How many roundtrip flights do you take in an average year?')).toBeInTheDocument();
    const flightsSlider = screen.getByRole('slider', { name: /Roundtrip Flights per Year/i });
    fireEvent.change(flightsSlider, { target: { value: '4' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 6: Shopping Style
    expect(screen.getByText('What describes your consumption patterns for clothing, electronics, and goods?')).toBeInTheDocument();
    const minimalistButton = screen.getByRole('radio', { name: /Minimalist \/ Thrifter/i });
    fireEvent.click(minimalistButton);

    // Submit form (Next button on final step acts as submit)
    fireEvent.click(screen.getByRole('button', { name: /Calculate Score/i }));

    // Router should redirect to dashboard
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should skip Commute Distance step if "Walk / Bike / None" transportation is selected', async () => {
    render(
      <AppProvider>
        <AssessmentPage />
      </AppProvider>
    );

    // Select Walk / Bike / None
    const noneButton = screen.getByRole('radio', { name: /Walk \/ Bike \/ None/i });
    fireEvent.click(noneButton);
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Should skip mileage and go directly to Food & Diet
    expect(screen.getByText('What best describes your typical food consumption habits?')).toBeInTheDocument();
  });
});
