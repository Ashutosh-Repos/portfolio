'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from './liquid/Container';
import { GithubStats } from './stats';
import { LeetCodeStats } from './leetcode';
import { GLASS_OPTICS } from '@/lib/glass-config';

export const DeveloperStats = () => {
  const [isGithubExpanded, setIsGithubExpanded] = useState(false);
  const [isLeetCodeExpanded, setIsLeetCodeExpanded] = useState(false);

  const bothCollapsed = !isGithubExpanded && !isLeetCodeExpanded;

  return (
    <div className="w-full grid grid-cols-1 min-[890px]:grid-cols-2 gap-6 items-start">
      {/* GitHub Stats Card */}
      <motion.div
        layout
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={
          bothCollapsed
            ? 'col-span-1 min-[890px]:col-span-1 w-full'
            : 'col-span-1 min-[890px]:col-span-2 w-full'
        }
      >
        <Container
          className={`rounded-[32px] transition-all duration-300 w-full ${
            bothCollapsed ? 'p-4 sm:p-5' : 'p-6 sm:p-7'
          }`}
          radius={36}
          optics={GLASS_OPTICS}
        >
          <GithubStats
            isExpanded={isGithubExpanded}
            onToggleExpand={() => setIsGithubExpanded((prev) => !prev)}
          />
        </Container>
      </motion.div>

      {/* LeetCode Stats Card */}
      <motion.div
        layout
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={
          bothCollapsed
            ? 'col-span-1 min-[890px]:col-span-1 w-full'
            : 'col-span-1 min-[890px]:col-span-2 w-full'
        }
      >
        <Container
          className={`rounded-[32px] transition-all duration-300 w-full ${
            bothCollapsed ? 'p-4 sm:p-5' : 'p-6 sm:p-7'
          }`}
          radius={36}
          optics={GLASS_OPTICS}
        >
          <LeetCodeStats
            isExpanded={isLeetCodeExpanded}
            onToggleExpand={() => setIsLeetCodeExpanded((prev) => !prev)}
          />
        </Container>
      </motion.div>
    </div>
  );
};

export default DeveloperStats;
