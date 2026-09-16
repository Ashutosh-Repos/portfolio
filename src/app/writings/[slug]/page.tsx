import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { writingService } from '@/platform/modules/writing/writing.service';
import { ArticleView } from '@/components/Writings/ArticleView';

interface WritingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const item = await writingService.getWritingBySlug(slug);
    return {
      title: `${item.title} — Ashutosh`,
      description: item.excerpt,
      alternates: {
        canonical: `/writings/${slug}`,
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
      description: `Essay by Ashutosh — "${title}".`,
      alternates: {
        canonical: `/writings/${slug}`,
      },
    };
  }

}

export default async function WritingDetailPage({ params }: WritingPageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await writingService.getWritingBySlug(slug);
  } catch {
    notFound();
  }

  // If this item is a blog post, redirect to canonical /blogs/:slug
  if (article.type === 'blog') {
    redirect(`/blogs/${article.slug}`);
  }

  // If this item is a research paper, redirect to canonical /papershelf/:slug
  if (article.type === 'research_paper') {
    redirect(`/papershelf/${article.slug}`);
  }

  // Retrieve essay list to determine previous and next articles
  const allEssaysResult = await writingService
    .getWritings({ type: 'essay', limit: 100 })
    .catch(() => ({ items: [] }));
  const items = allEssaysResult.items;
  const currentIndex = items.findIndex(
    (e) => e.slug === article.slug || e.id === article.id,
  );
  const prevArticle =
    currentIndex > 0
      ? {
          title: items[currentIndex - 1].title,
          href: `/writings/${items[currentIndex - 1].slug}`,
        }
      : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < items.length - 1
      ? {
          title: items[currentIndex + 1].title,
          href: `/writings/${items[currentIndex + 1].slug}`,
        }
      : null;

  return (
    <ArticleView
      sectionLabel="Writings"
      sectionHref="/writings"
      article={article}
      prevArticle={prevArticle}
      nextArticle={nextArticle}
    />
  );
}
