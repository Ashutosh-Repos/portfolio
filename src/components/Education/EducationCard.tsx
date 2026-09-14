'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, Camera, X, ChevronLeft, School } from 'lucide-react';
import type { EducationDto } from '@/platform/modules/education/education.service';
import { Container } from '../liquid';

interface EducationCardProps {
  education: EducationDto;
}

export function EducationCard({ education }: EducationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const gallery = education.gallery;
  const photos = gallery?.items || [];
  const previewPhotos = isExpanded ? photos : photos.slice(0, 4);

  return (
    <div className="rounded-2xl flex flex-col gap-4 transition-all">
      {/* Institution Header */}
      <Container
        className="p-6 rounded-2xl"
        contentClassName="flex flex-col gap-3.5"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl text-foreground/80">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {education.institution}
              </h3>
              {education.location && (
                <span className="text-xs font-mono text-foreground/45">
                  {education.location}
                </span>
              )}
            </div>
          </div>
          <span className="text-xs font-mono text-foreground/50 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
            {education.startDate} &mdash; {education.endDate || 'Present'}
          </span>
        </div>

        {/* Degree & Grade */}
        <div className="text-sm text-foreground/85 font-mono flex flex-wrap items-center gap-2">
          <span className="font-semibold text-foreground">
            {education.degree}
          </span>
          <span className="text-foreground/40">&bull;</span>
          <span>{education.fieldOfStudy}</span>
          {education.gradeOrCgpa && (
            <span className="px-2.5 py-0.5 text-xs border-l">
              Score: {education.gradeOrCgpa}
            </span>
          )}
        </div>

        {/* Description */}
        {education.description && (
          <p className="text-sm text-foreground/80 leading-relaxed">
            {education.description}
          </p>
        )}

        {/* Highlights */}
        {education.highlights && education.highlights.length > 0 && (
          <ul className="list-disc list-inside text-xs sm:text-sm text-foreground/70 space-y-1">
            {education.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}

        {/* Gallery Section */}
        {photos.length > 0 && (
          <div className="mt-2 pt-4 border-t border-black/6 dark:border-white/6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-foreground/50" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground/60">
                  Photo Gallery
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-foreground/6 text-foreground/60">
                  {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
                </span>
              </div>

              {photos.length > 4 && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs font-mono text-foreground/70 hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>
                    {isExpanded ? 'Show less' : `View all (${photos.length})`}
                  </span>
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
                    alt={
                      photo.altText || photo.caption || education.institution
                    }
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-[10px] font-mono text-white px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* Lightbox / Modal for full photo view */}
      {activePhotoIndex !== null && photos[activePhotoIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setActivePhotoIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar Controls */}
            <div className="w-full flex items-center justify-between text-white font-mono text-xs px-2">
              <span>
                {activePhotoIndex + 1} / {photos.length} &bull;{' '}
                {education.institution}
              </span>
              <button
                type="button"
                onClick={() => setActivePhotoIndex(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Box */}
            <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-2xl overflow-hidden border border-white/15 bg-black flex items-center justify-center">
              <Image
                src={photos[activePhotoIndex].publicUrl}
                alt={
                  photos[activePhotoIndex].altText ||
                  photos[activePhotoIndex].caption ||
                  education.institution
                }
                fill
                priority
                className="object-contain"
              />

              {/* Prev Button */}
              {activePhotoIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setActivePhotoIndex(activePhotoIndex - 1)}
                  className="absolute left-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer backdrop-blur-xs"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
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

            {/* Caption */}
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
