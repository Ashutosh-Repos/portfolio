import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { hobbiesService } from '@/platform/modules/hobbies/hobbies.service';
import { Container } from '@/components/liquid/Container';
import { GLASS_OPTICS } from '@/lib/glass-config';

export const metadata: Metadata = {
  title: 'Cinema & Movies — Ashutosh Kumar',
  description:
    'Favorite films, deep-dive reviews, iconic scenes, and cinematic perspectives curated by Ashutosh Kumar.',
};

export default async function MoviesPage() {
  const movies = await hobbiesService.getMediaEntries({ type: 'movie' });

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4 pb-16">
      <Link
        href="/"
        className="text-sm font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-2"
      >
        &larr; Back to Home
      </Link>

      {/* Header & Sub-navigation */}
      <Container
        className="p-6 sm:p-8 rounded-[32px] bg-[#d5ede6]/25 dark:bg-[#1a3832]/25 transition-all duration-300 w-full"
        radius={36}
        optics={GLASS_OPTICS}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Cinema &amp; Films
            </h1>
            <span className="text-xs font-mono text-foreground/40">
              {movies.length} Masterpieces &bull; Curated Canon
            </span>
          </div>
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
            Films that shaped my aesthetic intuition for pacing, sound design, human psychology, and philosophical storytelling.
          </p>

          {/* Hobbies Switcher */}
          <div className="flex items-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-foreground/10 text-foreground border border-foreground/15">
              Movies
            </span>
            <Link
              href="/about/hobbies/webseries"
              className="px-3 py-1 rounded-full text-xs font-mono text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all"
            >
              Web Series
            </Link>
            <Link
              href="/about/hobbies/travel"
              className="px-3 py-1 rounded-full text-xs font-mono text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all"
            >
              Solo Travel
            </Link>
          </div>
        </div>
      </Container>

      {/* Movies Grid / List */}
      <div className="flex flex-col gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="p-6 sm:p-7 rounded-[28px] border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.015] dark:bg-white/[0.02] flex flex-col md:flex-row gap-6 items-start"
          >
            {/* Poster */}
            {movie.posterUrl && (
              <div className="relative w-32 sm:w-36 h-48 sm:h-52 shrink-0 rounded-2xl overflow-hidden shadow-lg border border-black/10 dark:border-white/10 bg-neutral-900 mx-auto md:mx-0">
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 144px, 160px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground flex items-baseline gap-2">
                    <span>{movie.title}</span>
                    {movie.releaseYear && (
                      <span className="text-sm font-mono font-normal text-foreground/50">
                        ({movie.releaseYear})
                      </span>
                    )}
                  </h2>
                  {movie.creators.length > 0 && (
                    <p className="text-xs font-mono text-foreground/60 pt-0.5">
                      Directed by {movie.creators.join(', ')}
                    </p>
                  )}
                </div>

                {movie.myRating && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono text-xs font-semibold w-fit">
                    <span>★</span>
                    <span>{movie.myRating.toFixed(1)} / 10</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-foreground/[0.05] text-foreground/65"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Review */}
              {movie.personalReview && (
                <p className="text-sm text-foreground/85 leading-relaxed pt-1">
                  {movie.personalReview}
                </p>
              )}

              {/* Iconic Quote */}
              {movie.quotes.length > 0 && (
                <blockquote className="border-l-2 border-foreground/30 pl-3 py-0.5 text-xs sm:text-sm italic text-foreground/70 font-serif">
                  &ldquo;{movie.quotes[0]}&rdquo;
                </blockquote>
              )}

              {/* Standout Scenes */}
              {movie.favoriteScenes.length > 0 && (
                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/45">
                    Unforgettable Sequences
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.favoriteScenes.map((scene, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono text-foreground/70 px-2 py-0.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.04]"
                      >
                        &bull; {scene}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
