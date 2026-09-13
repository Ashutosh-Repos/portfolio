import { db, schema } from '../../db';
import { eq, desc, and, sql, like } from 'drizzle-orm';
import { NotFoundError } from '../../core/errors';
import { decodeCursor, encodeCursor, type ApiPaginationMeta } from '../../core/pagination';

export interface PaperDto {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  contentMarkdown: string;
  authors: string[];
  venue: string | null;
  year: number | null;
  paperUrl: string | null;
  codeUrl: string | null;
  takeaways: string[];
  status: string;
  readingTimeMinutes: number;
  tags: string[];
  citations: Array<{ title: string; url?: string; author?: string; doi?: string }>;
  publishedAt: number | null;
  updatedAt: number;
}

export interface PaperListResult {
  items: PaperDto[];
  meta: ApiPaginationMeta;
}

export class PaperService {
  async getPapers(options: {
    venue?: string;
    year?: number;
    tag?: string;
    status?: string;
    limit?: number;
    cursor?: string;
  } = {}): Promise<PaperListResult> {
    const limit = options.limit ? Math.min(Math.max(options.limit, 1), 100) : 20;
    const conditions = [];

    const targetStatus = options.status || 'published';
    conditions.push(eq(schema.researchPaper.status, targetStatus));

    if (options.venue) {
      conditions.push(eq(schema.researchPaper.venue, options.venue));
    }

    if (options.year) {
      conditions.push(eq(schema.researchPaper.year, options.year));
    }

    if (options.tag) {
      conditions.push(like(schema.researchPaper.tagsJson, `%"${options.tag}"%`));
    }

    if (options.cursor) {
      const decoded = decodeCursor<{ publishedAt: number; id: string }>(options.cursor);
      if (decoded && decoded.publishedAt) {
        conditions.push(
          sql`(${schema.researchPaper.publishedAt} < ${decoded.publishedAt} OR (${schema.researchPaper.publishedAt} = ${decoded.publishedAt} AND ${schema.researchPaper.id} < ${decoded.id}))`
        );
      }
    }

    const records = await db
      .select()
      .from(schema.researchPaper)
      .where(and(...conditions))
      .orderBy(desc(schema.researchPaper.publishedAt), desc(schema.researchPaper.id))
      .limit(limit + 1);

    const hasMore = records.length > limit;
    const items = hasMore ? records.slice(0, limit) : records;

    const mappedItems: PaperDto[] = items.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle,
      excerpt: item.excerpt,
      contentMarkdown: item.contentMarkdown,
      authors: item.authorsJson ? JSON.parse(item.authorsJson) : [],
      venue: item.venue,
      year: item.year,
      paperUrl: item.paperUrl,
      codeUrl: item.codeUrl,
      takeaways: item.takeawaysJson ? JSON.parse(item.takeawaysJson) : [],
      status: item.status,
      readingTimeMinutes: item.readingTimeMinutes,
      tags: item.tagsJson ? JSON.parse(item.tagsJson) : [],
      citations: item.citationsJson ? JSON.parse(item.citationsJson) : [],
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
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

  async getPaperBySlug(slugOrTitle: string): Promise<PaperDto> {
    const decoded = decodeURIComponent(slugOrTitle).trim();
    const normalizedSlug = decoded.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const records = await db
      .select()
      .from(schema.researchPaper)
      .where(
        sql`${schema.researchPaper.slug} = ${slugOrTitle} OR ${schema.researchPaper.slug} = ${normalizedSlug} OR LOWER(${schema.researchPaper.title}) = LOWER(${decoded})`
      )
      .limit(1);

    if (!records.length) {
      throw new NotFoundError('Research Paper', slugOrTitle);
    }

    const item = records[0];
    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle,
      excerpt: item.excerpt,
      contentMarkdown: item.contentMarkdown,
      authors: item.authorsJson ? JSON.parse(item.authorsJson) : [],
      venue: item.venue,
      year: item.year,
      paperUrl: item.paperUrl,
      codeUrl: item.codeUrl,
      takeaways: item.takeawaysJson ? JSON.parse(item.takeawaysJson) : [],
      status: item.status,
      readingTimeMinutes: item.readingTimeMinutes,
      tags: item.tagsJson ? JSON.parse(item.tagsJson) : [],
      citations: item.citationsJson ? JSON.parse(item.citationsJson) : [],
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
    };
  }
}

export const paperService = new PaperService();
