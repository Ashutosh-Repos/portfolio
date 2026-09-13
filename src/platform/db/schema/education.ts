import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { mediaItem, gallery } from './media';

export const education = sqliteTable('education', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  institution: text('institution').notNull(),
  degree: text('degree').notNull(),
  fieldOfStudy: text('field_of_study').notNull(),
  gradeOrCgpa: text('grade_or_cgpa'),
  location: text('location'),
  startDate: text('start_date').notNull(), // ISO YYYY-MM or YYYY
  endDate: text('end_date'),
  isCurrent: integer('is_current', { mode: 'boolean' }).notNull().default(false),
  description: text('description'),
  highlightsJson: text('highlights_json'), // Array of string or structured achievement points
  linksJson: text('links_json'), // Array of { title, url, type }
  logoMediaId: text('logo_media_id').references(() => mediaItem.id),
  galleryId: text('gallery_id').references(() => gallery.id),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
