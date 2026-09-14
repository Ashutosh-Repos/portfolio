import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { db, schema } from './index';
import { sql } from 'drizzle-orm';
import { BLOOM_FILTER_ARTICLE } from './seed-bloom-filters';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Preserve code block languages from Astro
turndown.addRule('astroCode', {
  filter: (node) => node.nodeName === 'PRE' && !!node.querySelector('code'),
  replacement: (content, node) => {
    const element = node as HTMLElement;
    const lang = element.getAttribute('data-language') || 'text';
    const code = element.querySelector('code')?.textContent || '';
    return `\n\n\`\`\`${lang}\n${code.trim()}\n\`\`\`\n\n`;
  },
});

// Remove Twitter / YouTube widgets or scripts if any
turndown.addRule('stripWidgets', {
  filter: (node) =>
    ['script', 'style', 'lite-youtube', 'lite-vimeo'].includes(
      node.nodeName.toLowerCase(),
    ),
  replacement: () => '',
});

export const BLOG_SLUGS = [
  'clock-sync-nightmare',
  'how-llm-inference-works',
  'blocking-queues',
  'heartbeats-in-distributed-systems',
  'grpc-http2',
  'cdn-content-replication',
  'why-consensus',
  'database-deadlocks',
  'dns-udp-tcp',
  'fast-and-efficient-pagination-in-mongodb',
  'mongodb-cursor-skip-is-slow',
  'benchmark-and-compare-pagination-approach-in-mongodb',
  'sliding-window-ratelimiter',
  'bayesian-average',
  'fsm-python',
  'midpoint-insertion-caching-strategy',
  'copy-on-write',
  'fractional-cascading',
  'inheritance-c',
  'bitcask',
  'morris-counter',
  'lfu',
  'ts-smoothing',
  '1d-terrain',
  'israeli-queues',
  '2q-cache',
  'flajolet-martin',
  'fork-bomb',
  'mistaken-beliefs-of-distributed-systems',
  'architectures-in-distributed-systems',
  'cpu-cache-locality',
  'eventual-consistency',
  'redis-replication',
  'ai-first-org',
];

const ACID_SLUGS = ['atomicity', 'consistency', 'isolation', 'durability'];

function getRandomDateInLast4Years(): number {
  const now = Date.now();
  const fourYearsAgo = now - 4 * 365 * 24 * 60 * 60 * 1000;
  // Pick random timestamp in the range [fourYearsAgo, now - 3 days]
  return Math.floor(
    fourYearsAgo + Math.random() * (now - fourYearsAgo - 3 * 86400000),
  );
}

