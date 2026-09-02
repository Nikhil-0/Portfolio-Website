import React from 'react';
import '../styles/FilterChips.css';

export const ALL = 'All';

/**
 * A controlled single-select filter, rendered as a radio group so keyboard
 * users get arrow-key navigation for free and screen readers announce the
 * selection state. Deliberately not a row of buttons.
 */
export default function FilterChips({ options, value, onChange, label }) {
  return (
    <fieldset className="filter-chips">
      <legend className="visually-hidden">{label}</legend>
      {[ALL, ...options].map((option) => (
        <label
          key={option}
          className={`filter-chip${value === option ? ' filter-chip--on' : ''}`}
        >
          <input
            type="radio"
            name={label}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="visually-hidden"
          />
          {option}
        </label>
      ))}
    </fieldset>
  );
}
