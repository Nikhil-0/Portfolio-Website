import React from 'react';
import Navbar from './NavigationBar';
import SocialMediaLinks from './SocialMediaLinks';
import '../styles/header.css';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-content">
        <div className="site-title">
          <a href="/">Nikhil Madeti</a>
        </div>
        <Navbar />
        <SocialMediaLinks />
      </div>
    </header>
  );
}