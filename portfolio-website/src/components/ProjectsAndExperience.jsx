import React from 'react';
import pythonCert from '../assets/Py_Cert.png';
import OCI_Foundation from '../assets/OCI_AI_Foundations.png';
import OCI_GenerativeAI from '../assets/OCI_GenAI.png';
import OCI_VectorSearch from '../assets/OCI_VectorSearch.png';
import Bloomberg_Fundamentals from '../assets/Bloomberg_Finance_Fundamentals_Cert.png'
import Bloomberg_Market from '../assets/Bloomberg_Market_Concepts_Cert.png'
import '../styles/ProjectsAndExperience.css';  

export default function ProjectsAndExperience() {
  return (
    <section className="projects-and-experience-section">
      <h2 className="section-heading">Certifications</h2>
      <div className="certifications-grid">
        <div className="certification-entry">
          <img src={pythonCert} alt="Python Certification" className="certification-image" />
          <h3 className="certification-title">Python Certification</h3>
        </div>
        <div className="certification-entry">
          <img src={OCI_Foundation} alt="Oracle AI Foundation Certification" className="certification-image" />
          <h3 className="certification-title">OCI AI Foundations</h3>
        </div>
        <div className="certification-entry">
          <img src={OCI_GenerativeAI} alt="Oracle Generative AI Certification" className="certification-image" />
          <h3 className="certification-title">OCI Generative AI Professional</h3>
        </div>
        <div className="certification-entry">
          <img src={OCI_VectorSearch} alt="Oracle Vector Search Certification" className="certification-image" />
          <h3 className="certification-title">OCI Vector Search Professional</h3>
        </div>
        <div className="certification-entry">
          <img src={Bloomberg_Fundamentals} alt="Bloomberg Finance Fundamentals Certification" className="certification-image" />
          <h3 className="certification-title">Bloomberg Finance Fundamentals</h3>
        </div>
        <div className="certification-entry">
          <img src={Bloomberg_Market} alt="Bloomberg Market Concepts Certification" className="certification-image" />
          <h3 className="certification-title">Bloomberg Market Concepts</h3>
        </div>
      </div>

      <h2 className="section-heading">Projects</h2>
      <div className="projects-list">
        <div className="project-entry">
          <h3 className="project-title">BTO System Simulation</h3>
          <p className="project-description">Simulated the BTO system using Java on the CLI, allowing users to log in, input their various preferences and receive a list of suitable flats based on their criteria, and then book a flat, cancel bookings and send enquiries. HDB Officers can log in to view flat listings, process bookings and cancellations, and respond to enquiries. HDB Managers can manage flat listings and oversee the entire process, as well as generate reports.</p>
          <p className="project-tech"><strong>Technology applied:</strong> Java, CLI management, Object-Oriented Programming</p>
        </div>
        <div className="project-entry">
          <h3 className="project-title">Portfolio Website</h3>
          <p className="project-description">Created a personal portfolio website using React to showcase my skills, projects, and experiences. The website features a clean and modern design, with sections for my bio, skills, projects, and contact information.</p>
          <p className="project-tech"><strong>Technology applied:</strong> React, JavaScript, HTML, CSS</p>
        </div>
        <div className="project-entry">
          <h3 className="project-title">Chat App</h3>
          <p className="project-description">A modern, real-time chat app built with React, Node.js, Express, and Socket.IO. Users can join with a username, send instant messages, see who’s online, view typing indicators, and receive sound notifications for new messages, all in a responsive interface.</p>
          <p className="project-tech"><strong>Technology applied:</strong> React, Vite, Node.js, Express, Socket.IO, CSS</p>
        </div>
        <div className="project-entry">
          <h3 className="project-title">AI-Powered Market Analysis</h3>
          <p className="project-description">A Python-based platform for exploring the relationship between financial news sentiment and stock price movements. The project integrates data collection, sentiment analysis, entity recognition, and interactive visualizations to support qualitative market research.</p>
          <p className="project-tech"><strong>Technology applied:</strong> Python, pandas, scikit-learn, XGBoost, VADER, spaCy, Plotly, and Dash</p>
        </div>
        <div className="project-entry">
          <h3 className="project-title">Trading Engine</h3>
          <p className="project-description">A robust, modular Python trading engine designed for quantitative finance, featuring machine learning strategies, advanced risk management, and comprehensive backtesting. 
            The system supports multi-source data fetching (Yahoo Finance, CCXT), technical indicator calculation, portfolio optimization, and automated trade execution. Built for reliability and reproducibility, it includes Dockerized deployment, structured logging, and resilient error handling.</p>
          <p className="project-tech"><strong>Technology applied:</strong> Python, pandas, numpy, scikit-learn, yfinance, ccxt, Optuna, Docker, pytest</p>
        </div>
      </div>
    </section>
  );
}
