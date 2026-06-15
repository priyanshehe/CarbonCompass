'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useApp } from '@/context/AppContext';
import { calculateCarbonFootprint } from '@/domain/carbonCalculator';
import { HABITS_REGISTRY } from '@/domain/habitsData';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';

const AccessiblePie = dynamic(
  () => import('@/components/Chart/AccessiblePie').then(mod => mod.AccessiblePie),
  { ssr: false }
);
import { 
  TreePine, 
  Car, 
  Smartphone, 
  TrendingDown, 
  ShieldAlert, 
  Compass, 
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const { state, isHydrated } = useApp();

  // If loading/hydrating local storage, show a clean loading state
  if (!isHydrated) {
    return (
      <div className={styles.loadingContainer}>
        <RefreshCw className={styles.spinner} aria-hidden="true" />
        <p>Loading your carbon footprint data...</p>
      </div>
    );
  }

  // Handle empty state if assessment not completed
  if (!state.hasCompletedAssessment) {
    return (
      <div className={styles.emptyContainer}>
        <Card className={styles.emptyCard}>
          <Compass className={styles.emptyIcon} aria-hidden="true" />
          <h2>Unlock Your Carbon Story</h2>
          <p>
            You haven&apos;t calculated your carbon footprint yet. Take our 60-second lifestyle assessment 
            to discover your emissions footprint, simulate reductions, and unlock a weekly habit-change action plan.
          </p>
          <Link href="/assessment" passHref legacyBehavior>
            <Button variant="primary" className={styles.emptyCta}>
              Start Assessment <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Calculate footprint details using useMemo
  const calculation = React.useMemo(() => {
    return calculateCarbonFootprint(state.assessment);
  }, [state.assessment]);
  
  // Calculate potential reductions if habits are committed using useMemo
  const weeklyHabitSavingKg = React.useMemo(() => {
    return state.commitments.reduce((sum, commit) => {
      const habit = HABITS_REGISTRY.find((h) => h.id === commit.habitId);
      return sum + (habit ? habit.co2ReductionPerWeek : 0);
    }, 0);
  }, [state.commitments]);
  
  const annualHabitSavingTons = React.useMemo(() => {
    return parseFloat(((weeklyHabitSavingKg * 52) / 1000).toFixed(2));
  }, [weeklyHabitSavingKg]);

  const projectedScore = React.useMemo(() => {
    return parseFloat((calculation.total - annualHabitSavingTons).toFixed(2));
  }, [calculation.total, annualHabitSavingTons]);

  return (
    <div className={styles.container}>
      {/* Header Summary */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Carbon Story</h1>
          <p className={styles.subtitle}>Based on your transportation, diet, travel, and home utility choices.</p>
        </div>
        <div className={styles.actions}>
          <Link href="/assessment" passHref legacyBehavior>
            <Button variant="secondary" className={styles.retakeBtn}>
              <RefreshCw size={14} style={{ marginRight: 8 }} /> Retake Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Score Grid */}
      <div className={styles.scoreGrid}>
        
        {/* Carbon Score Card */}
        <Card className={styles.scoreCard}>
          <h2>Carbon Score</h2>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreNumber}>{calculation.total.toFixed(1)}</span>
            <span className={styles.scoreUnit}>Metric Tons CO₂/Yr</span>
          </div>
          
          <div className={styles.ratingBadge} style={{ borderColor: calculation.rating.color }}>
            <span className={styles.ratingDot} style={{ backgroundColor: calculation.rating.color }} />
            <span className={styles.ratingTitle}>{calculation.rating.title}</span>
          </div>
          <p className={styles.ratingDescription}>{calculation.rating.description}</p>
        </Card>

        {/* Highlight Insights Card */}
        <Card className={styles.insightCard}>
          <h2>Key Insight</h2>
          <div className={styles.insightContent}>
            <div className={styles.insightHeader}>
              <ShieldAlert className={styles.insightIcon} />
              <h3>Highest Emission Area</h3>
            </div>
            <p className={styles.insightText}>
              Your highest emission source is <strong>{calculation.highestSource.name}</strong>, 
              accounting for <strong>{calculation.highestSource.value.toFixed(1)} tons</strong> of CO₂ annually.
            </p>

            {annualHabitSavingTons > 0 ? (
              <div className={styles.reductionBanner}>
                <TrendingDown className={styles.reductionIcon} />
                <div>
                  <h4>Committed Reductions</h4>
                  <p>
                    Your active habit commitments save <strong>{weeklyHabitSavingKg.toFixed(1)} kg</strong> CO₂/week, 
                    shrinking your footprint by <strong>{annualHabitSavingTons} tons</strong> annually to <strong>{projectedScore} tons</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.simulatorPromo}>
                <Sparkles className={styles.promoIcon} />
                <div>
                  <h4>Tweak Your Story</h4>
                  <p>
                    Wondering how much impact you can make? Try our Carbon Twin Simulator 
                    to model changes in real-time.
                  </p>
                  <Link href="/simulator" className={styles.promoLink}>
                    Open Twin Simulator &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Breakdown and Story Section */}
      <div className={styles.breakdownGrid}>
        
        {/* CSS Chart Card */}
        <Card className={styles.chartCard}>
          <h2>Emissions Breakdown</h2>
          <p className={styles.cardSubtitle}>Visual proportions of your carbon output</p>
          <div className={styles.chartWrap}>
            <AccessiblePie breakdown={calculation.breakdown} total={calculation.total} />
          </div>
        </Card>

        {/* Relatable Stories Card */}
        <Card className={styles.storyCard}>
          <h2>Why This Score Matters</h2>
          <p className={styles.cardSubtitle}>Translating abstract carbon metrics into nature equivalents</p>
          
          <div className={styles.storyGrid}>
            <div className={styles.storyItem}>
              <div className={styles.storyIconCircle} style={{ color: '#5d8a66', backgroundColor: '#eaf3eb' }}>
                <TreePine size={24} />
              </div>
              <div>
                <h3>{calculation.equivalents.treesSaved} Trees</h3>
                <p>Number of mature trees required to absorb your annual emissions from the atmosphere.</p>
              </div>
            </div>

            <div className={styles.storyItem}>
              <div className={styles.storyIconCircle} style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>
                <Car size={24} />
              </div>
              <div>
                <h3>{calculation.equivalents.drivingOffsetKm.toLocaleString()} km</h3>
                <p>Equivalent driving distance in an average gasoline car to emit the same amount of CO₂.</p>
              </div>
            </div>

            <div className={styles.storyItem}>
              <div className={styles.storyIconCircle} style={{ color: '#f59e0b', backgroundColor: '#fffbeb' }}>
                <Smartphone size={24} />
              </div>
              <div>
                <h3>{calculation.equivalents.smartphoneCharges.toLocaleString()}</h3>
                <p>Number of smartphones you could fully charge with this amount of energy consumption.</p>
              </div>
            </div>
          </div>
        </Card>

      </div>

      {/* CTA to Actions */}
      <Card className={styles.actionPlanCard}>
        <div className={styles.actionPlanContent}>
          <div>
            <h2>Take Simple Actions</h2>
            <p>
              Commit to small, personalized weekly changes to reduce your {calculation.total.toFixed(1)} tons score. 
              Track your daily habits and see your impact grow.
            </p>
          </div>
          <Link href="/action-plan" passHref legacyBehavior>
            <Button variant="primary" className={styles.actionCta}>
              View Weekly Action Plan <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
