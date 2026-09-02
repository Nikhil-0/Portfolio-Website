import React from 'react';

export default function TagList({ items, label = 'Tags' }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="tag-list" aria-label={label}>
      {items.map((item) => (
        <li key={item} className="tag">
          {item}
        </li>
      ))}
    </ul>
  );
}
