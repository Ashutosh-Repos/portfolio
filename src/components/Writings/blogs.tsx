import { LinkPreview } from '../ui/link-preview';

export interface BlogItem {
  date: string;
  title: string;
  slug?: string;
}

const defaultWritings: BlogItem[] = [
  {
    date: '14/Aug/2024',
    title: 'Bloom Filters: Deconstructed and Demystified',
    slug: 'bloom-filters',
  },
  {
    date: '02/Jan/2024',
    title:
      'ACID in Databases: Atomicity, Consistency, Isolation, and Durability',
    slug: 'acid',
  },
  {
    date: '18/May/2024',
    title: 'Why Distributed Consensus Matters',
    slug: 'why-consensus',
  },
  {
    date: '14/Mar/2024',
    title: 'Understanding Database Deadlocks',
    slug: 'database-deadlocks',
  },
  {
    date: '28/Feb/2024',
    title: 'Sliding Window Counter Rate Limiting',
    slug: 'sliding-window-ratelimiter',
  },
  {
    date: '19/Jan/2024',
    title:
      'The Architecture of Bitcask: A High-Performance Append-Only KV Store',
    slug: 'bitcask',
  },
  {
    date: '10/Dec/2023',
    title: 'Midpoint Insertion Caching Strategy',
    slug: 'midpoint-insertion-caching-strategy',
  },
  {
    date: '05/Nov/2023',
    title: 'Copy-on-Write: Architecture and Trade-offs',
    slug: 'copy-on-write',
  },
];

export const Blogs = ({ items = defaultWritings }: { items?: BlogItem[] }) => {
  const displayItems = items.length > 0 ? items : defaultWritings;

  return (
    <div className="py-1 px-0.5 flow-root">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-foreground">
          <span className="font-light text-md md:text-lg">Technical</span>{' '}
          <span className="text-foreground/50 text-sm">blog</span>{' '}
          <span className="italic text-base font-light">posts</span>
        </h2>
        <LinkPreview
          url="/blogs"
          dotGap={6}
          dotSize={2}
          dotOffset={-1}
          className="text-xs font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-1 shrink-0"
        >
          View all &rarr;
        </LinkPreview>
      </div>
      <p className="pt-3 text-sm text-foreground/90 leading-relaxed">
        Deep dives on systems architecture, distributed data structures,
        low-latency databases, and AI engineering.
      </p>
      <ul className="pt-3 grid grid-cols-1 min-[460px]:grid-cols-2 min-[890px]:grid-cols-1 gap-x-6 gap-y-2.5">
        {displayItems.map((writing) => (
          <li key={writing.title} className="flex items-baseline gap-2 min-w-0">
            <span className="italic text-xs text-foreground/50 shrink-0 font-mono">
              {writing.date}
            </span>
            <span className="text-xs text-foreground/40 shrink-0">-</span>
            <LinkPreview
              url={`/blogs/${encodeURIComponent(
                writing.slug || writing.title,
              )}`}
              multiline={true}
              dotGap={6}
              dotSize={2}
              dotOffset={-1}
              className="text-sm text-foreground hover:text-foreground transition-colors"
            >
              {writing.title}
            </LinkPreview>
          </li>
        ))}
      </ul>
    </div>
  );
};
