'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { Slider } from '@/components/Slider/Slider';
import { TransitType, DietType, EnergyType, ShoppingType, AssessmentResponse } from '@/domain/types';
import { AssessmentResponseSchema } from '@/domain/validationSchemas';
import { Car, Bike, Plane, Flame, ShoppingBag, Utensils, ArrowLeft, ArrowRight } from 'lucide-react';
import styles from './Assessment.module.css';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { 'aria-hidden'?: string }>;
}

export default function AssessmentPage() {
  const router = useRouter();
  const { submitAssessment } = useApp();
  
  // Local assessment answers state
  const [transportation, setTransportation] = useState<TransitType>('car-gas');
  const [weeklyMileage, setWeeklyMileage] = useState<number>(100);
  const [diet, setDiet] = useState<DietType>('balanced');
  const [homeEnergy, setHomeEnergy] = useState<EnergyType>('grid-average');
  const [travelFrequency, setTravelFrequency] = useState<number>(2);
  const [shoppingHabits, setShoppingHabits] = useState<ShoppingType>('average');

  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps: Step[] = [
    { id: 'transportation', title: 'Daily Commute', description: 'What is your primary mode of transportation?', icon: Car },
    { id: 'mileage', title: 'Commute Distance', description: 'How many kilometers do you commute/travel in a typical week?', icon: Bike },
    { id: 'diet', title: 'Food & Diet', description: 'What best describes your typical food consumption habits?', icon: Utensils },
    { id: 'energy', title: 'Home Energy Source', description: 'What power grid mix or fuel heats/cools your residence?', icon: Flame },
    { id: 'flights', title: 'Annual Flights', description: 'How many roundtrip flights do you take in an average year?', icon: Plane },
    { id: 'shopping', title: 'Shopping Style', description: 'What describes your consumption patterns for clothing, electronics, and goods?', icon: ShoppingBag },
  ];

  const totalSteps = steps.length;
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleRadioKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    options: string[],
    currentValue: string,
    setValue: (val: any) => void
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

  const handleNext = () => {
    // If user has no transportation, skip weekly mileage step
    if (currentStep === 0 && transportation === 'none') {
      setWeeklyMileage(0);
      setCurrentStep(2); // Jump over mileage slider
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFormSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep === 2 && transportation === 'none') {
      setCurrentStep(0); // Jump back past mileage slider
      return;
    }

    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setErrorMessage(null);
    }
  };

  const handleFormSubmit = () => {
    const payload: AssessmentResponse = {
      transportation,
      weeklyMileage,
      diet,
      homeEnergy,
      travelFrequency,
      shoppingHabits
    };

    const validation = AssessmentResponseSchema.safeParse(payload);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || 'Validation failed. Please review your answers.';
      setErrorMessage(errorMsg);
      return;
    }

    try {
      submitAssessment(validation.data);
      router.push('/dashboard');
    } catch (e: any) {
      setErrorMessage(e.message || 'An error occurred during calculation.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="sr-only">Carbon Footprint Lifestyle Assessment</h1>

      <div className={styles.formContainer}>
        {/* Progress Bar Header */}
        <div className={styles.progressHeader}>
          <span className={styles.progressText}>Question {currentStep + 1} of {totalSteps}</span>
          <div className={styles.progressBarBg} aria-hidden="true">
            <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Question Panel */}
        <Card className={styles.questionCard} role="main" aria-label={steps[currentStep].title}>
          <div className={styles.questionHeader}>
            {React.createElement(steps[currentStep].icon, { className: styles.stepIcon, 'aria-hidden': 'true' })}
            <h2 className={styles.stepTitle}>{steps[currentStep].title}</h2>
          </div>
          <p className={styles.stepDescription}>{steps[currentStep].description}</p>

          <hr className={styles.divider} aria-hidden="true" />

          {/* Question Contents */}
          <div className={styles.questionContent}>
            
            {/* Step 1: Transportation Type */}
            {currentStep === 0 && (
              <div 
                className={styles.optionGrid} 
                role="radiogroup" 
                aria-label="commute option"
                onKeyDown={(e) => handleRadioKeyDown(
                  e,
                  ['car-gas', 'car-hybrid', 'electric', 'transit', 'none'],
                  transportation,
                  (val) => setTransportation(val as TransitType)
                )}
              >
                {[
                  { value: 'car-gas', label: 'Gasoline Car', desc: 'Single occupancy fossil fuel vehicle' },
                  { value: 'car-hybrid', label: 'Hybrid Car', desc: 'Partial electric combustion vehicle' },
                  { value: 'electric', label: 'Electric EV', desc: 'Zero emissions tailpipe vehicle' },
                  { value: 'transit', label: 'Public Transit', desc: 'Buses, subways, metro systems' },
                  { value: 'none', label: 'Walk / Bike / None', desc: 'Active transit or no regular commute' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`${styles.optionBtn} ${transportation === opt.value ? styles.selected : ''}`}
                    onClick={() => setTransportation(opt.value as TransitType)}
                    role="radio"
                    aria-checked={transportation === opt.value}
                    tabIndex={transportation === opt.value ? 0 : -1}
                  >
                    <span className={styles.optLabel}>{opt.label}</span>
                    <span className={styles.optDesc}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Commute Distance */}
            {currentStep === 1 && (
              <div className={styles.sliderWrap}>
                <Slider
                  id="weekly-mileage-slider"
                  label="Weekly Travel Distance"
                  min={0}
                  max={1500}
                  step={10}
                  value={weeklyMileage}
                  onChange={setWeeklyMileage}
                  valueDisplay={`${weeklyMileage} km / week`}
                />
                <p className={styles.calcContext}>
                  Calculated based on your weekly commute. 
                  Commuting in a <strong>{transportation.replace('car-', '').toUpperCase()}</strong> vehicle.
                </p>
              </div>
            )}

            {/* Step 3: Diet & Food */}
            {currentStep === 2 && (
              <div 
                className={styles.optionGrid} 
                role="radiogroup" 
                aria-label="diet options"
                onKeyDown={(e) => handleRadioKeyDown(
                  e,
                  ['meat-heavy', 'balanced', 'low-meat', 'vegetarian', 'vegan'],
                  diet,
                  (val) => setDiet(val as DietType)
                )}
              >
                {[
                  { value: 'meat-heavy', label: 'Meat Heavy', desc: 'Eat red meat (beef, pork) almost daily' },
                  { value: 'balanced', label: 'Balanced', desc: 'Mix of meat, poultry, vegetables, grains' },
                  { value: 'low-meat', label: 'Low Meat', desc: 'Rarely eat red meat, mostly vegetarian/poultry' },
                  { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat or fish; consume eggs & dairy' },
                  { value: 'vegan', label: 'Vegan', desc: 'Purely plant-based food only' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`${styles.optionBtn} ${diet === opt.value ? styles.selected : ''}`}
                    onClick={() => setDiet(opt.value as DietType)}
                    role="radio"
                    aria-checked={diet === opt.value}
                    tabIndex={diet === opt.value ? 0 : -1}
                  >
                    <span className={styles.optLabel}>{opt.label}</span>
                    <span className={styles.optDesc}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Home Energy Source */}
            {currentStep === 3 && (
              <div 
                className={styles.optionGrid} 
                role="radiogroup" 
                aria-label="home energy options"
                onKeyDown={(e) => handleRadioKeyDown(
                  e,
                  ['coal-gas', 'grid-average', 'renewable'],
                  homeEnergy,
                  (val) => setHomeEnergy(val as EnergyType)
                )}
              >
                {[
                  { value: 'coal-gas', label: 'Coal & Gas Mix', desc: 'Traditional carbon-heavy grid electricity/heating' },
                  { value: 'grid-average', label: 'Standard Grid Average', desc: 'Mixed standard grid with average clean integration' },
                  { value: 'renewable', label: '100% Renewables', desc: 'Solar, wind energy, or dedicated green tariff' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`${styles.optionBtn} ${homeEnergy === opt.value ? styles.selected : ''}`}
                    onClick={() => setHomeEnergy(opt.value as EnergyType)}
                    role="radio"
                    aria-checked={homeEnergy === opt.value}
                    tabIndex={homeEnergy === opt.value ? 0 : -1}
                  >
                    <span className={styles.optLabel}>{opt.label}</span>
                    <span className={styles.optDesc}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 5: Flights */}
            {currentStep === 4 && (
              <div className={styles.sliderWrap}>
                <Slider
                  id="travel-flights-slider"
                  label="Roundtrip Flights per Year"
                  min={0}
                  max={50}
                  step={1}
                  value={travelFrequency}
                  onChange={setTravelFrequency}
                  valueDisplay={`${travelFrequency} flight${travelFrequency === 1 ? '' : 's'} / year`}
                />
                <p className={styles.calcContext}>
                  Short and long-haul flights averaged at ~0.9 metric tons CO2 per roundtrip commute.
                </p>
              </div>
            )}

            {/* Step 6: Shopping habits */}
            {currentStep === 5 && (
              <div 
                className={styles.optionGrid} 
                role="radiogroup" 
                aria-label="shopping options"
                onKeyDown={(e) => handleRadioKeyDown(
                  e,
                  ['heavy-consumer', 'average', 'minimalist'],
                  shoppingHabits,
                  (val) => setShoppingHabits(val as ShoppingType)
                )}
              >
                {[
                  { value: 'heavy-consumer', label: 'Heavy Consumer', desc: 'Regularly purchase brand new clothes, gadgets, and items' },
                  { value: 'average', label: 'Average Consumer', desc: 'Shop occasionally; replace goods when they break' },
                  { value: 'minimalist', label: 'Minimalist / Thrifter', desc: 'Buy secondhand, mend items, purchase very rarely' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`${styles.optionBtn} ${shoppingHabits === opt.value ? styles.selected : ''}`}
                    onClick={() => setShoppingHabits(opt.value as ShoppingType)}
                    role="radio"
                    aria-checked={shoppingHabits === opt.value}
                    tabIndex={shoppingHabits === opt.value ? 0 : -1}
                  >
                    <span className={styles.optLabel}>{opt.label}</span>
                    <span className={styles.optDesc}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            )}

          </div>

          {errorMessage && (
            <div className={styles.errorBanner} role="alert">
              {errorMessage}
            </div>
          )}

          {/* Navigation Controls */}
          <div className={styles.navigationControls}>
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={styles.navBtn}
            >
              <ArrowLeft size={16} style={{ marginRight: 8 }} /> Back
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              className={styles.navBtn}
            >
              {currentStep === totalSteps - 1 ? 'Calculate Score' : 'Next'} <ArrowRight size={16} style={{ marginLeft: 8 }} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
