import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const profile = sqliteTable('profile', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  headline: text('headline').notNull(),
  bio: text('bio').notNull(),
  currentFocus: text('current_focus'),
  location: text('location'),
  availabilityStatus: text('availability_status'), // e.g. "Available for select advisory & deep tech roles"
  socialLinksJson: text('social_links_json'), // Array of { platform, url, username, icon }
  updatedAt: integer('updated_at').notNull(),
});
