'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Trophy,
  Target,
  Flame,
  Calendar,
  Code2,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeetCodeStatsData } from '@/app/api/leetcode-stats/route';
import { Container } from './liquid/Container';
import { StatBubble } from './ui/stat-bubble';
import LinkPreview from './ui/link-preview';
import { MAX_GLASS_OPTICS } from '@/lib/glass-config';

const INITIAL_LEETCODE_STATS: LeetCodeStatsData = {
  user: {
    username: 'ashutosh0406',
    profileUrl: 'https://leetcode.com/u/ashutosh0406/',
    ranking: 1052423,
    avatarUrl:
      'https://assets.leetcode.com/users/ashutosh0406/avatar_1783796482.png',
  },
  solved: {
    all: 164,
    easy: 47,
    medium: 97,
    hard: 20,
  },
  totalQuestions: {
    all: 4047,
    easy: 963,
    medium: 2111,
    hard: 973,
  },
  accuracy: {
    acceptanceRate: 81.2,
    totalSubmissions: 266,
    acceptedSubmissions: 216,
  },
  consistency: {
    streak: 7,
    totalActiveDays: 49,
  },
  topTags: [
    { name: 'Array', solved: 97 },
    { name: 'String', solved: 34 },
    { name: 'Hash Table', solved: 32 },
    { name: 'Two Pointers', solved: 30 },
    { name: 'Math', solved: 28 },
    { name: 'Sorting', solved: 25 },
    { name: 'Binary Search', solved: 22 },
    { name: 'Dynamic Programming', solved: 20 },
    { name: 'Linked List', solved: 15 },
    { name: 'Tree', solved: 12 },
    { name: 'Greedy', solved: 12 },
    { name: 'DFS', solved: 11 },
  ],
};

