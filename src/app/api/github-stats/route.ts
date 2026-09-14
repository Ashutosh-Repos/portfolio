import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export interface GitHubStatsData {
  user: {
    username: string;
    name: string;
    avatarUrl: string;
    profileUrl: string;
    followers: number;
    publicRepos: number;
  };
  impact: {
    stars: number;
    forks: number;
    followers: number;
  };
  activity: {
    totalCommits: number;
    mergedPRs: number;
    closedIssues: number;
    totalContributions: number;
  };
  streak: {
    currentStreak: number;
    longestStreak: number;
  };
  languages: Array<{
    name: string;
    percentage: number;
    color: string;
    count: number;
  }>;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572a5',
  Go: '#00add8',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  Java: '#b07219',
};

const DEFAULT_STATS: GitHubStatsData = {
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
    { name: 'TypeScript', percentage: 58, color: '#3178c6', count: 27 },
    { name: 'JavaScript', percentage: 22, color: '#f7df1e', count: 9 },
    { name: 'Python', percentage: 10, color: '#3572a5', count: 3 },
    { name: 'HTML / CSS', percentage: 5, color: '#e34c26', count: 2 },
    { name: 'Go', percentage: 3, color: '#00add8', count: 1 },
    { name: 'Shell', percentage: 2, color: '#89e051', count: 1 },
  ],
};

import { syncService } from '@/platform/integrations/sync.service';

const GITHUB_USERNAME = 'Ashutosh-Repos';

export async function GET() {
  // 1. Primary path: Fast local database snapshot (0ms latency, zero external rate limit)
  try {
    const snapshot = await syncService.getSnapshot<GitHubStatsData>(
      'github_overview',
    );
    if (snapshot.data) {
      return NextResponse.json(snapshot.data, {
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }
  } catch (err) {
    console.warn('[github-stats] Snapshot read error, falling back:', err);
  }

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Stats-Fetcher',
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  try {
    const stats: GitHubStatsData = JSON.parse(JSON.stringify(DEFAULT_STATS));

    // Helper fetch with timeout
    const fetchWithTimeout = async (
      url: string,
      customHeaders?: Record<string, string>,
    ) => {
      return fetch(url, {
        headers: { ...headers, ...customHeaders },
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 3600 },
      });
    };

    // Parallel fetch basic profile, repos, and direct GitHub contributions calendar
    const [userRes, reposRes, contribRes] = await Promise.allSettled([
      fetchWithTimeout(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetchWithTimeout(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      ),
      fetch(`https://github.com/users/${GITHUB_USERNAME}/contributions`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 3600 },
      }),
    ]);

    // Handle user profile
    if (userRes.status === 'fulfilled' && userRes.value.ok) {
      const userData = await userRes.value.json();
      stats.user.followers = userData.followers ?? stats.user.followers;
      stats.user.publicRepos = userData.public_repos ?? stats.user.publicRepos;
      stats.user.name = userData.name ?? stats.user.name;
      stats.user.avatarUrl = userData.avatar_url ?? stats.user.avatarUrl;
      stats.impact.followers = userData.followers ?? stats.impact.followers;
    }

    // Handle repositories (stars, forks, languages)
    if (reposRes.status === 'fulfilled' && reposRes.value.ok) {
      const repos = await reposRes.value.json();
      if (Array.isArray(repos)) {
        let totalStars = 0;
        let totalForks = 0;
        const langCounts: Record<string, number> = {};

        repos.forEach((repo) => {
          if (!repo.fork) {
            totalStars += repo.stargazers_count || 0;
            totalForks += repo.forks_count || 0;
          }
          if (repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
          }
        });

        stats.impact.stars = totalStars > 0 ? totalStars : stats.impact.stars;
        stats.impact.forks = totalForks;

        const totalLangRepos = Object.values(langCounts).reduce(
          (a, b) => a + b,
          0,
        );
        if (totalLangRepos > 0) {
          const sortedLangs = Object.entries(langCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([name, count]) => {
              const percentage = Math.round((count / totalLangRepos) * 100);
              return {
                name,
                percentage,
                color: LANGUAGE_COLORS[name] || '#8b949e',
                count,
              };
            });

          // Normalize percentage sum to 100%
          const sum = sortedLangs.reduce((acc, l) => acc + l.percentage, 0);
          if (sum !== 100 && sortedLangs.length > 0) {
            sortedLangs[0].percentage += 100 - sum;
          }

          if (sortedLangs.length > 0) {
            stats.languages = sortedLangs;
          }
        }
      }
    }

    // Handle authentic contributions count and streak directly from GitHub calendar
    if (contribRes.status === 'fulfilled' && contribRes.value.ok) {
      const contribHtml = await contribRes.value.text();
      const match = contribHtml.match(
        /([0-9,]+)\s+contributions\s+in\s+(the\s+last\s+year|[0-9]{4})/i,
      );
      if (match) {
        stats.activity.totalContributions = parseInt(
          match[1].replace(/,/g, ''),
          10,
        );
      }

      const dayRegex =
        /data-date=\"([0-9]{4}-[0-9]{2}-[0-9]{2})\"[^>]*data-level=\"([0-9]+)\"/g;
      const days: Array<{ date: string; level: number }> = [];
      let m;
      while ((m = dayRegex.exec(contribHtml)) !== null) {
        days.push({ date: m[1], level: parseInt(m[2], 10) });
      }
      days.sort((a, b) => a.date.localeCompare(b.date));

      if (days.length > 0) {
        let maxStreak = 0;
        let runningStreak = 0;
        for (const d of days) {
          if (d.level > 0) {
            runningStreak++;
            if (runningStreak > maxStreak) maxStreak = runningStreak;
          } else {
            runningStreak = 0;
          }
        }
        stats.streak.longestStreak = maxStreak;

        const rev = [...days].reverse();
        const todayActive = rev[0]?.level > 0;
        const yesterdayActive = rev[1]?.level > 0;
        if (todayActive || yesterdayActive) {
          let curr = 0;
          const startIndex = todayActive ? 0 : 1;
          for (let i = startIndex; i < rev.length; i++) {
            if (rev[i].level > 0) {
              curr++;
            } else {
              break;
            }
          }
          stats.streak.currentStreak = curr;
        } else {
          stats.streak.currentStreak = 0;
        }
      }
    }

    // Secondary search for PRs and Issues (guarded)
    const [prRes, issueRes, commitsRes] = await Promise.allSettled([
      fetchWithTimeout(
        `https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:pr+is:merged`,
      ),
      fetchWithTimeout(
        `https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:issue+is:closed`,
      ),
      fetchWithTimeout(
        `https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}`,
        { Accept: 'application/vnd.github.cloak-preview' },
      ),
    ]);

    if (prRes.status === 'fulfilled' && prRes.value.ok) {
      const prData = await prRes.value.json();
      if (typeof prData.total_count === 'number') {
        stats.activity.mergedPRs = prData.total_count;
      }
    }

    if (issueRes.status === 'fulfilled' && issueRes.value.ok) {
      const issueData = await issueRes.value.json();
      if (typeof issueData.total_count === 'number') {
        stats.activity.closedIssues = issueData.total_count;
      }
    }

    if (commitsRes.status === 'fulfilled' && commitsRes.value.ok) {
      const commitsData = await commitsRes.value.json();
      if (typeof commitsData.total_count === 'number') {
        stats.activity.totalCommits = commitsData.total_count;
      }
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in github-stats route:', error);
    return NextResponse.json(DEFAULT_STATS);
  }
}
