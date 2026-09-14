'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Film, Tv, RotateCcw } from 'lucide-react';
import { Container } from '@/components/liquid/Container';
import type { MediaEntryDto } from '@/platform/modules/hobbies/hobbies.service';

interface MediaCatalogProps {
  initialItems: MediaEntryDto[];
  type: 'movie' | 'tv_series';
  headerTitleBold: string;
  headerTitleItalic: string;
  badgeSuffix: string;
  description: string;
}

export function MediaCatalog({
  initialItems,
  type,
  headerTitleBold,
  headerTitleItalic,
  badgeSuffix,
  description,
}: MediaCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<
    'rating' | 'year-desc' | 'year-asc' | 'title'
  >('rating');

  // Extract all unique genres and their counts
  const genreCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of initialItems) {
      for (const genre of item.genres) {
        map.set(genre, (map.get(genre) || 0) + 1);
      }
    }
    // Sort genres by frequency
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([genre, count]) => ({ genre, count }));
  }, [initialItems]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return initialItems
      .filter((item) => {
        // Genre filter
        if (selectedGenre !== 'all' && !item.genres.includes(selectedGenre)) {
          return false;
        }

        // Search query filter
        if (!q) return true;

        const titleMatch = item.title.toLowerCase().includes(q);
        const creatorMatch = item.creators.some((c) =>
          c.toLowerCase().includes(q),
        );
        const genreMatch = item.genres.some((g) => g.toLowerCase().includes(q));
        const reviewMatch =
          item.personalReview?.toLowerCase().includes(q) ?? false;
        const quoteMatch = item.quotes.some((quote) =>
          quote.toLowerCase().includes(q),
        );
        const characterMatch = item.favoriteCharacters.some((fc) =>
          fc.toLowerCase().includes(q),
        );
        const sceneMatch = item.favoriteScenes.some((s) =>
          s.toLowerCase().includes(q),
        );
        const yearMatch = item.releaseYear?.toString().includes(q) ?? false;

        return (
          titleMatch ||
          creatorMatch ||
          genreMatch ||
          reviewMatch ||
          quoteMatch ||
          characterMatch ||
          sceneMatch ||
          yearMatch
        );
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.myRating ?? 0) - (a.myRating ?? 0);
        }
        if (sortBy === 'year-desc') {
          return (b.releaseYear ?? 0) - (a.releaseYear ?? 0);
        }
        if (sortBy === 'year-asc') {
          return (a.releaseYear ?? 0) - (b.releaseYear ?? 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [initialItems, searchQuery, selectedGenre, sortBy]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedGenre !== 'all' ||
    sortBy !== 'rating';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setSortBy('rating');
  };

  const isMovie = type === 'movie';
  const itemNoun = isMovie ? 'movies' : 'series';

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Sub-navigation */}
      <div className="py-1 px-0.5 flow-root">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3 sm:mb-4">
          <h1 className="text-xl md:text-2xl text-foreground">
            <span className="font-bold">{headerTitleBold}</span>{' '}
            <span className="text-foreground/50 text-sm">I&apos;d</span>{' '}
            <span className="italic text-base font-light">
              {headerTitleItalic}
            </span>
          </h1>
          <span className="text-xs font-mono text-foreground/40">
            {hasActiveFilters ? (
              <span>
                Showing {filteredItems.length} of {initialItems.length}{' '}
                {itemNoun}
              </span>
            ) : (
              <span>
                {initialItems.length} {badgeSuffix}
              </span>
            )}
          </span>
        </div>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Interactive Search & Filter Bar */}
      <div className="flex flex-col gap-3.5 p-3 sm:p-4 rounded-3xl bg-foreground/[0.02] border border-black/10 dark:border-white/10 backdrop-blur-md shadow-sm">
        {/* Search Input Row */}
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSearchQuery('');
            }}
            placeholder={`Search ${initialItems.length} ${itemNoun} by title, ${
              isMovie ? 'director' : 'creator'
            }, genre, or keyword...`}
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all placeholder:text-foreground/35 text-foreground font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 rounded-full text-foreground/40 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters and Sorting Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          {/* Genre Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setSelectedGenre('all')}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 ${
                selectedGenre === 'all'
                  ? 'bg-foreground text-background font-semibold shadow-sm'
                  : 'bg-black/[0.03] dark:bg-white/[0.04] text-foreground/60 hover:text-foreground hover:bg-black/[0.06] dark:hover:bg-white/[0.08] border border-black/5 dark:border-white/5'
              }`}
            >
              All ({initialItems.length})
            </button>
            {genreCounts.slice(0, 10).map(({ genre, count }) => (
              <button
                key={genre}
                onClick={() =>
                  setSelectedGenre(selectedGenre === genre ? 'all' : genre)
                }
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 ${
                  selectedGenre === genre
                    ? 'bg-foreground text-background font-semibold shadow-sm'
                    : 'bg-black/[0.03] dark:bg-white/[0.04] text-foreground/60 hover:text-foreground hover:bg-black/[0.06] dark:hover:bg-white/[0.08] border border-black/5 dark:border-white/5'
                }`}
              >
                {genre}{' '}
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            ))}
          </div>

          {/* Sort Selector & Reset */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-mono px-2.5 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 text-foreground/75 focus:outline-none focus:border-foreground/30 cursor-pointer"
            >
              <option value="rating">Top Rated</option>
              <option value="year-desc">Newest Year</option>
              <option value="year-asc">Oldest Year</option>
              <option value="title">Title (A-Z)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-mono text-foreground/50 hover:text-foreground px-2 py-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Media List */}
      <div className="flex flex-col gap-6">
        {filteredItems.length === 0 ? (
          <Container
            className="p-12 rounded-[28px] text-center"
            contentClassName="flex flex-col items-center justify-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center text-foreground/40">
              {isMovie ? (
                <Film className="w-6 h-6" />
              ) : (
                <Tv className="w-6 h-6" />
              )}
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="text-base font-bold text-foreground">
                No matching {itemNoun} found
              </h3>
              <p className="text-xs text-foreground/60 leading-relaxed font-mono">
                {searchQuery
                  ? `No titles matched "${searchQuery}"${
                      selectedGenre !== 'all' ? ` in ${selectedGenre}` : ''
                    }.`
                  : `No titles found in the ${selectedGenre} genre.`}
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-1.5 text-xs font-mono font-medium rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              Clear Filters
            </button>
          </Container>
        ) : (
          filteredItems.map((item) => (
            <Container
              key={item.id}
              className="p-6 sm:p-7 rounded-[28px]"
              contentClassName="flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Poster */}
              {item.posterUrl && (
                <div className="relative w-32 sm:w-36 h-48 sm:h-52 shrink-0 rounded-2xl overflow-hidden shadow-lg border border-black/10 dark:border-white/10 bg-neutral-900 mx-auto md:mx-0">
                  <Image
                    src={item.posterUrl}
                    alt={item.title}
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
                      <span>{item.title}</span>
                      {item.releaseYear && (
                        <span className="text-sm font-mono font-normal text-foreground/50">
                          ({item.releaseYear})
                        </span>
                      )}
                    </h2>
                    {item.creators.length > 0 && (
                      <p className="text-xs font-mono text-foreground/60 pt-0.5">
                        {isMovie ? 'Directed by' : 'Created by'}{' '}
                        {item.creators.join(', ')}
                      </p>
                    )}
                  </div>

                  {item.myRating && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono text-xs font-semibold w-fit">
                      <span>★</span>
                      <span>{item.myRating.toFixed(1)} / 10</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {item.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-2 py-0.5 text-[11px] font-mono rounded-md transition-colors ${
                          selectedGenre === genre
                            ? 'bg-foreground text-background font-semibold'
                            : 'bg-foreground/[0.05] text-foreground/65 hover:bg-foreground/10 hover:text-foreground'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                )}

                {/* Review */}
                {item.personalReview && (
                  <p className="text-sm text-foreground/85 leading-relaxed pt-1">
                    {item.personalReview}
                  </p>
                )}

                {/* Iconic Quote */}
                {item.quotes.length > 0 && (
                  <blockquote className="border-l-2 border-foreground/30 pl-3 py-0.5 text-xs sm:text-sm italic text-foreground/70 font-serif">
                    &ldquo;{item.quotes[0]}&rdquo;
                  </blockquote>
                )}

                {/* Standout Scenes / Favorite Characters */}
                {isMovie && item.favoriteScenes.length > 0 && (
                  <div className="flex flex-col gap-1 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/45">
                      Unforgettable Sequences
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.favoriteScenes.map((scene, idx) => (
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

                {!isMovie && item.favoriteCharacters.length > 0 && (
                  <div className="flex flex-col gap-1 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/45">
                      Standout Characters
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.favoriteCharacters.map((char, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-mono text-foreground/70 px-2 py-0.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.04]"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Container>
          ))
        )}
      </div>
    </div>
  );
}
