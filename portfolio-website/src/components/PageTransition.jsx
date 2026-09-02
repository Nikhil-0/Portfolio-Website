import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'motion/react';
import { DUR_TRANSITION, EASE_OUT } from '../lib/motion';

/**
 * Animates route changes.
 *
 * Scroll position on navigation is owned by usePageTitle (src/hooks/usePageTitle.js),
 * which resets to top except when the URL carries a hash anchor. Do not
 * duplicate that reset here — a second, unconditional scroll-to-top on the
 * same pathname change would defeat that exemption and yank hash-anchored
 * pages (e.g. /blog#some-post) back up mid-exit-animation.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: reduced ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduced ? 0 : -4 }}
        transition={{ duration: reduced ? 0 : DUR_TRANSITION, ease: EASE_OUT }}
      >
        {children}
      </Motion.div>
    </AnimatePresence>
  );
}
