'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { 
  Settings, 
  Accessibility, 
  Trash2, 
  Moon, 
  Sun, 
  Eye, 
  Type, 
  Move, 
  ShieldCheck,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import styles from './Settings.module.css';

export default function SettingsPage() {
  const { state, updateAccessibility, resetData, isHydrated } = useApp();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetFinished, setResetFinished] = useState(false);

  if (!isHydrated) {
    return (
      <div className={styles.loadingContainer}>
        <RefreshCw className={styles.spinner} aria-hidden="true" />
        <p>Loading settings panel...</p>
      </div>
    );
  }

  const { theme, fontSize, reducedMotion } = state.accessibilitySettings;

  const handleThemeChange = (newTheme: typeof theme) => {
    updateAccessibility({ theme: newTheme });
  };

  const handleFontChange = (newSize: typeof fontSize) => {
    updateAccessibility({ fontSize: newSize });
  };

  const handleMotionToggle = () => {
    updateAccessibility({ reducedMotion: !reducedMotion });
  };

  const handleResetClick = () => {
    setShowConfirmReset(true);
  };

  const confirmResetAction = () => {
    resetData();
    setShowConfirmReset(false);
    setResetFinished(true);
    setTimeout(() => setResetFinished(false), 3000);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Settings className={styles.headerIcon} />
        <div>
          <h1 className={styles.title}>Settings & Accessibility</h1>
          <p className={styles.subtitle}>
            Customize your layout experience, configure theme levels, or manage local data storage.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        
        {/* Left Hand: Accessibility Prefs */}
        <div className={styles.leftColumn}>
          <Card className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <Accessibility className={styles.sectionIcon} />
              <h2>Accessibility & Display</h2>
            </div>
            <p className={styles.cardSubtitle}>Configure display contrast, font scaling, and motion rules (WCAG 2.2 AA optimized)</p>

            <hr className={styles.divider} aria-hidden="true" />

            <div className={styles.optionsList}>
              
              {/* Option: Themes */}
              <div className={styles.optionGroup}>
                <div className={styles.optionHeader}>
                  <Sun size={18} className={styles.optionIcon} />
                  <div>
                    <h3>Contrast Theme</h3>
                    <p>Select color styling designed for your visibility needs.</p>
                  </div>
                </div>
                
                <div className={styles.choiceGrid} role="radiogroup" aria-label="Theme selection">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'high-contrast', label: 'High Contrast', icon: Eye }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleThemeChange(opt.id as any)}
                      className={`${styles.choiceBtn} ${theme === opt.id ? styles.choiceSelected : ''}`}
                      role="radio"
                      aria-checked={theme === opt.id}
                    >
                      <opt.icon size={16} style={{ marginRight: 6 }} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option: Font Sizing */}
              <div className={styles.optionGroup}>
                <div className={styles.optionHeader}>
                  <Type size={18} className={styles.optionIcon} />
                  <div>
                    <h3>Text Sizing Scale</h3>
                    <p>Adjust font display size for reading comfort.</p>
                  </div>
                </div>

                <div className={styles.choiceGrid} role="radiogroup" aria-label="Font sizing selection">
                  {[
                    { id: 'normal', label: 'Normal (100%)' },
                    { id: 'large', label: 'Large (115%)' },
                    { id: 'extra-large', label: 'X-Large (130%)' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleFontChange(opt.id as any)}
                      className={`${styles.choiceBtn} ${fontSize === opt.id ? styles.choiceSelected : ''}`}
                      role="radio"
                      aria-checked={fontSize === opt.id}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option: Reduced Motion */}
              <div className={styles.optionGroup}>
                <div className={styles.optionHeader}>
                  <Move size={18} className={styles.optionIcon} />
                  <div>
                    <h3>Reduced Motion</h3>
                    <p>Disable hover translations, rotating globes, and animations.</p>
                  </div>
                </div>

                <label className={styles.switchLabel}>
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={handleMotionToggle}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.switchText}>
                    {reducedMotion ? "Motion is REDUCED" : "Motion is ENABLED"}
                  </span>
                </label>
              </div>

            </div>
          </Card>
        </div>

        {/* Right Hand: Privacy and Data Management */}
        <div className={styles.rightColumn}>
          <Card className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <ShieldCheck className={styles.sectionIcon} style={{ color: 'var(--color-primary)' }} />
              <h2>Privacy & Data Storage</h2>
            </div>
            
            <div className={styles.privacyStatement}>
              <p>
                Carbon Compass operates as a <strong>local-first offline-capable web app</strong>. 
                All calculated emissions details, survey records, and logged habits are kept inside your browser&apos;s local storage.
              </p>
              <ul>
                <li>❌ No server-side databases</li>
                <li>❌ No trackers or cookies</li>
                <li>❌ No data sharing or selling</li>
              </ul>
            </div>

            <hr className={styles.divider} aria-hidden="true" />

            <div className={styles.resetBlock}>
              <h3>Reset Profile Data</h3>
              <p>Permanently remove your assessment answers, simulator goals, and habit logging data from this device.</p>
              
              {resetFinished && (
                <div className={styles.resetSuccess} role="alert">
                  <CheckCircle size={16} style={{ marginRight: 6 }} /> Profile data successfully reset.
                </div>
              )}

              {!showConfirmReset ? (
                <Button variant="danger" onClick={handleResetClick} className={styles.resetBtnAction}>
                  <Trash2 size={16} style={{ marginRight: 8 }} /> Reset All Data
                </Button>
              ) : (
                <div className={styles.confirmBox}>
                  <p className={styles.confirmWarning}>⚠️ Are you sure? This cannot be undone.</p>
                  <div className={styles.confirmControls}>
                    <Button variant="secondary" onClick={() => setShowConfirmReset(false)}>
                      Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmResetAction}>
                      Yes, Delete Everything
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
