import React from 'react';
import pythonCert from '../assets/Py_Cert.png';
import OCI_Java from '../assets/OCI_Java_Explorer_Badge.png';
import OCI_Foundation from '../assets/OCI_AI_Foundations.png';
import OCI_GenerativeAI from '../assets/OCI_GenAI.png';
import OCI_VectorSearch from '../assets/OCI_VectorSearch.png';
import OCI_MySQL from '../assets/Oracle MySQL Explorer Badge.png';
import OCI_MySQL_Heatwave from '../assets/Oracle MySQL Heatwave.jpg';
import Bloomberg_Fundamentals from '../assets/Bloomberg_Finance_Fundamentals_Cert.png'
import Bloomberg_Market from '../assets/Bloomberg_Market_Concepts_Cert.png'
import AWS_Cloud_Essentials from '../assets/AWS Cloud Practitioner Essentials.png'
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
          <img src={OCI_Java} alt="Oracle Java Explorer Badge" className="certification-image" />
          <h3 className="certification-title">Oracle Java Explorer</h3>
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
        <div className="certification-entry">
          <img src={OCI_MySQL} alt="Oracle MySQL Explorer Badge" className="certification-image" />
          <h3 className="certification-title">Oracle MySQL Explorer</h3>
        </div>
        <div className="certification-entry">
          <img src={OCI_MySQL_Heatwave} alt="Oracle MySQL Heatwave Certification" className="certification-image" />
          <h3 className="certification-title">Oracle MySQL Heatwave Implementation Associate</h3>
        </div>
        <div className="certification-entry">
          <img src={AWS_Cloud_Essentials} alt="AWS Cloud Practitioner Essentials Certification" className="certification-image" />
          <h3 className="certification-title">AWS Cloud Practitioner</h3>
        </div>
      </div>

      <h2 className="section-heading">Experience</h2>
      <div className="projects-list">
        <div className="project-entry">
          <h3 className="project-title">Google CSSIx Apprenticeship</h3>
          <p className="project-description">Was selected for an intensive and prestigious programming apprenticeship conducted by Google, where Google developers and engineers taught me how to build web apps in Javascript, HTML, CSS, Python and the Google AppEngine, along with some other technologies mixed in such as Restful APIs. I worked with a team during the apprenticeship to build a full-fledged app hosted by the GoogleApp Engine using Python, HTML and CSS.</p>
          <p className="project-tech"><strong>Technology applied:</strong> Web Infrastructure, Python (Programming Language), JavaScript, HTML, CSS, Google AppEngine.</p>
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
          <p className="project-tech"><strong>Technology applied:</strong> React, JavaScript, HTML, CSS, Vite, Front-End Development, Github</p>
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
        <div className="project-entry">
          <h3 className="project-title">Bin Buddy: E-waste Recycling Web App</h3>
          <p className="project-description">Developed as a team, Bin Buddy is a full-stack Node.js application designed to help users locate e-waste recycling bins in Singapore and promote sustainable disposal practices. Our team, adhering to the Scrum project management framework, collaborated on the complete software engineering lifecycle, including requirements gathering, analysis, and design. We produced rigorous test cases throughout development to ensure quality work and produced detailed use case diagrams, class diagrams, sequence diagrams, and system architecture diagrams to guide development and ensure robust functionality. Key features include secure authentication, admin controls, password recovery, Google Maps integration, account management, query management and educational resources. The project demonstrates our ability to work collaboratively, apply best practices in software engineering, and deliver a solution with real-world impact.</p>
          <p className="project-tech"><strong>Tech stack (Including SWE Practices):</strong> Node.js, Express.js, MongoDB, Handlebars, Google Maps API, SendGrid, Requirement elicitation/analysis, Scrum, Test-Driven Development, SDLC, UML Diagrams.</p>
        </div>
        <div className="project-entry">
          <h3 className="project-title">Research Assistant Application</h3>
          <p className="project-description">An AI-driven multi-agent research tool built for the Google Cloud Run hackathon. The application automates research tasks through a sophisticated system of specialized agents: the Research Agent gathers information from various sources, the Synthesis Agent organizes content logically, and the Evaluation Agent ensures accuracy and reliability. Built with Streamlit for an intuitive user interface and FastAPI backend, the system delivers well-formatted outputs in various styles (reports, debates, analyses) while providing real-time progress tracking. Successfully implemented agent coordination, cloud deployment with auto-scaling capabilities, and a flexible output system that adapts to different research needs.</p>
          <p className="project-tech"><strong>Tech stack:</strong> Python, Streamlit, FastAPI, Google ADK (Agent Development Kit), Docker, Google Cloud Run, Google Cloud Build, Google Container Registry, Git/GitHub</p>
        </div>
      </div>
    </section>
  );
}
