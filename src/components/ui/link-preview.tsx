'use client';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

import React from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'motion/react';

import { cn } from '@/lib/utils';
import { POP_IN_VARIANTS, SPRING_CONFIG } from '@/lib/motion-config';

export interface DottedSvgConfig {
  /** Whether to show the dotted SVG underline. Defaults to true. */
  show?: boolean;
  /** Stroke color of the dots. Defaults to "currentColor" to match text color. */
  color?: string;
  /** Dot diameter / stroke width in pixels. Defaults to 2. */
  size?: number;
  /** Spacing / gap between dots in pixels. Defaults to 4. */
  gap?: number;
  /** Dot shape: "circle" (round dots), "square" (square dots), or "dash" (small dashes). Defaults to "circle". */
  shape?: 'circle' | 'square' | 'dash';
  /** How dots spread: "center" (symmetrically centered) or "justify" (spread edge-to-edge). Defaults to "center". */
  spread?: 'center' | 'justify';
  /** Inset padding from text bounds in pixels. Defaults to 0. */
  inset?: number;
  /** Vertical offset in pixels below text baseline. Defaults to -2. */
  offset?: number;
  /** Extra CSS classes for the SVG element. */
  className?: string;
  /** Custom SVG render prop to completely override the SVG output if desired. */
  render?: React.ReactNode | ((config: DottedSvgConfig) => React.ReactNode);
}

export type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  /** Optional title to display in a footer bar inside the preview card */
  title?: string;
  /** Whether to show the bottom footer bar with title and domain. Defaults to true. */
  showFooter?: boolean;
  className?: string;
  sideOffset?: number;
  width?: number;
  height?: number;
  quality?: number;
  layout?: string;
  target?: string;
  rel?: string;
  /** Full configuration object for the dotted SVG underline */
  dottedConfig?: DottedSvgConfig;
  /** Quick toggle to show/hide the dotted SVG underline. Defaults to true. */
  dotted?: boolean;
  /** Quick prop for dot color. Defaults to "currentColor". */
  dotColor?: string;
  /** Quick prop for dot diameter / stroke width in px. Defaults to 2. */
  dotSize?: number;
  /** Quick prop for gap between dots in px. Defaults to 4. */
  dotGap?: number;
  /** Quick prop for dot shape: "circle" | "square" | "dash". Defaults to "circle". */
  dotShape?: 'circle' | 'square' | 'dash';
  /** Quick prop for spread mode: "center" (centered) | "justify" (edge-to-edge). Defaults to "center". */
  dotSpread?: 'center' | 'justify';
  /** Quick prop for inset from text boundaries in px. Defaults to 0. */
  dotInset?: number;
  /** Quick prop for vertical offset below text in px. Defaults to -2. */
  dotOffset?: number;
  /** Quick prop for custom SVG class name. */
  svgClassName?: string;
  /** Quick prop to provide a custom SVG element or render function. */
  renderSvg?: React.ReactNode | ((config: DottedSvgConfig) => React.ReactNode);
  /** Whether the link can wrap onto multiple lines. Uses native CSS dotted underline on each line to avoid SVG clipping and overflow. */
  multiline?: boolean;
  isStatic?: boolean;
  imageSrc?: string;
};

