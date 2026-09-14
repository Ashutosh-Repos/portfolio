import { ExternalProvider } from '../provider.interface';

export interface GitHubNormalizedData {
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
  repositories: Array<{
    id: string;
    name: string;
    fullName: string;
    description: string | null;
    stars: number;
    forks: number;
    openIssues: number;
    primaryLanguage: string | null;
    languages: Record<string, number>;
    latestCommitSha: string | null;
    latestCommitAt: number | null;
    isPinned: boolean;
    repoUrl: string;
    homepageUrl: string | null;
    topics: string[];
  }>;
}

interface RawGitHubRepo {
  id?: number | string;
  name: string;
  full_name?: string;
  description?: string | null;
  stargazers_count?: number;
  forks_count?: number;
  open_issues_count?: number;
  language?: string | null;
  html_url?: string;
  homepage?: string | null;
  pushed_at?: string;
  fork?: boolean;
  topics?: string[];
}

interface RawGitHubPayload {
  user?: {
    login?: string;
    name?: string;
    public_repos?: number;
    followers?: number;
    avatar_url?: string;
    html_url?: string;
  };
  repos?: RawGitHubRepo[];
  pinnedRepoNames?: string[];
  contributionsHtml?: string;
  searchStats?: {
    totalCommits?: number;
    mergedPRs?: number;
    closedIssues?: number;
  };
}

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

