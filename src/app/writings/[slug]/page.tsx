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
      title: item.title,
      description: item.excerpt,
    };
  } catch {
    const title = decodeURIComponent(slug);
    return {
      title,
      description: `Essay by Ashutosh Kumar — "${title}".`,
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

  return (
    <ArticleView
      sectionLabel="Writings"
      sectionHref="/writings"
      article={article}
    />
  );
}
