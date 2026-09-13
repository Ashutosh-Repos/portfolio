'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { generateLiquidDropletMap } from './liquid-droplet-shader';

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export interface LiquidContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  background?: React.ReactNode;
  className?: string;
  radius?: number;
  strength?: number;
  curvature?: number;
  bend?: number;
  bendWidth?: number;
  dispersion?: number;
  specular?: number;
  specularAngle?: number;
  frost?: number;
  contentClassName?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
  elasticity?: number;
  activationZone?: number;
  overlayClassName?: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Utility
// ────────────────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────

/**
 * LiquidContainer — live SVG displacement glass with per-instance mouse physics.
 *
 * Mouse approach (inspired by rdev/liquid-glass-react):
 * - Mouse tracking listens on the container element itself — each container
 *   only responds to its own interaction. No window-level listener, no coordinator.
 * - Only TWO effects: elastic magnetic translation + directional stretch/squash.
 * - No specular shine, no color changes, no light tracking.
 * - CSS transition for smooth ease-out, no RAF loop needed.
 */
export const LiquidContainer: React.FC<LiquidContainerProps> = ({
  children,
  background,
  className,
  radius = 32,
  strength = 0.22,
  curvature = 1.4,
  bend = 1.0,
  bendWidth = 0.16,
  dispersion = 0,
  specular = 1.2,
  specularAngle = 45,
  frost = 1.4,
  contentClassName,
  style,
  interactive = true,
  elasticity = 0.15,
  activationZone = 200,
  overlayClassName,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const instanceId = useMemo(
    () => `liquid-${rawId.replace(/:/g, '')}`,
    [rawId],
  );

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  // Current mouse-driven transform string — applied via CSS transition for smoothness
  const [mouseTransform, setMouseTransform] = useState('');

  // ── Measure container dimensions ─────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w > 0 && h > 0) {
        setDimensions((prev) =>
          prev.width === w && prev.height === h
            ? prev
            : { width: w, height: h },
        );
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Generate displacement map ────────────────────────────────────────
  const mapUrl = useMemo(() => {
    if (dimensions.width <= 0 || dimensions.height <= 0) return '';

    return generateLiquidDropletMap({
      width: dimensions.width,
      height: dimensions.height,
      radius,
      curvature,
      bend,
      bendWidth,
      specularAngle,
      specularIntensity: specular,
    });
  }, [
    dimensions.width,
    dimensions.height,
    radius,
    curvature,
    bend,
    bendWidth,
    specularAngle,
    specular,
  ]);

  // ── Mouse interaction (rdev approach) ────────────────────────────────
  // Listens on the container itself — each container only responds to its own mouse.
  // Uses window mousemove only while mouse is over the container (tracked via mouseenter/leave).
  // This naturally isolates each liquid container's interaction.
  useEffect(() => {
    if (!interactive) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches
    )
      return;

    const el = containerRef.current;
    if (!el) return;

    let isOver = false;

    const computeTransform = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      const w = el.offsetWidth;
      const h = el.offsetHeight;

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;

      // Edge distance: 0 inside, positive outside
      const edgeX = Math.max(0, Math.abs(dx) - w / 2);
      const edgeY = Math.max(0, Math.abs(dy) - h / 2);
      const edgeDist = Math.sqrt(edgeX * edgeX + edgeY * edgeY);

      if (edgeDist > activationZone) {
        setMouseTransform('');
        return;
      }

      // Fade-in: 1 at edge → 0 at activation zone boundary
      const fadeIn = 1 - edgeDist / activationZone;

      // Normalize scaling by element size so both large cards and small bubbles feel alive
      const minDimension = Math.min(w, h);
      const maxStretchDist = Math.max(20, Math.min(minDimension, 300));
      const transScale =
        minDimension < 60 ? 0.35 : minDimension < 180 ? 0.26 : 0.1;

      // Elastic translation (magnetic pull towards cursor)
      const transX = dx * elasticity * transScale * fadeIn;
      const transY = dy * elasticity * transScale * fadeIn;

      // Directional stretch/squash
      const centerDist = Math.sqrt(dx * dx + dy * dy);
      let scaleStr = '';
      if (centerDist > 1) {
        const nx = dx / centerDist;
        const ny = dy / centerDist;
        const stretchIntensity =
          Math.min(centerDist / maxStretchDist, 1) * elasticity * fadeIn;
        const scaleX =
          1 +
          Math.abs(nx) * stretchIntensity * 0.3 -
          Math.abs(ny) * stretchIntensity * 0.15;
        const scaleY =
          1 +
          Math.abs(ny) * stretchIntensity * 0.3 -
          Math.abs(nx) * stretchIntensity * 0.15;
        scaleStr = `scaleX(${Math.max(0.85, scaleX).toFixed(
          4,
        )}) scaleY(${Math.max(0.85, scaleY).toFixed(4)})`;
      }

      setMouseTransform(
        `translate3d(${clamp(transX, -12, 12).toFixed(2)}px, ${clamp(
          transY,
          -12,
          12,
        ).toFixed(2)}px, 0) ${scaleStr}`,
      );
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isOver) computeTransform(e.clientX, e.clientY);
    };

    const onMouseEnter = () => {
      isOver = true;
    };

    const onMouseLeave = () => {
      isOver = false;
      setMouseTransform('');
    };

    // Listen on the container for enter/leave, window for move (so movement outside still tracks while cursor is near)
    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [interactive, elasticity, activationZone]);

  const norm = Math.sqrt(
    (dimensions.width * dimensions.width +
      dimensions.height * dimensions.height) /
      2,
  );
  // Strictly non-inverting liquid optical scale
  const baseScale = Math.max(3, Math.round(strength * norm * 0.16));
  const hasDispersion = dispersion > 0.05;
  const redScale = hasDispersion
    ? Math.round(baseScale * (1 + dispersion * 0.04))
    : baseScale;
  const greenScale = baseScale;
  const blueScale = hasDispersion
    ? Math.max(1, Math.round(baseScale * (1 - dispersion * 0.04)))
    : baseScale;

  const frostFilter = frost > 0 ? `blur(${frost}px) ` : '';
  // Pure optical transparency: direct SVG displacement map filter with zero artificial tints or brightness modifications
  const backdropFilterValue = mapUrl
    ? `${frostFilter}url(#${instanceId}-filter)`.trim()
    : frostFilter.trim() || undefined;

  // Compose transform: base style transform + mouse physics transform
  const baseTransform = style?.transform ?? '';
  const composedTransform = mouseTransform
    ? `${baseTransform} ${mouseTransform}`.trim()
    : baseTransform || undefined;

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{
        borderRadius: `${radius}px`,
        transformOrigin: 'center center',
        ...style,
        transform: composedTransform,
        transition: mouseTransform
          ? 'transform 0.2s ease-out'
          : 'transform 0.35s ease-out',
      }}
      {...props}
    >
      {/* SVG Filter */}
      {mapUrl && (
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
            pointerEvents: 'none',
          }}
        >
          <defs>
            <filter
              id={`${instanceId}-filter`}
              x="0"
              y="0"
              width="100%"
              height="100%"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={mapUrl}
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                result="LENS_MAP"
              />
              {hasDispersion ? (
                <>
                  {/* Subtle, natural optical dispersion */}
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="LENS_MAP"
                    scale={redScale}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="DISP_RED"
                  />
                  <feColorMatrix
                    in="DISP_RED"
                    type="matrix"
                    values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                    result="RED_ONLY"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="LENS_MAP"
                    scale={greenScale}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="DISP_GREEN"
                  />
                  <feColorMatrix
                    in="DISP_GREEN"
                    type="matrix"
                    values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                    result="GREEN_ONLY"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="LENS_MAP"
                    scale={blueScale}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="DISP_BLUE"
                  />
                  <feColorMatrix
                    in="DISP_BLUE"
                    type="matrix"
                    values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                    result="BLUE_ONLY"
                  />
                  <feBlend
                    in="RED_ONLY"
                    in2="GREEN_ONLY"
                    mode="screen"
                    result="RG_COMBINED"
                  />
                  <feBlend in="RG_COMBINED" in2="BLUE_ONLY" mode="screen" />
                </>
              ) : (
                /* Pure natural liquid refraction — crystal clear single-pass displacement */
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="LENS_MAP"
                  scale={baseScale}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              )}
            </filter>
          </defs>
        </svg>
      )}

      {/* Layer 0: Background element (e.g. image, canvas, or transitioning background) */}
      {background && (
        <div
          className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none rounded-[inherit]"
          style={{ borderRadius: `${radius}px` }}
        >
          {background}
        </div>
      )}

      {/* Layer 1: Liquid Refraction Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: `${radius}px`,
          backdropFilter: backdropFilterValue,
          WebkitBackdropFilter: backdropFilterValue,
          background: 'transparent',
        }}
      />

      {/* Layer 2: Natural Water Droplet Optics — Feathered 3D fluid volume (zero 1px border lines) */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 pointer-events-none transition-all duration-300 z-20',
          overlayClassName ?? [
            // Strictly zero border stroke
            'border-0',
            // Light Mode: natural water droplet dome roll-off with soft ambient elevation
            'shadow-[inset_0_4px_16px_-4px_rgba(255,255,255,0.65),0_3px_10px_-2px_rgba(0,0,0,0.025),0_14px_28px_-6px_rgba(0,0,0,0.03),0_32px_64px_-16px_rgba(0,0,0,0.03)]',
            // Dark Mode: soft celestial meniscus sheen with deep floating elevation
            'dark:shadow-[inset_0_4px_16px_-4px_rgba(255,255,255,0.12),0_4px_14px_-2px_rgba(0,0,0,0.35),0_18px_38px_-8px_rgba(0,0,0,0.5),0_44px_84px_-18px_rgba(0,0,0,0.65)]',
          ],
        )}
        style={{ borderRadius: `${radius}px` }}
      />

      {/* Layer 3: Content */}
      <div
        className={cn(
          'relative z-10 w-full h-full pointer-events-auto',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default LiquidContainer;
