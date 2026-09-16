'use client';

import React from 'react';
import { Container } from '@/components/liquid/Container';
import { SkillIcon } from './SkillIcon';
import { SKILL_COLOR_MAP } from './skill-assets';
import { cn } from '@/lib/utils';
import type { SkillDto } from '@/platform/modules/skills/skills.service';

export interface SkillBubbleProps {
  skill: SkillDto;
  className?: string;
  showLabel?: boolean;
}

/**
 * SkillBubble — Renders a liquid glass bubble for a skill with fluid displacement,
 * custom brand tinting, and bulletproof 3-tier icon/SVG/monogram fallbacks.
 */
export const SkillBubble: React.FC<SkillBubbleProps> = ({
  skill,
  className,
  showLabel = true,
}) => {
  const key = (skill.iconSlug || skill.slug || '').toLowerCase();
  const colorClass = SKILL_COLOR_MAP[key] || SKILL_COLOR_MAP.default;

  return (
    <span
      className={cn(
        'group flex flex-col items-center justify-center gap-1.5 select-none',
        className,
      )}
    >
      <Container
        className={cn(
          'transition-all duration-300 w-12 h-12 cursor-pointer shadow-sm hover:shadow-md hover:scale-105 active:scale-95',
          colorClass,
        )}
        radius={9999}
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
        elasticity={0.7}
        aria-label={skill.name}
      >
        <SkillIcon
          name={skill.name}
          slug={skill.slug}
          iconSlug={skill.iconSlug}
          category={skill.category}
          size={48}
        />
      </Container>
      {showLabel && (
        <span
          title={skill.name}
          className="text-xs sm:text-sm text-foreground/60 group-hover:text-foreground transition-colors text-center font-normal truncate max-w-[84px]"
        >
          {skill.name.split(' (')[0]}
        </span>
      )}
    </span>
  );
};

export default SkillBubble;
