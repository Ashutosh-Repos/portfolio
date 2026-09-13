import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const mediaItem = sqliteTable('media_item', {
  id: text('id').primaryKey(),
  filename: text('filename').notNull(),
  mimeType: text('mime_type').notNull(),
  byteSize: integer('byte_size').notNull(),
  width: integer('width'),
  height: integer('height'),
  blurhash: text('blurhash'),
  altText: text('alt_text'),
  caption: text('caption'),
  storageKey: text('storage_key').notNull().unique(),
  publicUrl: text('public_url').notNull(),
  exifJson: text('exif_json'), // camera, lens, shutter, ISO, aperture, focalLength, date
  createdAt: integer('created_at').notNull(),
});

export const gallery = sqliteTable('gallery', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  coverMediaId: text('cover_media_id').references(() => mediaItem.id),
  createdAt: integer('created_at').notNull(),
});

export const galleryItem = sqliteTable('gallery_item', {
  id: text('id').primaryKey(),
  galleryId: text('gallery_id')
    .notNull()
    .references(() => gallery.id, { onDelete: 'cascade' }),
  mediaId: text('media_id')
    .notNull()
    .references(() => mediaItem.id, { onDelete: 'cascade' }),
  sortOrder: integer('sort_order').notNull().default(0),
  captionOverride: text('caption_override'),
});

export const mediaRelation = sqliteTable('media_relation', {
  id: text('id').primaryKey(),
  entityType: text('entity_type').notNull(), // 'education', 'experience', 'project', 'writing', 'hobby'
  entityId: text('entity_id').notNull(),
  mediaId: text('media_id')
    .notNull()
    .references(() => mediaItem.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'cover', 'logo', 'screenshot', 'inline', 'attachment'
  sortOrder: integer('sort_order').notNull().default(0),
});
