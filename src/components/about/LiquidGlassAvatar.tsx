'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Container from '../liquid/Container';
import PixelTransition from '../ui/pixel-transition';
import { cn } from '@/lib/utils';

interface LiquidGlassAvatarProps {
  firstImageSrc?: string;
  secondImageSrc?: string;
  alt?: string;
  className?: string;
}

export const LiquidGlassAvatar: React.FC<LiquidGlassAvatarProps> = ({
  firstImageSrc = '/images/image5.jpeg',
  secondImageSrc = '/images/image2.jpg',
  alt = 'Ashutosh',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative w-full h-full rounded-full cursor-pointer select-none group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered((prev) => !prev)}
    >
      <Container
        className="w-full h-full rounded-full transition-shadow duration-300 shadow-md hover:shadow-xl"
        contentClassName="w-full h-full rounded-full overflow-hidden"
        radius={9999}
        interactive={true}
        elasticity={0.45}
        activationZone={180}
        overlayClassName="z-20 pointer-events-none border-0 ring-1 ring-inset ring-black/10 dark:ring-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2),0_8px_24px_-4px_rgba(0,0,0,0.18)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-3px_8px_rgba(0,0,0,0.5),0_10px_28px_-4px_rgba(0,0,0,0.4)]"
        optics={{
          strength: 0.5,
          curvature: 2.0,
          bend: 1.5,
          bendWidth: 0.3,
          dispersion: 0.3,
          specular: 1.8,
          specularAngle: 60,
          frost: 0,
        }}
        background={
          <div
            className="w-full h-full transition-transform duration-300 ease-out"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1.0)',
            }}
          >
            <PixelTransition
              active={isHovered}
              firstContent={
                <Image
                  src={firstImageSrc}
                  alt={alt}
                  width={220}
                  height={220}
                  className="w-full h-full object-cover select-none"
                  priority
                />
              }
              secondContent={
                <Image
                  src={secondImageSrc}
                  alt={alt}
                  width={220}
                  height={220}
                  className="w-full h-full object-cover select-none"
                  priority
                />
              }
              gridSize={8}
              pixelColor="#ffffff"
              once={false}
              animationStepDuration={0.35}
              className="w-full h-full border-0"
            />
          </div>
        }
      />
    </div>
  );
};

export const InteractiveLiquidGlassBubble: React.FC<
  Omit<LiquidGlassAvatarProps, 'firstImageSrc' | 'secondImageSrc'> & {
    children?: React.ReactNode;
    background?: React.ReactNode;
    className?: string;
    contentClassName?: string;
    overlayClassName?: string;
  }
> = ({
  background,
  className,
  contentClassName,
  overlayClassName,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`relative rounded-full cursor-pointer select-none group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered((prev) => !prev)}
    >
      <Container
        className="w-full h-full rounded-full transition-shadow duration-300 shadow-md hover:shadow-xl"
        contentClassName={cn(
          'w-full h-full rounded-full overflow-hidden',
          contentClassName,
        )}
        radius={9999}
        interactive={true}
        elasticity={0.45}
        activationZone={180}
        overlayClassName={cn(
          'z-20 pointer-events-none border-0 ring-1 ring-inset ring-black/10 dark:ring-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2),0_8px_24px_-4px_rgba(0,0,0,0.18)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-3px_8px_rgba(0,0,0,0.5),0_10px_28px_-4px_rgba(0,0,0,0.4)]',
          overlayClassName,
        )}
        optics={{
          strength: 0.5,
          curvature: 2.0,
          bend: 1.5,
          bendWidth: 0.3,
          dispersion: 0.3,
          specular: 1.8,
          specularAngle: 60,
          frost: 0,
        }}
        background={
          <div
            className="w-full h-full transition-transform duration-300 ease-out"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1.0)',
            }}
          >
            {background}
          </div>
        }
      />
    </div>
  );
};

export default LiquidGlassAvatar;
