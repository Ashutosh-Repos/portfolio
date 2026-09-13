import { db, schema } from '../../db';
import { eq, desc, and, sql, like } from 'drizzle-orm';
import { NotFoundError } from '../../core/errors';
import { decodeCursor, encodeCursor, type ApiPaginationMeta } from '../../core/pagination';

export interface BlogDto {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  contentMarkdown: string;
  category: string | null;
  series: string | null;
  seriesOrder: number | null;
  status: string;
  featured: boolean;
  publishedAt: number | null;
  updatedAt: number;
  readingTimeMinutes: number;
  canonicalUrl: string | null;
  coverImageUrl: string | null;
  citations: Array<{ title: string; url?: string; author?: string; doi?: string }>;
  tags: string[];
}

export interface BlogListResult {
  items: BlogDto[];
  meta: ApiPaginationMeta;
}

export class BlogService {
  async getBlogs(options: {
    category?: string;
    series?: string;
    tag?: string;
    status?: string;
    limit?: number;
    cursor?: string;
  } = {}): Promise<BlogListResult> {
    const limit = options.limit ? Math.min(Math.max(options.limit, 1), 100) : 20;
    const conditions = [];

    const targetStatus = options.status || 'published';
    conditions.push(eq(schema.blog.status, targetStatus));

    if (options.category) {
      conditions.push(eq(schema.blog.category, options.category));
    }

    if (options.series) {
      conditions.push(eq(schema.blog.series, options.series));
    }

    if (options.tag) {
      conditions.push(like(schema.blog.tagsJson, `%"${options.tag}"%`));
    }

    if (options.cursor) {
      const decoded = decodeCursor<{ publishedAt: number; id: string }>(options.cursor);
      if (decoded && decoded.publishedAt) {
        conditions.push(
          sql`(${schema.blog.publishedAt} < ${decoded.publishedAt} OR (${schema.blog.publishedAt} = ${decoded.publishedAt} AND ${schema.blog.id} < ${decoded.id}))`
        );
      }
    }

    const records = await db
      .select()
      .from(schema.blog)
      .where(and(...conditions))
      .orderBy(desc(schema.blog.publishedAt), desc(schema.blog.id))
      .limit(limit + 1);

    const hasMore = records.length > limit;
    const items = hasMore ? records.slice(0, limit) : records;

    const mappedItems: BlogDto[] = items.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle,
      excerpt: item.excerpt,
      contentMarkdown: item.contentMarkdown,
      category: item.category,
      series: item.series,
      seriesOrder: item.seriesOrder,
      status: item.status,
      featured: Boolean(item.featured),
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
      readingTimeMinutes: item.readingTimeMinutes,
      canonicalUrl: item.canonicalUrl,
      coverImageUrl: item.coverImageUrl,
      citations: item.citationsJson ? JSON.parse(item.citationsJson) : [],
      tags: item.tagsJson ? JSON.parse(item.tagsJson) : [],
    }));

    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];
      nextCursor = encodeCursor({
        publishedAt: lastItem.publishedAt,
        id: lastItem.id,
      });
    }

    return {
      items: mappedItems,
      meta: {
        count: mappedItems.length,
        hasMore,
        nextCursor,
        limit,
      },
    };
  }

  async getBlogBySlug(slugOrTitle: string): Promise<BlogDto> {
    const decoded = decodeURIComponent(slugOrTitle).trim();
    const normalizedSlug = decoded.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const records = await db
      .select()
      .from(schema.blog)
      .where(
        sql`${schema.blog.slug} = ${slugOrTitle} OR ${schema.blog.slug} = ${normalizedSlug} OR LOWER(${schema.blog.title}) = LOWER(${decoded})`
      )
      .limit(1);

    if (!records.length) {
      throw new NotFoundError('Blog', slugOrTitle);
    }

    const item = records[0];
    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle,
      excerpt: item.excerpt,
      contentMarkdown: item.contentMarkdown,
      category: item.category,
      series: item.series,
      seriesOrder: item.seriesOrder,
      status: item.status,
      featured: Boolean(item.featured),
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
      readingTimeMinutes: item.readingTimeMinutes,
      canonicalUrl: item.canonicalUrl,
      coverImageUrl: item.coverImageUrl,
      citations: item.citationsJson ? JSON.parse(item.citationsJson) : [],
      tags: item.tagsJson ? JSON.parse(item.tagsJson) : [],
    };
  }
}

export const blogService = new BlogService();
