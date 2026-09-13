import { db, schema } from './index';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

export async function seedAllWritings() {
  console.log('✍️ Seeding authentic personal essays from designerdada...');
  const jsonPath = path.join(__dirname, 'designerdada-essays.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Missing ${jsonPath}`);
  }

  const essays = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const now = Date.now();

  let count = 0;
  for (let i = 0; i < essays.length; i++) {
    const item = essays[i];
    const id = `essay-${item.slug}`;
    // Stagger dates realistically in 2024–2026
    const publishedAt = now - (i * 86400000 * 20);

    const record = {
      id,
      slug: item.slug,
      title: item.title,
      subtitle: null,
      excerpt: item.excerpt,
      contentMarkdown: item.markdown,
      type: 'essay',
      status: 'published',
      publishedAt,
      updatedAt: now,
      readingTimeMinutes: item.readingTimeMinutes,
      canonicalUrl: item.canonicalUrl,
      coverImageUrl: null,
      coverMediaId: null,
      galleryId: null,
      citationsJson: JSON.stringify([]),
      tagsJson: JSON.stringify(['Essays', 'Design', 'Craft', 'Outcomes', 'Philosophy']),
    };

    await db
      .insert(schema.writing)
      .values(record)
      .onConflictDoUpdate({
        target: schema.writing.id,
        set: {
          title: sql`excluded.title`,
          excerpt: sql`excluded.excerpt`,
          contentMarkdown: sql`excluded.content_markdown`,
          readingTimeMinutes: sql`excluded.reading_time_minutes`,
          canonicalUrl: sql`excluded.canonical_url`,
          tagsJson: sql`excluded.tags_json`,
          publishedAt: sql`excluded.published_at`,
          updatedAt: now,
        },
      });

    count++;
  }

  console.log(`✅ Successfully seeded ${count} authentic personal essays into schema.writing!`);
}
