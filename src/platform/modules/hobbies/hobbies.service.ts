import { db, schema } from '../../db';
import { eq, desc, and, or, like } from 'drizzle-orm';
import { NotFoundError } from '../../core/errors';

export interface MediaEntryDto {
  id: string;
  slug: string;
  type: string;
  externalProvider: string | null;
  externalId: string | null;
  title: string;
  releaseYear: number | null;
  genres: string[];
  creators: string[];
  posterUrl: string | null;
  backdropUrl: string | null;
  myRating: number | null;
  watchStatus: string;
  consumedAt: string | null;
  personalReview: string | null;
  favoriteCharacters: string[];
  favoriteScenes: string[];
  quotes: string[];
  tier: string | null;
  galleryId: string | null;
}

export class HobbiesService {
  async getMediaEntries(
    options: {
      type?: string;
      tier?: string;
      watchStatus?: string;
      search?: string;
    } = {},
  ): Promise<MediaEntryDto[]> {
    const conditions = [];
    if (options.type) {
      conditions.push(eq(schema.mediaEntry.type, options.type));
    }
    if (options.tier) {
      conditions.push(eq(schema.mediaEntry.tier, options.tier));
    }
    if (options.watchStatus) {
      conditions.push(eq(schema.mediaEntry.watchStatus, options.watchStatus));
    }
    if (options.search && options.search.trim()) {
      const q = `%${options.search.trim()}%`;
      conditions.push(
        or(
          like(schema.mediaEntry.title, q),
          like(schema.mediaEntry.creatorsJson, q),
          like(schema.mediaEntry.genresJson, q),
          like(schema.mediaEntry.personalReview, q),
        ),
      );
    }

    const query = db.select().from(schema.mediaEntry);
    const records = await (conditions.length > 0
      ? query
          .where(and(...conditions))
          .orderBy(desc(schema.mediaEntry.myRating))
      : query.orderBy(desc(schema.mediaEntry.myRating)));

    return records.map((item) => ({
      id: item.id,
      slug: item.slug,
      type: item.type,
      externalProvider: item.externalProvider,
      externalId: item.externalId,
      title: item.title,
      releaseYear: item.releaseYear,
      genres: item.genresJson ? JSON.parse(item.genresJson) : [],
      creators: item.creatorsJson ? JSON.parse(item.creatorsJson) : [],
      posterUrl: item.posterUrl,
      backdropUrl: item.backdropUrl,
      myRating: item.myRating,
      watchStatus: item.watchStatus,
      consumedAt: item.consumedAt,
      personalReview: item.personalReview,
      favoriteCharacters: item.favoriteCharactersJson
        ? JSON.parse(item.favoriteCharactersJson)
        : [],
      favoriteScenes: item.favoriteScenesJson
        ? JSON.parse(item.favoriteScenesJson)
        : [],
      quotes: item.quotesJson ? JSON.parse(item.quotesJson) : [],
      tier: item.tier,
      galleryId: item.galleryId,
    }));
  }

  async getMediaEntryBySlug(slug: string): Promise<MediaEntryDto> {
    const records = await db
      .select()
      .from(schema.mediaEntry)
      .where(eq(schema.mediaEntry.slug, slug))
      .limit(1);

    if (!records.length) {
      throw new NotFoundError('Media entry', slug);
    }

    const item = records[0];
    return {
      id: item.id,
      slug: item.slug,
      type: item.type,
      externalProvider: item.externalProvider,
      externalId: item.externalId,
      title: item.title,
      releaseYear: item.releaseYear,
      genres: item.genresJson ? JSON.parse(item.genresJson) : [],
      creators: item.creatorsJson ? JSON.parse(item.creatorsJson) : [],
      posterUrl: item.posterUrl,
      backdropUrl: item.backdropUrl,
      myRating: item.myRating,
      watchStatus: item.watchStatus,
      consumedAt: item.consumedAt,
      personalReview: item.personalReview,
      favoriteCharacters: item.favoriteCharactersJson
        ? JSON.parse(item.favoriteCharactersJson)
        : [],
      favoriteScenes: item.favoriteScenesJson
        ? JSON.parse(item.favoriteScenesJson)
        : [],
      quotes: item.quotesJson ? JSON.parse(item.quotesJson) : [],
      tier: item.tier,
      galleryId: item.galleryId,
    };
  }
}

export const hobbiesService = new HobbiesService();
