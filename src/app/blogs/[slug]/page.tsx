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
      title: item.title,
      description: item.excerpt,
    };
  } catch {
    const title = decodeURIComponent(slug);
    return {
      title,
      description: `Blog post by Ashutosh Kumar — "${title}".`,
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

  return (
    <ArticleView sectionLabel="Blogs" sectionHref="/blogs" article={article} />
  );
}
