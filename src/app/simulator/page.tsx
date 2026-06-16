'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { calculateCarbonFootprint } from '@/domain/carbonCalculator';
import { Card } from '@/components/Card/Card';
import { Button } from '@/components/Button/Button';
import { Slider } from '@/components/Slider/Slider';
import { TransitType, DietType, EnergyType, ShoppingType, AssessmentResponse } from '@/domain/types';
import { Compass, Sparkles, TrendingDown, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import styles from './Simulator.module.css';

export default function SimulatorPage() {
  const { state, updateSimulatedOverrides, isHydrated } = useApp();
  
  // Local state for simulated values
  const [simTransit, setSimTransit] = useState<TransitType>('transit');
  const [simMileage, setSimMileage] = useState<number>(0);
  const [simDiet, setSimDiet] = useState<DietType>('balanced');
  const [simEnergy, setSimEnergy] = useState<EnergyType>('grid-average');
  const [simFlights, setSimFlights] = useState<number>(0);
  const [simShopping, setSimShopping] = useState<ShoppingType>('average');
  
  const [isAdopted, setIsAdopted] = useState(false);

  // Hydrate local simulation state with current profile assessment
  useEffect(() => {
    if (isHydrated && state.hasCompletedAssessment) {
      const current = state.assessment;
      // If there are existing overrides in state, load them, otherwise current profile
      const overrides = state.simulatedAssessmentOverrides;
      setSimTransit(overrides.transportation ?? current.transportation);
      setSimMileage(overrides.weeklyMileage ?? current.weeklyMileage);
      setSimDiet(overrides.diet ?? current.diet);
      setSimEnergy(overrides.homeEnergy ?? current.homeEnergy);
      setSimFlights(overrides.travelFrequency ?? current.travelFrequency);
      setSimShopping(overrides.shoppingHabits ?? current.shoppingHabits);
    }
  }, [isHydrated, state.hasCompletedAssessment, state.assessment, state.simulatedAssessmentOverrides]);

  // Calculate current baseline footprint (memoized)
  const currentFootprint = React.useMemo(() => {
    return calculateCarbonFootprint(state.assessment);
  }, [state.assessment]);

  // Calculate simulated projected footprint (memoized)
  const simulatedAssessment = React.useMemo<AssessmentResponse>(() => ({
    transportation: simTransit,
    weeklyMileage: simTransit === 'none' ? 0 : simMileage,
    diet: simDiet,
    homeEnergy: simEnergy,
    travelFrequency: simFlights,
    shoppingHabits: simShopping
  }), [simTransit, simMileage, simDiet, simEnergy, simFlights, simShopping]);

  const projectedFootprint = React.useMemo(() => {
    return calculateCarbonFootprint(simulatedAssessment);
  }, [simulatedAssessment]);

  const reductionTons = React.useMemo(() => {
    return parseFloat((currentFootprint.total - projectedFootprint.total).toFixed(2));
  }, [currentFootprint.total, projectedFootprint.total]);

  const reductionPercent = React.useMemo(() => {
    return currentFootprint.total > 0
      ? Math.round((reductionTons / currentFootprint.total) * 100)
      : 0;
  }, [reductionTons, currentFootprint.total]);

  const handleRadioKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    options: string[],
    currentValue: string,
    setValue: (val: string) => void
  ) => {
    const currentIndex = options.indexOf(currentValue);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % options.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else {
      return;
    }

    const nextValue = options[nextIndex];
    setValue(nextValue);

    const buttons = e.currentTarget.querySelectorAll<HTMLButtonElement>('button');
    buttons[nextIndex]?.focus();
  };

  const handleReset = () => {
    const current = state.assessment;
    setSimTransit(current.transportation);
    setSimMileage(current.weeklyMileage);
    setSimDiet(current.diet);
    setSimEnergy(current.homeEnergy);
    setSimFlights(current.travelFrequency);
    setSimShopping(current.shoppingHabits);
    setIsAdopted(false);
    updateSimulatedOverrides({});
  };

  const handleAdopt = () => {
    // Save overrides globally to context state
    updateSimulatedOverrides({
      transportation: simTransit,
      weeklyMileage: simTransit === 'none' ? 0 : simMileage,
      diet: simDiet,
      homeEnergy: simEnergy,
      travelFrequency: simFlights,
      shoppingHabits: simShopping
    });
    setIsAdopted(true);
    setTimeout(() => setIsAdopted(false), 4000); // clear visual success feedback after 4s
  };

  if (!isHydrated) {
    return (
      <div className={styles.loadingContainer}>
        <RefreshCw className={styles.spinner} aria-hidden="true" />
        <p>Loading Simulator Environment...</p>
      </div>
    );
  }

  // Handle empty state
  if (!state.hasCompletedAssessment) {
    return (
      <div className={styles.emptyContainer}>
        <Card className={styles.emptyCard}>
          <Compass className={styles.emptyIcon} aria-hidden="true" />
          <h2>Carbon Twin Simulator Locked</h2>
          <p>
            You must establish a baseline footprint before using the simulator. 
            Complete the 60-second assessment first to generate your &quot;Carbon Twin&quot;.
          </p>
          <Link href="/assessment">
            <Button variant="primary" className={styles.emptyCta}>
              Take Assessment First
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Carbon Twin Simulator</h1>
          <p className={styles.subtitle}>
            Tweak your lifestyle sliders on your virtual twin to instantly visualize how behavioral changes reduce your emissions.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" onClick={handleReset} className={styles.resetBtn}>
            <RefreshCw size={14} style={{ marginRight: 8 }} /> Reset to Baseline
          </Button>
        </div>
      </div>

      {/* Simulator Layout split in two: Left Controls, Right Real-time Graph */}
      <div className={styles.grid}>
        
        {/* Sliders and Controls Pane */}
        <Card className={styles.controlsCard}>
          <h2>Adjust Twin Lifestyle</h2>
          <p className={styles.cardSubtitle}>Modify transit, diet, home, and shopping variables</p>
          
          <hr className={styles.divider} aria-hidden="true" />
          
          <div className={styles.controlsList}>
            {/* Transit COMMUTE MODE SELECT */}
            <div className={styles.controlGroup}>
              <span className={styles.controlTitle}>Commute Transit Type</span>
              <div 
                className={styles.radioGrid} 
                role="radiogroup" 
                aria-label="Simulated Transit Type"
                onKeyDown={(e) => handleRadioKeyDown(
                  e,
                  ['car-gas', 'car-hybrid', 'electric', 'transit', 'none'],
                  simTransit,
                  (val) => setSimTransit(val as TransitType)
                )}
              >
                {[
                  { value: 'car-gas', label: 'Gas Car' },
                  { value: 'car-hybrid', label: 'Hybrid' },
                  { value: 'electric', label: 'Electric EV' },
                  { value: 'transit', label: 'Transit' },
                  { value: 'none', label: 'Active/None' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`${styles.radioBtn} ${simTransit === opt.value ? styles.radioSelected : ''}`}
                    onClick={() => setSimTransit(opt.value as TransitType)}
                    role="radio"
                    aria-checked={simTransit === opt.value}
                    tabIndex={simTransit === opt.value ? 0 : -1}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Commute distance slider (active only if transit is not none) */}
            {simTransit !== 'none' && (
              <div className={styles.controlGroup}>
                <Slider
                  id="sim-mileage-slider"
                  label="Weekly Travel Distance"
                  min={0}
                  max={1500}
                  step={10}
                  value={simMileage}
                  onChange={setSimMileage}
                  valueDisplay={`${simMileage} km / week`}
                />
              </div>
            )}

            {/* Diet choice */}
            <div className={styles.controlGroup}>
              <span className={styles.controlTitle}>Diet & Food Plan</span>
              <div 
                className={styles.radioGrid} 
                role="radiogroup" 
                aria-label="Simulated Diet"
                onKeyDown={(e) => handleRadioKeyDown(
                  e,
                  ['meat-heavy', 'balanced', 'low-meat', 'vegetarian', 'vegan'],
                  simDiet,
                  (val) => setSimDiet(val as DietType)
                )}
              >
                {[
                  { value: 'meat-heavy', label: 'Meat Heavy' },
                  { value: 'balanced', label: 'Balanced' },
                  { value: 'low-meat', label: 'Low Meat' },
                  { value: 'vegetarian', label: 'Vegetarian' },
                  { value: 'vegan', label: 'Vegan' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`${styles.radioBtn} ${simDiet === opt.value ? styles.radioSelected : ''}`}
                    onClick={() => setSimDiet(opt.value as DietType)}
                    role="radio"
                    aria-checked={simDiet === opt.value}
                    tabIndex={simDiet === opt.value ? 0 : -1}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Home utility clean energy mix */}
            <div className={styles.controlGroup}>
              <span className={styles.controlTitle}>Home Power Source</span>
              <div 
                className={styles.radioGrid} 
                role="radiogroup" 
                aria-label="Simulated Home energy"
                onKeyDown={(e) => handleRadioKeyDown(
                  e,
                  ['coal-gas', 'grid-average', 'renewable'],
                  simEnergy,
                  (val) => setSimEnergy(val as EnergyType)
                )}
              >
                {[
                  { value: 'coal-gas', label: 'Fossil Mix' },
                  { value: 'grid-average', label: 'Standard Grid' },
                  { value: 'renewable', label: '100% Green' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`${styles.radioBtn} ${simEnergy === opt.value ? styles.radioSelected : ''}`}
                    onClick={() => setSimEnergy(opt.value as EnergyType)}
                    role="radio"
                    aria-checked={simEnergy === opt.value}
                    tabIndex={simEnergy === opt.value ? 0 : -1}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Flights per year */}
            <div className={styles.controlGroup}>
              <Slider
                id="sim-flights-slider"
                label="Annual Roundtrip Flights"
                min={0}
                max={50}
                step={1}
                value={simFlights}
                onChange={setSimFlights}
                valueDisplay={`${simFlights} flight${simFlights === 1 ? '' : 's'} / yr`}
              />
            </div>

            {/* Consumer Goods Shopping Style */}
            <div className={styles.controlGroup}>
              <span className={styles.controlTitle}>Shopping Goods Pattern</span>
              <div 
                className={styles.radioGrid} 
                role="radiogroup" 
                aria-label="Simulated Shopping"
                onKeyDown={(e) => handleRadioKeyDown(
                  e,
                  ['heavy-consumer', 'average', 'minimalist'],
                  simShopping,
                  (val) => setSimShopping(val as ShoppingType)
                )}
              >
                {[
                  { value: 'heavy-consumer', label: 'Heavy New' },
                  { value: 'average', label: 'Average' },
                  { value: 'minimalist', label: 'Minimalist' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`${styles.radioBtn} ${simShopping === opt.value ? styles.radioSelected : ''}`}
                    onClick={() => setSimShopping(opt.value as ShoppingType)}
                    role="radio"
                    aria-checked={simShopping === opt.value}
                    tabIndex={simShopping === opt.value ? 0 : -1}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </Card>

        {/* Real-time Graph & Projected Impact Card */}
        <div className={styles.outputColumn}>
          <Card className={styles.impactCard}>
            <h2>Simulated Impact</h2>
            <p className={styles.cardSubtitle}>Visual comparison of baseline vs. projected footprint</p>
            
            {/* Visual comparison bar height */}
            <div className={styles.graphContainer} aria-hidden="true">
              {/* Baseline track */}
              <div className={styles.barTrack}>
                <div className={styles.barValue}>{currentFootprint.total.toFixed(1)} t</div>
                <div className={styles.barFillBaseline} style={{ height: '80%' }} />
                <div className={styles.barLabel}>Baseline</div>
              </div>
              
              {/* Projected track */}
              <div className={styles.barTrack}>
                <div className={styles.barValue}>{projectedFootprint.total.toFixed(1)} t</div>
                <div 
                  className={styles.barFillProjected} 
                  style={{ 
                    height: `${Math.max(10, (projectedFootprint.total / Math.max(1, currentFootprint.total)) * 80)}%` 
                  }} 
                />
                <div className={styles.barLabel}>Projected</div>
              </div>
            </div>

            {/* Savings callout box */}
            {reductionTons > 0 ? (
              <div className={styles.reductionSuccessBox}>
                <TrendingDown className={styles.reductionIcon} />
                <div>
                  <h3>Potential Savings</h3>
                  <p>
                    Your simulated lifestyle cuts <strong>{reductionTons.toFixed(1)} tons</strong> of CO₂ annually. 
                    This represents a <strong>{reductionPercent}% footprint reduction</strong>!
                  </p>
                </div>
              </div>
            ) : reductionTons < 0 ? (
              <div className={styles.reductionIncreaseBox}>
                <TrendingDown className={styles.reductionIcon} style={{ transform: 'rotate(180deg)', color: 'var(--color-error)' }} />
                <div>
                  <h3>Footprint Increased</h3>
                  <p>
                    These simulated selections raise your annual footprint by <strong>{Math.abs(reductionTons).toFixed(1)} tons</strong> (+{Math.abs(reductionPercent)}%).
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.reductionNeutralBox}>
                <Compass className={styles.neutralIcon} />
                <p>Adjust the sliders to simulate a reduction below your current baseline footprint.</p>
              </div>
            )}

            {/* Adopt / Commit Actions */}
            <div className={styles.adoptWrapper}>
              <Button 
                variant={reductionTons > 0 ? 'primary' : 'secondary'} 
                onClick={handleAdopt}
                disabled={reductionTons <= 0}
                className={styles.adoptBtn}
              >
                {isAdopted ? (
                  <>
                    <CheckCircle size={18} style={{ marginRight: 8 }} /> Simulated Goals Saved!
                  </>
                ) : (
                  <>
                    Adopt Simulated Goals <Sparkles size={16} style={{ marginLeft: 8 }} />
                  </>
                )}
              </Button>
              
              {reductionTons > 0 && (
                <div className={styles.actionRecommendation}>
                  <p>
                    💡 <strong>Next step:</strong> Head to your habit planner to choose active, simple habits 
                    that match your simulated savings goals.
                  </p>
                  <Link href="/action-plan">
                    <Button variant="link" className={styles.recommendationLink}>
                      Configure Action Plan Habits <ArrowRight size={14} style={{ marginLeft: 4 }} />
                    </Button>
                  </Link>
                </div>
              )}
            </div>

          </Card>
        </div>

      </div>
    </div>
  );
}
