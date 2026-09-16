import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { writingService } from '@/platform/modules/writing/writing.service';
import { ArticleView } from '@/components/Writings/ArticleView';

interface PaperPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PaperPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const item = await writingService.getWritingBySlug(slug);
    return {
      title: `${item.title} — Ashutosh`,
      description: item.excerpt,
      alternates: {
        canonical: `/papershelf/${slug}`,
      },
      openGraph: {
        type: 'article',
        title: item.title,
        description: item.excerpt,
        authors: ['Ashutosh'],
        publishedTime: item.publishedAt
          ? new Date(item.publishedAt).toISOString()
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: item.title,
        description: item.excerpt,
      },
    };
  } catch {
    const title = decodeURIComponent(slug);
    return {
      title: `${title} — Ashutosh`,
      description: `Paper breakdown by Ashutosh — "${title}".`,
      alternates: {
        canonical: `/papershelf/${slug}`,
      },
    };
  }

}

export default async function PaperDetailPage({ params }: PaperPageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await writingService
      .getWritingBySlug(slug, 'research_paper')
      .catch(() => writingService.getWritingBySlug(slug));
  } catch {
    notFound();
  }

  // Retrieve paper list to determine previous and next articles
  const allPapersResult = await writingService
    .getWritings({ type: 'research_paper', limit: 100 })
    .catch(() => ({ items: [] }));
  const items = allPapersResult.items;
  const currentIndex = items.findIndex(
    (p) => p.slug === article.slug || p.id === article.id,
  );
  const prevArticle =
    currentIndex > 0
      ? {
          title: items[currentIndex - 1].title,
          href: `/papershelf/${items[currentIndex - 1].slug}`,
        }
      : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < items.length - 1
      ? {
          title: items[currentIndex + 1].title,
          href: `/papershelf/${items[currentIndex + 1].slug}`,
        }
      : null;

  return (
    <ArticleView
      sectionLabel="Papershelf"
      sectionHref="/papershelf"
      article={{
        ...article,
        paperUrl: article.canonicalUrl,
      }}
      prevArticle={prevArticle}
      nextArticle={nextArticle}
    />
  );
}
