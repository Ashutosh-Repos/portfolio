import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const researchPaper = sqliteTable('research_paper', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  excerpt: text('excerpt').notNull(),
  contentMarkdown: text('content_markdown').notNull(),
  authorsJson: text('authors_json'), // Array of authors or institutions e.g. ["Google Research"]
  venue: text('venue'), // e.g. 'OSDI', 'VLDB', 'NeurIPS', 'arXiv', 'CACM'
  year: integer('year'), // e.g. 2024, 2017
  paperUrl: text('paper_url'), // Link to original PDF or arXiv page
  codeUrl: text('code_url'), // Link to GitHub repo if implementation exists
  takeawaysJson: text('takeaways_json'), // Array of bullet points
  status: text('status').notNull().default('published'), // 'reading' | 'analyzed' | 'published'
  readingTimeMinutes: integer('reading_time_minutes').notNull().default(8),
  tagsJson: text('tags_json'), // Array of tags
  citationsJson: text('citations_json'), // Array of citations
  publishedAt: integer('published_at'),
  updatedAt: integer('updated_at').notNull(),
});
