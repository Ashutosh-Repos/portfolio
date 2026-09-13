export interface ProjectItem {
  name: string;
  description: string;
  stars: number;
  forks: number;
  url: string;
  language?: string;
  isPinned?: boolean;
}

const GITHUB_USERNAME = 'Ashutosh-Repos';

/** Curated descriptions for Ashutosh's original projects (used when GitHub repo description is empty) */
const REPO_DESCRIPTIONS: Record<string, string> = {
  Tessera:
    'Multi-Region Distributed Video Transcoding & HLS/DASH Packaging Engine in Go (Consistent Hash Ring, S3 Ingress, NATS, Redis Sharding)',
  Chatify:
    'Realtime chat platform using WebSockets, Next.js, Prisma, PostgreSQL, & Zustand',
  Bunly:
    'High-performance, feature-rich Video-On-Demand (VOD) streaming platform',
  'video-encoder':
    'Multithreaded video processing engine with Next.js, FFmpeg & HLS streaming',
  ShellGreets:
    'Smart, motivational greeting theme for terminal with dynamic day progress bar',
  Post: 'Minimalist social media platform built for sharing thoughts and updates',
  'Finance-Dashboard-UI':
    'Modern financial analytics dashboard UI with data visualization',
  'macbook-usb-tethering':
    'USB tethering driver & kernel extension utility for macOS',
  WeatherNow:
    'Real-time weather forecast and interactive conditions dashboard',
  VidtubeBackend:
    'Scalable video platform backend architecture with Node.js & MongoDB',
  'hls-server':
    'Lightweight HTTP Live Streaming (HLS) server for video distribution',
};

/** Default fallback projects (100% original, zero forks) */
export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    name: 'Tessera',
    description: REPO_DESCRIPTIONS['Tessera'],
    stars: 1,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/Tessera',
    language: 'Go',
    isPinned: true,
  },
  {
    name: 'Chatify',
    description: REPO_DESCRIPTIONS['Chatify'],
    stars: 1,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/Chatify',
    language: 'TypeScript',
    isPinned: false,
  },
  {
    name: 'Bunly',
    description: REPO_DESCRIPTIONS['Bunly'],
    stars: 0,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/Bunly',
    language: 'TypeScript',
    isPinned: true,
  },
  {
    name: 'video-encoder',
    description: REPO_DESCRIPTIONS['video-encoder'],
    stars: 0,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/video-encoder',
    language: 'TypeScript',
    isPinned: true,
  },
  {
    name: 'ShellGreets',
    description: REPO_DESCRIPTIONS['ShellGreets'],
    stars: 0,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/ShellGreets',
    language: 'Shell',
    isPinned: false,
  },
  {
    name: 'Post',
    description: REPO_DESCRIPTIONS['Post'],
    stars: 0,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/Post',
    language: 'TypeScript',
    isPinned: true,
  },
  {
    name: 'Finance-Dashboard-UI',
    description: REPO_DESCRIPTIONS['Finance-Dashboard-UI'],
    stars: 1,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/Finance-Dashboard-UI',
    language: 'TypeScript',
    isPinned: false,
  },
  {
    name: 'macbook-usb-tethering',
    description: REPO_DESCRIPTIONS['macbook-usb-tethering'],
    stars: 0,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/macbook-usb-tethering',
    language: 'C',
    isPinned: true,
  },
];

/** Fetch dynamic public pinned & original projects from GitHub */
import { projectService } from '@/platform/modules/project/project.service';

export async function getPublicProjects(limit = 8): Promise<ProjectItem[]> {
  // 1. Primary path: Fast local database projects (0ms latency, enriched case studies)
  try {
    const dbProjects = await projectService.getProjects({ limit });
    if (dbProjects.length > 0) {
      return dbProjects.map((p) => ({
        name: p.title,
        description: p.description,
        stars: p.github?.stars ?? (DEFAULT_PROJECTS.find(dp => dp.name.toLowerCase() === p.title.toLowerCase())?.stars ?? 1),
        forks: p.github?.forks ?? 0,
        url: p.demoUrl || p.github?.repoUrl || `https://github.com/${GITHUB_USERNAME}/${p.slug}`,
        language: p.technologies[0] || p.github?.primaryLanguage || 'TypeScript',
        isPinned: p.featuredPriority !== null,
      }));
    }
  } catch {
    // Fallback to GitHub API / static defaults
  }

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Projects-Fetcher',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch pinned repo names from GitHub profile HTML
    let pinnedNames: string[] = [];
    try {
      const profileRes = await fetch(
        `https://github.com/${GITHUB_USERNAME}`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          signal: AbortSignal.timeout(3500),
          next: { revalidate: 3600 },
        },
      );
      if (profileRes.ok) {
        const html = await profileRes.text();
        const matches = html.matchAll(
          new RegExp(`href="/${GITHUB_USERNAME}/([^/"]+)"[^>]*class="[^"]*repo[^"]*"`, 'g'),
        );
        pinnedNames = Array.from(matches, (m) => m[1]);
        if (pinnedNames.length === 0) {
          // Fallback regex for pinned list
          const pinnedBlocks = html.match(
            /class="[^"]*pinned-item-list-item[^"]*"[\s\S]*?<\/li>/g,
          );
          if (pinnedBlocks) {
            pinnedNames = pinnedBlocks
              .map((b) => {
                const m = b.match(new RegExp(`href="/${GITHUB_USERNAME}/([^/"]+)"`));
                return m ? m[1] : '';
              })
              .filter(Boolean);
          }
        }
      }
    } catch {
      // Pinned fetch fallback to default pinned list
      pinnedNames = ['Tessera', 'Bunly', 'Post', 'video-encoder', 'macbook-usb-tethering', 'WeatherNow'];
    }

    // 2. Fetch all public repositories to filter original (non-forked)
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`,
      {
        headers,
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 3600 },
      },
    );

    if (!reposRes.ok) {
      return DEFAULT_PROJECTS.slice(0, limit);
    }

    const allRepos = await reposRes.json();
    if (!Array.isArray(allRepos)) {
      return DEFAULT_PROJECTS.slice(0, limit);
    }

    // Strictly exclude all forks from other sources!
    const originalRepos = allRepos.filter((r) => !r.fork);

    // Map into ProjectItem with curated descriptions
    const projectMap = new Map<string, ProjectItem>();
    for (const r of originalRepos) {
      const isPinned = pinnedNames.includes(r.name);
      const description =
        r.description?.trim() ||
        REPO_DESCRIPTIONS[r.name] ||
        DEFAULT_PROJECTS.find((p) => p.name === r.name)?.description ||
        '';

      projectMap.set(r.name, {
        name: r.name,
        description,
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        url: r.html_url,
        language: r.language ?? undefined,
        isPinned,
      });
    }

    // Prioritize pinned non-forked repos first, then sort remaining by stars & recency
    const pinnedProjects: ProjectItem[] = [];
    for (const name of pinnedNames) {
      const p = projectMap.get(name);
      if (p) {
        pinnedProjects.push(p);
      }
    }

    const remainingProjects = Array.from(projectMap.values())
      .filter((p) => !pinnedNames.includes(p.name))
      .sort((a, b) => b.stars - a.stars);

    const combined = [...pinnedProjects, ...remainingProjects];

    return combined.length > 0 ? combined.slice(0, limit) : DEFAULT_PROJECTS.slice(0, limit);
  } catch {
    return DEFAULT_PROJECTS.slice(0, limit);
  }
}
