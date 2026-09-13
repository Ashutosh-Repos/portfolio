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
      title: item.title,
      description: item.excerpt,
    };
  } catch {
    const title = decodeURIComponent(slug);
    return {
      title,
      description: `Paper breakdown by Ashutosh Kumar — "${title}".`,
    };
  }
}

export default async function PaperDetailPage({ params }: PaperPageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await writingService.getWritingBySlug(slug, 'research_paper').catch(() =>
      writingService.getWritingBySlug(slug)
    );
  } catch {
    notFound();
  }

  return (
    <ArticleView
      sectionLabel="Papershelf"
      sectionHref="/papershelf"
      article={article}
    />
  );
}
