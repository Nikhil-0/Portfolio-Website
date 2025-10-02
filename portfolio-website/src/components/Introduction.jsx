import React from 'react';
import portfolioPic1 from '../assets/PortfolioPic1.jpg';
import '../styles/Introduction.css';

export default function Introduction() {
  return (
    <div className="introduction">
      <img src={portfolioPic1} className="profile-picture1" />
      <h2>Hello, I'm Nikhil!</h2>
      <p>I'm so glad you're here! This website contains information about me and is built to help you learn more about me. Feel free to click the headers at the top to visit any specific section that you may be interested in. The links to relevant social media profiles are also available.</p>
    </div>
  );
}