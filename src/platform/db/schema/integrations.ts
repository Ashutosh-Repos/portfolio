import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const integrationProvider = sqliteTable('integration_provider', {
  providerKey: text('provider_key').primaryKey(), // 'github', 'leetcode', 'tmdb'
  displayName: text('display_name').notNull(),
  accountIdentifier: text('account_identifier').notNull(), // e.g. username 'Ashutosh-Repos'
  syncFrequencyHours: integer('sync_frequency_hours').notNull().default(6),
  lastSyncedAt: integer('last_synced_at'),
  syncStatus: text('sync_status').notNull().default('idle'), // 'idle' | 'running' | 'success' | 'error'
  lastError: text('last_error'),
  metadataJson: text('metadata_json'),
});

export const githubRepoSnapshot = sqliteTable('github_repo_snapshot', {
  id: text('id').primaryKey(), // Owner/repo e.g. 'Ashutosh-Repos/portfolio_v2'
  name: text('name').notNull(),
  fullName: text('full_name').notNull().unique(),
  description: text('description'),
  stars: integer('stars').notNull().default(0),
  forks: integer('forks').notNull().default(0),
  openIssues: integer('open_issues').notNull().default(0),
  primaryLanguage: text('primary_language'),
  languagesJson: text('languages_json'), // Record<string, number>
  latestCommitSha: text('latest_commit_sha'),
  latestCommitAt: integer('latest_commit_at'),
  isPinned: integer('is_pinned', { mode: 'boolean' }).notNull().default(false),
  repoUrl: text('repo_url').notNull(),
  homepageUrl: text('homepage_url'),
  topicsJson: text('topics_json'), // Array<string>
  syncedAt: integer('synced_at').notNull(),
});

export const externalActivitySnapshot = sqliteTable('external_activity_snapshot', {
  id: text('id').primaryKey(), // e.g. 'leetcode_overview' or 'github_overview'
  provider: text('provider').notNull(), // 'github' | 'leetcode'
  metricType: text('metric_type').notNull(), // 'overview' | 'heatmap' | 'contest'
  payloadJson: text('payload_json').notNull(), // Normalized snapshot data
  syncedAt: integer('synced_at').notNull(),
});
