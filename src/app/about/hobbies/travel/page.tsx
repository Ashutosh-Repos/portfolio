import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/liquid/Container';
import { GLASS_OPTICS } from '@/lib/glass-config';

export const metadata: Metadata = {
  title: 'Solo Travel & Expeditions — Ashutosh Kumar',
  description:
    'Solo travel notes, high-altitude mountain trails, coastal wanderings, and reflections on solitude and engineering clarity.',
};

export default function TravelPage() {
  const journeys = [
    {
      destination: 'Spiti Valley & Kinnaur',
      altitude: '12,500 – 15,000 ft',
      season: 'Autumn / October',
      type: 'High-Altitude Cold Desert',
      notes:
        'Barren geological formations, thousand-year-old monasteries at Dhankar and Key, and stark silent expanses. When network connectivity drops to zero for seven consecutive days, mental bandwidth expands exponentially.',
      highlights: ['Chicham Bridge gorge', 'Kaza monastery chantings', 'Chandratal freezing night sky', 'Pin Valley gravel trails'],
    },
    {
      destination: 'Western Ghats & Sahyadri Ridges',
      altitude: '3,000 – 4,800 ft',
      season: 'Monsoon / July – August',
      type: 'Rainforest & Ridge Traverses',
      notes:
        'Violent monsoon downpours, vertical green escarpments, and thick cloud inversions. Navigating rocky spur lines in near-zero visibility demands acute spatial presence and physical endurance.',
      highlights: ['Harishchandragad Konkan Kada cliff', 'Kalsubai ridge ascent', 'Foggy railway tunnels of Dudhsagar', 'Dense evergreen canopies'],
    },
    {
      destination: 'Konkan Coast & Silent Shores',
      altitude: 'Sea Level',
      season: 'Winter / December',
      type: 'Coastal Wanderings',
      notes:
        'Red laterite cliffs meeting Arabian Sea tides, deserted fishing coves, and quiet midnight walks along empty beaches. The rhythm of rhythmic coastal swells is the finest natural metronome for synthesizing complex system designs.',
      highlights: ['Sindhudurg sea fort ramparts', 'Devbagh sandspit at dusk', 'Laterite cliff walks', 'Coastal night skies'],
    },
  ];

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
              Solo Travel &amp; Expeditions
            </h1>
            <span className="text-xs font-mono text-foreground/40">
              Unplugged Solitude &bull; Mountain Resets
            </span>
          </div>
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
            Venturing into remote mountain trails and forgotten coastlines with a single backpack. Traveling solo strips away routine, forces self-reliance, and sharpens architectural intuition.
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
              Solo Travel
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

      {/* Journeys List */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2 pt-2">
          <span>Memorable Routes &amp; Expeditions</span>
        </h2>

        {journeys.map((j) => (
          <div
            key={j.destination}
            className="p-6 sm:p-7 rounded-[28px] border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.015] dark:bg-white/[0.02] flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {j.destination}
                </h3>
                <span className="text-xs font-mono text-foreground/50">
                  {j.type} &bull; {j.altitude}
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                {j.season}
              </span>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed">
              {j.notes}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {j.highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-xs font-mono text-foreground/65 px-2.5 py-0.5 rounded-md bg-black/[0.03] dark:bg-white/[0.04]"
                >
                  &bull; {h}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
