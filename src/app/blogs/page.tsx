import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/liquid/Container';
import { LinkPreview } from '@/components/ui/link-preview';
import { GLASS_OPTICS } from '@/lib/glass-config';
import { blogService } from '@/platform/modules/blogs/blog.service';

export const metadata: Metadata = {
  title: 'Blogs',
  description:
    'Technical blog posts, system design essays, distributed data structures, AI engineering, and database internals by Ashutosh Kumar.',
};

export default async function BlogsPage() {
  const result = await blogService
    .getBlogs({ limit: 100 })
    .catch(() => ({ items: [] }));
  const blogs = result.items;

  const formatDate = (ts: number | null) => {
    if (!ts) return 'Recent';
    const d = new Date(ts);
    return `${d.getDate()} ${d.toLocaleString('en-US', {
      month: 'short',
    })} ${d.getFullYear()}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4">
      <Link
        href="/"
        className="text-sm font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-2"
      >
        &larr; Back to Home
      </Link>

      <div className="py-1 px-0.5 flow-root">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-xl md:text-2xl text-foreground mb-3 sm:mb-4">
            <span className="font-bold">Technical</span>{' '}
            <span className="text-foreground/50 text-sm">blog</span>{' '}
            <span className="italic text-base font-light">posts</span>
          </h1>
          <span className="text-xs font-mono text-foreground/50">
            {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
          </span>
        </div>

        <p className="pt-3 text-sm text-foreground/80">
          Deep dives on systems architecture, distributed data structures,
          low-latency databases, and AI engineering.
        </p>

        <ul className="pt-8 flex flex-col gap-6">
          {blogs.map((blog) => (
            <li
              key={blog.id}
              className="group flex flex-col gap-2 pb-6 border-b border-black/[0.06] dark:border-white/[0.06] last:border-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <LinkPreview
                  url={`/blogs/${encodeURIComponent(blog.slug)}`}
                  multiline={true}
                  dotGap={6}
                  dotSize={2}
                  dotOffset={-1}
                  className="text-base sm:text-lg font-semibold text-foreground group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors"
                >
                  {blog.title}
                </LinkPreview>

                <div className="flex items-center gap-2 text-xs font-mono text-foreground/45 shrink-0">
                  <span>{formatDate(blog.publishedAt)}</span>
                  {blog.readingTimeMinutes && (
                    <>
                      <span>&bull;</span>
                      <span>{blog.readingTimeMinutes} min read</span>
                    </>
                  )}
                </div>
              </div>

              {blog.excerpt && (
                <p className="text-sm text-foreground/70 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>
              )}

              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[11px] font-mono rounded bg-foreground/5 text-foreground/60 border border-black/5 dark:border-white/5"
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
    </div>
  );
}
