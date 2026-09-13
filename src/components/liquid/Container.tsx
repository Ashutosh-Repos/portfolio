'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { LiquidContainer } from './LiquidContainer';

export interface ContainerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: React.ReactNode;
  background?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  radius?: number;
  interactive?: boolean;
  elasticity?: number;
  activationZone?: number;
  overlayClassName?: string;
  /** Optical tuning for the displacement lens */
  optics?: {
    strength?: number;
    curvature?: number;
    bend?: number;
    bendWidth?: number;
    dispersion?: number;
    specular?: number;
    specularAngle?: number;
    frost?: number;
  };
}

export const Container: React.FC<ContainerProps> = ({
  children,
  background,
  className,
  contentClassName,
  optics,
  radius = 32,
  interactive = true,
  elasticity = 0.12,
  activationZone = 150,
  overlayClassName,
  style,
  ...props
}) => {
  return (
    <LiquidContainer
      className={cn('w-full bg-transparent', className)}
      background={background}
      contentClassName={contentClassName}
      radius={radius}
      strength={optics?.strength ?? 0.26}
      curvature={optics?.curvature ?? 1.0}
      bend={optics?.bend ?? 0.95}
      bendWidth={optics?.bendWidth ?? 0.2}
      dispersion={optics?.dispersion ?? 0}
      specular={optics?.specular ?? 1.2}
      specularAngle={optics?.specularAngle ?? 50}
      frost={optics?.frost ?? 1.4}
      interactive={interactive}
      elasticity={elasticity}
      activationZone={activationZone}
      overlayClassName={overlayClassName}
      style={style}
      {...props}
    >
      {children}
    </LiquidContainer>
  );
};

export { Container as LiquidBox };
export default Container;
