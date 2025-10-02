import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavigationBar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/projects">Projects & Experience</Link></li>
        <li><Link to="/education">Education</Link></li>
        <li><Link to="/holistic-development">Holistic Development</Link></li>
      </ul>
    </nav>
  );
}