import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../components/Button/Button';
import { Card } from '../components/Card/Card';
import { Slider } from '../components/Slider/Slider';

// Extend expect for toHaveNoViolations matcher
expect.extend(toHaveNoViolations);

describe('Accessible Shared UI Components', () => {
  it('Button should render correctly and have zero axe violations', async () => {
    const { container } = render(
      <Button variant="primary" aria-label="Clickable Action">
        Click Me
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Clickable Action' });
    expect(button).toBeInTheDocument();
    
    // Accessibility check
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Card should support keyboard interactions when interactive', async () => {
    const { container } = render(
      <Card onClick={() => {}} ariaLabel="Interactive Card">
        <div>Card content</div>
      </Card>
    );

    const card = screen.getByRole('button', { name: 'Interactive Card' });
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('tabIndex', '0');

    // Accessibility check
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Slider should render with accessible range attributes', async () => {
    const { container } = render(
      <Slider
        id="test-slider"
        label="Test Sizing Slider"
        min={0}
        max={100}
        value={40}
        onChange={() => {}}
        valueDisplay="40 percent"
      />
    );

    const input = screen.getByLabelText('Test Sizing Slider');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'range');
    expect(input).toHaveAttribute('aria-valuenow', '40');
    expect(input).toHaveAttribute('aria-valuemin', '0');
    expect(input).toHaveAttribute('aria-valuemax', '100');
    expect(input).toHaveAttribute('aria-valuetext', '40 percent');

    // Accessibility check
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
