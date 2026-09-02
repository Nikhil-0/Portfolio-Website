// ---------------------------------------------------------------------------
// Blog posts.
//
// Each post:
//   {
//     id:       string  — stable slug, used for the anchor link
//     title:    string
//     date:     string  — e.g. "2025" or "March 2025" (shown as-is)
//     summary:  string  — one-line teaser shown before the post is expanded
//     tags:     string[]
//     sections: [{ heading, body }]   body is a string OR an array of paragraphs
//     link?:    { label, href }       — optional external link (e.g. full article)
//   }
//
// The newest post should be first in the array.
// ---------------------------------------------------------------------------

export const blogIntro =
  'This is where I share my journey in technology, programming and career development. For longer, more in-depth articles, visit my Medium profile.';

export const blogMediumUrl = 'https://medium.com/@nikhil.madeti.work';

export const posts = [
  {
    id: 'building-a-trading-engine',
    title: "Building a Trading Engine: What Works, What Doesn't, and What I Learned",
    date: '2025',
    summary:
      'Building a modular Python trading engine to explore the realities of systematic trading, and the humbling lessons that came with it.',
    tags: ['Quantitative Finance', 'Python', 'Machine Learning', 'Backtesting'],
    sections: [
      {
        heading: 'Project Motivation',
        body: 'In 2025 I set out to build a modular, Python based trading engine to explore the realities of systematic trading. The goal was not only to experiment with rule-based and machine learning strategies, but also to understand the practical challenges of building a robust system that could handle real world frictions.',
      },
      {
        heading: 'System Architecture',
        body: 'The architecture included modules for data management, strategy design, risk management, and execution/backtesting. This let me quickly prototype ideas, rigorously backtest strategies, and integrate real world data sources: from simple moving average crossovers to more complex machine learning models. The flexibility made experimentation easy.',
      },
      {
        heading: 'Challenges & Reality Check',
        body: 'The journey was far from straightforward. Early backtests looked promising: a Sharpe ratio of 1.45 with low drawdowns, but deeper analysis revealed the pitfalls. Market conditions were unusually favourable, and strategies that thrived in bull markets struggled in sideways or bear regimes. Overfitting was a constant risk; even with walk-forward validation it was easy to build strategies that worked in-sample and failed out-of-sample. Properly modelled transaction costs and slippage reduced returns significantly and exposed how fragile many approaches were.',
      },
      {
        heading: 'Lessons Learned',
        body: 'Simplicity and robustness matter more than curve fitting; ignoring transaction costs is the fastest way to fool yourself; and strategies must be tested across multiple market regimes to be considered reliable. Machine learning, while powerful, is not a magic bullet. Domain knowledge and risk management matter just as much.',
      },
      {
        heading: 'Looking Forward',
        body: 'If I were starting over I would test on more diverse assets, incorporate regime detection, explore reinforcement learning, and seek collaboration for fresh perspectives. Open questions still intrigue me: why do some simple strategies persistently outperform, how best to combine ML signals with domain expertise, and how to adapt to regime shifts in real time.',
      },
      {
        heading: 'Conclusion',
        body: 'Ultimately, building this engine was humbling. It taught me that markets are complex and that backtests are only as good as their assumptions. The real value was not in the performance metrics, but in the lessons about rigor, humility, and the ongoing challenge of understanding financial markets.',
      },
    ],
  },
  {
    id: 'my-first-hackathon-research-assistant',
    title: 'My First Hackathon: Research Assistant Application',
    date: '2025',
    summary:
      'An AI-powered multi-agent tool for faster, smarter research: built at the Google Cloud Run hackathon.',
    tags: ['AI', 'Multi-Agent', 'Google Cloud', 'Hackathon'],
    sections: [
      {
        heading: 'Why We Built It',
        body: 'We took part in the Google Cloud Run hackathon, where the brief was to use the Google ADK to design a multi-agent workflow. As students and developers we kept losing time to repetitive research tasks — finding articles, extracting ideas, organising notes, checking claims. We wanted a tool that behaves like a small research team: one agent to collect information, another to organise it, and another to critique it, so we could focus on insight rather than grunt work.',
      },
      {
        heading: 'What It Does',
        body: 'The application accepts a research query through a Streamlit interface and invokes a multi-agent pipeline. The Research Agent collects sources and raw facts, the Synthesis Agent organises and summarises findings, and the Evaluation Agent validates and critiques results. It produces user-ready outputs like summaries, reports and structured notes, tracks progress in real time, and runs locally or in the cloud (containerised + Cloud Run).',
      },
      {
        heading: 'Architecture & Technologies',
        body: [
          'The architecture is a pipeline: query → research → synthesise → evaluate → present. Each stage returns structured data to the next. The frontend is Streamlit for quick prototyping and an interactive UX; the backend uses ADK-powered agents orchestrated via a FastAPI-compatible interface. The whole app is containerised with Docker and deployed to Google Cloud Run via Cloud Build for serverless hosting.',
          'Key technologies: Python 3.12, Streamlit, FastAPI, Google ADK, Docker, Google Cloud Run, Cloud Build, and Git/GitHub.',
        ],
      },
      {
        heading: 'Challenges & Lessons Learned',
        body: 'Dependency resolution was time-consuming — pinning exact versions and testing container builds early proved essential. Agent coordination needed clear input/output contracts (JSON schemas) to avoid brittle handoffs. Local and cloud environments differ significantly; replacing localhost with 0.0.0.0 for containerised services was crucial. For long-running tasks, progress tracking and partial updates improved the experience. And secret management matters: API keys must never be committed; we used .env locally and Cloud Secret Manager in production.',
      },
      {
        heading: "What's Next",
        body: 'We plan to improve source verification and traceability, add integrations with academic APIs like CrossRef and Semantic Scholar, provide collaborative features for team workflows, build CI pipelines for integration tests, and turn the deployment into a true web-app experience.',
      },
      {
        heading: 'Final Thoughts',
        body: 'This project sits at the intersection of AI, software engineering and human-computer interaction. The goal was not only to automate research tasks but to do so transparently and usefully. We learned a lot about engineering reliable AI pipelines and the importance of small, testable interfaces between components.',
      },
    ],
    link: {
      label: 'View on GitHub',
      href: 'https://github.com/Nikhil-0/Research-Assistant-Application',
    },
  },
];
