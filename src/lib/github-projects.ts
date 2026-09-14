export interface ProjectItem {
  name: string;
  description: string;
  stars: number;
  forks: number;
  url: string;
  demoUrl?: string;
  language?: string;
  isPinned?: boolean;
}

const GITHUB_USERNAME = 'Ashutosh-Repos';

/** Curated descriptions for Ashutosh's original projects (used when GitHub repo description is empty) */
const REPO_DESCRIPTIONS: Record<string, string> = {
  Tessera:
    'Multi-Region Distributed Video Transcoding & HLS/DASH Packaging Engine in Go (Consistent Hash Ring, S3 Ingress, NATS, Redis Sharding)',
  Bunly:
    'High-performance, feature-rich Video-On-Demand (VOD) streaming platform with adaptive bitrate streaming',
  Post: 'Minimalist social media platform built for sharing thoughts and updates with modern reactive UI',
  'video-encoder':
    'Multithreaded video processing engine with Next.js, FFmpeg & HLS streaming for rapid parallel transcoding',
  'macbook-usb-tethering':
    'Low-level USB tethering driver and network interface utility crafted in C for high-throughput connectivity on macOS',
  WeatherNow:
    'Real-time weather forecast and interactive conditions dashboard with location search and telemetry visualization',
  Chatify:
    'Realtime chat platform using WebSockets, Next.js, Prisma, PostgreSQL, & Zustand',
  ShellGreets:
    'Smart, motivational greeting theme for terminal with dynamic day progress bar',
  'Finance-Dashboard-UI':
    'Modern financial analytics dashboard UI with data visualization and transaction tracking',
  'Heart-Disease-Prediction':
    'Machine learning diagnostic tool evaluating clinical indicators to predict cardiovascular risks',
  VidtubeBackend:
    'Scalable video platform backend architecture with Node.js & MongoDB',
  'hls-server':
    'Lightweight HTTP Live Streaming (HLS) server for video segment distribution',
  ShAI: 'AI-Powered CLI Assistant translating natural language into safe shell commands (Ink, React, SQLite, Ollama, Claude, OpenAI)',
};

/** Default fallback projects (Strictly authentic GitHub data) */
export const DEFAULT_PROJECTS: ProjectItem[] = [
  // 6 Authentic Pinned Repositories First
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
    name: 'Bunly',
    description: REPO_DESCRIPTIONS['Bunly'],
    stars: 0,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/Bunly',
    language: 'TypeScript',
    isPinned: true,
  },
  {
    name: 'Post',
    description: REPO_DESCRIPTIONS['Post'],
    stars: 0,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/Post',
    demoUrl: 'https://post-kohl-six.vercel.app',
    language: 'TypeScript',
    isPinned: true,
  },
  {
    name: 'video-encoder',
    description: REPO_DESCRIPTIONS['video-encoder'],
    stars: 0,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/video-encoder',
    demoUrl: 'https://video-encoder-psi.vercel.app',
    language: 'TypeScript',
    isPinned: true,
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
  {
    name: 'WeatherNow',
    description: REPO_DESCRIPTIONS['WeatherNow'],
    stars: 0,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/WeatherNow',
    demoUrl: 'https://weather-now-gules-xi.vercel.app',
    language: 'JavaScript',
    isPinned: true,
  },

  // Other Authentic Public Repositories
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
    name: 'Finance-Dashboard-UI',
    description: REPO_DESCRIPTIONS['Finance-Dashboard-UI'],
    stars: 1,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/Finance-Dashboard-UI',
    language: 'TypeScript',
    isPinned: false,
  },
  {
    name: 'Heart-Disease-Prediction',
    description: REPO_DESCRIPTIONS['Heart-Disease-Prediction'],
    stars: 1,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/Heart-Disease-Prediction',
    language: 'TypeScript',
    isPinned: false,
  },
  {
    name: 'hls-server',
    description: REPO_DESCRIPTIONS['hls-server'],
    stars: 1,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/hls-server',
    language: 'TypeScript',
    isPinned: false,
  },
  {
    name: 'ShAI',
    description: REPO_DESCRIPTIONS['ShAI'],
    stars: 1,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/ShAI',
    demoUrl: 'https://www.npmjs.com/package/shai-shell',
    language: 'TypeScript',
    isPinned: false,
  },
  {
    name: 'VidtubeBackend',
    description: REPO_DESCRIPTIONS['VidtubeBackend'],
    stars: 1,
    forks: 0,
    url: 'https://github.com/Ashutosh-Repos/VidtubeBackend',
    language: 'JavaScript',
    isPinned: false,
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
];

