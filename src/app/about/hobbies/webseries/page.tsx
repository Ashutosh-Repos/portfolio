import type { Metadata } from 'next';
import Link from 'next/link';
import { hobbiesService } from '@/platform/modules/hobbies/hobbies.service';
import { MediaCatalog } from '@/components/Hobbies/MediaCatalog';

export const metadata: Metadata = {
  title: 'Web Series & Television — Ashutosh Kumar',
  description:
    'Long-form storytelling, television masterpieces, tech satires, and character studies curated by Ashutosh Kumar.',
};

export default async function WebSeriesPage() {
  const series = await hobbiesService.getMediaEntries({ type: 'tv_series' });

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4">
      <Link
        href="/"
        className="text-sm font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-2"
      >
        &larr; Back to Home
      </Link>

      <MediaCatalog
        initialItems={series}
        type="tv_series"
        headerTitleBold="Web Series"
        headerTitleItalic="watched"
        badgeSuffix="Series • Definitive Television"
        description="Long-form episodic masterworks that blend intricate character arcs, systems-level realism, existential themes, and razor-sharp writing."
      />
    </div>
  );
}
