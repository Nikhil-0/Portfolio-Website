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
    </section>
  );
}