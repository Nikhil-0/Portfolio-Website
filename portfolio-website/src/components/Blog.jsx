import React from 'react';
import '../styles/Blog.css';
export default function Blog() {
  return (
    <section className="blog-section">
      <h2>Blog</h2>
      <div className="blog-intro">
        <h3>Welcome!</h3>
        <p>
          This is where I share my journey in technology, programming, and career development. For more in-depth articles, do visit my <a href="https://medium.com/@nikhil.madeti.work" target="_blank" rel="noopener noreferrer" className="medium-link">Medium</a> profile!
        </p>
      </div>
      <div className="blog-entry">
        <div className="blog-details">
          <h3>1. Building a Trading Engine: What Works, What Doesn't, and What I Learned</h3>
          <h4 className="blog-paragraph-header">Project Motivation</h4>
          <p>
            In 2025, I set out to build a modular, Python-based trading engine to explore the realities of systematic trading. My goal was not only to experiment with rule-based and machine learning strategies, but also to understand the practical challenges of building a robust system that could handle real-world frictions.
          </p>
          <h4 className="blog-paragraph-header">System Architecture</h4>
          <p>
            The architecture I developed included modules for data management, strategy design, risk management, and execution/backtesting. This allowed me to quickly prototype ideas, rigorously backtest strategies, and integrate real-world data sources. I was able to test both simple moving average crossovers and more complex machine learning models, and the flexibility of the platform made experimentation easy.
          </p>
          <h4 className="blog-paragraph-header">Challenges & Reality Check</h4>
          <p>
            However, the journey was far from straightforward. Early backtests showed promising results: a Sharpe ratio of 1.45 and low drawdowns, but deeper analysis revealed the pitfalls. Market conditions in 2023 were unusually favorable, and many strategies that performed well in bull markets struggled in sideways or bear regimes. Overfitting was a constant risk, and even with walk-forward validation, it was easy to create strategies that worked in-sample but failed out-of-sample. Transaction costs and slippage, when properly modeled, reduced returns significantly and exposed the fragility of many approaches.
          </p>
          <h4 className="blog-paragraph-header">Lessons Learned</h4>
          <p>
            Through this project, I learned several key lessons. Simplicity and robustness matter more than curve-fitting; ignoring transaction costs is the fastest way to fool yourself; and strategies must be tested across multiple market regimes to be considered reliable. Machine learning, while powerful, is not a magic bullet. Domain knowledge and risk management are just as important.
          </p>
          <h4 className="blog-paragraph-header">Looking Forward</h4>
          <p>
            If I were to start over, I would test on more diverse assets, incorporate regime detection, explore reinforcement learning, and seek collaboration for fresh perspectives. There are still open questions that intrigue me: why do some simple strategies persistently outperform, how best to combine ML signals with domain expertise, and how to adapt to regime shifts in real time.
          </p>
          <h4 className="blog-paragraph-header">Conclusion</h4>
          <p>
            Ultimately, building this trading engine was a humbling experience. It taught me that markets are complex and that backtests are only as good as their assumptions. The real value was not in the performance metrics, but in the lessons learned about rigor, humility, and the ongoing challenge of understanding financial markets.
          </p>
        </div>
      </div>

      <div className="blog-entry">
        <div className="blog-details">
          <h3>2. My First Hackathon: Research Assistant Application — An AI-Powered Multi-Agent for Faster, Smarter Research</h3>
          <h4 className="blog-paragraph-header">Why We Built It</h4>
          <p>
            We participated in the Google Cloud Run hackathon where we were to use the Google ADK to design a multi-agent workflow. As students and developers, we kept losing time to repetitive research tasks: finding relevant articles, extracting key ideas, organizing notes, and checking claims. We wanted a tool that could act like a small research team: one agent to collect information, another to organize it, and another to critique it, so that we could focus on insight rather than grunt work.
          </p>
          <h4 className="blog-paragraph-header">What It Does</h4>
          <p>
            The Research Assistant Application accepts a research query through a Streamlit interface and invokes a multi-agent pipeline. The Research Agent collects sources and raw facts, the Synthesis Agent organizes and summarizes findings, and the Evaluation Agent validates and critiques results. The system produces user-ready outputs like summaries, reports, or structured notes, tracks progress in real-time, and runs locally or in the cloud (containerized + Cloud Run).
          </p>
          <h4 className="blog-paragraph-header">Architecture & Technologies</h4>
          <p>
            The architecture is a pipeline: query → research → synthesize → evaluate → present. Each stage returns structured data to the next. We built the frontend with Streamlit for quick prototyping and an interactive UX. The backend uses ADK-powered agents orchestrated via a FastAPI-compatible interface. The entire application is containerized with Docker and deployed to Google Cloud Run via Cloud Build for serverless hosting.
          </p>
          <p>
            <strong>Key technologies:</strong> Python 3.12, Streamlit, FastAPI, ADK (AI Development Kit), Docker, Google Cloud Run, Cloud Build, and Git/GitHub.
          </p>
          <h4 className="blog-paragraph-header">Challenges & Lessons Learned</h4>
          <p>
            Dependency resolution was time-consuming—pinning exact versions and testing container builds early proved essential. Agent coordination required designing clear input/output contracts (JSON schemas) to avoid brittle handoffs. We learned that local and cloud environments differ significantly; replacing localhost with 0.0.0.0 for containerized services was crucial. For long-running tasks, implementing progress tracking and partial updates improved the user experience. We also learned the importance of secret management—API keys must never be committed to Git; we used .env locally and Cloud Secret Manager in production.
          </p>
          <h4 className="blog-paragraph-header">What's Next</h4>
          <p>
            We plan to improve source verification and traceability, add integrations with academic APIs like CrossRef and Semantic Scholar, provide collaborative features for team workflows, build CI pipelines for integration tests, and enhance the production deployment to create a true web app experience.
          </p>
          <h4 className="blog-paragraph-header">Final Thoughts</h4>
          <p>
            This project sits at the intersection of AI, software engineering, and human-computer interaction. The goal was not only to automate research tasks, but to do so in a way that's transparent and useful to people. We learned a lot about engineering reliable AI pipelines and the importance of small, testable interfaces between system components. You can try the app by cloning the repo at <a href="https://github.com/Nikhil-0/Research-Assistant-Application" target="_blank" rel="noopener noreferrer" className="medium-link">GitHub</a>.
          </p>
        </div>
      </div>
    </section>
  );
}