import React from 'react';
import { FiArrowUpRight, FiExternalLink } from 'react-icons/fi';
import Panel from './Panel';
import TagList from './TagList';
import '../styles/EntryCard.css';

/**
 * A project / experience card. `entry` shape:
 *   { title, description, tech[], links?: [{label, href}], period?, org? }
 * When the entry has links, the title becomes a link to the first one, with
 * its own hover treatment. The panel itself is not `interactive` — the card
 * contains multiple independent links (title plus a button row), so a
 * panel-wide hover/lift affordance would promise a single click target the
 * card doesn't have.
 * `index`, when given, renders as a zero-padded instrument-voice label.
 */
export default function EntryCard({ entry, index }) {
  const primary = entry.links && entry.links.length > 0 ? entry.links[0] : null;

  return (
    <Panel as="article" className="entry-card">
      <header className="entry-card__head">
        {typeof index === 'number' && (
          <span className="index-label entry-card__index">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        <h3 className="entry-card__title">
          {primary ? (
            <a
              className="entry-card__title-link"
              href={primary.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {entry.title}
              <FiArrowUpRight aria-hidden="true" />
            </a>
          ) : (
            entry.title
          )}
        </h3>
        {entry.period && <span className="meta entry-card__period">{entry.period}</span>}
      </header>
      {entry.org && <p className="entry-card__org instrument">{entry.org}</p>}
      <p className="entry-card__description prose">{entry.description}</p>
      <TagList items={entry.tech} label="Technologies used" />
      {entry.links && entry.links.length > 0 && (
        <div className="entry-card__links">
          {entry.links.map((link) => (
            <a
              key={link.href}
              className="btn"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label} <FiExternalLink aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
    </Panel>
  );
}
