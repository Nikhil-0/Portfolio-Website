import React from 'react';

export default function SectionHeading({ children, id }) {
  return (
    <h2 id={id} className="section-heading">
      {children}
    </h2>
  );
}
