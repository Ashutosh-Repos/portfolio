import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { mediaItem, gallery } from './media';

export const blog = sqliteTable('blog', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  excerpt: text('excerpt').notNull(),
  contentMarkdown: text('content_markdown').notNull(),
  category: text('category'), // e.g. 'Algorithms & Data Structures', 'Databases', 'Distributed Systems', 'AI Engineering'
  series: text('series'), // e.g. 'From the First Principles', 'Systems Internals'
  seriesOrder: integer('series_order'),
  status: text('status').notNull().default('published'), // 'draft' | 'published' | 'archived'
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  readingTimeMinutes: integer('reading_time_minutes').notNull().default(5),
  canonicalUrl: text('canonical_url'),
  coverMediaId: text('cover_media_id').references(() => mediaItem.id),
  coverImageUrl: text('cover_image_url'),
  galleryId: text('gallery_id').references(() => gallery.id),
  citationsJson: text('citations_json'), // Array of { title, url, doi, author }
  tagsJson: text('tags_json'), // Array of string tags
  publishedAt: integer('published_at'), // Epoch ms
  updatedAt: integer('updated_at').notNull(),
});
