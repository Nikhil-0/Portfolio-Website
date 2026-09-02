import React from 'react';
import { FiAward } from 'react-icons/fi';
import Reveal from './Reveal';
import Panel from './Panel';
import SectionHeading from './SectionHeading';
import ImageGallery from './ImageGallery';
import { stages } from '../data/activities';
import '../styles/HolisticDevelopment.css';

// Most recent stage first — University at the top, Secondary School at the
// bottom. Reversed here rather than in activities.js so the data file keeps
// its chronological order and no stage's contents are touched.
const orderedStages = [...stages].reverse();

export default function HolisticDevelopment() {
  return (
    <div className="page">
      {orderedStages.map((stage, stageIndex) => (
        <section key={stage.label} className="section">
          <Reveal index={stageIndex}>
            <SectionHeading>
              <span className="index-label holistic__stage-index">
                {String(stageIndex + 1).padStart(2, '0')}
              </span>
              {stage.label}
            </SectionHeading>
          </Reveal>
          <div className="activity-list">
            {stage.activities.map((activity, i) => (
              <Reveal key={activity.org} index={i}>
                <Panel as="article" className="activity-card">
                  <span className="activity-card__frame">
                    <img
                      src={activity.logo}
                      alt=""
                      className="activity-card__logo"
                      width="72"
                      height="72"
                      loading="lazy"
                    />
                  </span>
                  <div className="activity-card__body">
                    <h3>{activity.org}</h3>
                    {activity.role && (
                      <p className="instrument activity-card__role">{activity.role}</p>
                    )}
                    {activity.award && (
                      <p className="award-badge">
                        <FiAward aria-hidden="true" />
                        {activity.award}
                      </p>
                    )}
                    <p className="activity-card__description prose">{activity.description}</p>
                    <ImageGallery images={activity.images} />
                  </div>
                </Panel>
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
