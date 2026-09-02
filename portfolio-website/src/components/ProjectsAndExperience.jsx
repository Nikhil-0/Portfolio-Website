import React, { useMemo, useState } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import SectionHeading from './SectionHeading';
import EntryCard from './EntryCard';
import Reveal from './Reveal';
import TagList from './TagList';
import Panel from './Panel';
import FilterChips, { ALL } from './FilterChips';
import { certifications } from '../data/certifications';
import { experience, projects } from '../data/projects';
import '../styles/timeline.css';
import '../styles/ProjectsAndExperience.css';

function railLines(period) {
  return String(period || '')
    .split(/\s*[–-]\s*/)
    .filter(Boolean);
}

// UI bucket label for certifications with no issuer in the data — not a
// claimed issuer, so it doesn't violate the no-invention constraint.
const OTHER = 'Other';

export default function ProjectsAndExperience() {
  const [issuer, setIssuer] = useState(ALL);

  // Issuers are derived from the data, so adding a certification with a new
  // issuer adds a chip with no component change. Certifications with an
  // empty issuer group under a trailing "Other" chip, which only appears
  // when the data actually has one and always sorts after the real issuers.
  const issuers = useMemo(() => {
    const real = [...new Set(certifications.map((c) => c.issuer).filter(Boolean))].sort();
    const hasOther = certifications.some((c) => !c.issuer);
    return hasOther ? [...real, OTHER] : real;
  }, []);

  const visibleCertifications = useMemo(() => {
    if (issuer === ALL) return certifications;
    if (issuer === OTHER) return certifications.filter((c) => !c.issuer);
    return certifications.filter((c) => c.issuer === issuer);
  }, [issuer]);

  return (
    <div className="page">
      {experience.length > 0 && (
        <section className="section">
          <Reveal>
            <SectionHeading>Experience</SectionHeading>
          </Reveal>
          <div className="timeline">
            {experience.map((entry, i) => (
              <Reveal className="timeline__item" key={entry.title + entry.org} index={i}>
                <div className="timeline__rail">
                  <span className="index-label">{String(i + 1).padStart(2, '0')}</span>
                  {railLines(entry.period).map((line, j) => (
                    <div className="instrument" key={j}>{line}</div>
                  ))}
                </div>
                <div className="timeline__body">
                  <h3 className="timeline__title">{entry.title}</h3>
                  {entry.org && <p className="timeline__org instrument">{entry.org}</p>}
                  <p className="prose">{entry.description}</p>
                  <TagList items={entry.tech} label="Technologies used" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <Reveal>
          <SectionHeading>Projects</SectionHeading>
        </Reveal>
        <div className="entry-list entry-list--grid">
          {projects.map((entry, i) => (
            <Reveal
              key={entry.title}
              index={i}
              className={i === 0 ? 'entry-list__feature' : undefined}
            >
              <EntryCard entry={entry} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading>Certifications</SectionHeading>
        <FilterChips
          options={issuers}
          value={issuer}
          onChange={setIssuer}
          label="Filter certifications by issuer"
        />
        <ul className="certifications-grid">
          {visibleCertifications.map((cert) => {
            const inner = (
              <>
                <span className="certification-card__frame">
                  <img
                    src={cert.image}
                    alt={`${cert.title} certificate`}
                    className="certification-card__image"
                    width="320"
                    height="200"
                    loading="lazy"
                  />
                </span>
                <span className="certification-card__title">
                  {cert.title}
                  {cert.url && <FiArrowUpRight aria-hidden="true" />}
                </span>
                {cert.issuer && (
                  <span className="meta certification-card__issuer">{cert.issuer}</span>
                )}
              </>
            );
            return (
              <li key={cert.title}>
                {cert.url ? (
                  <Panel
                    as="a"
                    interactive
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="certification-card"
                  >
                    {inner}
                  </Panel>
                ) : (
                  <Panel className="certification-card">{inner}</Panel>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
