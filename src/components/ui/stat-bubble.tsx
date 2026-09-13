'use client';

import React from 'react';
import Image from 'next/image';
import { InteractiveLiquidGlassBubble } from '@/components/about/LiquidGlassAvatar';

export interface StatBubbleProps {
  icon?: React.ComponentType<{ className?: string }>;
  image?: { src: string; alt: string };
  color?: string;
  className?: string;
}

/**
 * StatBubble — A small liquid-glass sphere used to decorate stat labels.
 *
 * Displays either an icon over a coloured backdrop or a remote image
 * (e.g. an avatar) inside an interactive glass bubble.
 */
export const StatBubble = ({
  icon: Icon,
  image,
  color,
  className = 'w-7 h-7 mr-2 shrink-0',
}: StatBubbleProps) => (
  <InteractiveLiquidGlassBubble
    background={
      image ? (
        <div className="w-full h-full transition-transform duration-300 ease-out">
          <Image
            width={200}
            height={200}
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover m-auto"
            priority
          />
        </div>
      ) : Icon ? (
        <span className="relative inline-flex items-center justify-center w-full h-full p-1">
          <Icon className="w-full h-full text-black z-2 stroke-2" />
          <span className={`absolute w-full h-full ${color} rounded-full z-1`} />
        </span>
      ) : null
    }
    className={`aspect-square rounded-full transition-shadow duration-300 shadow-md hover:shadow-xl ${className}`}
    contentClassName="w-full h-full rounded-full overflow-hidden"
    overlayClassName="z-20 pointer-events-none border-0 ring-1 ring-inset ring-black/10 dark:ring-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2),0_8px_24px_-4px_rgba(0,0,0,0.18)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-3px_8px_rgba(0,0,0,0.5),0_10px_28px_-4px_rgba(0,0,0,0.4)]"
  />
);
