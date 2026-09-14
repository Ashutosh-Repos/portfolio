'use client';

import React, { useEffect, useState } from 'react';
import {
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  Flame,
  FolderGit2,
  Star,
  GitFork,
  Users,
  Activity,
  Code2,
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GitHubStatsData } from '@/app/api/github-stats/route';
import { Container } from './liquid/Container';
import { StatBubble } from './ui/stat-bubble';
import LinkPreview from './ui/link-preview';
import Link from 'next/link';
import { MAX_GLASS_OPTICS } from '@/lib/glass-config';

export const GITHUB_LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  Go: '#00add8',
  HTML: '#e34c26',
  'HTML / CSS': '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  Java: '#b07219',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Dart: '#00b4ab',
  Ruby: '#701516',
  PHP: '#4f5d95',
};

export const getLanguageColor = (
  name: string,
  fallbackColor?: string,
): string => {
  return GITHUB_LANGUAGE_COLORS[name] || fallbackColor || '#3178c6';
};

const INITIAL_STATS: GitHubStatsData = {
  user: {
    username: 'Ashutosh-Repos',
    name: 'Ashutosh',
    avatarUrl: 'https://avatars.githubusercontent.com/u/179326754?v=4',
    profileUrl: 'https://github.com/Ashutosh-Repos',
    followers: 1,
    publicRepos: 53,
  },
  impact: {
    stars: 7,
    forks: 0,
    followers: 1,
  },
  activity: {
    totalCommits: 482,
    mergedPRs: 15,
    closedIssues: 7,
    totalContributions: 377,
  },
  streak: {
    currentStreak: 0,
    longestStreak: 7,
  },
  languages: [
    { name: 'TypeScript', percentage: 64, color: '#3178c6', count: 27 },
    { name: 'JavaScript', percentage: 19, color: '#f1e05a', count: 8 },
    { name: 'Python', percentage: 7, color: '#3572a5', count: 3 },
    { name: 'HTML', percentage: 5, color: '#e34c26', count: 2 },
    { name: 'Go', percentage: 2, color: '#00add8', count: 1 },
    { name: 'Shell', percentage: 2, color: '#89e051', count: 1 },
  ],
};

