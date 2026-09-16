import { db, schema } from './index';
import { sql } from 'drizzle-orm';

export const BLOOM_FILTER_ARTICLE = {
  id: 'blog-bloom-filters',
  slug: 'bloom-filters',
  title: 'Bloom Filters',
  subtitle:
    'Probabilistic data structures for fast, memory-efficient membership testing',
  excerpt:
    'A Bloom filter is a probabilistic data structure that answers a very specific question - have I seen this thing before? - while using almost no memory.',
  type: 'blog',
  status: 'published',
  readingTimeMinutes: 12,
  canonicalUrl: 'https://arpitbhayani.me/blogs/bloom-filters',
  coverImageUrl: null,
  tags: [
    'Algorithms',
    'Data Structures',
    'Distributed Systems',
    'Databases',
    'Probabilistic Data Structures',
  ],
  citations: [
    {
      title:
        'Kirsch and Mitzenmacher - Less Hashing, Same Performance: Building a Better Bloom Filter',
      url: 'https://www.eecs.harvard.edu/~michaelm/postscripts/esa2006a.pdf',
    },
    {
      title: 'Deletable Bloom Filter (DlBF)',
      url: 'https://arxiv.org/pdf/1005.0352',
    },
    {
      title: 'abloom - GitHub Repository by Arpit Bhayani',
      url: 'https://github.com/arpitbbhayani/abloom',
    },
    {
      title: 'Scaling Large Applications with Bloom Filters - Akamai',
      url: 'https://www.jamesridgway.co.uk/scaling-large-applications-with-bloom-filters/',
    },
  ],
  contentMarkdown: `A Bloom filter is a probabilistic data structure that answers a very specific question - ==have I seen this thing before?== - while using ==[underline] almost no memory==.

There is a trade-off, though - bloom filters can be 'wrong'. A Bloom filter will ==never tell you something is absent when it is actually present==, but it might occasionally claim something exists when it does not.

In this essay, we explore Bloom filters end-to-end, from fundamental concepts to advanced variants like counting and deletable Bloom filters, the nuances of hash functions, and real-world benchmarks and use-cases.

## Why Bloom Filters Matter

Say, you are building a recommendation engine for a content platform with millions of users. Each user has seen thousands of articles. When generating recommendations, you need to filter out articles the user has already seen.

Storing every article ID for every user in a hash set would consume enormous amounts of memory. Let's crunch the numbers…

Assumptions:
- 10 million active users
- Each user has seen an average of 5,000 articles
- Article IDs are 64-bit integers (8 bytes each)

Storing article IDs directly in a hash set:

\`\`\`text
Per user storage:
  5,000 article IDs * 8 bytes = 40,000 bytes = 40 KB

Hash set overhead (typical 2x for load factor + pointers):
  40 KB * 2 = 80 KB per user

Total for all users:
  80 KB * 10,000,000 users = 800 GB
\`\`\`

That is 800 GB of RAM just for tracking which articles users have seen. Even with a more optimistic 1.5x overhead factor, you are looking at 600 GB.

A Bloom filter will take up about ~60GB (one-tenth) of space by not storing actual article IDs, but rather storing existence in a compact bit array that can answer the question:

> ==[box] has this user probably seen this article?==

If the answer is no, you can confidently recommend it. If the answer is yes, you either skip it or do a more expensive lookup to confirm. In practice, this cuts memory usage by ==[circle] more than 90%== without slowing down recommendation generation.

Variations of this idea show up in many large systems - Medium uses it in recommendations, Chrome uses it to flag unsafe URLs, and ==[underline] databases rely on Bloom filters to avoid unnecessary disk reads==.

## The Fundamental Structure

A Bloom filter consists of two primary components: ==[underline] a bit array of m bits==, all initially set to zero, and ==[underline] a collection of k independent hash functions==. Each hash function maps an arbitrary input to one of the \`m\` array positions.

To add an element to the filter:

\`\`\`python
def add(element):
    for i in 1 to k:
        position = hash_i(element) mod m
        bit_array[position] = 1
\`\`\`

To check if an element might exist in the filter:

\`\`\`python
def contains(element):
    for i in 1 to k:
        position = hash_i(element) mod m
        if bit_array[position] == 0:
            return false
    return true
\`\`\`

==[highlight] If any bit at the computed positions is zero, the element was definitely never added.== Those positions would have been set to one during insertion. However, if all bits are one, the element might have been added, or those positions might have been set by other elements. This is the source of ==[box] false positives==.

Consider a concrete example. Suppose you have a 10-bit array and two hash functions. You insert the strings "apple" and "banana":
- \`hash1("apple") mod 10 = 2\`, \`hash2("apple") mod 10 = 5\`
- \`hash1("banana") mod 10 = 3\`, \`hash2("banana") mod 10 = 7\`

After these insertions, bits 2, 3, 5, and 7 are set to one. Now you check for "cherry":
- \`hash1("cherry") mod 10 = 2\`, \`hash2("cherry") mod 10 = 3\`

Both positions are already one (set by previous insertions), so the filter reports that "cherry" might be present. This is a ==[underline] false positive== - no error in logic, just hash collision overlap.

## Mathematics of False Positives

After inserting \`n\` elements using \`k\` hash functions into a filter with \`m\` bits, the probability that a specific bit remains zero is:

\`\`\`text
p0 = (1 - 1/m)^(kn)
\`\`\`

If you have \`m\` bits in your array and a hash function that outputs random positions, the probability of hitting any specific bit is \`1/m\`. Hence, the probability of NOT hitting a specific bit with one hash is \`1 - 1/m\`. The probability of that bit being zero with \`n\` insertions and each one setting \`k\` bits will be \`(1 - 1/m)^(kn)\`.

For large \`m\`, this approximates to:

\`\`\`text
p0 ≈ e^(-kn/m)
\`\`\`

The probability of a false positive is the probability that all \`k\` bits are set for a random element not in the set:

\`\`\`text
p_fp = (1 - e^(-kn/m))^k
\`\`\`

Here's an important trade-off. Increasing \`m\` (more bits) reduces false positives but uses more memory. Increasing \`k\` (more hash functions) can either help or hurt depending on the relationship between \`k\` and \`m/n\`.

==[highlight] The optimal number of hash functions that minimizes the false positive rate== is:

\`\`\`text
k_optimal = (m/n) * ln(2) ≈ 0.693 * (m/n)
\`\`\`

At this optimal \`k\`, the false positive rate becomes:

\`\`\`text
p_fp ≈ (0.6185)^(m/n)
\`\`\`

Working backwards, if you want a specific false positive rate \`p\`, you need approximately:

\`\`\`text
m/n = -ln(p) / (ln(2))^2 ≈ -1.44 * ln(p)
\`\`\`

For a 1% false positive rate, you need about ==[circle] 9.6 bits per element==. For 0.1%, you need about ==[circle] 14.4 bits per element==.

Compare this to storing 1 million 64-bit integers directly, which would require 8 MB. The Bloom filter ==[bracket] achieves roughly 7x space savings== while providing probabilistic membership testing.

## Hash Functions

Bloom filters require hash functions that are fast, produce uniformly distributed outputs, and behave independently of each other.

### Cryptographic vs Non-cryptographic Hashes

Cryptographic hash functions, such as SHA-1 or MD5, offer good distribution properties and security guarantees; however, they are computationally expensive. Since Bloom filters do not require cryptographic security, using them wastes CPU cycles.

==[underline] Non-cryptographic hash functions are the standard choice==:
- **MurmurHash3**: Widely considered the best general-purpose non-cryptographic hash. It provides excellent distribution, handles all input sizes well, and is very fast.
- **xxHash**: Extremely fast, especially on modern CPUs with SIMD support. The \`xxh3\` variant used in RocksDB is particularly optimized for short keys.
- **FNV-1a**: Simple to implement and performs well on short strings.

### Double Hashing Optimization

A seminal paper by Kirsch and Mitzenmacher showed that you ==[box] do not actually need k independent hash functions==. Instead, you can compute just two hash functions and derive all \`k\` positions using a linear combination:

\`\`\`text
g_i(x) = h1(x) + i * h2(x)  for i = 0, 1, ..., k-1
\`\`\`

This is called the ==[highlight] Kirsch-Mitzenmacher optimization==, and it reduces computational overhead dramatically while maintaining the same asymptotic false positive rate.

\`\`\`python
def compute_positions(element, k, m, hash1, hash2):
    """
    Compute k bit positions using double hashing.
    """
    h1 = hash1(element)
    h2 = hash2(element)
    
    positions = []
    for i in range(k):
        pos = (h1 + i * h2) % m
        positions.append(pos)
    
    return positions
\`\`\`

A subtle but important implementation detail: if \`h2\` can be zero or share a common factor with \`m\`, you may get degenerate cases where multiple positions collide. The enhanced double hashing variant addresses this by ==[underline] ensuring the delta value is always odd==:

\`\`\`python
def compute_positions_enhanced(element, k, m, hash_func):
    """
    Enhanced double hashing that avoids degenerate cases.
    """
    h = hash_func(element)
    h1 = h & 0xFFFFFFFF        # Lower 32 bits
    h2 = (h >> 32) | 1         # Upper 32 bits, ensure odd
    
    positions = []
    for i in range(k):
        pos = (h1 + i * h2) % m
        positions.append(pos)
    
    return positions
\`\`\`

RocksDB discovered this issue in their Bloom filter implementation and fixed it by ensuring the delta value is always odd, which guarantees distinct positions when \`m\` is a power of two.

## Deletable Bloom Filters

Standard Bloom filters have a significant limitation: ==[box] you cannot remove elements==. Once a bit is set to one, there is no way to know if it was set by one element or multiple elements. Unsetting it could cause false negatives for other elements.

Several variants address this limitation:

### 1. Counting Bloom Filters

The most straightforward approach: ==[underline] Counting Bloom Filters replace each bit with a small counter== (typically 4 bits). Instead of setting bits to one, you increment counters. To delete an element, you decrement the counters at the corresponding positions.

\`\`\`python
class CountingBloomFilter:
    def __init__(self, m, k, counter_bits=4):
        self.m = m
        self.k = k
        self.max_count = (1 << counter_bits) - 1
        self.counters = [0] * m
    
    def add(self, element):
        for pos in self._get_positions(element):
            if self.counters[pos] < self.max_count:
                self.counters[pos] += 1
    
    def remove(self, element):
        for pos in self._get_positions(element):
            if self.counters[pos] > 0:
                self.counters[pos] -= 1
    
    def contains(self, element):
        return all(self.counters[pos] > 0 
                   for pos in self._get_positions(element))
\`\`\`

The trade-off is significant: ==[circle] 4-bit counters mean 4x more memory== than a standard Bloom filter.

### 2. Deletable Bloom Filter (DlBF)

The ==[highlight] Deletable Bloom Filter (DlBF)== takes a different approach. Instead of counting, it splits the entire bloom filter array into \`r\` logical regions, tracks which bit regions have experienced collisions, and maintains a collision bitmap.

When inserting an element:
1. Compute the \`k\` bit positions
2. For each position, if the bit is already set, mark that region as having a collision
3. Set the bits

The DlBF provides ==[bracket] probabilistic deletability without the 4x memory footprint of counting filters==.

## Bloom Filters in Databases: LSM Trees

Databases like ==[underline] RocksDB, Cassandra, LevelDB, and HBase== all use Bloom filters to optimize read paths in ==[box] Log-Structured Merge (LSM) trees==:

1. Writes go to an in-memory MemTable
2. When full, the MemTable flushes to an immutable SSTable on disk
3. Reads must potentially check multiple SSTables to find a key

==[highlight] With Bloom filters attached to each SSTable, the database can determine if a key is definitely not present==, eliminating unnecessary disk I/O.

Cassandra exposes this as a tunable parameter:

\`\`\`sql
CREATE TABLE my_table (
    id uuid PRIMARY KEY,
    name text
) WITH bloom_filter_fp_chance = 0.01;
\`\`\`

## Advanced Production Applications

### 1. Cache Filtering: Avoiding "One-Hit Wonders"
CDNs use Bloom filters to track which objects are cached at edge nodes. ==[underline] Akamai pioneered using Bloom filters to avoid caching one-hit wonders== (objects accessed only once). By only caching objects seen at least twice, they dramatically improved cache efficiency.

### 2. PostgreSQL Bloom Indexes
PostgreSQL offers the \`bloom\` extension for multi-column indexing:

\`\`\`sql
CREATE EXTENSION bloom;
CREATE INDEX products_bloom ON products USING bloom (color, size, brand, category, price_range, material);
\`\`\`

==[box] A single compact Bloom index handles arbitrary combinations of column filters== without requiring combinatorial B-tree indexes.

### 3. Spark Broadcast Joins
When joining a 1-billion-row table with a 100,000-row table, Spark can build a Bloom filter from the small table's keys and broadcast it:
- ==[bracket] Only matching rows participate in the join, saving up to 95% of shuffle I/O==.

## Key Takeaways

1. **Definite Negatives, Probabilistic Positives**: Bloom filters provide a 100% reliable guarantee for absences.
2. **Double Hashing**: The ==[highlight] Kirsch-Mitzenmacher trick== turns two hash values into $k$ positions with zero quality degradation.
3. **Pervasive in Infrastructure**: From LSM-tree storage engines to CDN caches and query optimizers, Bloom filters are an essential tool in every systems engineer's toolbox.`,
};

