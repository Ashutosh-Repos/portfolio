'use client';

import React, { useState, useMemo } from 'react';
import { SkillBubble } from './SkillBubble';
import type { SkillDto } from '@/platform/modules/skills/skills.service';
import { cn } from '@/lib/utils';

export interface SkillsShowcaseProps {
  skills: SkillDto[];
  className?: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  all: 'All',
  languages: 'Languages',
  frameworks: 'Frontend & UI',
  networking: 'Networking',
  databases: 'Databases',
  cloud_infra: 'Cloud & Infra',
  tools: 'Tools',
  ai_ml: 'AI / ML',
};

export const SkillsShowcase: React.FC<SkillsShowcaseProps> = ({
  skills,
  className,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Discover available categories in current dataset
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    skills.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return ['all', ...Array.from(cats)];
  }, [skills]);

  // Filter skills
  const filteredSkills = useMemo(() => {
    if (activeCategory === 'all') return skills;
    return skills.filter((s) => s.category === activeCategory);
  }, [skills, activeCategory]);

  return (
    <div className={cn('w-full flex flex-col gap-5', className)}>
      {/* Category Filter Pills */}
      {availableCategories.length > 1 && (
        <div className="flex flex-wrap gap-2 pt-1 pb-1">
          {availableCategories.map((catKey) => {
            const isActive = activeCategory === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setActiveCategory(catKey)}
                className={cn(
                  'px-3 py-1 text-xs font-mono rounded-full transition-all cursor-pointer border',
                  isActive
                    ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                    : 'bg-foreground/[0.03] text-foreground/60 border-black/5 dark:border-white/5 hover:text-foreground hover:bg-foreground/[0.06]',
                )}
              >
                {CATEGORY_NAMES[catKey] || catKey}
              </button>
            );
          })}
        </div>
      )}

      {/* Bubbles Grid */}
      <div className="w-full flex flex-wrap gap-5 sm:gap-6 items-start py-2">
        {filteredSkills.map((skill) => (
          <SkillBubble key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  );
};

export default SkillsShowcase;
