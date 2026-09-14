import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/liquid/Container';
import { LinkPreview } from '@/components/ui/link-preview';
import { GLASS_OPTICS } from '@/lib/glass-config';
import { writingService } from '@/platform/modules/writing/writing.service';

export const metadata: Metadata = {
  title: 'Writings & Essays',
  description:
    'Personal thoughts, essays, reflections on engineering craft, agency, and outcomes by Ashutosh Kumar.',
};

export default async function WritingsPage() {
  const result = await writingService
    .getWritings({ type: 'essay', limit: 100 })
    .catch(() => ({ items: [] }));
  const essays = result.items;

  const formatDate = (ts: number | null) => {
    if (!ts) return 'Recent';
    const d = new Date(ts);
    return `${d.getDate()} ${d.toLocaleString('en-US', {
      month: 'short',
    })} ${d.getFullYear()}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4 pb-20">
      <Link
        href="/"
        className="text-sm font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-2"
      >
        &larr; Back to Home
      </Link>

      {/* <Container
        className="p-6 sm:p-8 rounded-[32px] bg-[#d5ede6]/20 dark:bg-[#1a3832]/20 transition-all duration-300 w-full"
        radius={36}
        optics={GLASS_OPTICS}
      > */}
      <div className="py-1 px-0.5 flow-root">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-xl md:text-2xl text-foreground mb-3 sm:mb-4">
            <span className="font-bold">Personal</span>{' '}
            <span className="text-foreground/50 text-sm">thoughts</span>{' '}
            <span className="italic text-base font-light">& essays</span>
          </h1>
          <span className="text-xs font-mono text-foreground/50">
            {essays.length} {essays.length === 1 ? 'essay' : 'essays'}
          </span>
        </div>

        <p className="pt-3 text-sm text-foreground/80">
          I write whenever inspiration strikes, which means I&apos;m pretty
          irregular about it. Reflections on engineering philosophy, intentional
          craft, and ambition.
        </p>

        <ul className="pt-8 flex flex-col gap-6">
          {essays.map((essay) => (
            <li
              key={essay.id}
              className="group flex flex-col gap-2 pb-6 border-b border-black/[0.06] dark:border-white/[0.06] last:border-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <LinkPreview
                  url={`/writings/${encodeURIComponent(essay.slug)}`}
                  multiline={true}
                  dotGap={6}
                  dotSize={2}
                  dotOffset={-1}
                  className="text-base sm:text-lg font-semibold text-foreground group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors"
                >
                  {essay.title}
                </LinkPreview>

                <div className="flex items-center gap-2 text-xs font-mono text-foreground/45 shrink-0">
                  <span>{formatDate(essay.publishedAt)}</span>
                  {essay.readingTimeMinutes && (
                    <>
                      <span>&bull;</span>
                      <span>{essay.readingTimeMinutes} min read</span>
                    </>
                  )}
                </div>
              </div>

              {essay.excerpt && (
                <p className="text-sm text-foreground/70 line-clamp-2 leading-relaxed">
                  {essay.excerpt}
                </p>
              )}

              {essay.tags && essay.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {essay.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[11px] font-mono rounded bg-foreground/[0.05] text-foreground/60 border border-black/5 dark:border-white/5"
                    >
                      #{tag.toLowerCase().replace(/\s+/g, '-')}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* </Container> */}
    </div>
  );
}
