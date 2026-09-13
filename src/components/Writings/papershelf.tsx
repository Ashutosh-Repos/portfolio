import { LinkPreview } from '../ui/link-preview';

export interface PaperItem {
  date: string;
  title: string;
  slug?: string;
}

const defaultWritings: PaperItem[] = [
  {
    date: '15/May/2024',
    title: 'Spanner: Google’s Globally-Distributed Database',
    slug: 'spanner-google-s-globally-distributed-database',
  },
  {
    date: '08/Apr/2024',
    title: 'Attention Is All You Need',
    slug: 'attention-is-all-you-need',
  },
  {
    date: '20/Feb/2024',
    title: 'Bigtable: A Distributed Storage System for Structured Data',
    slug: 'bigtable-a-distributed-storage-system-for-structured-data',
  },
  {
    date: '12/Jan/2024',
    title: 'C/C++ Thread Safety Analysis',
    slug: 'c-c-thread-safety-analysis',
  },
  {
    date: '05/Nov/2023',
    title: 'MapReduce: Simplified Data Processing on Large Clusters',
    slug: 'mapreduce-simplified-data-processing-on-large-clusters',
  },
  {
    date: '18/Sep/2023',
    title: 'Firecracker: Lightweight virtualization for serverless applications',
    slug: 'firecracker-lightweight-virtualization-for-serverless-applications',
  },
  {
    date: '22/Jul/2023',
    title: 'The Google File System',
    slug: 'the-google-file-system',
  },
];

export const PaperShelf = ({ items = defaultWritings }: { items?: PaperItem[] }) => {
  const displayItems = items.length > 0 ? items : defaultWritings;

  return (
    <div className="py-1 px-0.5 flow-root">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-foreground">
          <span className="font-light text-md md:text-lg">Research</span>{' '}
          <span className="text-foreground/50 text-sm">work</span>{' '}
          <span className="italic text-base font-light">Papershelf</span>
        </h2>
        <LinkPreview
          url="/papershelf"
          dotGap={6}
          dotSize={2}
          dotOffset={-1}
          className="text-xs font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-1 shrink-0"
        >
          View all &rarr;
        </LinkPreview>
      </div>
      <p className="pt-3 text-sm text-foreground/90 leading-relaxed">
        Architectural breakdowns and takeaways from foundational systems and AI papers.
      </p>
      <ul className="pt-3 grid grid-cols-1 min-[460px]:grid-cols-2 min-[890px]:grid-cols-1 gap-x-6 gap-y-2.5">
        {displayItems.map((writing) => (
          <li key={writing.title} className="flex items-baseline gap-2 min-w-0">
            <span className="text-xs text-foreground/40 shrink-0">-</span>
            <LinkPreview
              url={`/papershelf/${encodeURIComponent(writing.slug || writing.title)}`}
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
