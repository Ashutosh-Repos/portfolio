'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, Camera, X, ChevronLeft, MapPin, Compass } from 'lucide-react';
import type { TravelDestinationDto } from '@/platform/modules/travel/travel.service';

interface TravelCardProps {
  journey: TravelDestinationDto;
}

export function TravelCard({ journey }: TravelCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const gallery = journey.gallery;
  const photos = gallery?.items || [];
  const previewPhotos = isExpanded ? photos : photos.slice(0, 4);

  return (
    <div className="p-6 sm:p-7 rounded-[28px] border border-black/[0.08] dark:border-white/[0.08] bg-foreground/[0.02] flex flex-col gap-4 transition-all">
      {/* Destination Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{journey.destination}</span>
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-mono text-foreground/50 pt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{journey.location}</span>
            {journey.altitude && (
              <>
                <span>&bull;</span>
                <span>{journey.altitude}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            {journey.season}
          </span>
        </div>
      </div>

      {/* Type pill */}
      <div className="text-xs font-mono text-foreground/60">
        <span className="px-2.5 py-0.5 rounded-md bg-foreground/[0.05] border border-black/5 dark:border-white/5">
          {journey.type}
        </span>
      </div>

      {/* Travel Notes */}
      <p className="text-sm text-foreground/85 leading-relaxed">
        {journey.notes}
      </p>

      {/* Key Highlights */}
      {journey.highlights.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {journey.highlights.map((h, i) => (
            <span
              key={i}
              className="text-xs font-mono text-foreground/70 px-2.5 py-0.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/5"
            >
              &bull; {h}
            </span>
          ))}
        </div>
      )}

      {/* Photo Gallery or Pending Notice */}
      {photos.length > 0 ? (
        <div className="mt-2 pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-foreground/50" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground/60">
                Photo Gallery
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-foreground/[0.06] text-foreground/60">
                {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
              </span>
            </div>

            {photos.length > 4 && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-mono text-foreground/70 hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{isExpanded ? 'Show less' : `View all (${photos.length})`}</span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>
            )}
          </div>

          {/* Photo Thumbnails Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {previewPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => setActivePhotoIndex(idx)}
                className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer border border-black/10 dark:border-white/10 bg-neutral-950 transition-all hover:scale-[1.02] hover:shadow-md"
              >
                <Image
                  src={photo.publicUrl}
                  alt={photo.altText || photo.caption || journey.destination}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-[10px] font-mono text-white px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs">
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center gap-2 text-xs font-mono text-foreground/45">
          <Camera className="w-3.5 h-3.5" />
          <span>Photos currently being curated &bull; Will populate automatically once moved to public/travel</span>
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && photos[activePhotoIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setActivePhotoIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Controls */}
            <div className="w-full flex items-center justify-between text-white font-mono text-xs px-2">
              <span>
                {activePhotoIndex + 1} / {photos.length} &bull; {journey.destination}
              </span>
              <button
                type="button"
                onClick={() => setActivePhotoIndex(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Box */}
            <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-2xl overflow-hidden border border-white/15 bg-black flex items-center justify-center">
              <Image
                src={photos[activePhotoIndex].publicUrl}
                alt={
                  photos[activePhotoIndex].altText ||
                  photos[activePhotoIndex].caption ||
                  journey.destination
                }
                fill
                priority
                className="object-contain"
              />

              {activePhotoIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setActivePhotoIndex(activePhotoIndex - 1)}
                  className="absolute left-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer backdrop-blur-xs"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {activePhotoIndex < photos.length - 1 && (
                <button
                  type="button"
                  onClick={() => setActivePhotoIndex(activePhotoIndex + 1)}
                  className="absolute right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer backdrop-blur-xs"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {photos[activePhotoIndex].caption && (
              <p className="text-xs font-mono text-white/70 text-center px-4">
                {photos[activePhotoIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