export async function insertBloomFilterArticle() {
  console.log('🔄 Upserting "Bloom Filters" blog article into database...');
  const now = Date.now();

  const record = {
    id: BLOOM_FILTER_ARTICLE.id,
    slug: BLOOM_FILTER_ARTICLE.slug,
    title: BLOOM_FILTER_ARTICLE.title,
    subtitle: BLOOM_FILTER_ARTICLE.subtitle,
    excerpt: BLOOM_FILTER_ARTICLE.excerpt,
    contentMarkdown: BLOOM_FILTER_ARTICLE.contentMarkdown,
    type: BLOOM_FILTER_ARTICLE.type,
    status: BLOOM_FILTER_ARTICLE.status,
    publishedAt: now,
    updatedAt: now,
    readingTimeMinutes: BLOOM_FILTER_ARTICLE.readingTimeMinutes,
    canonicalUrl: BLOOM_FILTER_ARTICLE.canonicalUrl,
    coverImageUrl: BLOOM_FILTER_ARTICLE.coverImageUrl,
    citationsJson: JSON.stringify(BLOOM_FILTER_ARTICLE.citations),
    tagsJson: JSON.stringify(BLOOM_FILTER_ARTICLE.tags),
  };

  // Upsert: check if exists, then update or insert
  const existing = await db
    .select()
    .from(schema.writing)
    .where(
      sql`${schema.writing.slug} = ${BLOOM_FILTER_ARTICLE.slug} OR ${schema.writing.id} = ${BLOOM_FILTER_ARTICLE.id}`,
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(schema.writing)
      .set({
        ...record,
        id: existing[0].id,
      })
      .where(sql`${schema.writing.id} = ${existing[0].id}`);
    console.log(
      `✅ Updated existing Bloom Filters article (id: ${existing[0].id})`,
    );
  } else {
    await db.insert(schema.writing).values(record);
    console.log(`✅ Inserted Bloom Filters article into database!`);
  }
}

if (require.main === module) {
  insertBloomFilterArticle()
    .then(() => {
      console.log('🎉 Done!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error inserting Bloom Filter article:', err);
      process.exit(1);
    });
}
