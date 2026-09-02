import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion as Motion, useScroll } from 'motion/react';
import NavigationBar from './NavigationBar';
import SocialMediaLinks from './SocialMediaLinks';
import ThemeToggle from './ThemeToggle';
import LiveClock from './LiveClock';
import { profile } from '../data/profile';
import '../styles/header.css';

// Hysteresis band for the condensed state. The condensed padding is shorter
// by ~16px, and because the header sits in normal flow (position: sticky),
// shrinking it pulls scrollY back down by that delta — scroll anchoring can
// then cross a single threshold going the other way and flip straight back.
// A ~30px gap between the enter and exit thresholds absorbs that shift so
// the state can't oscillate.
const CONDENSE_ON = 80;
const CONDENSE_OFF = 48;

export default function Header({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const wasOpen = useRef(false);

  // Condense the header past CONDENSE_ON; only expand it again once scrolled
  // back up past CONDENSE_OFF (see hysteresis note above).
  useEffect(() => {
    const onScroll = () => {
      setCondensed((prev) => (prev ? window.scrollY > CONDENSE_OFF : window.scrollY > CONDENSE_ON));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Return focus to the toggle when the menu closes (not on the initial render).
  useEffect(() => {
    if (wasOpen.current && !menuOpen) toggleRef.current?.focus();
    wasOpen.current = menuOpen;
  }, [menuOpen]);

  // While the menu is open: lock body scroll, close on Escape, and trap focus in the panel.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const focusables = () =>
      panelRef.current
        ? Array.from(panelRef.current.querySelectorAll('a[href], button:not([disabled])'))
        : [];

    focusables()[0]?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header className={`site-header${condensed ? ' site-header--condensed' : ''}`}>
      <div className="header-content">
        <div className="site-title">
          <Link to="/">{profile.name}</Link>
          <span className="instrument site-title__role">{profile.current}</span>
        </div>

        <NavigationBar className="navbar--desktop" />

        <div className="header-actions">
          <LiveClock />
          <SocialMediaLinks className="social-media-links--desktop" />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            ref={toggleRef}
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      <Motion.div
        className="site-header__progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />

      {menuOpen &&
        createPortal(
          <div
            className="mobile-menu"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div
              className="mobile-menu__backdrop"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="mobile-menu__panel" ref={panelRef}>
              <div className="mobile-menu__top">
                <span className="eyebrow">Menu</span>
                <button
                  type="button"
                  className="menu-button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <FiX />
                </button>
              </div>
              <NavigationBar
                className="navbar--mobile"
                onNavigate={() => setMenuOpen(false)}
              />
              <SocialMediaLinks className="social-media-links--mobile" />
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
