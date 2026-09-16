import { db, schema } from './index';
import { sql } from 'drizzle-orm';

interface EnrichmentRule {
  pattern: RegExp;
  action: 'highlight' | 'underline' | 'box' | 'circle' | 'bracket';
}

const SPECIFIC_KEYWORD_RULES: EnrichmentRule[] = [
  // Circles: Complexity, metrics, scales, constants, years, percentages
  {
    pattern: /\b(O\((?:1|n|log\s*n|n\s*log\s*n|n\^2|k)\))\b/g,
    action: 'circle',
  },
  {
    pattern: /\b(99\.99?%|99th\s+percentile|p99(?:\.9)?)\b/gi,
    action: 'circle',
  },
  { pattern: /\b(5\/8|3\/8)\b/g, action: 'circle' },
  { pattern: /\b(10x|100x|1000x)\b/g, action: 'circle' },
  {
    pattern: /\b(\d+(?:\.\d+)?\s*(?:ms|seconds?|minutes?|KB|MB|GB|bytes?))\b/gi,
    action: 'circle',
  },
  {
    pattern: /\b(512\s+bytes|4KB|64MB|128MB|64-bit|32-bit)\b/gi,
    action: 'circle',
  },
  { pattern: /\b(1977|1983|2015)\b/g, action: 'circle' },

  // Boxes: Hard limits, hazards, trade-offs, concurrency bugs, fallacies
  { pattern: /\b(trade-offs?|tradeoffs?)\b/gi, action: 'box' },
  {
    pattern: /\b(concurrency\s+bugs?|race\s+conditions?|data\s+races?)\b/gi,
    action: 'box',
  },
  { pattern: /\b(single\s+point\s+of\s+failure|SPOF)\b/gi, action: 'box' },
  { pattern: /\b(performance\s+bottlenecks?|bottlenecks?)\b/gi, action: 'box' },
  { pattern: /\b(false\s+positives?)\b/gi, action: 'box' },
  { pattern: /\b(split-brain(?:\s+scenarios?)?)\b/gi, action: 'box' },
  {
    pattern:
      /\b(cascading\s+(?:queue\s+)?collapses?|cascading\s+failures?)\b/gi,
    action: 'box',
  },
  { pattern: /\b(deadlock\s+cycles?|circular\s+wait)\b/gi, action: 'box' },
  {
    pattern: /\b(phantom\s+reads?|dirty\s+reads?|non-repeatable\s+reads?)\b/gi,
    action: 'box',
  },
  {
    pattern: /\b(thundering\s+herd(?:\s+problem)?|cache\s+stampede)\b/gi,
    action: 'box',
  },
  {
    pattern: /\b(PACELC\s+and\s+CAP\s+theorems?|CAP\s+theorem)\b/gi,
    action: 'box',
  },
  { pattern: /\b(tombstone\s+records?)\b/gi, action: 'box' },
  { pattern: /\b(eventual\s+consistency)\b/gi, action: 'box' },
  { pattern: /\b(head-of-line\s+blocking)\b/gi, action: 'box' },
  { pattern: /\b(clock\s+drift)\b/gi, action: 'box' },
  {
    pattern: /\b(PID\s+exhaustion|process\s+table\s+exhaustion)\b/gi,
    action: 'box',
  },
  {
    pattern:
      /\b(the\s+network\s+is\s+reliable|latency\s+is\s+zero|bandwidth\s+is\s+infinite)\b/gi,
    action: 'box',
  },
  { pattern: /\b(linear\s+scan|index\s+scan)\b/gi, action: 'box' },
  { pattern: /\b(scarce\s+resource)\b/gi, action: 'box' },

  // Highlights: Core axioms, key thesis statements
  { pattern: /\b(there\s+is\s+no\s+global\s+clock)\b/gi, action: 'highlight' },
  {
    pattern: /\b(AI-first\s+engineering\s+org(?:anization)?s?)\b/gi,
    action: 'highlight',
  },
  {
    pattern: /\b(ACID\s+guarantees\s+are\s+the\s+cornerstone)\b/gi,
    action: 'highlight',
  },

  // Underlines: Architectural mechanisms, data structures, protocols
  {
    pattern: /\b(in-memory\s+keydir(?:\s+hash\s+table)?)\b/gi,
    action: 'underline',
  },
  { pattern: /\b(append-only\s+logs?)\b/gi, action: 'underline' },
  {
    pattern: /\b(sliding\s+window\s+(?:counter|rate\s+limiting)?)\b/gi,
    action: 'underline',
  },
  { pattern: /\b(rate\s+limit(?:er|ing)?)\b/gi, action: 'underline' },
  { pattern: /\b(Leaky\s+Bucket|Token\s+Bucket)\b/gi, action: 'underline' },
  { pattern: /\b(Wait-For\s+graphs?)\b/gi, action: 'underline' },
  { pattern: /\b(InnoDB\s+buffer\s+pool)\b/gi, action: 'underline' },
  { pattern: /\b(Raft\s+consensus(?:\s+algorithm)?)\b/gi, action: 'underline' },
  {
    pattern: /\b(Write-Ahead\s+Logging|Write-Ahead\s+Log|WAL)\b/g,
    action: 'underline',
  },
  {
    pattern: /\b(Multi-Version\s+Concurrency\s+Control|MVCC)\b/gi,
    action: 'underline',
  },
  { pattern: /\b(Two-Phase\s+Locking|2PL)\b/gi, action: 'underline' },
  { pattern: /\b(Two-Phase\s+Commit|2PC)\b/gi, action: 'underline' },
  { pattern: /\b(Copy-On-Write(?:\s+semantics)?)\b/gi, action: 'underline' },
  {
    pattern: /\b(spatial\s+and\s+temporal\s+locality)\b/gi,
    action: 'underline',
  },
  { pattern: /\b(false\s+sharing)\b/gi, action: 'underline' },
  {
    pattern: /\b(binary\s+framing(?:\s+layer)?|stream\s+multiplexing)\b/gi,
    action: 'underline',
  },
  { pattern: /\b(HTTP\/2|HTTP\/1\.1)\b/g, action: 'underline' },
  { pattern: /\b(gRPC)\b/g, action: 'underline' },
  {
    pattern: /\b(Network\s+Time\s+Protocol|NTP|TrueTime)\b/gi,
    action: 'underline',
  },
  {
    pattern: /\b(DNS\s+(?:queries|resolution|lookups?)|EDNS0)\b/gi,
    action: 'underline',
  },
  {
    pattern: /\b(cursor-based\s+pagination|offset-based\s+pagination)\b/gi,
    action: 'underline',
  },
  { pattern: /\b(Bayesian\s+average(?:s)?)\b/gi, action: 'underline' },
  {
    pattern: /\b(struct(?:ure)?\s+composition|vtable)\b/gi,
    action: 'underline',
  },
  {
    pattern:
      /\b(Morris(?:'s)?\s+(?:approximate\s+)?counting(?:\s+algorithm)?|Approximate\s+Counting)\b/gi,
    action: 'underline',
  },
  { pattern: /\b(Flajolet-Martin\s+algorithm)\b/gi, action: 'underline' },
  { pattern: /\b(2Q\s+(?:cache\s+)?algorithm)\b/gi, action: 'underline' },
  { pattern: /\b(fractional\s+cascading)\b/gi, action: 'underline' },
  { pattern: /\b(KV\s+cache)\b/gi, action: 'underline' },
  { pattern: /\b(self-attention\s+mechanisms?)\b/gi, action: 'underline' },
  { pattern: /\b(time\s+series\s+smoothing)\b/gi, action: 'underline' },
  {
    pattern:
      /\b(1D\s+terrain\s+generation|Perlin\s+noise|midpoint\s+displacement)\b/gi,
    action: 'underline',
  },
  { pattern: /\b(pagination)\b/gi, action: 'underline' },
  { pattern: /\b(engineering\s+time)\b/gi, action: 'underline' },
  { pattern: /\b(Distributed\s+System(?:s)?)\b/g, action: 'underline' },
  { pattern: /\b(document[- ]based\s+data\s+store)\b/gi, action: 'underline' },
  { pattern: /\b(cursor\s+pagination)\b/gi, action: 'underline' },
  { pattern: /\b(Israeli\s+queues?)\b/gi, action: 'underline' },
  { pattern: /\b(fork\s+bomb)\b/gi, action: 'underline' },
  {
    pattern: /\b(fallacies\s+of\s+distributed\s+computing)\b/gi,
    action: 'underline',
  },
  { pattern: /\b(event-driven\s+architectures?)\b/gi, action: 'underline' },
];

export function enrichMarkdownContent(
  markdown: string,
  title?: string,
): string {
  if (!markdown) return '';

  // Split code blocks and markdown links so we never touch text inside code or inside [link](url)
  const parts = markdown.split(
    /(```[\s\S]*?```|`[^`\n]+`|\[[^\]]+\]\([^\)]+\)|==\[[a-z-]+(?::[^\]]+)?\][\s\S]*?==|==[\s\S]*?==)/g,
  );

  const enrichedParts = parts.map((part) => {
    // If it's a code block, inline code, link, or already highlighted tag, leave it alone
    if (part.startsWith('`') || part.startsWith('[') || part.startsWith('==')) {
      return part;
    }

    let processed = part;

    // Apply specific keyword rules carefully (limit occurrences per term)
    for (const rule of SPECIFIC_KEYWORD_RULES) {
      let count = 0;
      processed = processed.replace(rule.pattern, (match) => {
        if (count >= 2) return match;
        count++;
        return `==[${rule.action}] ${match}==`;
      });
    }

    return processed;
  });

  let result = enrichedParts.join('');

  // Clean up any double-wrapped syntax e.g. ==[a] ==[b] x====
  result = result.replace(
    /==\[[a-z-]+\]\s*==\[[a-z-]+\]\s*(.*?)\s*====/g,
    '==[highlight] $1==',
  );
  result = result.replace(/==(?:\s*==)+/g, '==');

  // Strip any highlights mistakenly placed inside markdown link or image brackets [ ... ](...)
  let prevResult = '';
  while (prevResult !== result) {
    prevResult = result;
    result = result.replace(
      /(\!?\[[^\]]*?)==(?:\[[a-z-]+(?::[^\]]+)?\])?\s*(.*?)\s*==([^\]]*?\]\([^\)]+\))/g,
      '$1$2$3',
    );
  }

  // If there are key takeaway blockquotes or conclusion paragraphs, ensure they have a bracket
  result = result.replace(
    /^(>\s*(?:Summary|Conclusion|Takeaway|Key Takeaway|Rule of Thumb):?\s*)([^\n]+)$/gim,
    '$1==[bracket] $2==',
  );

  // Add bracket to key concluding aphorisms if none exists
  if (!result.includes('==[bracket]')) {
    result = result.replace(
      /((?:The key is|In conclusion|It is important to|No matter what we are building|The takeaway is|To summarize)[^\n.]+?\.)/i,
      '==[bracket] $1==',
    );
  }

  return result;
}

