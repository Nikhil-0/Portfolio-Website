import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaMedium } from 'react-icons/fa';
import { socialLinks } from '../data/profile';
import '../styles/SocialMediaLinks.css';

const ICONS = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  medium: FaMedium,
};

export default function SocialMediaLinks({ className = '' }) {
  return (
    <div className={`social-media-links ${className}`.trim()}>
      {socialLinks.map(({ label, href, icon }) => {
        const Icon = ICONS[icon];
        return (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
          >
            {Icon ? <Icon /> : label}
          </a>
        );
      })}
    </div>
  );
}
