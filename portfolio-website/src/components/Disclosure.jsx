import React, { useId, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'motion/react';
import { FiChevronDown } from 'react-icons/fi';
import { DUR_TRANSITION, EASE_OUT } from '../lib/motion';
import '../styles/Disclosure.css';

/**
 * An accessible, animated expand/collapse.
 *
 * The native `<details>` element cannot animate its own height, so this
 * replaces it with a button + region pair and wires ARIA by hand:
 * `aria-expanded` on the toggle, `aria-controls`/`aria-labelledby` linking
 * button and panel, and native button semantics for Enter/Space activation.
 *
 * Height is the one property this codebase animates outside the
 * transform/opacity rule — a disclosure that does not animate height either
 * jumps or requires a fixed height it cannot know.
 */
export default function Disclosure({ summary, children, className = '' }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className={`disclosure ${className}`.trim()}>
      <button
        type="button"
        id={buttonId}
        className="disclosure__summary instrument"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {summary}
        <FiChevronDown
          className={`disclosure__chevron${open ? ' disclosure__chevron--open' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <Motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="disclosure__panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : DUR_TRANSITION, ease: EASE_OUT }}
            style={{ overflow: 'hidden' }}
          >
            <div className="disclosure__inner">{children}</div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
