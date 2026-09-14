import type { Metadata } from 'next';
import Link from 'next/link';
import { travelService } from '@/platform/modules/travel/travel.service';
import { TravelCard } from '@/components/Travel/TravelCard';

export const metadata: Metadata = {
  title: 'Travel & Expeditions — Ashutosh Kumar',
  description:
    'Travel notes, historic pilgrimages to Nepal, Lumbini, Kushinagar, wetland sanctuaries, and reflections on architecture and clarity.',
};

export default async function TravelPage() {
  const destinations = await travelService.getDestinations();

  const travelRules = [
    {
      title: 'One 30L Pack Only',
      desc: 'Packing light enforces ruthless prioritization. Everything carried must serve a distinct purpose; physical lightness equals psychological freedom.',
    },
    {
      title: 'Zero Strict Agendas',
      desc: 'Plan the entry point and the exit window; let every hour between be dictated by curiosity, spontaneous local conversations, and weather patterns.',
    },
    {
      title: 'Analog Reflection',
      desc: 'Carrying a physical notebook for architectural musings, code sketches, and journal entries rather than typing on glass screens.',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4">
      <Link
        href="/"
        className="text-sm font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-2"
      >
        &larr; Back to Home
      </Link>

      {/* Header */}
      <div className="p-2 pb-4 flow-root">
        <h1 className="text-xl md:text-2xl text-foreground mb-3 sm:mb-4">
          <span className="font-bold">Travel</span>{' '}
          <span className="text-foreground/50 text-sm">&amp;</span>{' '}
          <span className="italic text-base font-light">Expeditions</span>
        </h1>
        {/* <p className="text-sm text-foreground/80">
            Venturing into ancient monastic grounds, sacred stupas, and lakeside
            reflections. Traveling with an observant eye strips away routine,
            sharpens architectural intuition, and grants mental bandwidth for
            deep systems work.
          </p> */}
        <ol className="list-decimal list-inside pt-2">
          {travelRules.map((rule) => (
            <li key={rule.title}>
              <span className="text-sm font-semibold text-foreground">
                {rule.title}
              </span>
              {' - '}
              <span className="text-xs text-foreground/70">{rule.desc}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Philosophy Principles */}

      {/* Journeys List with Galleries */}
      <div className="flex flex-col gap-5">
        <h1 className="text-xl md:text-2xl text-foreground">
          <span className="font-bold">Places</span>{' '}
          <span className="text-foreground/50 text-sm">I&apos;d</span>{' '}
          <span className="italic text-base font-light">visited</span>
        </h1>

        {destinations.map((j) => (
          <TravelCard key={j.id} journey={j} />
        ))}
      </div>
    </div>
  );
}
