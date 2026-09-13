import { LinkPreview } from '../ui/link-preview';

export interface WritingItem {
  date: string;
  title: string;
  slug?: string;
}

const defaultWritings: WritingItem[] = [
  {
    date: '10/July/2003',
    title: 'Outcomes',
  },
  {
    date: '10/July/2003',
    title: 'Manufacturing Luck',
  },
  {
    date: '10/July/2003',
    title: "Taste Can't Be Prompted",
  },
  {
    date: '10/July/2003',
    title: 'Trying to Be Human',
  },
  {
    date: '10/July/2003',
    title: 'Buy a Domain',
  },
  {
    date: '10/July/2003',
    title: 'Growth Without Hacks',
  },
  {
    date: '10/July/2003',
    title: 'Make Something YOU Want',
  },
];

export const Writings = ({ items = defaultWritings }: { items?: WritingItem[] }) => {
  const displayItems = items.length > 0 ? items : defaultWritings;

  return (
    <div className="py-1 px-0.5 flow-root">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-foreground">
          <span className="font-light text-md md:text-lg">Writing</span>{' '}
          <span className="text-foreground/50 text-sm">my</span>{' '}
          <span className="italic text-base font-light">thoughts</span>
        </h2>
        <LinkPreview
          url="/writings"
          dotGap={6}
          dotSize={2}
          dotOffset={-1}
          className="text-xs font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-1 shrink-0"
        >
          View all &rarr;
        </LinkPreview>
      </div>
      <p className="pt-3 text-sm text-foreground/90 leading-relaxed">
        Personal essays and reflections on engineering craft, agency, judgment, and life.
      </p>
      <ul className="pt-3 grid grid-cols-1 min-[460px]:grid-cols-2 min-[890px]:grid-cols-1 gap-x-6 gap-y-2.5">
        {displayItems.map((writing) => (
          <li key={writing.title} className="flex items-baseline gap-2 min-w-0">
            <span className="italic text-xs text-foreground/50 shrink-0 font-mono">
              {writing.date}
            </span>
            <span className="text-xs text-foreground/40 shrink-0">-</span>
            <LinkPreview
              url={`/writings/${encodeURIComponent(writing.slug || writing.title)}`}
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

export default Writings;
