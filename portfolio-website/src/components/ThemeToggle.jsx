import React, { useRef } from 'react';
import { flushSync } from 'react-dom';
import { FiMoon, FiSun } from 'react-icons/fi';
import '../styles/ThemeToggle.css';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  const ref = useRef(null);

  const handleClick = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!document.startViewTransition || reduced) {
      onToggle();
      return;
    }

    // Anchor the reveal on the button so the new theme appears to spread from
    // the control the reader just pressed.
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      document.documentElement.style.setProperty('--vt-x', `${rect.left + rect.width / 2}px`);
      document.documentElement.style.setProperty('--vt-y', `${rect.top + rect.height / 2}px`);
    }

    document.startViewTransition(() => {
      flushSync(() => onToggle());
    });
  };

  return (
    <button
      ref={ref}
      type="button"
      className="theme-toggle"
      onClick={handleClick}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? <FiSun /> : <FiMoon />}
    </button>
  );
}
