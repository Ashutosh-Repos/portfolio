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
  citations?: Array<{
    title: string;
    url?: string;
    author?: string;
    doi?: string;
  }>;
  canonicalUrl?: string | null;
  paperUrl?: string | null;
}

export interface AdjacentArticle {
  title: string;
  href: string;
}

export interface ArticleViewProps {
  sectionLabel: string;
  sectionHref: string;
  article: BaseArticle;
  prevArticle?: AdjacentArticle | null;
  nextArticle?: AdjacentArticle | null;
}

interface SectionConfig {
  homeHref: string;
  homeLabel: string;
  nextSectionHref: string;
  nextSectionLabel: string;
  signatureBadge: React.ReactNode;
}

const getSectionConfig = (sectionLabel: string): SectionConfig => {
  const norm = sectionLabel.toLowerCase();
  if (norm.includes('blog')) {
    return {
      homeHref: '/',
      homeLabel: 'Back to Home',
      nextSectionHref: '/papershelf',
      nextSectionLabel: "Research Papers I'd read",
      signatureBadge: (
        <span className="inline-flex items-baseline gap-1">
          <span className="font-bold">Technical</span>{' '}
          <span className="text-foreground/50 text-xs sm:text-sm">blog</span>{' '}
          <span className="italic text-sm sm:text-base font-light">post</span>
        </span>
      ),
    };
  }
  if (norm.includes('paper')) {
    return {
      homeHref: '/',
      homeLabel: 'Back to Home',
      nextSectionHref: '/writings',
      nextSectionLabel: 'Writings',
      signatureBadge: (
        <span className="inline-flex items-baseline gap-1">
          <span className="font-bold">Research Paper</span>{' '}
          <span className="text-foreground/50 text-xs sm:text-sm">
            I&apos;d
          </span>{' '}
          <span className="italic text-sm sm:text-base font-light">Read</span>
        </span>
      ),
    };
  }
  // Default to writings/essays
  return {
    homeHref: '/',
    homeLabel: 'Back to Home',
    nextSectionHref: '/blogs',
    nextSectionLabel: 'Technical Blogs',
    signatureBadge: (
      <span className="inline-flex items-baseline gap-1">
        <span className="font-bold">Writing</span>{' '}
        <span className="text-foreground/50 text-xs sm:text-sm">my</span>{' '}
        <span className="italic text-sm sm:text-base font-light">thoughts</span>
      </span>
    ),
  };
};

export const ArticleView = ({
  sectionLabel,
  sectionHref,
  article,
  prevArticle,
  nextArticle,
}: ArticleViewProps) => {
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  const sectionConfig = getSectionConfig(sectionLabel);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.excerpt || article.subtitle || article.title,
    author: {
      '@type': 'Person',
      name: 'Ashutosh',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Ashutosh',
      url: siteUrl,
    },
    datePublished: article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : undefined,
    inLanguage: 'en-US',
  };

  // Strip duplicate h1 if the markdown starts with # <Title>
  const bodyContent = article.contentMarkdown.replace(/^#\s+.+\n+/, '');

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Top Navigation: Streamlined list navigation */}
      <nav
        aria-label="Article navigation"
        className="flex w-full justify-between items-center text-xs sm:text-sm font-mono text-foreground/50 pb-2"
      >
        {/* Left Link */}
        {prevArticle && nextArticle ? (
          <Link
            href={prevArticle.href}
            className="hover:text-foreground transition-colors inline-flex items-center gap-1.5 max-w-[48%] group"
            title={prevArticle.title}
          >
            <span className="shrink-0 transition-transform group-hover:-translate-x-0.5">
              &larr;
            </span>
            <span className="truncate group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
              {prevArticle.title}
            </span>
          </Link>
        ) : (
          <Link
            href={sectionHref}
            className="hover:text-foreground transition-colors inline-flex items-center gap-1.5 group"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">
              &larr;
            </span>
            <span>All {sectionLabel.toLowerCase()}</span>
          </Link>
        )}

        {/* Right Link */}
        {nextArticle ? (
          <Link
            href={nextArticle.href}
            className="hover:text-foreground transition-colors inline-flex items-center justify-end gap-1.5 max-w-[48%] text-right ml-auto group"
            title={nextArticle.title}
          >
            <span className="truncate group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
              {nextArticle.title}
            </span>
            <span className="shrink-0 transition-transform group-hover:translate-x-0.5">
              &rarr;
            </span>
          </Link>
        ) : (
          <Link
            href={sectionConfig.nextSectionHref}
            className="hover:text-foreground transition-colors inline-flex items-center justify-end gap-1.5 text-right ml-auto group"
          >
            <span>{sectionConfig.nextSectionLabel}</span>
            <span className="transition-transform group-hover:translate-x-0.5">
              &rarr;
            </span>
          </Link>
        )}
      </nav>

      {/* Article Header */}
      <header className="flex flex-col gap-2.5 pt-1">
        <div className="flex justify-between items-center">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
            {article.title}
          </span>

          {article.readingTimeMinutes && (
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground/50 shrink-0 whitespace-nowrap">
              <span>⏱️</span>
              <span>Reading time: {article.readingTimeMinutes} min</span>
            </div>
          )}
        </div>

        {/* Monospace tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-foreground/[0.05] text-foreground/70 border border-black/5 dark:border-white/5"
              >
                #{tag.toLowerCase().replace(/\s+/g, '-')}
              </span>
            ))}
          </div>
        )}

        {article.subtitle && (
          <p className="text-sm sm:text-base text-foreground/75 font-normal leading-relaxed">
            {article.subtitle}
          </p>
        )}
      </header>

      {/* Article Content */}
      <article className="flex flex-col gap-5">
        {/* {article.excerpt && (
          <div className="p-4 rounded-xl bg-foreground/[0.025] border border-black/5 dark:border-white/5 text-sm italic text-foreground/80 leading-relaxed">
            <MarkdownRenderer
              content={article.excerpt}
              className="!gap-0 [&_p]:text-sm [&_p]:italic [&_p]:leading-relaxed"
            />
          </div>
        )} */}

        {(article.paperUrl || article.canonicalUrl) && (
          <div className="flex items-center gap-3">
            <a
              href={(article.paperUrl || article.canonicalUrl) as string}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-200"
            >
              <span>
                {article.paperUrl
                  ? '📄 Read Original Paper PDF'
                  : '🔗 Canonical Source'}
              </span>
              <span>↗</span>
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
                  <span className="font-mono text-xs text-foreground/40 shrink-0">
                    [{idx + 1}]
                  </span>
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

        <footer className="pt-6 mt-8 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-4">
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
        </footer>
      </article>
    </div>
  );
};
