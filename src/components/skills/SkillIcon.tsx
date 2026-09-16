'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  SKILL_ICON_MAP,
  SKILL_SCALE_MAP,
  DARK_INVERT_SLUGS,
  CATEGORY_FALLBACK_ICONS,
  getSkillMonogram,
} from './skill-assets';
import { cn } from '@/lib/utils';

export interface SkillIconProps {
  name: string;
  slug: string;
  iconSlug?: string | null;
  category?: string;
  className?: string;
  size?: number;
}

/**
 * SkillIcon — 3-Tier Bulletproof Icon Renderer
 *
 * Tier 1: Resolves registered vector SVG / high-DPI PNG asset with optical scaling.
 * Tier 2: Gracefully catches onError or unmapped icon and renders category-specific Lucide vector icon.
 * Tier 3: If no icon or category matches, renders a sleek typographic monogram (e.g., 'TS', 'GO', 'PY').
 */
export const SkillIcon: React.FC<SkillIconProps> = ({
  name,
  slug,
  iconSlug,
  category = 'tools',
  className,
  size = 48,
}) => {
  const [hasError, setHasError] = useState(false);

  // 1. Resolve registered asset path
  const key = (iconSlug || slug || '').toLowerCase();
  const iconSrc = SKILL_ICON_MAP[key] || null;
  const isInvertDark = DARK_INVERT_SLUGS.has(key);
  const opticalScale = SKILL_SCALE_MAP[key] || '';

  // Tier 1: Asset available and has not failed
  if (iconSrc && !hasError) {
    return (
      <div
        className={cn(
          'relative w-full h-full flex items-center justify-center p-2',
          className,
        )}
      >
        <Image
          src={iconSrc}
          width={size}
          height={size}
          alt={name}
          onError={() => setHasError(true)}
          unoptimized
          className={cn(
            'w-full h-full object-contain pointer-events-none select-none transition-transform duration-200 group-hover:scale-105',
            opticalScale,
            isInvertDark && 'dark:invert dark:brightness-125',
          )}
          loading="eager"
        />
      </div>
    );
  }

  // Tier 2: Category-based vector icon fallback
  const FallbackIcon = CATEGORY_FALLBACK_ICONS[category];
  if (FallbackIcon) {
    return (
      <div
        className={cn(
          'relative w-full h-full flex items-center justify-center p-2.5',
          className,
        )}
      >
        <FallbackIcon className="w-full h-full text-foreground/75 stroke-[1.75] transition-transform duration-200 group-hover:scale-105" />
      </div>
    );
  }

  // Tier 3: Sleek typographic monogram badge
  const monogram = getSkillMonogram(name);
  return (
    <div
      className={cn(
        'relative w-full h-full flex items-center justify-center p-1',
        className,
      )}
    >
      <span className="font-mono text-xs font-bold tracking-wider text-foreground/80 select-none">
        {monogram}
      </span>
    </div>
  );
};

export default SkillIcon;