async function fetchBlogData(slug: string) {
  const url = `https://arpitbhayani.me/blogs/${slug}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) {
      console.warn(`⚠️ Failed to fetch ${url}: status ${res.status}`);
      return null;
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    const title =
      $('h1.title').text().trim() || $('title').text().split('|')[0].trim();
    const excerpt =
      $('meta[name="description"]').attr('content')?.trim() ||
      $('meta[property="og:description"]').attr('content')?.trim() ||
      '';

    const category = $('a.tag.is-dark').first().text().trim() || null;

    const tags: string[] = [];
    $('div.tags-and-category a.tag').each((_, el) => {
      const text = $(el).text().trim().replace(/^#/, '');
      if (text && !tags.includes(text) && text !== category) {
        tags.push(text);
      }
    });

    const contentHtml = $('div.content.blog-content').html() || '';
    let markdown = turndown.turndown(contentHtml);

    // Clean up excessive newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim();

    // Estimate reading time (approx 200 words per minute)
    const wordCount = markdown.split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

    return {
      slug,
      title,
      excerpt,
      category,
      tags,
      markdown,
      readingTimeMinutes,
      canonicalUrl: url,
    };
  } catch (err) {
    console.error(`❌ Error fetching ${slug}:`, err);
    return null;
  }
}

async function fetchAndMergeAcidBlog() {
  console.log(
    '🔗 Fetching and merging ACID articles (atomicity, consistency, isolation, durability)...',
  );
  const results = await Promise.all(
    ACID_SLUGS.map((slug) => fetchBlogData(slug)),
  );
  const validParts = results.filter(
    (p): p is NonNullable<typeof p> => p !== null,
  );

  if (validParts.length === 0) return null;

  const atomicity = validParts.find((p) => p.slug === 'atomicity');
  const consistency = validParts.find((p) => p.slug === 'consistency');
  const isolation = validParts.find((p) => p.slug === 'isolation');
  const durability = validParts.find((p) => p.slug === 'durability');

  const combinedMarkdown = `ACID guarantees are the cornerstone of transactional reliability in database systems. First coined in 1983 by Andreas Reuter and Theo Härder building upon Jim Gray's work, ACID ensures that database transactions are processed reliably even in the presence of power loss, hardware failures, concurrent race conditions, and network partitions.

In this comprehensive essay, we explore the four foundational pillars of ACID end-to-end:

1. **Atomicity** — All-or-nothing execution
2. **Consistency** — Preserving application and database invariants
3. **Isolation** — Concurrent transaction execution without race hazards
4. **Durability** — Ensuring committed transactions survive crashes and power failure

---

## 1. Atomicity: The All-or-Nothing Guarantee

${
  atomicity
    ? atomicity.markdown
    : 'Atomicity ensures that all statements within a transaction boundary succeed or none do.'
}

---

## 2. Consistency: Preserving Invariants

${
  consistency
    ? consistency.markdown
    : 'Consistency guarantees that a transaction transforms the database from one valid state to another.'
}

---

## 3. Isolation: Concurrency Without Chaos

${
  isolation
    ? isolation.markdown
    : 'Isolation ensures that concurrently executing transactions do not interfere with each other.'
}

---

## 4. Durability: Surviving Catastrophic Crashes

${
  durability
    ? durability.markdown
    : 'Durability guarantees that once a transaction has committed, its changes will persist permanently.'
}

---

## Summary: Modern Tradeoffs in ACID Systems

While ACID transactions provide clean mental models for developers, scaling ACID across distributed nodes introduces tradeoffs captured by the PACELC and CAP theorems. Modern distributed databases like Google Spanner, CockroachDB, and TiDB employ atomic clocks, Raft/Paxos consensus, and two-phase commit (2PC) to offer Distributed ACID across geographic regions.
`;

  const wordCount = combinedMarkdown.split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

  return {
    slug: 'acid',
    title:
      'ACID in Databases: Atomicity, Consistency, Isolation, and Durability',
    subtitle:
      'A comprehensive deep dive into transaction guarantees, failure recovery, and concurrency control',
    excerpt:
      'ACID guarantees are the cornerstone of database reliability. In this deep dive, we explore Atomicity, Consistency, Isolation, and Durability end-to-end.',
    category: 'Databases',
    tags: [
      'Databases',
      'ACID',
      'Transactions',
      'Distributed Systems',
      'Concurrency',
      'Reliability',
    ],
    markdown: combinedMarkdown,
    readingTimeMinutes,
    canonicalUrl: 'https://arpitbhayani.me/blogs/consistency',
  };
}

export async function seedAllArpitBlogs() {
  console.log(
    `🚀 Starting fetch and seed for ${BLOG_SLUGS.length + 1} blogs...`,
  );

  const fetchedBlogs = [];

  // Fetch individual blogs with polite concurrency (5 at a time)
  const batchSize = 5;
  for (let i = 0; i < BLOG_SLUGS.length; i += batchSize) {
    const chunk = BLOG_SLUGS.slice(i, i + batchSize);
    console.log(
      `📡 Fetching batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        BLOG_SLUGS.length / batchSize,
      )}: ${chunk.join(', ')}...`,
    );
    const results = await Promise.all(chunk.map((slug) => fetchBlogData(slug)));
    for (const res of results) {
      if (res) fetchedBlogs.push(res);
    }
  }

  // Fetch and merge ACID
  const acidBlog = await fetchAndMergeAcidBlog();
  if (acidBlog) fetchedBlogs.push(acidBlog);

  console.log(`✅ Successfully extracted ${fetchedBlogs.length} articles!`);

  // Include Bloom Filters if present
  fetchedBlogs.push({
    slug: BLOOM_FILTER_ARTICLE.slug,
    title: BLOOM_FILTER_ARTICLE.title,
    subtitle: BLOOM_FILTER_ARTICLE.subtitle,
    excerpt: BLOOM_FILTER_ARTICLE.excerpt,
    category: 'Algorithms & Data Structures',
    tags: BLOOM_FILTER_ARTICLE.tags,
    markdown: BLOOM_FILTER_ARTICLE.contentMarkdown,
    readingTimeMinutes: BLOOM_FILTER_ARTICLE.readingTimeMinutes,
    canonicalUrl: BLOOM_FILTER_ARTICLE.canonicalUrl,
  });

  // Assign realistic randomized dates in the last 4 years and sort them
  const enrichedBlogs = fetchedBlogs.map((b) => ({
    ...b,
    id: `blog-${b.slug}`,
    // Ensure bloom filters and acid are recent, other blogs distributed across 4 years
    publishedAt:
      b.slug === 'bloom-filters'
        ? Date.now()
        : b.slug === 'acid'
        ? Date.now() - 5 * 86400000
        : getRandomDateInLast4Years(),
    updatedAt: Date.now(),
  }));

  console.log(
    '💾 Writing blogs into SQLite database (both `blog` table and `writing` table)...',
  );

  let insertedCount = 0;

  for (const item of enrichedBlogs) {
    // 1. Insert into schema.blog
    const blogRecord = {
      id: item.id,
      slug: item.slug,
      title: item.title,
      subtitle: (item as { subtitle?: string | null }).subtitle || null,
      excerpt: item.excerpt,
      contentMarkdown: item.markdown,
      category: item.category || 'Engineering',
      series: null,
      seriesOrder: null,
      status: 'published',
      featured: item.slug === 'bloom-filters' || item.slug === 'acid',
      readingTimeMinutes: item.readingTimeMinutes,
      canonicalUrl: item.canonicalUrl,
      coverImageUrl: null,
      coverMediaId: null,
      galleryId: null,
      citationsJson: JSON.stringify([]),
      tagsJson: JSON.stringify(item.tags),
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
    };

    // Upsert blog
    const existingBlog = await db
      .select()
      .from(schema.blog)
      .where(sql`${schema.blog.slug} = ${item.slug}`)
      .limit(1);

    if (existingBlog.length > 0) {
      await db
        .update(schema.blog)
        .set(blogRecord)
        .where(sql`${schema.blog.id} = ${existingBlog[0].id}`);
    } else {
      await db.insert(schema.blog).values(blogRecord);
    }

    // 2. Also keep schema.writing updated (type: 'blog') for backward compatibility
    const writingRecord = {
      id: item.id,
      slug: item.slug,
      title: item.title,
      subtitle: (item as { subtitle?: string | null }).subtitle || null,
      excerpt: item.excerpt,
      contentMarkdown: item.markdown,
      type: 'blog',
      status: 'published',
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
      readingTimeMinutes: item.readingTimeMinutes,
      canonicalUrl: item.canonicalUrl,
      coverImageUrl: null,
      coverMediaId: null,
      galleryId: null,
      citationsJson: JSON.stringify([]),
      tagsJson: JSON.stringify(item.tags),
    };

    const existingWriting = await db
      .select()
      .from(schema.writing)
      .where(sql`${schema.writing.slug} = ${item.slug}`)
      .limit(1);

    if (existingWriting.length > 0) {
      await db
        .update(schema.writing)
        .set(writingRecord)
        .where(sql`${schema.writing.id} = ${existingWriting[0].id}`);
    } else {
      await db.insert(schema.writing).values(writingRecord);
    }

    insertedCount++;
  }

  console.log(
    `🎉 Successfully seeded ${insertedCount} technical blogs into the database!`,
  );
}

if (require.main === module) {
  seedAllArpitBlogs()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Failed to seed blogs:', err);
      process.exit(1);
    });
}
