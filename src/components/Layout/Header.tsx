'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Compass, Menu, X, BarChart3, Settings, Sparkles, CalendarCheck2 } from 'lucide-react';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { state } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const showCoreNav = state.hasCompletedAssessment;

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        mobileMenuBtnRef.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        const nav = mobileNavRef.current;
        if (!nav) return;

        const focusableElements = nav.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (focusableElements.length === 0) return;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Shift focus into first drawer element
    setTimeout(() => {
      const firstLink = mobileNavRef.current?.querySelector('a');
      firstLink?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3, requireAssessment: true },
    { href: '/simulator', label: 'Carbon Twin', icon: Sparkles, requireAssessment: true },
    { href: '/action-plan', label: 'Action Plan', icon: CalendarCheck2, requireAssessment: true },
    { href: '/settings', label: 'Settings & A11y', icon: Settings, requireAssessment: false },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Skip Navigation Link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
          <Compass className={styles.logoIcon} aria-hidden="true" />
          <span className={styles.logoText}>Carbon Compass</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          <ul className={styles.navList}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isBlocked = item.requireAssessment && !showCoreNav;
              
              if (isBlocked) return null;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className={styles.navIcon} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            {!showCoreNav && (
              <li>
                <Link href="/assessment" className={styles.ctaButton}>
                  Start Assessment
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          ref={mobileMenuBtnRef}
          className={styles.mobileMenuBtn}
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          ref={mobileNavRef}
          id="mobile-nav"
          className={styles.mobileNav}
          aria-label="Mobile Navigation"
        >
          <ul className={styles.mobileNavList}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isBlocked = item.requireAssessment && !showCoreNav;

              if (isBlocked) return null;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.mobileNavLink} ${isActive ? styles.mobileActive : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={closeMobileMenu}
                  >
                    <item.icon className={styles.mobileNavIcon} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            {!showCoreNav && (
              <li className={styles.mobileCtaItem}>
                <Link
                  href="/assessment"
                  className={styles.mobileCtaButton}
                  onClick={closeMobileMenu}
                >
                  Start Assessment
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};
