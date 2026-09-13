import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/liquid/Container';
import { GLASS_OPTICS } from '@/lib/glass-config';
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
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4 pb-16">
      <Link
        href="/"
        className="text-sm font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-2"
      >
        &larr; Back to Home
      </Link>

      {/* Header */}
      <Container
        className="p-6 sm:p-8 rounded-[32px] bg-[#d5ede6]/25 dark:bg-[#1a3832]/25 transition-all duration-300 w-full"
        radius={36}
        optics={GLASS_OPTICS}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Travel &amp; Expeditions
            </h1>
            <span className="text-xs font-mono text-foreground/40">
              Pilgrimages &bull; Historic Sanctuaries &bull; Nature
            </span>
          </div>
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
            Venturing into ancient monastic grounds, sacred stupas, and lakeside reflections. Traveling with an observant eye strips away routine, sharpens architectural intuition, and grants mental bandwidth for deep systems work.
          </p>

          {/* Hobbies Switcher */}
          <div className="flex items-center gap-2 pt-2">
            <Link
              href="/about/hobbies/movies"
              className="px-3 py-1 rounded-full text-xs font-mono text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all"
            >
              Movies
            </Link>
            <Link
              href="/about/hobbies/webseries"
              className="px-3 py-1 rounded-full text-xs font-mono text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all"
            >
              Web Series
            </Link>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-foreground/10 text-foreground border border-foreground/15">
              Travel
            </span>
          </div>
        </div>
      </Container>

      {/* Philosophy Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {travelRules.map((rule) => (
          <div
            key={rule.title}
            className="p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.015] dark:bg-white/[0.02] flex flex-col gap-1.5"
          >
            <h3 className="text-sm font-semibold font-mono text-foreground">
              {rule.title}
            </h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              {rule.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Journeys List with Galleries */}
      <div className="flex flex-col gap-5">
        <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2 pt-2">
          <span>Journeys, Heritage &amp; Sacred Sites</span>
          <span className="text-xs font-mono font-normal text-foreground/40 uppercase">Authentic Expeditions</span>
        </h2>

        {destinations.map((j) => (
          <TravelCard key={j.id} journey={j} />
        ))}
      </div>
    </div>
  );
}
