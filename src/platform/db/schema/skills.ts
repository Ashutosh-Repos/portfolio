import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { mediaItem } from './media';

export const skill = sqliteTable('skill', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(), // 'languages' | 'frameworks' | 'databases' | 'cloud_infra' | 'ai_ml' | 'tools'
  proficiencyTier: text('proficiency_tier').notNull().default('proficient'), // 'master' | 'proficient' | 'familiar'
  yearsOfExperience: integer('years_of_experience'),
  iconSlug: text('icon_slug'),
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const achievement = sqliteTable('achievement', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  issuer: text('issuer').notNull(),
  category: text('category').notNull(), // 'competition' | 'hackathon' | 'certification' | 'honor'
  dateAwarded: text('date_awarded').notNull(),
  credentialUrl: text('credential_url'),
  description: text('description'),
  mediaId: text('media_id').references(() => mediaItem.id),
  sortOrder: integer('sort_order').notNull().default(0),
});
