'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface NoiseProps {
  children?: React.ReactNode;
  /** Custom container class name to customize or override glass tints, borders, etc. */
  containerClassName?: string;
  className?: string;
  /** Custom class name for the noise texture layer */
  noiseClassName?: string;
  /** Opacity of the noise grain (default: 0.15 for subtle, premium grain) */
  noiseOpacity?: number;
  /** Tile size for noise texture in pixels or CSS units (default: 160px) */
  patternSize?: number | string;
  /** Custom base background styling (default: subtle translucent glass) */
  bgClassName?: string;
  /** Custom ambient illumination highlight gradient */
  bgGradient?: string;
  /** Whether to mask noise at edges (default: false to cover 100% of background) */
  maskNoise?: boolean;
}

/**
 * Noise — A full-coverage, textured noise background component built specifically
 * to be passed as a background to any glass or liquid component (or used as a wrapper).
 *
 * It covers 100% of the parent container from edge to edge without clipping or
 * boundary shrinkage.
 *
 * @internal Unused — reserved for future use.
 */
export const Noise: React.FC<NoiseProps> = ({
  children,
  containerClassName,
  className,
  noiseClassName,
  noiseOpacity = 0.15,
  patternSize = 160,
  bgClassName,
  bgGradient,
  maskNoise = false,
}) => {
  const sizeValue =
    typeof patternSize === 'number' ? `${patternSize}px` : patternSize;

  return (
    <div
      className={cn(
        'absolute inset-0 w-full h-full rounded-[inherit] overflow-hidden pointer-events-none',
        bgClassName ?? 'bg-white/40 dark:bg-white/2',
        containerClassName,
        className,
      )}
      aria-hidden="true"
    >
      {/* Layer 1: Ambient top illumination gradient for frosted glass realism */}
      <div
        className={cn(
          'absolute inset-0 w-full h-full rounded-[inherit] pointer-events-none',
          'bg-[radial-gradient(88%_100%_at_top,rgba(255,255,255,0.45),rgba(255,255,255,0))] dark:bg-[radial-gradient(88%_100%_at_top,rgba(255,255,255,0.06),rgba(255,255,255,0))]',
          bgGradient,
        )}
        style={{
          boxShadow:
            '0 10px 32px rgba(34, 42, 53, 0.08), 0 1px 1px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.15)',
        }}
      />

      {/* Layer 2: Seamless edge-to-edge Noise texture */}
      <div
        className={cn(
          'absolute inset-0 w-full h-full pointer-events-none rounded-[inherit]',
          'dark:invert-0 invert',
          maskNoise &&
            'mask-[radial-gradient(#fff,transparent_80%)] [-webkit-mask-image:radial-gradient(#fff,transparent_80%)]',
          noiseClassName,
        )}
        style={{
          backgroundImage: 'url(/noise.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: sizeValue,
          opacity: noiseOpacity,
        }}
      />

      {/* Optional Children content layer if used as a wrapper component */}
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default Noise;
