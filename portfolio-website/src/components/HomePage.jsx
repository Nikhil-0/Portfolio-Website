import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight, FiMail } from 'react-icons/fi';
import EntryCard from './EntryCard';
import StatusRail from './StatusRail';
import CareerSpine from './CareerSpine';
import Panel from './Panel';
import Reveal from './Reveal';
import { profile } from '../data/profile';
import { featuredExperience } from '../data/projects';
import '../styles/HomePage.css';

const explore = [
  {
    to: '/projects',
    label: 'Projects & Experience',
    blurb: 'Trading engines, multi-agent AI, full-stack builds, and where I have worked.',
  },
  {
    to: '/education',
    label: 'Education',
    blurb: 'Computer Science at NTU, and the schooling that led there.',
  },
  {
    to: '/holistic-development',
    label: 'Holistic Development',
    blurb: 'Leadership, service and performance: from cadet corps to competing with NTU Choir.',
  },
  {
    to: '/blog',
    label: 'Blog',
    blurb: 'Longer write-ups on what I have built and what it taught me.',
  },
];

export default function HomePage() {
  return (
    <div className="page home">
      <section className="hero">
        <div className="hero__text">
          <p className="index-label hero__eyebrow">
            {profile.location} — Portfolio / 2026
          </p>
          <h1 className="hero__name">
            <span>{profile.name.split(' ')[0]}</span>
            <span>{profile.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="hero__tagline">{profile.tagline}</p>
          <p className="hero__bio prose">{profile.bio}</p>
          <StatusRail />
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/projects">
              View my work <FiArrowRight aria-hidden="true" />
            </Link>
            <a className="btn" href={`mailto:${profile.email}`}>
              <FiMail aria-hidden="true" /> Email me
            </a>
            {profile.showResume && (
              <a className="btn" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                Résumé
              </a>
            )}
          </div>
        </div>

        <figure className="hero__figure">
          <div className="hero__frame">
            <img
              className="hero__portrait"
              src={profile.portrait}
              alt={`Portrait of ${profile.name}`}
              width="320"
              height="400"
              fetchPriority="high"
            />
          </div>
          <figcaption className="instrument hero__caption">
            Fig. 01 — {profile.name}
          </figcaption>
        </figure>
      </section>

      <CareerSpine />

      {featuredExperience.length > 0 && (
        <section className="section">
          <Reveal as="div" className="section-head">
            <h2 className="section-heading section-heading--bare">Recent experience</h2>
            <Link className="section-head__link instrument" to="/projects">
              All projects &amp; experience <FiArrowRight aria-hidden="true" />
            </Link>
          </Reveal>
          <div className="entry-list">
            {featuredExperience.map((entry, i) => (
              <Reveal key={entry.title} index={i}>
                <EntryCard entry={entry} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <Reveal as="h2" className="section-heading">Explore</Reveal>
        <ul className="explore-grid">
          {explore.map((item, i) => {
            // Derived from `to` (unique per item, stable across re-renders)
            // rather than useId, since this is a static array mapped in
            // render, not a per-component identity.
            const blurbId = `explore-blurb-${item.to.replace(/\//g, '')}`;
            return (
              <Reveal as="li" key={item.to} index={i}>
                <Panel interactive className="explore-card__panel">
                  <span className="index-label">{String(i + 1).padStart(2, '0')}</span>
                  <span className="explore-card__label">
                    <Link className="explore-card" to={item.to} aria-describedby={blurbId}>
                      {item.label}
                    </Link>
                    <FiArrowUpRight aria-hidden="true" />
                  </span>
                  <span className="explore-card__blurb muted" id={blurbId}>
                    {item.blurb}
                  </span>
                </Panel>
              </Reveal>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
