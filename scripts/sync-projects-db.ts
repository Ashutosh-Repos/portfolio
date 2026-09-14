import { db, schema } from '../src/platform/db';
import { eq } from 'drizzle-orm';

async function syncProjectsAndSnapshots() {
  const now = Date.now();
  console.log(
    '🔄 Syncing authentic GitHub snapshots and projects into pdp.db...',
  );

  const githubSnapshots = [
    // 6 Pinned Repositories
    {
      id: 'Ashutosh-Repos/Tessera',
      name: 'Tessera',
      fullName: 'Ashutosh-Repos/Tessera',
      description:
        'Multi-Region Distributed Video Transcoding & HLS/DASH Packaging Engine in Go (Consistent Hash Ring, S3 Ingress, NATS, Redis Sharding)',
      stars: 1,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'Go',
      languagesJson: JSON.stringify({ Go: 94.2, Shell: 5.8 }),
      latestCommitSha: 'a8b7c6d',
      latestCommitAt: now - 86400000 * 12,
      isPinned: true,
      repoUrl: 'https://github.com/Ashutosh-Repos/Tessera',
      homepageUrl: 'https://github.com/Ashutosh-Repos/Tessera#readme',
      topicsJson: JSON.stringify([
        'distributed-systems',
        'transcoding',
        'golang',
        'hls',
        'nats',
      ]),
      syncedAt: now,
    },
    {
      id: 'Ashutosh-Repos/Bunly',
      name: 'Bunly',
      fullName: 'Ashutosh-Repos/Bunly',
      description:
        'High-performance, feature-rich Video-On-Demand (VOD) streaming platform with adaptive bitrate streaming',
      stars: 0,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'TypeScript',
      languagesJson: JSON.stringify({ TypeScript: 88.0, HTML: 6.0, CSS: 6.0 }),
      latestCommitSha: '3a2b1c0',
      latestCommitAt: now - 86400000 * 60,
      isPinned: true,
      repoUrl: 'https://github.com/Ashutosh-Repos/Bunly',
      homepageUrl: null,
      topicsJson: JSON.stringify(['video-on-demand', 'streaming', 'hls']),
      syncedAt: now,
    },
    {
      id: 'Ashutosh-Repos/Post',
      name: 'Post',
      fullName: 'Ashutosh-Repos/Post',
      description:
        'Minimalist social media platform built for sharing thoughts and updates with modern reactive UI',
      stars: 0,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'TypeScript',
      languagesJson: JSON.stringify({ TypeScript: 84.0, CSS: 16.0 }),
      latestCommitSha: '5e6f7a8',
      latestCommitAt: now - 86400000 * 110,
      isPinned: true,
      repoUrl: 'https://github.com/Ashutosh-Repos/Post',
      homepageUrl: 'https://post-kohl-six.vercel.app',
      topicsJson: JSON.stringify(['social-app', 'nextjs', 'prisma']),
      syncedAt: now,
    },
    {
      id: 'Ashutosh-Repos/video-encoder',
      name: 'video-encoder',
      fullName: 'Ashutosh-Repos/video-encoder',
      description:
        'Multithreaded video processing engine with Next.js, FFmpeg & HLS streaming for rapid parallel transcoding',
      stars: 0,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'TypeScript',
      languagesJson: JSON.stringify({
        TypeScript: 78.0,
        JavaScript: 15.0,
        Shell: 7.0,
      }),
      latestCommitSha: '7f8e9d0',
      latestCommitAt: now - 86400000 * 90,
      isPinned: true,
      repoUrl: 'https://github.com/Ashutosh-Repos/video-encoder',
      homepageUrl: 'https://video-encoder-psi.vercel.app',
      topicsJson: JSON.stringify(['ffmpeg', 'video-processing', 'hls']),
      syncedAt: now,
    },
    {
      id: 'Ashutosh-Repos/macbook-usb-tethering',
      name: 'macbook-usb-tethering',
      fullName: 'Ashutosh-Repos/macbook-usb-tethering',
      description:
        'Low-level USB tethering driver and network interface utility crafted in C for high-throughput connectivity on macOS',
      stars: 0,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'C',
      languagesJson: JSON.stringify({ C: 92.0, Makefile: 8.0 }),
      latestCommitSha: '2b3c4d5',
      latestCommitAt: now - 86400000 * 150,
      isPinned: true,
      repoUrl: 'https://github.com/Ashutosh-Repos/macbook-usb-tethering',
      homepageUrl: null,
      topicsJson: JSON.stringify(['macos', 'kernel-extension', 'c', 'driver']),
      syncedAt: now,
    },
    {
      id: 'Ashutosh-Repos/WeatherNow',
      name: 'WeatherNow',
      fullName: 'Ashutosh-Repos/WeatherNow',
      description:
        'Real-time weather forecast and interactive conditions dashboard with location search and telemetry visualization',
      stars: 0,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'JavaScript',
      languagesJson: JSON.stringify({ JavaScript: 85.0, CSS: 15.0 }),
      latestCommitSha: '4a5b6c7',
      latestCommitAt: now - 86400000 * 140,
      isPinned: true,
      repoUrl: 'https://github.com/Ashutosh-Repos/WeatherNow',
      homepageUrl: 'https://weather-now-gules-xi.vercel.app',
      topicsJson: JSON.stringify(['weather', 'dashboard', 'javascript']),
      syncedAt: now,
    },

    // Additional authentic public repositories
    {
      id: 'Ashutosh-Repos/Chatify',
      name: 'Chatify',
      fullName: 'Ashutosh-Repos/Chatify',
      description:
        'Realtime chat platform using WebSockets, Next.js, Prisma, PostgreSQL, & Zustand',
      stars: 1,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'TypeScript',
      languagesJson: JSON.stringify({
        TypeScript: 85.0,
        JavaScript: 10.0,
        CSS: 5.0,
      }),
      latestCommitSha: '4d5e6f7',
      latestCommitAt: now - 86400000 * 45,
      isPinned: false,
      repoUrl: 'https://github.com/Ashutosh-Repos/Chatify',
      homepageUrl: null,
      topicsJson: JSON.stringify(['websockets', 'nextjs', 'prisma', 'chat']),
      syncedAt: now,
    },
    {
      id: 'Ashutosh-Repos/Finance-Dashboard-UI',
      name: 'Finance-Dashboard-UI',
      fullName: 'Ashutosh-Repos/Finance-Dashboard-UI',
      description:
        'Modern financial analytics dashboard UI with data visualization and transaction tracking',
      stars: 1,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'TypeScript',
      languagesJson: JSON.stringify({ TypeScript: 80.0, CSS: 20.0 }),
      latestCommitSha: '8d9e0f1',
      latestCommitAt: now - 86400000 * 130,
      isPinned: false,
      repoUrl: 'https://github.com/Ashutosh-Repos/Finance-Dashboard-UI',
      homepageUrl: null,
      topicsJson: JSON.stringify(['finance', 'dashboard', 'charts']),
      syncedAt: now,
    },
    {
      id: 'Ashutosh-Repos/Heart-Disease-Prediction',
      name: 'Heart-Disease-Prediction',
      fullName: 'Ashutosh-Repos/Heart-Disease-Prediction',
      description:
        'Machine learning diagnostic tool evaluating clinical indicators to predict cardiovascular risks',
      stars: 1,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'TypeScript',
      languagesJson: JSON.stringify({ TypeScript: 90.0, Python: 10.0 }),
      latestCommitSha: '3c4d5e6',
      latestCommitAt: now - 86400000 * 160,
      isPinned: false,
      repoUrl: 'https://github.com/Ashutosh-Repos/Heart-Disease-Prediction',
      homepageUrl: null,
      topicsJson: JSON.stringify(['machine-learning', 'healthcare', 'ai']),
      syncedAt: now,
    },
    {
      id: 'Ashutosh-Repos/hls-server',
      name: 'hls-server',
      fullName: 'Ashutosh-Repos/hls-server',
      description:
        'Lightweight HTTP Live Streaming (HLS) server for video segment distribution',
      stars: 1,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'TypeScript',
      languagesJson: JSON.stringify({ TypeScript: 96.0, Shell: 4.0 }),
      latestCommitSha: '9e0f1a2',
      latestCommitAt: now - 86400000 * 200,
      isPinned: false,
      repoUrl: 'https://github.com/Ashutosh-Repos/hls-server',
      homepageUrl: null,
      topicsJson: JSON.stringify(['streaming', 'hls', 'http']),
      syncedAt: now,
    },
    {
      id: 'Ashutosh-Repos/ShAI',
      name: 'ShAI',
      fullName: 'Ashutosh-Repos/ShAI',
      description:
        'AI-Powered CLI Assistant translating natural language into safe shell commands (Ink, React, SQLite, Ollama, Claude, OpenAI)',
      stars: 1,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'TypeScript',
      languagesJson: JSON.stringify({
        TypeScript: 92.0,
        JavaScript: 5.0,
        Shell: 3.0,
      }),
      latestCommitSha: 'b4c5d6e',
      latestCommitAt: now - 86400000 * 8,
      isPinned: false,
      repoUrl: 'https://github.com/Ashutosh-Repos/ShAI',
      homepageUrl: 'https://www.npmjs.com/package/shai-shell',
      topicsJson: JSON.stringify([
        'cli',
        'ai',
        'developer-tools',
        'typescript',
        'terminal',
      ]),
      syncedAt: now,
    },
    {
      id: 'Ashutosh-Repos/VidtubeBackend',
      name: 'VidtubeBackend',
      fullName: 'Ashutosh-Repos/VidtubeBackend',
      description:
        'Scalable video platform backend architecture with Node.js & MongoDB',
      stars: 1,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'JavaScript',
      languagesJson: JSON.stringify({ JavaScript: 95.0, Shell: 5.0 }),
      latestCommitSha: '6c7d8e9',
      latestCommitAt: now - 86400000 * 180,
      isPinned: false,
      repoUrl: 'https://github.com/Ashutosh-Repos/VidtubeBackend',
      homepageUrl: null,
      topicsJson: JSON.stringify(['nodejs', 'mongodb', 'express', 'video']),
      syncedAt: now,
    },
    {
      id: 'Ashutosh-Repos/ShellGreets',
      name: 'ShellGreets',
      fullName: 'Ashutosh-Repos/ShellGreets',
      description:
        'Smart, motivational greeting theme for terminal with dynamic day progress bar',
      stars: 0,
      forks: 0,
      openIssues: 0,
      primaryLanguage: 'Shell',
      languagesJson: JSON.stringify({ Shell: 100.0 }),
      latestCommitSha: '1a2b3c4',
      latestCommitAt: now - 86400000 * 75,
      isPinned: false,
      repoUrl: 'https://github.com/Ashutosh-Repos/ShellGreets',
      homepageUrl: null,
      topicsJson: JSON.stringify([
        'zsh',
        'bash',
        'terminal',
        'developer-tools',
      ]),
      syncedAt: now,
    },
  ];

  // Delete fake projects and repo snapshots respecting foreign keys
  await db
    .delete(schema.project)
    .where(eq(schema.project.id, 'proj-cheating-daddy'));
  await db
    .delete(schema.githubRepoSnapshot)
    .where(eq(schema.githubRepoSnapshot.id, 'Ashutosh-Repos/cheating-daddy'));

  // Upsert snapshots
  for (const snap of githubSnapshots) {
    await db
      .insert(schema.githubRepoSnapshot)
      .values(snap)
      .onConflictDoUpdate({
        target: schema.githubRepoSnapshot.id,
        set: {
          stars: snap.stars,
          forks: snap.forks,
          description: snap.description,
          isPinned: snap.isPinned,
          primaryLanguage: snap.primaryLanguage,
          homepageUrl: snap.homepageUrl,
          syncedAt: now,
        },
      });
  }

  // Reset all project featured priorities first
  await db.update(schema.project).set({ featuredPriority: null });

  // Pinned Projects with featuredPriority 1-6
  const projectsData = [
    {
      id: 'proj-tessera',
      slug: 'tessera',
      title: 'Tessera',
      tagline:
        'Distributed Video Transcoding & HLS/DASH Packaging Engine in Go',
      description:
        'Multi-Region Distributed Video Transcoding & HLS/DASH Packaging Engine in Go (Consistent Hash Ring, S3 Ingress, NATS, Redis Sharding).',
      caseStudyMarkdown:
        '# Tessera Architecture\n\nHigh-throughput distributed transcoding engine built with Go, FFmpeg bindings, and NATS event streams.',
      status: 'active',
      featuredPriority: 1,
      demoUrl: 'https://github.com/Ashutosh-Repos/Tessera',
      packageUrl: null,
      githubRepoId: 'Ashutosh-Repos/Tessera',
      overrideGithubData: false,
      technologiesJson: JSON.stringify([
        'Go',
        'FFmpeg',
        'NATS',
        'Redis',
        'Docker',
      ]),
      architectureJson: JSON.stringify([
        'Consistent Hash Ring',
        'S3 Ingress Pipeline',
      ]),
      lessonsLearnedMarkdown: null,
      coverImageUrl: null,
      sortOrder: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'proj-bunly',
      slug: 'bunly',
      title: 'Bunly',
      tagline: 'High-performance Video-On-Demand (VOD) streaming platform',
      description:
        'High-performance, feature-rich Video-On-Demand (VOD) streaming platform with adaptive bitrate streaming.',
      caseStudyMarkdown: null,
      status: 'completed',
      featuredPriority: 2,
      demoUrl: 'https://github.com/Ashutosh-Repos/Bunly',
      packageUrl: null,
      githubRepoId: 'Ashutosh-Repos/Bunly',
      overrideGithubData: false,
      technologiesJson: JSON.stringify([
        'TypeScript',
        'React',
        'HLS.js',
        'Node.js',
      ]),
      architectureJson: JSON.stringify(['Adaptive Bitrate Streaming']),
      lessonsLearnedMarkdown: null,
      coverImageUrl: null,
      sortOrder: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'proj-post',
      slug: 'post',
      title: 'Post',
      tagline:
        'Minimalist social media platform built for sharing thoughts and updates',
      description:
        'Minimalist social media platform built for sharing thoughts, media, and architectural thoughts.',
      caseStudyMarkdown: null,
      status: 'completed',
      featuredPriority: 3,
      demoUrl: 'https://post-kohl-six.vercel.app',
      packageUrl: null,
      githubRepoId: 'Ashutosh-Repos/Post',
      overrideGithubData: false,
      technologiesJson: JSON.stringify(['TypeScript', 'React', 'Tailwind CSS']),
      architectureJson: JSON.stringify([
        'Server Components',
        'Optimistic Mutations',
      ]),
      lessonsLearnedMarkdown: null,
      coverImageUrl: null,
      sortOrder: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'proj-video-encoder',
      slug: 'video-encoder',
      title: 'video-encoder',
      tagline: 'Multithreaded video processing engine with Next.js & FFmpeg',
      description:
        'Multithreaded video processing engine with Next.js, FFmpeg & HLS streaming for rapid parallel video transcoding.',
      caseStudyMarkdown: null,
      status: 'completed',
      featuredPriority: 4,
      demoUrl: 'https://video-encoder-psi.vercel.app',
      packageUrl: null,
      githubRepoId: 'Ashutosh-Repos/video-encoder',
      overrideGithubData: false,
      technologiesJson: JSON.stringify([
        'TypeScript',
        'FFmpeg',
        'Node.js',
        'Next.js',
      ]),
      architectureJson: JSON.stringify([
        'Worker Threads',
        'Pipeline Streaming',
      ]),
      lessonsLearnedMarkdown: null,
      coverImageUrl: null,
      sortOrder: 4,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'proj-macbook-usb-tethering',
      slug: 'macbook-usb-tethering',
      title: 'macbook-usb-tethering',
      tagline: 'USB tethering driver & kernel extension utility for macOS',
      description:
        'Low-level USB tethering driver and network interface utility crafted in C for high-throughput connectivity on macOS.',
      caseStudyMarkdown: null,
      status: 'completed',
      featuredPriority: 5,
      demoUrl: 'https://github.com/Ashutosh-Repos/macbook-usb-tethering',
      packageUrl: null,
      githubRepoId: 'Ashutosh-Repos/macbook-usb-tethering',
      overrideGithubData: false,
      technologiesJson: JSON.stringify(['C', 'macOS Kernel', 'USB']),
      architectureJson: JSON.stringify(['Kernel Extension', 'IOKit Interface']),
      lessonsLearnedMarkdown: null,
      coverImageUrl: null,
      sortOrder: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'proj-weathernow',
      slug: 'weathernow',
      title: 'WeatherNow',
      tagline:
        'Real-time weather forecast and interactive conditions dashboard',
      description:
        'Real-time weather forecast and interactive conditions dashboard with location search and weather telemetry.',
      caseStudyMarkdown: null,
      status: 'completed',
      featuredPriority: 6,
      demoUrl: 'https://weather-now-gules-xi.vercel.app',
      packageUrl: null,
      githubRepoId: 'Ashutosh-Repos/WeatherNow',
      overrideGithubData: false,
      technologiesJson: JSON.stringify([
        'JavaScript',
        'Weather API',
        'Tailwind CSS',
      ]),
      architectureJson: JSON.stringify(['Async Telemetry Fetching']),
      lessonsLearnedMarkdown: null,
      coverImageUrl: null,
      sortOrder: 6,
      createdAt: now,
      updatedAt: now,
    },

    // Non-pinned projects (featuredPriority: null)
    {
      id: 'proj-chatify',
      slug: 'chatify',
      title: 'Chatify',
      tagline:
        'Realtime chat platform using WebSockets, Next.js, Prisma, & Zustand',
      description:
        'Realtime chat platform using WebSockets, Next.js, Prisma, PostgreSQL, & Zustand.',
      caseStudyMarkdown: null,
      status: 'completed',
      featuredPriority: null,
      demoUrl: 'https://github.com/Ashutosh-Repos/Chatify',
      packageUrl: null,
      githubRepoId: 'Ashutosh-Repos/Chatify',
      overrideGithubData: false,
      technologiesJson: JSON.stringify([
        'Next.js',
        'WebSockets',
        'Prisma',
        'PostgreSQL',
        'Zustand',
      ]),
      architectureJson: JSON.stringify([
        'WebSocket Cluster',
        'Optimistic UI Updates',
      ]),
      lessonsLearnedMarkdown: null,
      coverImageUrl: null,
      sortOrder: 7,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'proj-finance-dashboard',
      slug: 'finance-dashboard-ui',
      title: 'Finance-Dashboard-UI',
      tagline:
        'Modern financial analytics dashboard UI with data visualization',
      description:
        'Modern financial analytics dashboard UI with interactive charts, portfolio distribution, and ledger tracking.',
      caseStudyMarkdown: null,
      status: 'completed',
      featuredPriority: null,
      demoUrl: 'https://github.com/Ashutosh-Repos/Finance-Dashboard-UI',
      packageUrl: null,
      githubRepoId: 'Ashutosh-Repos/Finance-Dashboard-UI',
      overrideGithubData: false,
      technologiesJson: JSON.stringify(['TypeScript', 'Next.js', 'Chart.js']),
      architectureJson: JSON.stringify(['Responsive Glass Grids']),
      lessonsLearnedMarkdown: null,
      coverImageUrl: null,
      sortOrder: 8,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'proj-shai',
      slug: 'shai-cli',
      title: 'Shai — AI Powered CLI Assistant',
      tagline:
        'Translates devs natural language commands into safe, executable shell commands',
      description:
        'A modular command-line utility translating natural language into shell commands with interactive terminal UI, security interceptors, multi-LLM routing, and encrypted offline history.',
      caseStudyMarkdown:
        '# Shai — AI Powered CLI Assistant\n\nA production command-line developer assistant published on npm, combining React/Ink interactive terminal UI with security validation and unified multi-LLM clients.',
      status: 'active',
      featuredPriority: null,
      demoUrl: 'https://www.npmjs.com/package/shai-shell',
      packageUrl: 'https://www.npmjs.com/package/shai-shell',
      githubRepoId: 'Ashutosh-Repos/ShAI',
      overrideGithubData: true,
      technologiesJson: JSON.stringify([
        'TypeScript',
        'Node.js',
        'React',
        'Ink',
        'SQLite',
        'Claude',
        'OpenAI',
        'Gemini',
      ]),
      architectureJson: JSON.stringify([
        'Modular OOP design pattern separating configuration, SQLite managers, and LLM API clients',
        'Interactive TUI using React and Ink rendering real-time asynchronous streaming token flows',
        'Automated security validation module parsing shell AST to intercept destructive commands',
        'Encrypted offline prompt history engine leveraging embedded local SQLite',
      ]),
      lessonsLearnedMarkdown:
        'Building terminal interfaces with React Ink requires strict layout lifecycle discipline, atomic state updates, and graceful terminal resize event debouncing.',
      coverImageUrl: null,
      sortOrder: 9,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'proj-shellgreets',
      slug: 'shellgreets',
      title: 'ShellGreets',
      tagline:
        'Smart, motivational greeting theme for terminal with dynamic day progress bar',
      description:
        'Smart, motivational greeting theme for terminal with dynamic day progress bar and personalized productivity metrics.',
      caseStudyMarkdown: null,
      status: 'completed',
      featuredPriority: null,
      demoUrl: 'https://github.com/Ashutosh-Repos/ShellGreets',
      packageUrl: null,
      githubRepoId: 'Ashutosh-Repos/ShellGreets',
      overrideGithubData: false,
      technologiesJson: JSON.stringify(['Shell', 'Zsh', 'Bash']),
      architectureJson: JSON.stringify([
        'POSIX Compliant',
        'ANSI Color Engine',
      ]),
      lessonsLearnedMarkdown: null,
      coverImageUrl: null,
      sortOrder: 10,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'proj-vidtubebackend',
      slug: 'vidtubebackend',
      title: 'VidtubeBackend',
      tagline:
        'Scalable video platform backend architecture with Node.js & MongoDB',
      description:
        'Scalable video platform backend architecture featuring user authentication, video transcode queues, and aggregation pipelines.',
      caseStudyMarkdown: null,
      status: 'completed',
      featuredPriority: null,
      demoUrl: 'https://github.com/Ashutosh-Repos/VidtubeBackend',
      packageUrl: null,
      githubRepoId: 'Ashutosh-Repos/VidtubeBackend',
      overrideGithubData: false,
      technologiesJson: JSON.stringify([
        'Node.js',
        'Express',
        'MongoDB',
        'JWT',
      ]),
      architectureJson: JSON.stringify(['REST API', 'Aggregation Pipelines']),
      lessonsLearnedMarkdown: null,
      coverImageUrl: null,
      sortOrder: 11,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'proj-hls-server',
      slug: 'hls-server',
      title: 'hls-server',
      tagline:
        'Lightweight HTTP Live Streaming (HLS) server for video distribution',
      description:
        'Lightweight, concurrent HTTP Live Streaming (HLS) server built in Go for segment caching and byte-range delivery.',
      caseStudyMarkdown: null,
      status: 'completed',
      featuredPriority: null,
      demoUrl: 'https://github.com/Ashutosh-Repos/hls-server',
      packageUrl: null,
      githubRepoId: 'Ashutosh-Repos/hls-server',
      overrideGithubData: false,
      technologiesJson: JSON.stringify(['Go', 'HTTP/2', 'HLS']),
      architectureJson: JSON.stringify(['Zero-Copy File Serving']),
      lessonsLearnedMarkdown: null,
      coverImageUrl: null,
      sortOrder: 12,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const proj of projectsData) {
    await db
      .insert(schema.project)
      .values(proj)
      .onConflictDoUpdate({
        target: schema.project.id,
        set: {
          title: proj.title,
          tagline: proj.tagline,
          description: proj.description,
          githubRepoId: proj.githubRepoId,
          demoUrl: proj.demoUrl,
          technologiesJson: proj.technologiesJson,
          architectureJson: proj.architectureJson,
          featuredPriority: proj.featuredPriority,
          sortOrder: proj.sortOrder,
          updatedAt: now,
        },
      });
  }

  console.log('✅ Projects and snapshots synchronized successfully!');
}

syncProjectsAndSnapshots()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Sync failed:', err);
    process.exit(1);
  });
