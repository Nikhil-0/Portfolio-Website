// ---------------------------------------------------------------------------
// Personal details shown across the site (header, home page, footer, SEO).
// ---------------------------------------------------------------------------
import portrait from '../assets/PortfolioPic1.jpg';

export const profile = {
  name: 'Nikhil Madeti',
  tagline: 'Computer Science undergraduate at NTU, building across software, finance and AI.',
  bio: "Hi there! I'm so glad you're here! This site is a place to learn more about me - my projects, education and the experiences that shaped me. Use the navigation above to jump to whatever you're curious about, and feel free to reach out through any of the links.",
  // Shown as a one-line status on the home page. Keep it short.
  current: 'Software Engineer Intern at SP Group',
  location: 'Singapore',
  email: 'nikhil.madeti.work@gmail.com',
  portrait,
  resumeUrl: '/resume.pdf',
  showResume: true,
};

// social / external links. `icon` maps to an icon in components/SocialMediaLinks.jsx.
export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Nikhil-0', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nikhil-madeti-07914337a/', icon: 'linkedin' },
  { label: 'Instagram', href: 'https://instagram.com/ostrich.madeti', icon: 'instagram' },
  { label: 'Medium', href: 'https://medium.com/@nikhil.madeti.work', icon: 'medium' },
];
