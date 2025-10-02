import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ProjectsAndExperience from './components/ProjectsAndExperience';
import Education from './components/Education';
import HolisticDevelopment from './components/HolisticDevelopment';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsAndExperience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/holistic-development" element={<HolisticDevelopment />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;