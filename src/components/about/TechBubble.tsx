'use client';

import React from 'react';
import { Container } from '@/components/liquid/Container';
import { LinkPreview } from '../ui/link-preview';
import { cn } from '@/lib/utils';

export interface TechBubbleProps {
  /** Path to the SVG icon in /public (e.g. "/go.svg") */
  icon: string;
  /** Technology name for display and accessibility (e.g. "Go") */
  name: string;
  /** Official website URL of the technology */
  url: string;
  /** Invert colors in dark mode (essential for monochromatic black SVGs like Next.js & Rust) */
  invertDark?: boolean;
  /** Bubble size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  iconClassName?: string;
}

const sizeClasses = {
  sm: {
    bubble: 'w-6.5 h-6.5',
    icon: 'w-3.5 h-3.5',
    wrapper: 'w-6.5 h-5',
    padding: 'p-1',
  },
  md: {
    bubble: 'w-7.5 h-7.5',
    icon: 'w-4.5 h-4.5',
    wrapper: 'w-7.5 h-5',
    padding: 'p-1',
  },
  lg: {
    bubble: 'w-8 h-8 sm:w-8.5 sm:h-8.5',
    icon: 'w-4.5 h-4.5 sm:w-5 sm:h-5',
    wrapper: 'w-8 sm:w-8.5 h-5',
    padding: 'p-1.5',
  },
  xl: {
    bubble: 'w-9 h-9 sm:w-9.5 sm:h-9.5',
    icon: 'w-5 h-5 sm:w-5.5 sm:h-5.5',
    wrapper: 'w-9 sm:w-9.5 h-5',
    padding: 'p-1.5',
  },
};

/**
 * TechBubble — A spherical liquid droplet containing a technology icon.
 * Built using the liquid glass Container component with full pointer physics,
 * displacement refraction, spherical droplet meniscus.
 * On hover, shows a rich dynamic LinkPreview of the official website with the language name.
 * Designed with a constrained inline anchor so text line-height and line gap
 * remain strictly identical to normal text-base.
 */
export const TechBubble: React.FC<TechBubbleProps> = ({
  icon,
  name,
  url,
  invertDark = false,
  size = 'lg',
  className,
  iconClassName,
}) => {
  const selectedSize = sizeClasses[size] || sizeClasses.lg;

  const bubbleContent = (
    <span className="absolute inset-0 flex items-center justify-center pointer-events-auto">
      <Container
        radius={9999}
        interactive={true}
        elasticity={0.35}
        activationZone={50}
        optics={{
          strength: 0.28,
          curvature: 1.6,
          bend: 1.15,
          bendWidth: 0.22,
          specular: 1.4,
          specularAngle: 45,
          frost: 0.6,
        }}
        overlayClassName={cn(
          'border-0 rounded-full',
          // Light Mode: spherical water droplet meniscus with inset light glint & soft drop shadow
          'shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.08)]',
          // Dark Mode: crystalline spherical droplet sheen with ambient shadow
          'dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.28),inset_0_-2px_5px_rgba(0,0,0,0.6),0_3px_10px_rgba(0,0,0,0.45)]',
        )}
        className={cn(
          selectedSize.bubble,
          'aspect-square inline-flex items-center justify-center p-0 rounded-full cursor-pointer select-none shrink-0',
          'hover:scale-110 active:scale-95 transition-transform duration-200',
          className,
        )}
        contentClassName={cn(
          'relative flex items-center justify-center w-full h-full',
          selectedSize.padding,
        )}
        aria-label={name}
      >
        {/* 3D Convex Sphere Glint */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.1)_35%,transparent_65%)] dark:bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.05)_35%,transparent_65%)]"
        />

        <img
          src={icon}
          alt={name}
          className={cn(
            selectedSize.icon,
            'relative z-10 object-contain select-none pointer-events-none drop-shadow-sm transition-transform duration-200 group-hover:scale-105',
            invertDark && 'dark:invert dark:brightness-110',
            iconClassName,
          )}
          loading="eager"
          decoding="async"
        />
      </Container>
    </span>
  );

  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-center align-middle group ml-1 -mr-0.5 select-none',
        selectedSize.wrapper,
      )}
    >
      <LinkPreview
        url={url}
        title={name}
        dotted={false}
        className="inline-flex items-center justify-center w-full h-full"
        width={200}
        height={125}
      >
        {bubbleContent}
      </LinkPreview>
    </span>
  );
};

export default TechBubble;
