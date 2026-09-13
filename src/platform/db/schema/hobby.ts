import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { gallery } from './media';

export const mediaEntry = sqliteTable('media_entry', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  type: text('type').notNull(), // 'movie' | 'tv_series' | 'book' | 'anime' | 'game'
  externalProvider: text('external_provider'), // 'tmdb' | 'openlibrary' | 'goodreads'
  externalId: text('external_id'),
  title: text('title').notNull(),
  releaseYear: integer('release_year'),
  genresJson: text('genres_json'), // Array of genres
  creatorsJson: text('creators_json'), // Array of directors / authors / creators
  posterUrl: text('poster_url'),
  backdropUrl: text('backdrop_url'),
  myRating: real('my_rating'), // 1.0 - 10.0
  watchStatus: text('watch_status').notNull().default('completed'), // 'completed' | 'watching' | 'plan_to_watch' | 'dropped'
  consumedAt: text('consumed_at'),
  personalReview: text('personal_review'), // Markdown opinions
  favoriteCharactersJson: text('favorite_characters_json'), // Array of names
  favoriteScenesJson: text('favorite_scenes_json'), // Array of scene descriptions
  quotesJson: text('quotes_json'), // Array of quotes
  tier: text('tier'), // 'masterpiece' | 'favorite' | 'recommended' | 'casual'
  galleryId: text('gallery_id').references(() => gallery.id),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
