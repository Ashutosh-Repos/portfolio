import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MarkdownRenderer } from './MarkdownRenderer';

export interface BaseArticle {
  title: string;
  subtitle?: string | null;
  excerpt: string;
  contentMarkdown: string;
  publishedAt?: number | null;
  readingTimeMinutes?: number | null;
  tags?: string[];
  citations?: Array<{ title: string; url?: string; author?: string; doi?: string }>;
  canonicalUrl?: string | null;
  paperUrl?: string | null;
}

export interface ArticleViewProps {
  sectionLabel: string;
  sectionHref: string;
  article: BaseArticle;
}

export const ArticleView = ({ sectionLabel, sectionHref, article }: ArticleViewProps) => {
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  // Strip duplicate h1 if the markdown starts with # <Title>
  const bodyContent = article.contentMarkdown.replace(/^#\s+.+\n+/, '');

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 pt-4 pb-20">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs font-mono text-foreground/50 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href={sectionHref} className="text-foreground/70 hover:text-foreground transition-colors">
          {sectionLabel}
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight text-foreground leading-[1.2]">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-lg text-foreground/75 font-normal -mt-1 leading-snug">
            {article.subtitle}
          </p>
        )}

        {/* Monospace tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-xs font-mono rounded-md bg-foreground/[0.06] text-foreground/75 border border-black/5 dark:border-white/5"
              >
                #{tag.toLowerCase().replace(/\s+/g, '-')}
              </span>
            ))}
          </div>
        )}

        {/* Author & Meta bar */}
        <div className="flex items-center justify-between gap-4 pt-2 pb-3 border-b border-black/[0.08] dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <Image
              src="/images/image5.jpeg"
              alt="Ashutosh Kumar"
              width={42}
              height={42}
              className="rounded-full object-cover border border-black/10 dark:border-white/10 shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground leading-tight">
                Ashutosh Kumar
              </span>
              <span className="text-xs font-mono text-foreground/60 leading-tight">
                backend, distributed systems & AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-foreground/50 shrink-0">
            <span>{formattedDate}</span>
            {article.readingTimeMinutes && (
              <>
                <span>&bull;</span>
                <span>{article.readingTimeMinutes} min read</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="flex flex-col gap-6">
        {article.excerpt && (
          <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-black/5 dark:border-white/5 text-base sm:text-lg italic text-foreground/85 leading-snug">
            {article.excerpt}
          </div>
        )}

        {(article.paperUrl || article.canonicalUrl) && (
          <div className="flex items-center gap-3">
            <a
              href={(article.paperUrl || article.canonicalUrl) as string}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-200"
            >
              <span>{article.paperUrl ? '📄 Read Original Paper PDF' : '🔗 Canonical Source'}</span>
              <span>&nearr;</span>
            </a>
          </div>
        )}

        {/* Rich Markdown */}
        <MarkdownRenderer content={bodyContent} />

        {/* Citations if present */}
        {article.citations && article.citations.length > 0 && (
          <div className="mt-8 pt-6 border-t border-black/[0.08] dark:border-white/[0.08] flex flex-col gap-3">
            <h3 className="text-sm font-mono uppercase tracking-wider text-foreground/50 font-semibold">
              References & Citations
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              {article.citations.map((cite, idx) => (
                <li key={idx} className="flex items-baseline gap-2">
                  <span className="font-mono text-xs text-foreground/40 shrink-0">[{idx + 1}]</span>
                  {cite.url ? (
                    <a
                      href={cite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-emerald-400 underline decoration-foreground/30 hover:decoration-foreground transition-colors"
                    >
                      {cite.title}
                    </a>
                  ) : (
                    <span className="text-foreground/80">{cite.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <footer className="pt-6 mt-6 border-t border-black/[0.08] dark:border-white/[0.08] flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={sectionHref}
              className="text-xs font-mono text-foreground/60 hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              &larr; Back to all {sectionLabel.toLowerCase()}
            </Link>
            <p className="text-xs font-mono text-foreground/50">
              Discuss on{' '}
              <a
                href="https://github.com/Ashutosh-Repos"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground text-foreground/80"
              >
                GitHub
              </a>{' '}
              or Twitter/X
            </p>
          </div>
        </footer>
      </article>
    </div>
  );
};