export interface LeetCodeStatsProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const LeetCodeStats = ({
  isExpanded: isExpandedProp,
  onToggleExpand,
}: LeetCodeStatsProps = {}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded =
    isExpandedProp !== undefined ? isExpandedProp : internalExpanded;

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  const [stats, setStats] = useState<LeetCodeStatsData>(INITIAL_LEETCODE_STATS);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await fetch('/api/leetcode-stats');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            setStats(data);
          }
        }
      } catch (err) {
        console.error('Failed to load LeetCode stats:', err);
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const { easyPct, medPct, hardPct } = useMemo(() => {
    const total = stats.solved.all || 1;
    const easy = Math.round((stats.solved.easy / total) * 100);
    const med = Math.round((stats.solved.medium / total) * 100);
    const hard = Math.max(0, 100 - (easy + med));
    return { easyPct: easy, medPct: med, hardPct: hard };
  }, [stats.solved]);

  return (
    <div className="p-2 pb-3 flow-root w-full">
      {/* Header section with title */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-foreground">
          <span className="font-light text-md md:text-lg">LeetCode</span>{' '}
          <span className="text-foreground/50 text-sm">Activity &</span>{' '}
          <span className="italic text-base font-light">Stats</span>
        </h2>
      </div>

      {/* Developer Impact & Reach Strip */}
      <div className="px-3 py-2.5 mb-3 flex flex-col">
        <div className="mb-4 flex flex-wrap items-center justify-between text-xs gap-3">
          <span className="flex items-center gap-1.5">
            <StatBubble
              image={{ src: stats.user.avatarUrl, alt: stats.user.username }}
              className="w-7 h-7 sm:w-8 sm:h-8 shrink-0"
            />
            <LinkPreview
              url={stats.user.profileUrl}
              dotted={true}
              dotGap={6}
              className="text-sm"
            >
              {stats.user.username}
            </LinkPreview>
          </span>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-foreground font-mono">
            <span className="flex items-center gap-1.5" title="Global Ranking">
              <StatBubble
                icon={Trophy}
                color="bg-amber-400"
                className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
              />
              <span className="font-semibold">
                {(stats.user.ranking / 1000000).toFixed(2)}M
              </span>
              <span className="text-muted-foreground text-[11px] font-sans">
                rank
              </span>
            </span>

            <span className="hidden min-[420px]:inline-block w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0" />

            <span className="flex items-center gap-1.5" title="Acceptance Rate">
              <StatBubble
                icon={Target}
                color="bg-emerald-500"
                className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
              />
              <span className="font-semibold">
                {stats.accuracy.acceptanceRate}%
              </span>
              <span className="text-muted-foreground text-[11px] font-sans">
                accuracy
              </span>
            </span>

            <span className="hidden min-[420px]:inline-block w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0" />

            <span className="flex items-center gap-1.5" title="Streak">
              <StatBubble
                icon={Flame}
                color="bg-orange-500"
                className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
              />
              <span className="font-semibold">{stats.consistency.streak}d</span>
              <span className="text-muted-foreground text-[11px] font-sans">
                streak
              </span>
            </span>
          </div>
        </div>

        <div className="w-full flex gap-x-4 gap-y-2.5 flex-wrap px-1 sm:px-2 font-mono">
          <span className="text-foreground flex items-center">
            <StatBubble icon={Code2} color="bg-amber-500" />
            <span className="text-xs">
              Solved - <i className="text-foreground/50">{stats.solved.all}</i>
            </span>
          </span>
          <span className="text-foreground flex items-center">
            <StatBubble icon={Target} color="bg-blue-500" />
            <span className="text-xs">
              Submissions -{' '}
              <i className="text-foreground/50">
                {stats.accuracy.totalSubmissions}
              </i>
            </span>
          </span>
          <span className="text-foreground flex items-center">
            <StatBubble icon={CheckCircle2} color="bg-green-500" />
            <span className="text-xs">
              Accepted -{' '}
              <i className="text-foreground/50">
                {stats.accuracy.acceptedSubmissions}
              </i>
            </span>
          </span>
          <span className="text-foreground flex items-center">
            <StatBubble icon={Calendar} color="bg-purple-500" />
            <span className="text-xs">
              Active Days -{' '}
              <i className="text-foreground/50">
                {stats.consistency.totalActiveDays}
              </i>
            </span>
          </span>
        </div>
      </div>

      {/* Collapsible Section: Difficulty Breakdown & Categories */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="leetcode-charts"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {/* Category: Difficulty Breakdown */}
            <Container
              className="p-3.5 mb-3 rounded-2xl bg-neutral-50/10 dark:bg-white/4 transition-all duration-300 shadow-none overflow-hidden"
              radius={20}
              interactive={true}
              elasticity={0.15}
              activationZone={220}
              optics={MAX_GLASS_OPTICS}
              overlayClassName="pointer-events-none border-0 shadow-none ring-0"
            >
              <div className="flex items-center justify-between mb-2.5 flex-wrap gap-1.5">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <StatBubble
                    icon={Layers}
                    color="bg-amber-500"
                    className="w-5 h-5 shrink-0"
                  />
                  <span>Difficulty Breakdown</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {stats.solved.medium} Mediums ({medPct}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2.5 w-full rounded-full overflow-hidden flex gap-0.5 bg-neutral-200/80 dark:bg-neutral-800/80 p-0.5 mb-3">
                <div
                  className="h-full rounded-xs bg-emerald-500 transition-all duration-500 hover:brightness-110"
                  style={{ width: `${easyPct}%` }}
                  title={`Easy: ${stats.solved.easy} (${easyPct}%)`}
                />
                <div
                  className="h-full rounded-xs bg-amber-500 transition-all duration-500 hover:brightness-110"
                  style={{ width: `${medPct}%` }}
                  title={`Medium: ${stats.solved.medium} (${medPct}%)`}
                />
                <div
                  className="h-full rounded-xs bg-rose-500 transition-all duration-500 hover:brightness-110"
                  style={{ width: `${hardPct}%` }}
                  title={`Hard: ${stats.solved.hard} (${hardPct}%)`}
                />
              </div>

              {/* Difficulty Counts without any truncation */}
              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-emerald-500" />
                  <span className="text-foreground/90 font-medium">Easy</span>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {stats.solved.easy} ({easyPct}%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-amber-500" />
                  <span className="text-foreground/90 font-medium">Medium</span>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {stats.solved.medium} ({medPct}%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-rose-500" />
                  <span className="text-foreground/90 font-medium">Hard</span>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {stats.solved.hard} ({hardPct}%)
                  </span>
                </div>
              </div>
            </Container>

            {/* Category: Top Solved Categories */}
            <Container
              className="p-3.5 mb-3 rounded-2xl bg-neutral-50/10 dark:bg-white/4 transition-all duration-300 shadow-none overflow-hidden"
              radius={20}
              interactive={true}
              elasticity={0.15}
              activationZone={220}
              optics={MAX_GLASS_OPTICS}
              overlayClassName="pointer-events-none border-0 shadow-none ring-0"
            >
              <div className="flex items-center justify-between mb-2.5 flex-wrap gap-1.5">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <StatBubble
                    icon={Sparkles}
                    color="bg-amber-400"
                    className="w-5 h-5 shrink-0"
                  />
                  <span>Top Solved Categories</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {stats.topTags.length} topics
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {stats.topTags.map((tag) => (
                  <div
                    key={tag.name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-50/50 dark:bg-neutral-900/50 transition-all duration-200 text-xs text-foreground/80 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <span>{tag.name}</span>
                    <span className="text-[10px] font-mono px-1 py-0.5 rounded-xs bg-neutral-200/60 dark:bg-neutral-700/60 text-foreground font-medium shrink-0">
                      {tag.solved}
                    </span>
                  </div>
                ))}
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger at last */}
      <div className="flex items-center gap-4 text-xs font-mono pt-2 px-1 sm:px-2">
        <button
          type="button"
          onClick={handleToggle}
          className="text-xs text-foreground/50 hover:text-foreground transition-colors cursor-pointer text-left bg-transparent p-0 border-none inline-block font-normal font-mono"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'collapse ...' : 'know more ...'}
        </button>
      </div>
    </div>
  );
};

export default LeetCodeStats;
