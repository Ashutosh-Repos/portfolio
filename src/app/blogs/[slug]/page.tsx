import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogService } from '@/platform/modules/blogs/blog.service';
import { ArticleView } from '@/components/Writings/ArticleView';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const item = await blogService.getBlogBySlug(slug);
    return {
      title: `${item.title} — Ashutosh`,
      description: item.excerpt,
      alternates: {
        canonical: `/blogs/${slug}`,
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
      description: `Technical blog post by Ashutosh — "${title}".`,
      alternates: {
        canonical: `/blogs/${slug}`,
      },
    };
  }

}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await blogService.getBlogBySlug(slug);
  } catch {
    notFound();
  }

  // Retrieve blog list to determine previous and next articles
  const allBlogsResult = await blogService
    .getBlogs({ limit: 100 })
    .catch(() => ({ items: [] }));
  const items = allBlogsResult.items;
  const currentIndex = items.findIndex(
    (b) => b.slug === article.slug || b.id === article.id,
  );
  const prevArticle =
    currentIndex > 0
      ? {
          title: items[currentIndex - 1].title,
          href: `/blogs/${items[currentIndex - 1].slug}`,
        }
      : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < items.length - 1
      ? {
          title: items[currentIndex + 1].title,
          href: `/blogs/${items[currentIndex + 1].slug}`,
        }
      : null;

  return (
    <ArticleView
      sectionLabel="Blogs"
      sectionHref="/blogs"
      article={article}
      prevArticle={prevArticle}
      nextArticle={nextArticle}
    />
  );
}
