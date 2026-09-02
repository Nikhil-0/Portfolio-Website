import React from 'react';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import { education } from '../data/education';
import '../styles/timeline.css';
import '../styles/Education.css';

export default function Education() {
  return (
    <div className="page">
      <section className="section">
        <Reveal>
          <SectionHeading>Education</SectionHeading>
        </Reveal>
        <div className="timeline">
          {education.map((item, i) => (
            <Reveal className="timeline__item" key={item.school} index={i}>
              <div className="timeline__rail">
                <span className="index-label">{String(i + 1).padStart(2, '0')}</span>
                <span className="instrument">{item.period}</span>
              </div>
              <div className="timeline__body">
                <div className="education-card__head">
                  <span className="education-card__frame">
                    <img
                      src={item.logo}
                      alt=""
                      className="education-card__logo"
                      width="44"
                      height="44"
                      loading="lazy"
                    />
                  </span>
                  <h3 className="timeline__title">{item.school}</h3>
                </div>
                <p className="prose">{item.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
