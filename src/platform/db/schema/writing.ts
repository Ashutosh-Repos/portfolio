import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { mediaItem, gallery } from './media';

export const writing = sqliteTable('writing', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  excerpt: text('excerpt').notNull(),
  contentMarkdown: text('content_markdown').notNull(),
  type: text('type').notNull(), // 'blog' | 'article' | 'essay' | 'tech_note' | 'research_paper' | 'journal' | 'story'
  status: text('status').notNull().default('published'), // 'draft' | 'published' | 'archived'
  publishedAt: integer('published_at'), // Epoch millisecond or null if draft
  updatedAt: integer('updated_at').notNull(),
  readingTimeMinutes: integer('reading_time_minutes').notNull().default(1),
  canonicalUrl: text('canonical_url'),
  coverMediaId: text('cover_media_id').references(() => mediaItem.id),
  coverImageUrl: text('cover_image_url'),
  galleryId: text('gallery_id').references(() => gallery.id),
  citationsJson: text('citations_json'), // Array of { title, url, doi, author }
  relatedWritingIdsJson: text('related_writing_ids_json'), // Array of IDs
  tagsJson: text('tags_json'), // Array of string tags
});

export const tag = sqliteTable('tag', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
});

export const writingTag = sqliteTable('writing_tag', {
  writingId: text('writing_id')
    .notNull()
    .references(() => writing.id, { onDelete: 'cascade' }),
  tagId: text('tag_id')
    .notNull()
    .references(() => tag.id, { onDelete: 'cascade' }),
});