export const LinkPreview = ({
  children,
  url,
  title,
  showFooter = true,
  className,
  sideOffset = 10,
  width = 200,
  height = 125,
  isStatic = false,
  imageSrc = '',
  target,
  rel,
  dottedConfig,
  dotted,
  dotColor,
  dotSize,
  dotGap,
  dotShape,
  dotSpread,
  dotInset,
  dotOffset,
  svgClassName,
  renderSvg,
  multiline = false,
}: LinkPreviewProps) => {
  const isInternal = url.startsWith('/');
  const effectiveTarget = target ?? (isInternal ? '_self' : '_blank');
  const effectiveRel =
    rel ?? (effectiveTarget === '_blank' ? 'noopener noreferrer' : undefined);

  let src = '';
  if (!isStatic && !isInternal) {
    src = `/api/preview?url=${encodeURIComponent(url)}`;
  } else if (isStatic) {
    src = imageSrc || '';
  }

  const [isOpen, setOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const textRef = React.useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = React.useState<number>(0);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Measure exact text width to symmetrically center dots and prevent overflow
  React.useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setTextWidth(rect.width);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);

  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const targetRect = event.currentTarget.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
    x.set(offsetFromCenter);
  };

  // Resolve dotted SVG configuration
  const showDotted = dotted ?? dottedConfig?.show ?? true;
  const color = dotColor ?? dottedConfig?.color ?? 'currentColor';
  const size = dotSize ?? dottedConfig?.size ?? 2;
  const gap = dotGap ?? dottedConfig?.gap ?? 4;
  const shape = dotShape ?? dottedConfig?.shape ?? 'circle';
  const spread = dotSpread ?? dottedConfig?.spread ?? 'center';
  const inset = Math.max(0, dotInset ?? dottedConfig?.inset ?? 0);
  const rawOffset = dotOffset ?? dottedConfig?.offset ?? -2;
  const offsetY = typeof rawOffset === 'number' ? rawOffset : -2;
  const customSvgClassName = svgClassName ?? dottedConfig?.className;
  const customRender = renderSvg ?? dottedConfig?.render;

  const resolvedConfig: DottedSvgConfig = {
    show: showDotted,
    color,
    size,
    gap,
    shape,
    spread,
    inset,
    offset: offsetY,
    className: customSvgClassName,
    render: customRender,
  };

  // Clean string children to prevent accidental JSX whitespace from expanding text bounds
  const content = typeof children === 'string' ? children.trim() : children;

  const renderDottedLine = () => {
    if (!showDotted) return null;

    if (customRender) {
      if (typeof customRender === 'function') {
        return customRender(resolvedConfig);
      }
      return customRender;
    }

    // Determine half-width per dot according to shape
    const halfWidth = shape === 'dash' ? size : size / 2;
    // Available width strictly clamped so dot edges never overflow [0, textWidth]
    const availableWidth = Math.max(0, textWidth - halfWidth * 2 - inset * 2);

    let dots: number[] = [];

    if (textWidth > 0) {
      if (availableWidth <= 0 || gap <= 0) {
        // Text is too narrow for multiple dots: place a single centered dot
        dots = [textWidth / 2];
      } else if (spread === 'justify') {
        const numGaps = Math.max(1, Math.round(availableWidth / gap));
        const dynamicGap = availableWidth / numGaps;
        for (let i = 0; i <= numGaps; i++) {
          dots.push(halfWidth + inset + i * dynamicGap);
        }
      } else {
        // "center" spread (default): symmetrically center dots under the text
        const numGaps = Math.floor(availableWidth / gap);
        if (numGaps <= 0) {
          dots = [textWidth / 2];
        } else {
          const totalSpan = numGaps * gap;
          const minStartX = halfWidth + inset;
          const maxStartX = Math.max(
            minStartX,
            textWidth - halfWidth - inset - totalSpan,
          );
          // startX symmetrically centers the dot sequence: (textWidth - totalSpan) / 2
          const startX = Math.min(
            Math.max(minStartX, (textWidth - totalSpan) / 2),
            maxStartX,
          );
          for (let i = 0; i <= numGaps; i++) {
            dots.push(startX + i * gap);
          }
        }
      }
    }

    return (
      <svg
        aria-hidden="true"
        className={cn(
          'absolute left-0 w-full pointer-events-none overflow-hidden transition-opacity duration-150 opacity-100',
          customSvgClassName,
        )}
        style={{
          bottom: `${offsetY}px`,
          height: `${Math.max(size, 2)}px`,
        }}
        width="100%"
        height={Math.max(size, 2)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {textWidth > 0 ? (
          dots.map((cx, i) =>
            shape === 'circle' ? (
              <circle key={i} cx={cx} cy={size / 2} r={size / 2} fill={color} />
            ) : shape === 'square' ? (
              <rect
                key={i}
                x={cx - size / 2}
                y={0}
                width={size}
                height={size}
                fill={color}
              />
            ) : (
              <rect
                key={i}
                x={cx - size}
                y={0}
                width={size * 2}
                height={size}
                rx={size / 4}
                fill={color}
              />
            ),
          )
        ) : (
          /* Initial paint / SSR fallback line centered with dasharray */
          <line
            x1={size / 2}
            y1="50%"
            x2="100%"
            y2="50%"
            stroke={color}
            strokeWidth={size}
            strokeDasharray={`0.001 ${gap}`}
            strokeLinecap="round"
          />
        )}
      </svg>
    );
  };

  const hostname = React.useMemo(() => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      if (url.startsWith('/')) {
        try {
          return decodeURIComponent(url);
        } catch {
          return url;
        }
      }
      return '';
    }
  }, [url]);

  const displayTitle =
    title ?? (typeof children === 'string' ? children : hostname);

  return (
    <>
      {isMounted && !isInternal && !isStatic ? (
        <span className="hidden" aria-hidden="true">
          <img src={src} width={width} height={height} alt="hidden image" />
        </span>
      ) : null}

      <HoverCardPrimitive.Root
        openDelay={50}
        closeDelay={100}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <HoverCardPrimitive.Trigger
          onMouseMove={handleMouseMove}
          className={cn(
            multiline
              ? 'relative inline align-baseline text-black dark:text-white group'
              : 'relative inline-block align-baseline text-black dark:text-white group',
            className,
          )}
          href={url}
          target={effectiveTarget}
          rel={effectiveRel}
        >
          {multiline ? (
            <span
              ref={textRef}
              className="relative inline transition-colors"
              style={{
                backgroundImage: `radial-gradient(circle at ${size / 2}px ${
                  size / 2
                }px, ${color} ${size / 2}px, transparent ${size / 2 + 0.3}px)`,
                backgroundSize: `${gap}px ${Math.max(size, 2) + 2}px`,
                backgroundRepeat: 'repeat-x',
                backgroundPosition: `0 calc(100% - ${Math.max(
                  0,
                  -offsetY - 1,
                )}px)`,
                paddingBottom: `${Math.max(size, 2) + Math.max(0, -offsetY)}px`,
                WebkitBoxDecorationBreak: 'clone',
                boxDecorationBreak: 'clone',
              }}
            >
              {content}
            </span>
          ) : (
            <span ref={textRef} className="relative inline-block">
              {content}
              {renderDottedLine()}
            </span>
          )}
        </HoverCardPrimitive.Trigger>

        <HoverCardPrimitive.Content
          className="origin-(--radix-hover-card-content-transform-origin) perspective-distant z-50 pointer-events-auto"
          side="top"
          align="center"
          sideOffset={sideOffset}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={POP_IN_VARIANTS}
                transition={SPRING_CONFIG}
                initial="initial"
                animate="animate"
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                className="shadow-2xl rounded-xl overflow-hidden max-w-[calc(100vw-32px)]"
                style={{
                  x: translateX,
                  width,
                }}
              >
                <a
                  href={url}
                  className="block w-full shadow-xl rounded-xl overflow-hidden bg-background/95 backdrop-blur-md border border-black/10 dark:border-white/15"
                  target={effectiveTarget}
                  rel={effectiveRel}
                  style={{ width }}
                >
                  {isStatic && imageSrc ? (
                    <img
                      src={imageSrc}
                      width={width}
                      height={height}
                      style={{ width, height }}
                      className={cn(
                        'block w-full object-cover',
                        showFooter ? 'rounded-t-xl' : 'rounded-xl',
                      )}
                      alt={displayTitle || 'preview image'}
                    />
                  ) : isInternal ? (
                    <div
                      style={{ width, height }}
                      className={cn(
                        'relative w-full overflow-hidden bg-background pointer-events-none select-none',
                        showFooter ? 'rounded-t-xl' : 'rounded-xl',
                      )}
                    >
                      <iframe
                        src={url}
                        title={displayTitle || 'preview'}
                        tabIndex={-1}
                        aria-hidden="true"
                        className="border-0 pointer-events-none select-none"
                        style={{
                          width: `${width * 4}px`,
                          height: `${height * 4}px`,
                          transform: 'scale(0.25)',
                          transformOrigin: 'top left',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  ) : (
                    <img
                      src={src}
                      width={width}
                      height={height}
                      style={{ width, height }}
                      className={cn(
                        'block w-full object-cover',
                        showFooter ? 'rounded-t-xl' : 'rounded-xl',
                      )}
                      alt={displayTitle || 'preview image'}
                    />
                  )}
                  {showFooter && (
                    <div className="w-full px-2.5 py-1.5 flex items-center justify-between gap-2 border-t border-black/5 dark:border-white/10 bg-neutral-50/95 dark:bg-neutral-900/95 text-left min-w-0 overflow-hidden">
                      <span className="font-medium text-[11px] text-foreground truncate min-w-0 flex-1 leading-tight">
                        {displayTitle}
                      </span>
                      <span className="text-[9.5px] text-foreground/50 font-mono truncate min-w-0 max-w-[50%] shrink-0 text-right leading-tight">
                        {hostname}
                      </span>
                    </div>
                  )}
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Root>
    </>
  );
};

export default LinkPreview;
