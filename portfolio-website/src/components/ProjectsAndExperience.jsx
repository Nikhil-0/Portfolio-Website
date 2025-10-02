import React from 'react';
import pythonCert from '../assets/Py_Cert.png';
import OCI_Foundation from '../assets/OCI_AI_Foundations.png';
import OCI_GenerativeAI from '../assets/OCI_GenAI.png';
import OCI_VectorSearch from '../assets/OCI_VectorSearch.png';
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
      </div>
    </section>
  );
}
