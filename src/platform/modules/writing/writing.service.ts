import { db, schema } from '../../db';
import { eq, desc, and, sql, like } from 'drizzle-orm';
import { NotFoundError } from '../../core/errors';
import {
  decodeCursor,
  encodeCursor,
  type ApiPaginationMeta,
} from '../../core/pagination';

export interface WritingDto {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  contentMarkdown: string;
  type: string;
  status: string;
  publishedAt: number | null;
  updatedAt: number;
  readingTimeMinutes: number;
  canonicalUrl: string | null;
  coverImageUrl: string | null;
  galleryId: string | null;
  citations: Array<{
    title: string;
    url?: string;
    author?: string;
    doi?: string;
  }>;
  tags: string[];
}

export interface WritingListResult {
  items: WritingDto[];
  meta: ApiPaginationMeta;
}

export class WritingService {
  async getWritings(
    options: {
      type?: string;
      tag?: string;
      status?: string;
      limit?: number;
      cursor?: string;
    } = {},
  ): Promise<WritingListResult> {
    const limit = options.limit
      ? Math.min(Math.max(options.limit, 1), 100)
      : 20;
    const conditions = [];

    // Default to published unless requested otherwise
    const targetStatus = options.status || 'published';
    conditions.push(eq(schema.writing.status, targetStatus));

    if (options.type) {
      conditions.push(eq(schema.writing.type, options.type));
    }

    if (options.tag) {
      conditions.push(like(schema.writing.tagsJson, `%"${options.tag}"%`));
    }

    // Cursor pagination (keyset based on publishedAt + id)
    if (options.cursor) {
      const decoded = decodeCursor<{ publishedAt: number; id: string }>(
        options.cursor,
      );
      if (decoded && decoded.publishedAt) {
        conditions.push(
          sql`(${schema.writing.publishedAt} < ${decoded.publishedAt} OR (${schema.writing.publishedAt} = ${decoded.publishedAt} AND ${schema.writing.id} < ${decoded.id}))`,
        );
      }
    }

    // Fetch limit + 1 to know if hasMore is true
    const records = await db
      .select()
      .from(schema.writing)
      .where(and(...conditions))
      .orderBy(desc(schema.writing.publishedAt), desc(schema.writing.id))
      .limit(limit + 1);

    const hasMore = records.length > limit;
    const items = hasMore ? records.slice(0, limit) : records;

    const mappedItems: WritingDto[] = items.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle,
      excerpt: item.excerpt,
      contentMarkdown: item.contentMarkdown,
      type: item.type,
      status: item.status,
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
      readingTimeMinutes: item.readingTimeMinutes,
      canonicalUrl: item.canonicalUrl,
      coverImageUrl: item.coverImageUrl,
      galleryId: item.galleryId,
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

  async getWritingBySlug(
    slugOrTitle: string,
    expectedType?: string,
  ): Promise<WritingDto> {
    const decoded = decodeURIComponent(slugOrTitle).trim();
    const normalizedSlug = decoded
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const conditions = [
      sql`(${schema.writing.slug} = ${slugOrTitle} OR ${schema.writing.slug} = ${normalizedSlug} OR LOWER(${schema.writing.title}) = LOWER(${decoded}))`,
    ];

    if (expectedType) {
      conditions.push(eq(schema.writing.type, expectedType));
    }

    const records = await db
      .select()
      .from(schema.writing)
      .where(and(...conditions))
      .limit(1);

    if (!records.length) {
      throw new NotFoundError(expectedType || 'Writing', slugOrTitle);
    }

    const item = records[0];
    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle,
      excerpt: item.excerpt,
      contentMarkdown: item.contentMarkdown,
      type: item.type,
      status: item.status,
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
      readingTimeMinutes: item.readingTimeMinutes,
      canonicalUrl: item.canonicalUrl,
      coverImageUrl: item.coverImageUrl,
      galleryId: item.galleryId,
      citations: item.citationsJson ? JSON.parse(item.citationsJson) : [],
      tags: item.tagsJson ? JSON.parse(item.tagsJson) : [],
    };
  }
}

export const writingService = new WritingService();
