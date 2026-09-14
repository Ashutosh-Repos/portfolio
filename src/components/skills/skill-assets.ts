import {
  Network,
  Database,
  Cloud,
  Terminal,
  Layers,
  FileCode2,
  Sparkles,
} from 'lucide-react';

/**
 * Maps skill iconSlug or slug directly to SVG vector assets located in /public or /public/icons.
 */
export const SKILL_ICON_MAP: Record<string, string> = {
  // Languages
  go: '/go.svg',
  'net-http': '/go.svg',
  typescript: '/typescript.svg',
  javascript: '/icons/javascript.svg',
  python: '/icons/python.svg',
  java: '/icons/java.svg',
  sql: '/icons/sql.svg',
  rust: '/rust.svg',

  // Frameworks
  react: '/react.svg',
  nextjs: '/next.svg',
  nodejs: '/node.svg',
  express: '/icons/express.svg',
  tailwind: '/icons/tailwind.svg',
  tailwindcss: '/icons/tailwind.svg',
  html5: '/icons/html5.svg',
  'html5-css3': '/icons/html5.svg',

  // Databases & Storage
  postgresql: '/postgres.svg',
  postgres: '/postgres.svg',
  mongodb: '/mongodb.svg',
  mongoose: '/mongodb.svg',
  sqlite: '/icons/sqlite.svg',
  prisma: '/icons/prisma.svg',
  redis: '/icons/redis.svg',

  // Cloud & Infra
  docker: '/icons/docker.svg',
  nats: '/icons/nats.svg',
  'nats-jetstream': '/icons/nats.svg',
  aws: '/icons/aws.svg',
  's3-storage': '/icons/aws.svg',

  // Networking
  grpc: '/icons/grpc.svg',
  http: '/icons/http.svg',
  'http-protocols': '/icons/http.svg',
  network: '/icons/network.svg',
  'tcp-udp': '/icons/network.svg',
  stream: '/icons/stream.svg',
  sse: '/icons/stream.svg',
  websocket: '/icons/websocket.svg',
  websockets: '/icons/websocket.svg',

  // Tools & AI
  git: '/icons/git.svg',
  ai: '/icons/ai.svg',
  'llm-integration': '/icons/ai.svg',
};

/**
 * Tuned brand tint background colors for the liquid container bubble.
 * Provides subtle ambient color in light mode and sleek atmospheric glow in dark mode.
 */
export const SKILL_COLOR_MAP: Record<string, string> = {
  go: 'bg-[#53d0e0] dark:bg-[#1a3832]/25',
  'net-http': 'bg-[#53d0e0]/30 dark:bg-[#1a3832]/25',
  typescript: 'bg-[#3178c6]/25 dark:bg-[#3178c6]/20',
  javascript: 'bg-[#f7df1e]/25 dark:bg-[#f7df1e]/20',
  python: 'bg-[#3776ab]/25 dark:bg-[#3776ab]/20',
  java: 'bg-[#5382a1]/25 dark:bg-[#5382a1]/20',
  sql: 'bg-[#00758f]/25 dark:bg-[#00758f]/20',
  rust: 'bg-[#dea584]/25 dark:bg-[#dea584]/20',

  react: 'bg-[#61dafb]/25 dark:bg-[#61dafb]/20',
  nextjs: 'bg-black/10 dark:bg-white/15',
  nodejs: 'bg-[#5fa04e]/25 dark:bg-[#5fa04e]/20',
  express: 'bg-black/10 dark:bg-white/15',
  tailwind: 'bg-[#38bdf8]/25 dark:bg-[#38bdf8]/20',
  tailwindcss: 'bg-[#38bdf8]/25 dark:bg-[#38bdf8]/20',
  html5: 'bg-[#e34f26]/25 dark:bg-[#e34f26]/20',
  'html5-css3': 'bg-[#e34f26]/25 dark:bg-[#e34f26]/20',

  postgresql: 'bg-[#336791]/25 dark:bg-[#336791]/20',
  postgres: 'bg-[#336791]/25 dark:bg-[#336791]/20',
  mongodb: 'bg-[#47a248]/25 dark:bg-[#47a248]/20',
  mongoose: 'bg-[#47a248]/25 dark:bg-[#47a248]/20',
  sqlite: 'bg-[#003b57]/25 dark:bg-[#00a2d9]/20',
  prisma: 'bg-[#5a67d8]/25 dark:bg-[#5a67d8]/20',
  redis: 'bg-[#dc382d]/25 dark:bg-[#dc382d]/20',

  docker: 'bg-[#2496ed]/25 dark:bg-[#2496ed]/20',
  nats: 'bg-[#27aae1]/25 dark:bg-[#27aae1]/20',
  'nats-jetstream': 'bg-[#27aae1]/25 dark:bg-[#27aae1]/20',
  aws: 'bg-[#ff9900]/25 dark:bg-[#ff9900]/20',
  's3-storage': 'bg-[#ff9900]/25 dark:bg-[#ff9900]/20',

  grpc: 'bg-[#244c5a]/25 dark:bg-[#00e5ff]/20',
  http: 'bg-[#6366f1]/25 dark:bg-[#6366f1]/20',
  'http-protocols': 'bg-[#6366f1]/25 dark:bg-[#6366f1]/20',
  network: 'bg-[#0284c7]/25 dark:bg-[#0284c7]/20',
  'tcp-udp': 'bg-[#0284c7]/25 dark:bg-[#0284c7]/20',
  stream: 'bg-[#10b981]/25 dark:bg-[#10b981]/20',
  sse: 'bg-[#10b981]/25 dark:bg-[#10b981]/20',
  websocket: 'bg-[#f26522]/25 dark:bg-[#f26522]/20',
  websockets: 'bg-[#f26522]/25 dark:bg-[#f26522]/20',

  git: 'bg-[#f05032]/25 dark:bg-[#f05032]/20',
  ai: 'bg-[#8b5cf6]/25 dark:bg-[#8b5cf6]/20',
  'llm-integration': 'bg-[#8b5cf6]/25 dark:bg-[#8b5cf6]/20',

  default: 'bg-foreground/[0.08] dark:bg-[#1a3832]/20',
};

/**
 * Dark-mode inversion list for monochromatic black logos that need brightness on dark themes.
 */
export const DARK_INVERT_SLUGS = new Set(['nextjs', 'express', 'rust']);

/**
 * Category-based Lucide fallback icons for unmapped or failed image loads.
 */
export const CATEGORY_FALLBACK_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  networking: Network,
  databases: Database,
  cloud_infra: Cloud,
  ai_ml: Sparkles,
  tools: Terminal,
  frameworks: Layers,
  languages: FileCode2,
};

/**
 * Returns a 2-letter abbreviation for monogram fallback.
 */
export function getSkillMonogram(name: string): string {
  if (!name) return '??';
  const parts = name
    .trim()
    .split(/[\s(/]+/)
    .filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
