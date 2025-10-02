import React from 'react';
import TKSS from '../assets/Tanjong_Katong_Secondary_School_crest.png';
import TJC from '../assets/TJC_Logo.avif';
import NTU from '../assets/NTU_Logo.webp';
import '../styles/Education.css';

export default function Education() {
  return (
    <section className="education-section">
      <h2>Education</h2>

      <div className="education-entry">
        <img src={TKSS} className="school-logo" />
        <div className="education-details">
          <h3>Tanjong Katong Secondary School</h3>
          <p>Completed O-Level examination with a score of 9 points.</p>
        </div>
      </div>

      <div className="education-entry">
        <img src={TJC} className="school-logo" />
        <div className="education-details">
          <h3>Temasek Junior College</h3>
          <p>Completed A-Level examination with a Rank Point (RP) of 83.75.</p>
        </div>
      </div>

      <div className="education-entry">
        <img src={NTU} className="school-logo" />
        <div className="education-details">
          <h3>Nanyang Technological University (NTU)</h3>
          <p>I am currently pursuing a Bachelor of Computing in Computer Science. I am expected to graduate in 2028.</p>
        </div>
      </div>
    </section>
  );
}