import React from 'react';
import { NavLink } from 'react-router-dom';
import { navLinks } from '../data/nav';
import '../styles/NavigationBar.css';

export default function NavigationBar({ id, className = '', onNavigate }) {
  return (
    <nav id={id} className={`navbar ${className}`.trim()} aria-label="Primary">
      <ul>
        {navLinks.map((link, i) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === '/'}
              onClick={onNavigate}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              <span className="nav-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="nav-label">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
