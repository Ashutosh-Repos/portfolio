import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/liquid/Container';
import { LinkPreview } from '@/components/ui/link-preview';
import { GLASS_OPTICS } from '@/lib/glass-config';
import { writingService } from '@/platform/modules/writing/writing.service';

export const metadata: Metadata = {
  title: 'Research Papershelf',
  description:
    'Deep dives and architectural breakdowns of systems, databases, and AI research papers by Ashutosh Kumar.',
};

export default async function PapershelfPage() {
  const result = await writingService.getWritings({ type: 'research_paper', limit: 100 }).catch(() => ({ items: [] }));
  const papers = result.items;

  const formatDate = (ts: number | null) => {
    if (!ts) return 'Recent';
    const d = new Date(ts);
    return `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4 pb-20">
      <Link
        href="/"
        className="text-sm font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-2"
      >
        &larr; Back to Home
      </Link>

      <Container
        className="p-6 sm:p-8 rounded-[32px] bg-[#d5ede6]/20 dark:bg-[#1a3832]/20 transition-all duration-300 w-full"
        radius={36}
        optics={GLASS_OPTICS}
      >
        <div className="py-1 px-0.5 flow-root">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-foreground">
              <span className="font-light text-2xl md:text-3xl">Research</span>{' '}
              <span className="text-foreground/50 text-xl">paper</span>{' '}
              <span className="italic text-2xl font-light">shelf</span>
            </h1>
            <span className="text-xs font-mono text-foreground/50">
              {papers.length} {papers.length === 1 ? 'paper' : 'papers'}
            </span>
          </div>

          <p className="pt-3 text-sm sm:text-base text-foreground/80 leading-relaxed max-w-2xl">
            Technical breakdowns of seminal research works in distributed consensus, LSM storage engines, real-time stream processing, and AI reasoning.
          </p>

          <ul className="pt-8 flex flex-col gap-6">
            {papers.map((paper) => (
              <li
                key={paper.id}
                className="group flex flex-col gap-2 pb-6 border-b border-black/[0.06] dark:border-white/[0.06] last:border-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <LinkPreview
                    url={`/papershelf/${encodeURIComponent(paper.slug)}`}
                    multiline={true}
                    dotGap={6}
                    dotSize={2}
                    dotOffset={-1}
                    className="text-base sm:text-lg font-semibold text-foreground group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors"
                  >
                    {paper.title}
                  </LinkPreview>

                  <div className="flex items-center gap-2 text-xs font-mono text-foreground/45 shrink-0">
                    <span>{formatDate(paper.publishedAt)}</span>
                    {paper.readingTimeMinutes && (
                      <>
                        <span>&bull;</span>
                        <span>{paper.readingTimeMinutes} min read</span>
                      </>
                    )}
                  </div>
                </div>

                {paper.excerpt && (
                  <p className="text-sm text-foreground/70 line-clamp-2 leading-relaxed">
                    {paper.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                  {paper.tags && paper.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {paper.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[11px] font-mono rounded bg-foreground/[0.05] text-foreground/60 border border-black/5 dark:border-white/5"
                        >
                          #{tag.toLowerCase().replace(/\s+/g, '-')}
                        </span>
                      ))}
                    </div>
                  )}

                  {paper.canonicalUrl && (
                    <a
                      href={paper.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 shrink-0"
                    >
                      <span>PDF Document</span>
                      <span>&nearr;</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
