import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { mediaItem, gallery } from './media';

export const experience = sqliteTable('experience', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  company: text('company').notNull(),
  role: text('role').notNull(),
  employmentType: text('employment_type').notNull(), // 'full_time' | 'part_time' | 'contract' | 'open_source' | 'advisory'
  location: text('location'),
  locationType: text('location_type').notNull().default('remote'), // 'remote' | 'hybrid' | 'on_site'
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  isCurrent: integer('is_current', { mode: 'boolean' })
    .notNull()
    .default(false),
  description: text('description'),
  responsibilitiesJson: text('responsibilities_json'), // Array of responsibility bullet points
  achievementsJson: text('achievements_json'), // Array of achievement bullet points
  technologiesJson: text('technologies_json'), // Array of tech string tags
  storyMarkdown: text('story_markdown'), // Long-form narrative reflection
  companyUrl: text('company_url'),
  logoMediaId: text('logo_media_id').references(() => mediaItem.id),
  logoUrl: text('logo_url'), // Direct fallback URL or CDN path
  galleryId: text('gallery_id').references(() => gallery.id),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