export interface GithubStatsProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const GithubStats = ({
  isExpanded: isExpandedProp,
  onToggleExpand,
}: GithubStatsProps = {}) => {
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

  const [stats, setStats] = useState<GitHubStatsData>(INITIAL_STATS);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await fetch('/api/github-stats');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            setStats(data);
          }
        }
      } catch (err) {
        console.error('Failed to load GitHub stats:', err);
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-2 pb-3 flow-root w-full">
      {/* Header section with title */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-foreground">
          <span className="font-light text-md md:text-lg">GitHub</span>{' '}
          <span className="text-foreground/50 text-sm">Activity &</span>{' '}
          <span className="italic text-base font-light">Stats</span>
        </h2>
      </div>

      {/* Developer Impact & Reach Strip */}
      <div className="px-3 py-2.5 mb-3 flex flex-col">
        <div className="mb-4 flex flex-wrap items-center justify-between text-xs gap-3">
          <span className="flex items-center gap-1.5">
            <StatBubble
              image={{ src: stats.user.avatarUrl, alt: stats.user.name }}
              className="w-7 h-7 sm:w-8 sm:h-8 shrink-0"
            />
            <LinkPreview
              url={`https://github.com/${stats.user.username}`}
              dotted={true}
              dotGap={6}
              className="text-sm"
            >
              {stats.user.username}
            </LinkPreview>
          </span>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-foreground font-mono">
            <span
              className="flex items-center gap-1.5"
              title="Total Stars Earned"
            >
              <StatBubble
                icon={Star}
                color="bg-amber-400"
                className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
              />
              <span className="font-semibold">{stats.impact.stars}</span>
              <span className="text-muted-foreground text-[11px] font-sans">
                stars
              </span>
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="flex items-center gap-1.5" title="Followers">
              <StatBubble
                icon={Users}
                color="bg-sky-500"
                className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
              />
              <span className="font-semibold">
                {stats.impact.followers ?? stats.user.followers ?? 1}
              </span>
              <span className="text-muted-foreground text-[11px] font-sans">
                {(stats.impact.followers ?? stats.user.followers ?? 1) === 1
                  ? 'follower'
                  : 'followers'}
              </span>
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="flex items-center gap-1.5" title="Forks">
              <StatBubble
                icon={GitFork}
                color="bg-violet-500"
                className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
              />
              <span className="font-semibold">{stats.impact.forks}</span>
              <span className="text-muted-foreground text-[11px] font-sans">
                forks
              </span>
            </span>
          </div>
        </div>

        <div className="w-full flex gap-x-4 gap-y-2.5 flex-wrap px-1 sm:px-2 font-mono">
          <span className="text-foreground flex items-center">
            <StatBubble icon={Activity} color="bg-emerald-500" />
            <span className="text-xs">
              Contributions -{' '}
              <i className="text-foreground/50">
                {stats.activity.totalContributions}
              </i>
            </span>
          </span>
          <span className="text-foreground flex items-center">
            <StatBubble icon={GitCommit} color="bg-blue-500" />
            <span className="text-xs">
              Commits -{' '}
              <i className="text-foreground/50">
                {stats.activity.totalCommits}
              </i>
            </span>
          </span>
          <span className="text-foreground flex items-center">
            <StatBubble icon={GitPullRequest} color="bg-purple-500" />
            <span className="text-xs">
              PRs Merged -{' '}
              <i className="text-foreground/50">{stats.activity.mergedPRs}</i>
            </span>
          </span>
          <span className="text-foreground flex items-center">
            <StatBubble icon={CheckCircle2} color="bg-green-500" />
            <span className="text-xs">
              Issues Closed -{' '}
              <i className="text-foreground/50">
                {stats.activity.closedIssues}
              </i>
            </span>
          </span>
          <span className="text-foreground flex items-center">
            <StatBubble icon={FolderGit2} color="bg-amber-500" />
            <span className="text-xs">
              Public Repositories -{' '}
              <i className="text-foreground/50">{stats.user.publicRepos}</i>
            </span>
          </span>
          <span className="text-foreground flex items-center">
            <StatBubble icon={Flame} color="bg-orange-500" />
            <span className="text-xs">
              Longest Streak -{' '}
              <i className="text-foreground/50">
                {stats.streak.longestStreak} days
              </i>
            </span>
          </span>
          <span className="text-foreground flex items-center">
            <StatBubble icon={Flame} color="bg-rose-500" />
            <span className="text-xs">
              Current Streak -{' '}
              <i className="text-foreground/50">
                {stats.streak.currentStreak} days
              </i>
            </span>
          </span>
        </div>
      </div>

      {/* Collapsible Section: Languages & Heatmap */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="github-charts"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {/* Category 3: Skillset & Language Breakdown */}
            <Container
              className="p-3.5 mb-3 rounded-2xl bg-neutral-50/10 dark:bg-white/4 transition-all duration-300 shadow-none"
              radius={20}
              interactive={true}
              elasticity={0.15}
              activationZone={220}
              optics={MAX_GLASS_OPTICS}
              overlayClassName="pointer-events-none border-0 shadow-none ring-0"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <StatBubble
                    icon={Code2}
                    color="bg-blue-500"
                    className="w-5 h-5 shrink-0"
                  />
                  <span>Most Used Languages</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {stats.languages[0]?.name} {stats.languages[0]?.percentage}%
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full overflow-hidden flex gap-0.5 bg-neutral-200/80 dark:bg-neutral-800/80 p-0.5 mb-3">
                {stats.languages.map((lang) => {
                  const color = getLanguageColor(lang.name, lang.color);
                  return (
                    <div
                      key={lang.name}
                      className="h-full rounded-xs transition-all duration-500 hover:brightness-110"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: color,
                      }}
                      title={`${lang.name}: ${lang.percentage}%`}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
                {stats.languages.map((lang) => {
                  const color = getLanguageColor(lang.name, lang.color);
                  return (
                    <div
                      key={lang.name}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-foreground/90 font-medium">
                        {lang.name}
                      </span>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {lang.percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </Container>

            {/* Heatmap Contribution Graph Card */}
            <Container
              className="p-3.5 mb-3 rounded-2xl bg-neutral-50/10 dark:bg-white/4 transition-all duration-300 shadow-none overflow-hidden"
              radius={20}
              interactive={true}
              elasticity={0.15}
              activationZone={220}
              optics={MAX_GLASS_OPTICS}
              overlayClassName="pointer-events-none border-0 shadow-none ring-0"
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <span>Contribution Graph</span>
                </span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                  <span>Less</span>
                  <div className="w-2 h-2 rounded-xs bg-green-200 dark:bg-green-950" />
                  <div className="w-2 h-2 rounded-xs bg-green-400 dark:bg-green-700" />
                  <div className="w-2 h-2 rounded-xs bg-green-500 dark:bg-green-500" />
                  <div className="w-2 h-2 rounded-xs bg-green-700 dark:bg-green-400" />
                  <span>More</span>
                </div>
              </div>

              <Link
                href={stats.user.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative w-full h-32 sm:h-36 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/50 transition-all duration-200 p-2.5 overflow-hidden"
                title="View full contribution history on GitHub"
              >
                <div className="w-full h-full relative">
                  <Image
                    src={`https://ghchart.rshah.org/03C851/${stats.user.username}`}
                    alt="GitHub Contributions Heatmap"
                    fill
                    unoptimized
                    className="object-contain object-center transition-transform duration-300 group-hover:scale-[1.02] dark:invert dark:hue-rotate-180 dark:brightness-90"
                  />
                </div>
              </Link>
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

// Export as GithubHeatMap for backwards compatibility
export const GithubHeatMap = GithubStats;
export default GithubStats;
