'use client';
import React, { useRef, useEffect, useState, useCallback, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

export interface PixelTransitionProps {
  firstContent: React.ReactNode | string;
  secondContent: React.ReactNode | string;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  aspectRatio?: string;
  active?: boolean;
}

export const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 8,
  pixelColor = '#ffffff',
  animationStepDuration = 0.35,
  once = false,
  aspectRatio,
  className = '',
  style = {},
  active,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);

  const [internalActive, setInternalActive] = useState<boolean>(false);
  const isControlled = active !== undefined;
  const currentActive = isControlled ? active : internalActive;

  // Track previous active state for controlled mode to avoid initial-mount animations
  const prevActiveRef = useRef<boolean>(false);

  // Build the pixel grid
  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = '';

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixelated-image-card__pixel', 'absolute');
        pixel.style.backgroundColor = pixelColor;
        pixel.style.display = 'none';
        pixel.style.opacity = '0';

        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;

        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = useCallback((activate: boolean): void => {
    const pixelGridEl = pixelGridRef.current;
    const activeEl = activeRef.current;
    if (!pixelGridEl || !activeEl) return;

    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>(
      '.pixelated-image-card__pixel',
    );
    if (!pixels.length) {
      activeEl.style.display = activate ? 'block' : 'none';
      return;
    }

    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    const totalPixels = pixels.length;
    const staggerStep = animationStepDuration / totalPixels;

    // Reset pixels
    gsap.set(pixels, { display: 'none', opacity: 0 });

    // Step 1: Pixels flash in randomly across animationStepDuration
    gsap.to(pixels, {
      display: 'block',
      opacity: 1,
      duration: 0.04,
      stagger: {
        each: staggerStep,
        from: 'random',
      },
    });

    // Step 2: Switch the underlying content at the transition midpoint
    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? 'block' : 'none';
    });

    // Step 3: Pixels dissolve out randomly, revealing the new content
    gsap.to(pixels, {
      display: 'none',
      opacity: 0,
      duration: 0.04,
      delay: animationStepDuration,
      stagger: {
        each: staggerStep,
        from: 'random',
      },
    });
  }, [animationStepDuration]);

  // Controlled mode reaction
  useEffect(() => {
    if (isControlled && prevActiveRef.current !== active) {
      prevActiveRef.current = active;
      animatePixels(active);
    }
  }, [active, isControlled, animatePixels]);

  const handleEnter = (): void => {
    if (!currentActive) {
      setInternalActive(true);
      animatePixels(true);
    }
  };

  const handleLeave = (): void => {
    if (currentActive && !once) {
      setInternalActive(false);
      animatePixels(false);
    }
  };

  const handleClick = (): void => {
    if (!currentActive) {
      setInternalActive(true);
      animatePixels(true);
    } else if (!once) {
      setInternalActive(false);
      animatePixels(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden w-full h-full select-none',
        className,
      )}
      style={style}
      onMouseEnter={!isControlled ? handleEnter : undefined}
      onMouseLeave={!isControlled ? handleLeave : undefined}
      onClick={!isControlled ? handleClick : undefined}
      onFocus={!isControlled ? handleEnter : undefined}
      onBlur={!isControlled ? handleLeave : undefined}
      tabIndex={0}
    >
      {aspectRatio ? <div style={{ paddingTop: aspectRatio }} /> : null}

      {/* Base content (first image) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {firstContent}
      </div>

      {/* Target content (second image) */}
      <div
        ref={activeRef}
        className="absolute inset-0 w-full h-full z-10 overflow-hidden pointer-events-none"
        style={{ display: 'none' }}
      >
        {secondContent}
      </div>

      {/* Dissolving pixel grid */}
      <div
        ref={pixelGridRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />
    </div>
  );
};

export default PixelTransition;
