import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import '../styles/SocialMediaLinks.css';

export default function SocialMediaLinks() {
  return (
    <div className="social-media-links">
      <a href="https://github.com/Nikhil-0" target="_blank" rel="noopener noreferrer">
        <FaGithub />
      </a>
      <a href="https://www.linkedin.com/in/nikhil-madeti-07914337a/" target="_blank" rel="noopener noreferrer">
        <FaLinkedin />
      </a>
      <a href="https://instagram.com/ostrich.madeti" target="_blank" rel="noopener noreferrer">
        <FaInstagram />
      </a>
    </div>
  );
}