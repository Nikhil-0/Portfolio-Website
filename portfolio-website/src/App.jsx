import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ProjectsAndExperience from './components/ProjectsAndExperience';
import Education from './components/Education';
import HolisticDevelopment from './components/HolisticDevelopment';
import Blog from './components/Blog';
import NotFound from './components/NotFound';
import PageTransition from './components/PageTransition';
import { useTheme } from './hooks/useTheme';
import { usePageTitle } from './hooks/usePageTitle';
import './App.css';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  usePageTitle();

  return (
    <div className="app-container">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <PageTransition>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsAndExperience />} />
            <Route path="/education" element={<Education />} />
            <Route path="/holistic-development" element={<HolisticDevelopment />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}