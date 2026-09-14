import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { mediaItem, gallery } from './media';
import { githubRepoSnapshot } from './integrations';

export const project = sqliteTable('project', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  tagline: text('tagline').notNull(),
  description: text('description').notNull(),
  caseStudyMarkdown: text('case_study_markdown'),
  status: text('status').notNull().default('active'), // 'active' | 'completed' | 'maintained' | 'archived'
  featuredPriority: integer('featured_priority'), // Nullable integer, lower number = higher display priority
  demoUrl: text('demo_url'),
  packageUrl: text('package_url'),
  githubRepoId: text('github_repo_id').references(() => githubRepoSnapshot.id),
  overrideGithubData: integer('override_github_data', { mode: 'boolean' })
    .notNull()
    .default(false),
  technologiesJson: text('technologies_json'), // Array of tech tags
  architectureJson: text('architecture_json'), // Array of highlights
  lessonsLearnedMarkdown: text('lessons_learned_markdown'),
  coverMediaId: text('cover_media_id').references(() => mediaItem.id),
  coverImageUrl: text('cover_image_url'), // Direct fallback URL or CDN path
  galleryId: text('gallery_id').references(() => gallery.id),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
