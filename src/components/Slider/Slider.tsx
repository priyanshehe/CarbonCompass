import React from 'react';
import styles from './Slider.module.css';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  valueDisplay?: string;
  id: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  valueDisplay,
  id,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.header}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <span className={styles.value} aria-live="polite">
          {valueDisplay ?? value}
        </span>
      </div>
      <div className={styles.inputWrapper}>
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className={styles.rangeInput}
          style={{ '--percentage': `${percentage}%` } as React.CSSProperties}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={valueDisplay}
        />
        <div className={styles.rangeBounds}>
          <span aria-hidden="true" className={styles.bound}>{min}</span>
          <span aria-hidden="true" className={styles.bound}>{max}</span>
        </div>
      </div>
    </div>
  );
};
