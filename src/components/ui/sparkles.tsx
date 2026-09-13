'use client';

import React, { useId, useEffect, useRef, useSyncExternalStore, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const emptySubscribe = () => () => {};

interface Particle {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  speedX: number;
  speedY: number;
  phase: number;
  twinkleSpeed: number;
}

export interface SparklesCoreProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
}

export const SparklesCore: React.FC<SparklesCoreProps> = ({
  id,
  className,
  background = 'transparent',
  minSize = 0.6,
  maxSize = 2.4,
  speed = 1.0,
  particleColor,
  particleDensity = 70,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rawId = useId();
  const generatedId = id || `sparkles-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const effectiveParticleColor = useMemo(() => {
    if (particleColor) return particleColor;
    if (!mounted) return '#ffffff';
    return resolvedTheme === 'dark' ? '#ffffff' : '#475569';
  }, [particleColor, resolvedTheme, mounted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];

    const initParticles = () => {
      const count = Math.max(
        20,
        Math.floor(((width * height) / 10000) * (particleDensity / 10)),
      );
      particles = [];
      for (let i = 0; i < count; i++) {
        const size = minSize + Math.random() * (maxSize - minSize);
        const baseAlpha = 0.25 + Math.random() * 0.65;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          baseAlpha,
          alpha: baseAlpha,
          speedX: (Math.random() - 0.5) * 0.35 * speed,
          speedY: -(0.15 + Math.random() * 0.45) * speed, // Gentle upward celestial drift
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.02 + Math.random() * 0.04,
        });
      }
    };

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initParticles();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let lastTime = performance.now();

    const render = (now: number) => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((now - lastTime) / 16.666, 2.0);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Parse color for alpha assignment
      const isHex = effectiveParticleColor.startsWith('#');
      let r = 255,
        g = 255,
        b = 255;
      if (isHex && effectiveParticleColor.length >= 7) {
        r = parseInt(effectiveParticleColor.slice(1, 3), 16);
        g = parseInt(effectiveParticleColor.slice(3, 5), 16);
        b = parseInt(effectiveParticleColor.slice(5, 7), 16);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX * dt;
        p.y += p.speedY * dt;
        p.phase += p.twinkleSpeed * dt;

        // Wrap around viewport
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Shimmering twinkle formula
        const twinkle = 0.5 + 0.5 * Math.sin(p.phase);
        p.alpha = Math.max(
          0.05,
          Math.min(1.0, p.baseAlpha * (0.35 + 0.65 * twinkle)),
        );

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.fill();

        // Delicate specular cross-glint on larger particles
        if (p.size > 1.8 && twinkle > 0.8) {
          const glintSize = p.size * 2.2;
          ctx.beginPath();
          ctx.moveTo(p.x - glintSize, p.y);
          ctx.lineTo(p.x + glintSize, p.y);
          ctx.moveTo(p.x, p.y - glintSize);
          ctx.lineTo(p.x, p.y + glintSize);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.4})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
    };
  }, [effectiveParticleColor, minSize, maxSize, speed, particleDensity]);

  return (
    <canvas
      ref={canvasRef}
      id={generatedId}
      className={cn('w-full h-full pointer-events-none block', className)}
      style={{ background }}
    />
  );
};

export interface SparklesBackgroundProps
  extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  showRadialGradient?: boolean;
}

export const SparklesBackground: React.FC<SparklesBackgroundProps> = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center bg-slate-50 dark:bg-[#030712] text-neutral-900 dark:text-neutral-50 transition-colors duration-500 overflow-x-clip',
        className,
      )}
      {...props}
    >
      {/* Ambient background glows for rich liquid refraction */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft atmospheric gradient blooms */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 transition-opacity duration-700 pointer-events-none',
            // Light Mode: Ethereal sky & lavender watercolor washes
            'opacity-75 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(196,181,253,0.22),transparent_70%),radial-gradient(ellipse_70%_50%_at_100%_40%,rgba(147,197,253,0.25),transparent_70%),radial-gradient(ellipse_70%_50%_at_0%_80%,rgba(249,168,212,0.18),transparent_70%)]',
            // Dark Mode: Deep twilight slate with moody, muted bioluminescent glows (indigo, emerald, violet) to give the glass something beautiful to refract
            'dark:opacity-100 dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(30,58,138,0.15),transparent_80%),radial-gradient(ellipse_60%_70%_at_100%_60%,rgba(4,47,46,0.15),transparent_70%),radial-gradient(ellipse_80%_80%_at_0%_80%,rgba(88,28,135,0.1),transparent_80%)]',
          )}
        />

        {/* Shimmering Floating Stardust Field */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full',
            showRadialGradient &&
              'mask-[radial-gradient(ellipse_at_center,black_70%,transparent_100%)]',
          )}
        >
          <SparklesCore
            background="transparent"
            minSize={0.6}
            maxSize={2.4}
            speed={0.65}
            particleDensity={45}
            className="w-full h-full opacity-75 dark:opacity-50"
          />
        </div>
      </div>

      {/* Foreground Content Stream */}
      {children && (
        <div className="relative z-10 w-full flex flex-col items-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default SparklesBackground;
