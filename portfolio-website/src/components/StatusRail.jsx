import React from 'react';
import { profile } from '../data/profile';
import '../styles/StatusRail.css';

/**
 * The hero's live readout. Renders only what `profile` actually provides —
 * if `current` is absent the whole live indicator is omitted rather than
 * showing a dot with nothing behind it.
 */
export default function StatusRail() {
  return (
    <dl className="status-rail">
      <div className="status-rail__item">
        <dt className="index-label">Location</dt>
        <dd className="instrument">{profile.location} · UTC+8</dd>
      </div>

      {profile.current && (
        <div className="status-rail__item">
          <dt className="index-label">Status</dt>
          <dd className="instrument status-rail__live">
            <span className="status-rail__dot" aria-hidden="true" />
            {profile.current}
          </dd>
        </div>
      )}
    </dl>
  );
}
