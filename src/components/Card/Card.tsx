import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
  role?: string;
  ariaLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  tabIndex,
  role,
  ariaLabel,
}) => {
  const isInteractive = typeof onClick === 'function';
  const cardClass = `${styles.card} ${isInteractive ? styles.interactive : ''} ${className}`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={cardClass}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
      role={role ?? (isInteractive ? 'button' : undefined)}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};