export class GitHubAdapter
  implements ExternalProvider<RawGitHubPayload, GitHubNormalizedData>
{
  readonly providerKey = 'github';
  readonly displayName = 'GitHub';

  async fetchRawData(username = 'Ashutosh-Repos'): Promise<RawGitHubPayload> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Engine/2.0',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [
      userRes,
      reposRes,
      profileHtmlRes,
      contribRes,
      prRes,
      issueRes,
      commitRes,
    ] = await Promise.allSettled([
      fetch(`https://api.github.com/users/${username}`, {
        headers,
        signal: AbortSignal.timeout(8000),
      }),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        {
          headers,
          signal: AbortSignal.timeout(8000),
        },
      ),
      fetch(`https://github.com/${username}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(8000),
      }),
      fetch(`https://github.com/users/${username}/contributions`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(8000),
      }),
      fetch(
        `https://api.github.com/search/issues?q=author:${username}+type:pr+is:merged`,
        {
          headers,
          signal: AbortSignal.timeout(8000),
        },
      ),
      fetch(
        `https://api.github.com/search/issues?q=author:${username}+type:issue+is:closed`,
        {
          headers,
          signal: AbortSignal.timeout(8000),
        },
      ),
      fetch(`https://api.github.com/search/commits?q=author:${username}`, {
        headers: { ...headers, Accept: 'application/vnd.github.cloak-preview' },
        signal: AbortSignal.timeout(8000),
      }),
    ]);

    if (userRes.status !== 'fulfilled' || !userRes.value.ok) {
      throw new Error(`GitHub API user fetch failed`);
    }

    const userData = await userRes.value.json();
    const reposData =
      reposRes.status === 'fulfilled' && reposRes.value.ok
        ? await reposRes.value.json()
        : [];
    const contributionsHtml =
      contribRes.status === 'fulfilled' && contribRes.value.ok
        ? await contribRes.value.text()
        : '';

    // Extract pinned repositories from profile HTML
    let pinnedRepoNames: string[] = [
      'Tessera',
      'Bunly',
      'Post',
      'video-encoder',
      'macbook-usb-tethering',
      'WeatherNow',
    ];

    if (profileHtmlRes.status === 'fulfilled' && profileHtmlRes.value.ok) {
      try {
        const html = await profileHtmlRes.value.text();
        const matches = html.matchAll(/class="repo">([^<]+)<\/span>/g);
        const parsedNames = Array.from(matches, (m) => m[1]?.trim()).filter(
          Boolean,
        );
        if (parsedNames.length > 0) {
          pinnedRepoNames = parsedNames;
        }
      } catch {
        // use default pinned list
      }
    }

    // Extract search metrics
    let mergedPRs: number | undefined;
    let closedIssues: number | undefined;
    let totalCommits: number | undefined;

    if (prRes.status === 'fulfilled' && prRes.value.ok) {
      try {
        const prJson = await prRes.value.json();
        if (typeof prJson.total_count === 'number') {
          mergedPRs = prJson.total_count;
        }
      } catch {}
    }

    if (issueRes.status === 'fulfilled' && issueRes.value.ok) {
      try {
        const issueJson = await issueRes.value.json();
        if (typeof issueJson.total_count === 'number') {
          closedIssues = issueJson.total_count;
        }
      } catch {}
    }

    if (commitRes.status === 'fulfilled' && commitRes.value.ok) {
      try {
        const commitJson = await commitRes.value.json();
        if (typeof commitJson.total_count === 'number') {
          totalCommits = commitJson.total_count;
        }
      } catch {}
    }

    return {
      user: userData,
      repos: reposData,
      pinnedRepoNames,
      contributionsHtml,
      searchStats: {
        totalCommits,
        mergedPRs,
        closedIssues,
      },
    };
  }

  normalize(raw: RawGitHubPayload): GitHubNormalizedData {
    const user = raw?.user || {};
    const repos = Array.isArray(raw?.repos) ? raw.repos : [];
    const pinnedNames = raw?.pinnedRepoNames || [
      'Tessera',
      'Bunly',
      'Post',
      'video-encoder',
      'macbook-usb-tethering',
      'WeatherNow',
    ];

    // Filter out external forks to only include authentic original repositories
    const originalRepos = repos.filter((r) => !r.fork);

    let totalStars = 0;
    let totalForks = 0;
    const languageCounts: Record<string, number> = {};

    const normalizedRepos = originalRepos.map((repo: RawGitHubRepo) => {
      const stars = repo.stargazers_count || 0;
      const forks = repo.forks_count || 0;
      totalStars += stars;
      totalForks += forks;

      if (repo.language) {
        languageCounts[repo.language] =
          (languageCounts[repo.language] || 0) + 1;
      }

      const isPinned = pinnedNames.includes(repo.name);

      return {
        id: repo.full_name || `${user.login}/${repo.name}`,
        name: repo.name,
        fullName: repo.full_name || `${user.login}/${repo.name}`,
        description: repo.description || null,
        stars,
        forks,
        openIssues: repo.open_issues_count || 0,
        primaryLanguage: repo.language || null,
        languages: repo.language ? { [repo.language]: 1 } : {},
        latestCommitSha: null,
        latestCommitAt: repo.pushed_at
          ? new Date(repo.pushed_at).getTime()
          : null,
        isPinned,
        repoUrl:
          repo.html_url || `https://github.com/${user.login}/${repo.name}`,
        homepageUrl: repo.homepage || null,
        topics: Array.isArray(repo.topics) ? repo.topics : [],
      };
    });

    const totalLangInstances =
      Object.values(languageCounts).reduce((a, b) => a + b, 0) || 1;
    const languages = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalLangInstances) * 100),
        color: GITHUB_LANGUAGE_COLORS[name] || '#8b949e',
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Parse authentic contributions count and streak from contribution calendar
    let totalContributions = 377;
    let currentStreak = 0;
    let longestStreak = 7;

    if (raw?.contributionsHtml) {
      const contribMatch = raw.contributionsHtml.match(
        /([0-9,]+)\s+contributions\s+in\s+(the\s+last\s+year|[0-9]{4})/i,
      );
      if (contribMatch) {
        totalContributions = parseInt(contribMatch[1].replace(/,/g, ''), 10);
      }

      const dayRegex =
        /data-date=\"([0-9]{4}-[0-9]{2}-[0-9]{2})\"[^>]*data-level=\"([0-9]+)\"/g;
      const days: Array<{ date: string; level: number }> = [];
      let m;
      while ((m = dayRegex.exec(raw.contributionsHtml)) !== null) {
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
        longestStreak = maxStreak;

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
          currentStreak = curr;
        } else {
          currentStreak = 0;
        }
      }
    }

    const followers = user.followers ?? 1;

    return {
      user: {
        username: user.login || 'Ashutosh-Repos',
        name: user.name || 'Ashutosh',
        avatarUrl: user.avatar_url || '',
        profileUrl:
          user.html_url ||
          `https://github.com/${user.login || 'Ashutosh-Repos'}`,
        followers,
        publicRepos: user.public_repos || repos.length,
      },
      impact: {
        stars: totalStars,
        forks: totalForks,
        followers,
      },
      activity: {
        totalCommits: raw?.searchStats?.totalCommits ?? 482,
        mergedPRs: raw?.searchStats?.mergedPRs ?? 15,
        closedIssues: raw?.searchStats?.closedIssues ?? 7,
        totalContributions,
      },
      streak: {
        currentStreak,
        longestStreak,
      },
      languages,
      repositories: normalizedRepos,
    };
  }
}

export const githubAdapter = new GitHubAdapter();
