import React from 'react';
import { FiMail } from 'react-icons/fi';
import SocialMediaLinks from './SocialMediaLinks';
import { profile } from '../data/profile';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__rule" aria-hidden="true" />
      <div className="site-footer__inner">
        <div className="site-footer__block">
          <span className="index-label">Contact</span>
          <div className="site-footer__contact">
            <a className="btn btn--primary" href={`mailto:${profile.email}`}>
              <FiMail aria-hidden="true" />
              Get in touch
            </a>
            {profile.showResume && (
              <a className="btn" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                Download resume
              </a>
            )}
          </div>
        </div>

        <div className="site-footer__block">
          <span className="index-label">Elsewhere</span>
          <SocialMediaLinks />
        </div>

        <div className="site-footer__block">
          <p className="instrument site-footer__copy">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