/** Fetch dynamic public pinned & original projects */
import { projectService } from '@/platform/modules/project/project.service';

export interface GetProjectsOptions {
  limit?: number;
  pinnedOnly?: boolean;
}

export async function getPublicProjects(
  optionsOrLimit: number | GetProjectsOptions = 8,
): Promise<ProjectItem[]> {
  const options: GetProjectsOptions =
    typeof optionsOrLimit === 'number'
      ? { limit: optionsOrLimit }
      : optionsOrLimit;

  const limit = options.limit ?? 8;
  const pinnedOnly = Boolean(options.pinnedOnly);

  // 1. Primary path: Fast local database projects (Strategy 1: 0ms latency, zero rate limits)
  try {
    const dbProjects = await projectService.getProjects({
      limit,
      featuredOnly: pinnedOnly,
    });

    if (dbProjects.length > 0) {
      return dbProjects.map((p) => ({
        name: p.title,
        description: p.description,
        stars: p.github?.stars ?? (p.title === 'Tessera' ? 1 : 0),
        forks: p.github?.forks ?? 0,
        url:
          p.github?.repoUrl ||
          `https://github.com/${GITHUB_USERNAME}/${p.slug}`,
        demoUrl: p.demoUrl || undefined,
        language:
          p.technologies[0] || p.github?.primaryLanguage || 'TypeScript',
        isPinned: p.featuredPriority !== null,
      }));
    }
  } catch {
    // Fallback to GitHub API / static defaults
  }

  // 2. Fallback path: Direct GitHub API with caching
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Projects-Fetcher',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    // 2a. Extract pinned repo names
    let pinnedNames: string[] = [
      'Tessera',
      'Bunly',
      'Post',
      'video-encoder',
      'macbook-usb-tethering',
      'WeatherNow',
    ];

    try {
      const profileRes = await fetch(`https://github.com/${GITHUB_USERNAME}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(3500),
        next: { revalidate: 3600 },
      });
      if (profileRes.ok) {
        const html = await profileRes.text();
        const matches = html.matchAll(/class="repo">([^<]+)<\/span>/g);
        const parsed = Array.from(matches, (m) => m[1]?.trim()).filter(Boolean);
        if (parsed.length > 0) {
          pinnedNames = parsed;
        }
      }
    } catch {
      // use default pinned list
    }

    // 2b. Fetch public repos
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`,
      {
        headers,
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 3600 },
      },
    );

    if (!reposRes.ok) {
      const base = pinnedOnly
        ? DEFAULT_PROJECTS.filter((p) => p.isPinned)
        : DEFAULT_PROJECTS;
      return base.slice(0, limit);
    }

    const allRepos = await reposRes.json();
    if (!Array.isArray(allRepos)) {
      const base = pinnedOnly
        ? DEFAULT_PROJECTS.filter((p) => p.isPinned)
        : DEFAULT_PROJECTS;
      return base.slice(0, limit);
    }

    // Strictly exclude all external forks
    const originalRepos = allRepos.filter((r) => !r.fork);

    // Map into ProjectItem with curated descriptions & demo URLs
    const projectMap = new Map<string, ProjectItem>();
    for (const r of originalRepos) {
      const isPinned = pinnedNames.includes(r.name);
      if (pinnedOnly && !isPinned) continue;

      const fallbackMatch = DEFAULT_PROJECTS.find((p) => p.name === r.name);
      const description =
        r.description?.trim() ||
        REPO_DESCRIPTIONS[r.name] ||
        fallbackMatch?.description ||
        '';

      projectMap.set(r.name, {
        name: r.name,
        description,
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        url: r.html_url,
        demoUrl: r.homepage || fallbackMatch?.demoUrl || undefined,
        language: r.language ?? fallbackMatch?.language ?? undefined,
        isPinned,
      });
    }

    // Prioritize pinned non-forked repos first
    const pinnedProjects: ProjectItem[] = [];
    for (const name of pinnedNames) {
      const p = projectMap.get(name);
      if (p) {
        pinnedProjects.push(p);
      }
    }

    if (pinnedOnly) {
      return pinnedProjects.slice(0, limit);
    }

    const remainingProjects = Array.from(projectMap.values())
      .filter((p) => !pinnedNames.includes(p.name))
      .sort((a, b) => b.stars - a.stars);

    const combined = [...pinnedProjects, ...remainingProjects];

    return combined.length > 0
      ? combined.slice(0, limit)
      : DEFAULT_PROJECTS.slice(0, limit);
  } catch {
    const base = pinnedOnly
      ? DEFAULT_PROJECTS.filter((p) => p.isPinned)
      : DEFAULT_PROJECTS;
    return base.slice(0, limit);
  }
}
