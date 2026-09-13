import { LinkPreview } from '../ui/link-preview';

export interface BlogItem {
  date: string;
  title: string;
  slug?: string;
}

const defaultWritings: BlogItem[] = [
  {
    date: '10/July/2003',
    title: "Slop Debt",
  },
  {
    date: '10/July/2003',
    title: "What AI First Engineering Orgs Look Like",
  },
  {
    date: '10/July/2003',
    title: "Three Claude Skills I Think Every Org Should Have",
  },
  {
    date: '10/July/2003',
    title: "G-Eval, Explained",
  },
  {
    date: '10/July/2003',
    title: "AI Workflows Need Topological Sort",
  },
  {
    date: '10/July/2003',
    title: "Embedding Models Make Or Break Your Ai App",
  },
  {
    date: '10/July/2003',
    title: "Temporal Primer - Building Long-Running Systems",
  },
  {
    date: '10/July/2003',
    title: "What Matters in Production RAG",
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
        Deep dives on systems architecture, distributed data structures, low-latency databases, and AI engineering.
      </p>
      <ul className="pt-3 grid grid-cols-1 min-[460px]:grid-cols-2 min-[890px]:grid-cols-1 gap-x-6 gap-y-2.5">
        {displayItems.map((writing) => (
          <li key={writing.title} className="flex items-baseline gap-2 min-w-0">
            <span className="italic text-xs text-foreground/50 shrink-0 font-mono">
              {writing.date}
            </span>
            <span className="text-xs text-foreground/40 shrink-0">-</span>
            <LinkPreview
              url={`/blogs/${encodeURIComponent(writing.slug || writing.title)}`}
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

