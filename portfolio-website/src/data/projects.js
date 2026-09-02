// ---------------------------------------------------------------------------
// Work experience and projects shown on the Projects & Experience page.
//
// Each entry:
//   {
//     title:       string
//     description: string
//     tech:        string[]        — rendered as tags
//     links?:      [{ label, href }]  — optional buttons (GitHub, live demo, …)
//     period?:     string          — optional (e.g. "2024" or "Jun–Aug 2025")
//     org?:        string          — optional (company / organisation)
//     featured?:   boolean         — projects only: show on the home page
//   }
// Newest first is a good convention.
// ---------------------------------------------------------------------------

export const experience = [
  {
    title: 'Software Engineer Intern',
    org: 'SP Group',
    period: 'Jul 2026 - Present',
    description:
      "Working on grid-monitoring and Digital Twin systems for Singapore's electricity and gas network operator.",
    tech: ['PostgreSQL', 'MongoDB Time Series', 'Docker', 'Golang', 'Node.js', 'React', 'REST APIs', 'GraphQL', 'CI/CD', 'Git'],
    featured: true,
  },
  {
    title: 'Data Engineer Intern',
    org: 'Accenture',
    period: 'May 2026 - Jul 2026',
    description:
      "Supported a public-sector client's migration from Commercial Cloud to a regulated, high-availability Government on CommercialCloud environment.",
    tech: ['AWS Lambda', 'Python', 'Node.js', 'API Gateway', 'DynamoDB', 'S3', 'GraphQL', 'CI/CD'],
    featured: true,
  },
  {
    title: 'Google CSSIx Apprenticeship',
    org: 'Google',
    period: 'Jun 2019',
    description:
      'Selected for an the sole cohort of an intensive programming apprenticeship run by Google, where Google engineers from SG and the US taught me to build full-stack apps from scratch.',
    tech: ['Web Infrastructure', 'Python', 'JavaScript', 'HTML', 'CSS', 'Google App Engine', 'REST APIs'],
    featured: true,
  },
];

export const projects = [
  {
    title: 'Trading Engine',
    description:
      'A modular Python trading engine for quantitative finance, featuring machine-learning strategies, advanced risk management and comprehensive backtesting. It supports multi-source data fetching (Yahoo Finance, CCXT), technical-indicator calculation, portfolio optimisation and automated trade execution. Built for reliability and reproducibility, with Dockerised deployment, structured logging and resilient error handling.',
    tech: ['Python', 'pandas', 'numpy', 'scikit-learn', 'yfinance', 'ccxt', 'Optuna', 'Docker', 'pytest'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Nikhil-0/Trading-Engine' },
    ],
  },
  {
    title: 'Multi-Agent Research Assistant',
    period: 'Oct - Nov 2025',
    description:
      'Built for the Google Cloud Run hackathon: a multi-agent research assistant on Google ADK that decomposes a research question across four specialist agents: gathering sources, organising findings and critiquing results, and then synthesises their outputs into a single brief. It is exposed through both a CLI and a web interface, containerised with Docker and deployed to Cloud Run via Cloud Build.',
    tech: ['Google ADK', 'Python', 'Streamlit', 'FastAPI', 'Docker', 'Google Cloud Run', 'Cloud Build'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Nikhil-0/Research-Assistant-Application' },
    ],
  },
  {
    title: 'AI-Powered Market Analysis',
    period: 'Oct 2025',
    description:
      'An end-to-end research pipeline that pulls daily OHLCV data from Yahoo Finance and 100 Finviz headlines per ticker, scores sentiment with a VADER lexicon extended by 43 finance specific terms, and extracts company entities with spaCy NER into configurable co-occurrence networks. I compared logistic regression, Random Forest and XGBoost on next day price direction under walk-forward time-series cross-validation. Coefficient analysis showed headline sentiment carried near zero weight against price and volume features, quantifying the limits of daily sentiment as a predictive signal. An interactive Plotly/Dash dashboard exposes adjustable entity-network thresholds for exploring news flow and cross-company narratives.',
    tech: ['Python', 'pandas', 'scikit-learn', 'XGBoost', 'VADER', 'spaCy', 'Plotly', 'Dash'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Nikhil-0/Market-Analysis' },
    ],
  },
  {
    title: 'Bin Buddy: E-waste Recycling Web App',
    description:
      'A full-stack Node.js app that helps users locate e-waste recycling bins in Singapore and promotes sustainable disposal. Built as a team under Scrum, covering the full lifecycle: requirements, analysis, design, rigorous test cases and detailed UML (use case, class, sequence and architecture diagrams). Features include secure authentication, admin controls, password recovery, Google Maps integration, account and query management, and educational resources.',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Handlebars', 'Google Maps API', 'SendGrid', 'Scrum', 'TDD', 'UML'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Nikhil-0/Bin-Buddy' },
    ],
  },
  {
    title: 'Chat App',
    description:
      'A modern, real-time chat app built with React, Node.js, Express and Socket.IO. Users join with a username, send instant messages, see who is online, view typing indicators and get sound notifications for new messages - all in a responsive interface.',
    tech: ['React', 'Vite', 'Node.js', 'Express', 'Socket.IO', 'CSS'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Nikhil-0/Chat-App' },
    ],
  },
  {
    title: 'BTO Housing Application System',
    period: 'Mar - Apr 2025',
    description:
      'A role based HDB flat application system in Java (41 classes, ~4,100 LOC) built by a team of five. Applicant, Officer and Manager roles each resolve to a distinct permission set and menu flow at runtime through a Strategy pattern keyed on user role. The application lifecycle is modelled as an explicit state machine (pending → successful → booked), with eligibility rules: age and marital status constraints on flat type are enforced in the domain layer and unit inventory guarded against overbooking.',
    tech: ['Java', 'OOP Design Patterns', 'State Machines', 'CLI'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Nikhil-0/CLI-based-BTO-system' },
    ],
  },
  {
    title: 'Portfolio Website',
    description:
      'This site is a personal portfolio built with React and Vite to showcase my skills, projects and experiences. Content is data driven, so pages update by editing plain data files, with a light/dark theme and a responsive layout.',
    tech: ['React', 'Vite', 'JavaScript', 'CSS', 'React Router', 'GitHub'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Nikhil-0' },
    ],
  },
];

// Entries marked `featured` are surfaced on the home page.
export const featuredExperience = experience.filter((entry) => entry.featured);
export const featuredProjects = projects.filter((project) => project.featured);