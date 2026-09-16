'use client';

import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { annotate } from 'rough-notation';
import { type RoughAnnotation } from 'rough-notation/lib/model';
import { cn } from '@/lib/utils';

export type AnnotationAction =
  | 'highlight'
  | 'underline'
  | 'box'
  | 'circle'
  | 'strike-through'
  | 'crossed-off'
  | 'bracket';

export interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number | [number, number] | [number, number, number, number];
  multiline?: boolean;
  isView?: boolean;
  className?: string;
}

const DEFAULT_ACTION_COLORS: Record<AnnotationAction, string> = {
  highlight: 'rgba(250, 204, 21, 0.35)', // Warm amber glow (high readability in light & dark)
  underline: 'rgba(56, 189, 248, 0.85)', // Sky blue accent underline
  box: 'rgba(168, 85, 247, 0.75)', // Modern violet box
  circle: 'rgba(245, 158, 11, 0.85)', // Amber gold circle
  bracket: 'rgba(16, 185, 129, 0.85)', // Emerald bracket
  'strike-through': 'rgba(239, 68, 68, 0.65)',
  'crossed-off': 'rgba(239, 68, 68, 0.65)',
};

export function Highlighter({
  children,
  action = 'highlight',
  color,
  strokeWidth,
  animationDuration = 600,
  iterations = 2,
  padding,
  multiline = true,
  isView = false,
  className,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(!isView);

  const activeColor =
    color || DEFAULT_ACTION_COLORS[action] || DEFAULT_ACTION_COLORS.highlight;
  const activeStrokeWidth =
    strokeWidth ??
    (action === 'highlight' ? 1.5 : action === 'underline' ? 2 : 1.5);
  const activePadding =
    padding ?? (action === 'circle' || action === 'box' ? 4 : 2);

  // Robust observer supporting window and custom scrolling containers (e.g. SparklesBackground)
  useEffect(() => {
    if (!isView || isInView) return;
    const element = elementRef.current;
    if (!element) return;

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0, rootMargin: '100px' },
      );
      observer.observe(element);
      return () => observer.disconnect();
    } else {
      setIsInView(true);
    }
  }, [isView, isInView]);

  useEffect(() => {
    const element = elementRef.current;
    let annotation: RoughAnnotation | null = null;
    let resizeObserver: ResizeObserver | null = null;

    if (isInView && element) {
      const annotationConfig = {
        type: action,
        color: activeColor,
        strokeWidth: activeStrokeWidth,
        animationDuration,
        iterations,
        padding: activePadding,
        multiline,
      };

      const currentAnnotation = annotate(element, annotationConfig);
      annotation = currentAnnotation;
      currentAnnotation.show();

      // Re-measure after custom fonts load
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        document.fonts.ready.then(() => {
          currentAnnotation.hide();
          currentAnnotation.show();
        });
      }

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          currentAnnotation.hide();
          currentAnnotation.show();
        });
        resizeObserver.observe(element);
      }
    }

    return () => {
      annotation?.remove();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [
    isInView,
    action,
    activeColor,
    activeStrokeWidth,
    animationDuration,
    iterations,
    activePadding,
    multiline,
  ]);

  return (
    <span
      ref={elementRef}
      className={cn(
        'relative inline bg-transparent',
        (action === 'circle' || action === 'box') && 'px-1 mx-0.5 inline-block',
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Highlighter;
