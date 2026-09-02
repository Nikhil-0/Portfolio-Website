import React from 'react';
import { motion as Motion, useReducedMotion } from 'motion/react';
import { DUR_REVEAL, EASE_OUT } from '../lib/motion';

const STAGGER_MS = 40;

/**
 * Fades and rises its children once, the first time they enter the viewport.
 *
 * Reveals fire once and do not replay on scroll-back — replaying draws
 * attention to content the reader has already accepted.
 *
 * With reduced motion, the rise is dropped entirely and only opacity changes.
 */
export default function Reveal({
  as = 'div',
  index = 0,
  className,
  children,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Component = Motion[as] ?? Motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{
        duration: reduced ? 0 : DUR_REVEAL,
        ease: EASE_OUT,
        delay: reduced ? 0 : (index * STAGGER_MS) / 1000,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
