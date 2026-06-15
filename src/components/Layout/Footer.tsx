import React from 'react';
import { Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: 'var(--spacing-xl) var(--spacing-md)',
      marginTop: 'auto',
      transition: 'var(--transition-normal)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          color: 'var(--color-text-primary)'
        }}>
          <Compass size={20} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontWeight: 700, fontSize: 'var(--font-size-base)' }}>Carbon Compass</span>
        </div>
        
        <p style={{ 
          fontSize: 'var(--font-size-sm)', 
          maxWidth: '500px', 
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5
        }}>
          Know Your Carbon Story. Change It One Habit At A Time.
        </p>

        <p style={{ 
          fontSize: 'var(--font-size-xs)', 
          color: 'var(--color-text-secondary)',
          backgroundColor: 'rgba(46, 94, 78, 0.06)',
          padding: '4px 12px',
          borderRadius: 'var(--border-radius-sm)',
          marginTop: 'var(--spacing-xs)'
        }}>
          🔒 <strong>Privacy Guarantee:</strong> Local-first design. All calculations, answers, and habit completions are processed entirely in your browser. No data is sent to a server.
        </p>

        <div style={{ 
          fontSize: 'var(--font-size-xs)', 
          color: 'var(--color-text-secondary)',
          marginTop: 'var(--spacing-sm)'
        }}>
          &copy; {new Date().getFullYear()} Carbon Compass. Optimized for WCAG 2.2 AA.
        </div>
      </div>
    </footer>
  );
};
