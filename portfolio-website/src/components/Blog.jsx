import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import SectionHeading from './SectionHeading';
import TagList from './TagList';
import Panel from './Panel';
import Reveal from './Reveal';
import Disclosure from './Disclosure';
import { blogIntro, blogMediumUrl, posts } from '../data/blog';
import { readingTime } from '../lib/readingTime';
import '../styles/Blog.css';

function Section({ heading, body }) {
  const paragraphs = Array.isArray(body) ? body : [body];
  return (
    <div className="post-section">
      <h4 className="post-section__heading">{heading}</h4>
      {paragraphs.map((text, i) => (
        <p key={i}>{text}</p>
      ))}
    </div>
  );
}

export default function Blog() {
  return (
    <div className="page">
      <section className="section">
        <SectionHeading>Blog</SectionHeading>
        <p className="blog-intro">
          {blogIntro}{' '}
          <a href={blogMediumUrl} target="_blank" rel="noopener noreferrer">
            Read more on Medium <FiExternalLink aria-hidden="true" />
          </a>
        </p>

        <div className="post-list">
          {posts.map((post, i) => (
            <Reveal key={post.id} index={i}>
              <Panel as="article" id={post.id} className="post">
                <header className="post__head">
                  <span className="index-label">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="post__title">{post.title}</h3>
                  <span className="instrument post__meta">
                    {post.date} · {readingTime(post.sections)} min read
                  </span>
                </header>
                <p className="post__summary prose">{post.summary}</p>
                <TagList items={post.tags} label="Topics" />

                <Disclosure summary="Read the full post">
                  <div className="post__body prose">
                    {post.sections.map((section) => (
                      <Section key={section.heading} heading={section.heading} body={section.body} />
                    ))}
                    {post.link && (
                      <a
                        className="btn"
                        href={post.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {post.link.label} <FiExternalLink aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </Disclosure>
              </Panel>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
