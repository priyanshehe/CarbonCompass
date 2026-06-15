'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { Compass, Sparkles, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import styles from './Landing.module.css';

export default function LandingPage() {
  const { state } = useApp();

  return (
    <div className={styles.wrapper}>
      {/* Hero Section */}
      <section className={styles.heroSection} aria-label="Introduction">
        <div className={styles.heroContent}>
          <div className={styles.textColumn}>
            <span className={styles.badge}>Behavior-First Carbon Tracker</span>
            <h1 className={styles.title}>
              Know Your Carbon Story. <br />
              <span className={styles.highlight}>Change It One Habit At A Time.</span>
            </h1>
            <p className={styles.subtitle}>
              Carbon Compass doesn&apos;t just calculate your footprint—it helps you reshape it. 
              Simulate shifts in real-time and commit to simple, private, everyday habits that add up to real impact.
            </p>

            <div className={styles.ctaGroup}>
              {state.hasCompletedAssessment ? (
                <div className={styles.welcomeBack}>
                  <Link href="/dashboard" passHref legacyBehavior>
                    <Button variant="primary" className={styles.mainCta}>
                      Go to Dashboard <ArrowRight size={18} style={{ marginLeft: 8 }} />
                    </Button>
                  </Link>
                  <Link href="/assessment" className={styles.retakeLink}>
                    Retake Assessment
                  </Link>
                </div>
              ) : (
                <Link href="/assessment" passHref legacyBehavior>
                  <Button variant="primary" className={styles.mainCta}>
                    Start Assessment <ArrowRight size={18} style={{ marginLeft: 8 }} />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Visual Column: CSS-Animated Earth */}
          <div className={styles.visualColumn} aria-hidden="true">
            <div className={styles.globeContainer}>
              <div className={styles.atmosphereGlow} />
              <div className={styles.globeBody}>
                <div className={styles.gridLinesX} />
                <div className={styles.gridLinesY} />
                <div className={styles.continentBlob1} />
                <div className={styles.continentBlob2} />
              </div>
              <div className={styles.orbitingParticle} />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy/Core Features Section */}
      <section className={styles.featuresSection} aria-label="Core Capabilities">
        <h2 className={styles.sectionTitle}>Built for Behavior Change</h2>
        <div className={styles.featureGrid}>
          <Card className={styles.featureCard}>
            <Compass className={styles.featureIcon} />
            <h3>60-Second Onboarding</h3>
            <p>
              Answer 5 simple questions about your daily commute, diet, and flights. 
              No tedious receipts or details required.
            </p>
          </Card>

          <Card className={styles.featureCard}>
            <Sparkles className={styles.featureIcon} />
            <h3>Carbon Twin Simulator</h3>
            <p>
              Tweak lifestyle variables on virtual sliders. Instantly visualize how a 
              Meatless Monday or transit switch shrinks your footprint.
            </p>
          </Card>

          <Card className={styles.featureCard}>
            <HeartHandshake className={styles.featureIcon} />
            <h3>Habits Over Guilt</h3>
            <p>
              Emissions are translated into stories—like trees saved or smartphone charges avoided. 
              Small, compounding habits beat guilt every time.
            </p>
          </Card>

          <Card className={styles.featureCard}>
            <ShieldCheck className={styles.featureIcon} />
            <h3>100% Client-Side Privacy</h3>
            <p>
              Your environmental footprint is personal. Carbon Compass validates and runs all data 
              strictly locally in your browser.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
