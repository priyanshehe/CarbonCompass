import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AppProvider } from '../context/AppContext';
import SettingsPage from '../app/settings/page';

expect.extend(toHaveNoViolations);

describe('Settings and Accessibility Page', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-font-size');
    document.documentElement.classList.remove('reduced-motion');
  });

  it('should support switching contrast themes and updating DOM attributes', async () => {
    const { container } = render(
      <AppProvider>
        <SettingsPage />
      </AppProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Settings & Accessibility')).toBeInTheDocument();
    });

    // Check default theme selection (Light)
    const darkThemeBtn = screen.getByRole('radio', { name: /Dark/i });
    expect(darkThemeBtn).toBeInTheDocument();
    
    // Switch to dark
    fireEvent.click(darkThemeBtn);

    // Verify it updates HTML root
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // Switch to high-contrast
    const hcThemeBtn = screen.getByRole('radio', { name: /High Contrast/i });
    fireEvent.click(hcThemeBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('high-contrast');

    // Check accessibility
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should toggle font scaling and reduced motion classes on document root', async () => {
    render(
      <AppProvider>
        <SettingsPage />
      </AppProvider>
    );

    // Large font size click
    const largeFontBtn = screen.getByRole('radio', { name: 'Large (115%)' });
    fireEvent.click(largeFontBtn);
    expect(document.documentElement.getAttribute('data-font-size')).toBe('large');

    // Motion checkbox toggle
    const motionCheckbox = screen.getByRole('checkbox');
    expect(motionCheckbox).not.toBeChecked();
    
    fireEvent.click(motionCheckbox);
    expect(motionCheckbox).toBeChecked();
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(true);

    // Toggle back
    fireEvent.click(motionCheckbox);
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(false);
  });

  it('should support profile data reset flows and clear localStorage', async () => {
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

    render(
      <AppProvider>
        <SettingsPage />
      </AppProvider>
    );

    const resetBtn = screen.getByRole('button', { name: /Reset All Data/i });
    fireEvent.click(resetBtn);

    // Verify confirmation banner is shown
    expect(screen.getByText(/Are you sure\? This cannot be undone\./i)).toBeInTheDocument();
    
    const confirmBtn = screen.getByRole('button', { name: /Yes, Delete Everything/i });
    fireEvent.click(confirmBtn);

    // Local storage key should be reset (meaning hasCompletedAssessment is false)
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('carbon_compass_profile_v1')!);
      expect(stored.hasCompletedAssessment).toBe(false);
    });
  });
});