export async function enrichAllBlogsInDb() {
  console.log(
    '✨ Starting comprehensive semantic enrichment for all blogs in DB...',
  );

  const blogs = await db.select().from(schema.blog);
  console.log(`Found ${blogs.length} blogs in database.`);

  let updatedCount = 0;

  for (const blog of blogs) {
    if (blog.slug === 'bloom-filters') {
      // Bloom filters is already hand-crafted in seed-bloom-filters.ts
      continue;
    }

    const originalContent = blog.contentMarkdown;
    const enrichedContent = enrichMarkdownContent(originalContent, blog.title);

    if (enrichedContent !== originalContent) {
      // 1. Update schema.blog
      await db
        .update(schema.blog)
        .set({
          contentMarkdown: enrichedContent,
          updatedAt: Date.now(),
        })
        .where(sql`${schema.blog.id} = ${blog.id}`);

      // 2. Update schema.writing
      await db
        .update(schema.writing)
        .set({
          contentMarkdown: enrichedContent,
          updatedAt: Date.now(),
        })
        .where(sql`${schema.writing.slug} = ${blog.slug}`);

      updatedCount++;
    }
  }

  console.log(
    `🎉 Successfully updated ${updatedCount} blogs with semantic rough-notation markup!`,
  );
}

if (require.main === module) {
  enrichAllBlogsInDb()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Enrichment failed:', err);
      process.exit(1);
    });
}
