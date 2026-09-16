import type { MetadataRoute } from 'next';
import { blogService } from '@/platform/modules/blogs/blog.service';
import { writingService } from '@/platform/modules/writing/writing.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/myworks`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/writings`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/papershelf`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contactme`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about/hobbies/travel`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/about/hobbies/movies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/about/hobbies/webseries`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic blogs
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await blogService.getBlogs({ limit: 100 });
    blogRoutes = (blogs.items || []).map((blog) => ({
      url: `${siteUrl}/blogs/${blog.slug}`,
      lastModified: blog.publishedAt ? new Date(blog.publishedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    // Graceful fallback if database isn't reached
  }

  // Dynamic essays
  let essayRoutes: MetadataRoute.Sitemap = [];
  try {
    const essays = await writingService.getWritings({
      type: 'essay',
      limit: 100,
    });
    essayRoutes = (essays.items || []).map((essay) => ({
      url: `${siteUrl}/writings/${essay.slug}`,
      lastModified: essay.publishedAt ? new Date(essay.publishedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    // Graceful fallback
  }

  // Dynamic research papers
  let paperRoutes: MetadataRoute.Sitemap = [];
  try {
    const papers = await writingService.getWritings({
      type: 'research_paper',
      limit: 100,
    });
    paperRoutes = (papers.items || []).map((paper) => ({
      url: `${siteUrl}/papershelf/${paper.slug}`,
      lastModified: paper.publishedAt ? new Date(paper.publishedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    // Graceful fallback
  }

  return [...staticRoutes, ...blogRoutes, ...essayRoutes, ...paperRoutes];
}
