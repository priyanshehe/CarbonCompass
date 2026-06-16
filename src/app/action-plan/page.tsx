'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { HABITS_REGISTRY } from '@/domain/habitsData';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { Habit } from '@/domain/types';
import { 
  TreePine, 
  Calendar, 
  CheckSquare, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Compass, 
  Flame, 
  Car, 
  Utensils, 
  ShoppingBag,
} from 'lucide-react';
import styles from './ActionPlan.module.css';

export default function ActionPlanPage() {
  const { state, toggleHabitCommitment, logHabitToday, isHydrated } = useApp();
  const [activeCategory, setActiveCategory] = useState<'all' | 'transportation' | 'diet' | 'energy' | 'consumption'>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  if (!isHydrated) {
    return (
      <div className={styles.loadingContainer}>
        <RefreshCw className={styles.spinner} aria-hidden="true" />
        <p>Loading Action Plan...</p>
      </div>
    );
  }

  // Handle empty assessment lock
  if (!state.hasCompletedAssessment) {
    return (
      <div className={styles.emptyContainer}>
        <Card className={styles.emptyCard}>
          <Compass className={styles.emptyIcon} aria-hidden="true" />
          <h2>Action Plan Locked</h2>
          <p>
            You must complete the lifestyle assessment before planning actions. 
            Discover your current score first to view matching recommendations.
          </p>
          <Link href="/assessment">
            <Button variant="primary" className={styles.emptyCta}>
              Take Assessment
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Active commitments state mapping
  const committedIds = state.commitments.map(c => c.habitId);
  const activeCommitments = state.commitments.map(c => {
    const habit = HABITS_REGISTRY.find(h => h.id === c.habitId);
    return { commitment: c, habit };
  }).filter((x): x is { commitment: typeof x.commitment; habit: Habit } => x.habit !== undefined);

  // Filter habits registry by category
  const filteredHabits = HABITS_REGISTRY.filter(h => 
    activeCategory === 'all' ? true : h.category === activeCategory
  );

  // Calculate stats based on log completions
  // 1 completion = 1/7th of the weekly co2 savings (pro-rated per day completed!)
  const totalCo2SavedGrams = activeCommitments.reduce((sum, { commitment, habit }) => {
    const dailySaving = habit.co2ReductionPerWeek / 7;
    return sum + (commitment.completedDays.length * dailySaving);
  }, 0);

  const totalCo2SavedKg = parseFloat(totalCo2SavedGrams.toFixed(2));
  const treesSavedEquivalent = parseFloat((totalCo2SavedKg / 22).toFixed(2)); // 1 tree absorbs ~22kg CO2/year

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'transportation': return <Car size={18} />;
      case 'diet': return <Utensils size={18} />;
      case 'energy': return <Flame size={18} />;
      default: return <ShoppingBag size={18} />;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'easy': return 'var(--color-success)';
      case 'medium': return 'var(--color-warning)';
      default: return 'var(--color-error)';
    }
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Weekly Action Plan</h1>
        <p className={styles.subtitle}>
          Commit to high-impact changes and log them daily. Small steps lead to big physical stories.
        </p>
      </div>

      {/* Main Grid: Active Logging (Left/Top) and Catalog (Right/Bottom) */}
      <div className={styles.grid}>
        
        {/* Active Commitments Panel */}
        <div className={styles.activePanelColumn}>
          <Card className={styles.activeCard}>
            <div className={styles.activeHeader}>
              <Calendar className={styles.activeTitleIcon} />
              <h2>Active Commitments</h2>
            </div>
            <p className={styles.cardSubtitle}>Log your habits for today, {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>

            <hr className={styles.divider} aria-hidden="true" />

            {activeCommitments.length === 0 ? (
              <div className={styles.emptyCommitments}>
                <CheckSquare size={36} className={styles.emptyCommitIcon} />
                <p>No active commitments yet.</p>
                <small>Browse the habit catalog below and select 1-3 items to add them here.</small>
              </div>
            ) : (
              <div className={styles.commitmentsList}>
                {activeCommitments.map(({ commitment, habit }) => {
                  const isLoggedToday = commitment.completedDays.includes(todayStr);

                  return (
                    <div key={habit.id} className={`${styles.commitmentItem} ${isLoggedToday ? styles.loggedBg : ''}`}>
                      <div className={styles.commitmentDetails}>
                        <div className={styles.commitmentCategoryIcon}>
                          {getCategoryIcon(habit.category)}
                        </div>
                        <div>
                          <h3>{habit.title}</h3>
                          <small className={styles.weeklySavingLabel}>
                            Saves {habit.co2ReductionPerWeek} kg CO₂ / week
                          </small>
                        </div>
                      </div>

                      <div className={styles.commitmentControls}>
                        {/* Daily logger button */}
                        <Button
                          variant={isLoggedToday ? 'primary' : 'secondary'}
                          onClick={() => logHabitToday(habit.id, todayStr)}
                          className={styles.logBtn}
                          aria-label={`Mark "${habit.title}" completed today`}
                        >
                          {isLoggedToday ? 'Completed' : 'Log Today'}
                        </Button>
                        
                        {/* Remove commitment button */}
                        <button
                          onClick={() => toggleHabitCommitment(habit.id)}
                          className={styles.removeBtn}
                          title="Remove commitment"
                          aria-label={`Remove commitment for ${habit.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Relatable aggregate savings box */}
                {totalCo2SavedKg > 0 && (
                  <div className={styles.aggregateSavings}>
                    <TreePine className={styles.savingsIcon} />
                    <div>
                      <h4>Your Cumulative Impact</h4>
                      <p>
                        You checked off commitments, avoiding <strong>{totalCo2SavedKg} kg</strong> of CO₂. 
                        That is equivalent to planting <strong>{treesSavedEquivalent}</strong> mature trees!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Habit Catalog Panel */}
        <div className={styles.catalogColumn}>
          <div className={styles.catalogHeaderRow}>
            <h2>Habits Catalog</h2>
            
            {/* Category tabs */}
            <div className={styles.tabs} role="tablist">
              {[
                { id: 'all', label: 'All' },
                { id: 'transportation', label: 'Transit' },
                { id: 'diet', label: 'Diet' },
                { id: 'energy', label: 'Energy' },
                { id: 'consumption', label: 'Shopping' }
              ].map(tab => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeCategory === tab.id}
                  onClick={() =>
  setActiveCategory(
    tab.id as 'all' | 'transportation' | 'diet' | 'energy' | 'consumption'
  )
}
                  className={`${styles.tab} ${activeCategory === tab.id ? styles.activeTab : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.catalogGrid}>
            {filteredHabits.map((habit) => {
              const isCommitted = committedIds.includes(habit.id);

              return (
                <Card key={habit.id} className={`${styles.habitCard} ${isCommitted ? styles.committedBorder : ''}`}>
                  <div className={styles.habitCardHeader}>
                    <span className={styles.habitCategoryBadge}>
                      {getCategoryIcon(habit.category)} {habit.category.toUpperCase()}
                    </span>
                    <div className={styles.habitTags}>
                      <span 
                        className={styles.tag} 
                        style={{ borderColor: getDifficultyColor(habit.difficulty), color: getDifficultyColor(habit.difficulty) }}
                      >
                        {habit.difficulty}
                      </span>
                      <span className={styles.impactTag}>
                        {habit.impact} Impact
                      </span>
                    </div>
                  </div>

                  <h3 className={styles.habitTitle}>{habit.title}</h3>
                  <p className={styles.habitDescription}>{habit.description}</p>
                  
                  <div className={styles.savingsBox}>
                    <span className={styles.savingsValue}>{habit.co2ReductionPerWeek} kg CO₂</span>
                    <span className={styles.savingsLabel}>saved per week</span>
                  </div>

                  <p className={styles.analogyText}>
                    🌱 {habit.metricAnalogy}
                  </p>

                  <div className={styles.cardAction}>
                    <Button
                      variant={isCommitted ? 'secondary' : 'primary'}
                      onClick={() => toggleHabitCommitment(habit.id)}
                      className={styles.actionBtn}
                    >
                      {isCommitted ? (
                        <>Remove Commitment</>
                      ) : (
                        <>
                          <Plus size={16} style={{ marginRight: 6 }} /> Commit to Habit
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
