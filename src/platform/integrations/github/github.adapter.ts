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
}

export class GitHubAdapter implements ExternalProvider<RawGitHubPayload, GitHubNormalizedData> {
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

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers,
        signal: AbortSignal.timeout(6000),
      }),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        {
          headers,
          signal: AbortSignal.timeout(6000),
        }
      ),
    ]);

    if (!userRes.ok) {
      throw new Error(`GitHub API user fetch failed: ${userRes.status}`);
    }

    const userData = await userRes.json();
    const reposData = reposRes.ok ? await reposRes.json() : [];

    return { user: userData, repos: reposData };
  }

  normalize(raw: RawGitHubPayload): GitHubNormalizedData {
    const user = raw?.user || {};
    const repos = Array.isArray(raw?.repos) ? raw.repos : [];

    let totalStars = 0;
    let totalForks = 0;
    const languageCounts: Record<string, number> = {};

    const normalizedRepos = repos.map((repo: RawGitHubRepo) => {
      const stars = repo.stargazers_count || 0;
      const forks = repo.forks_count || 0;
      totalStars += stars;
      totalForks += forks;

      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }

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
        latestCommitAt: repo.pushed_at ? new Date(repo.pushed_at).getTime() : null,
        isPinned: false,
        repoUrl: repo.html_url || `https://github.com/${user.login}/${repo.name}`,
        homepageUrl: repo.homepage || null,
        topics: Array.isArray(repo.topics) ? repo.topics : [],
      };
    });

    const totalLangInstances = Object.values(languageCounts).reduce((a, b) => a + b, 0) || 1;
    const languages = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalLangInstances) * 100),
        color: '#3b82f6',
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      user: {
        username: user.login || 'Ashutosh-Repos',
        name: user.name || 'Ashutosh',
        avatarUrl: user.avatar_url || '',
        profileUrl: user.html_url || `https://github.com/${user.login || 'Ashutosh-Repos'}`,
        followers: user.followers || 0,
        publicRepos: user.public_repos || repos.length,
      },
      impact: {
        stars: totalStars,
        forks: totalForks,
      },
      activity: {
        totalCommits: 250,
        mergedPRs: 15,
        closedIssues: 8,
        totalContributions: 320,
      },
      streak: {
        currentStreak: 12,
        longestStreak: 45,
      },
      languages,
      repositories: normalizedRepos,
    };
  }
}

export const githubAdapter = new GitHubAdapter();
