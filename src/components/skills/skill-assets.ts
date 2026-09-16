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
/**
 * Maps skill iconSlug or slug directly to SVG vector assets and high-res PNGs located in /skills.
 */
export const SKILL_ICON_MAP: Record<string, string> = {
  // Languages
  typescript: '/skills/typescript.svg',
  javascript: '/skills/javascript.svg',
  python: '/skills/python.svg',
  go: '/skills/go.svg',
  'net-http': '/skills/go.svg',
  java: '/skills/java.svg',
  mysql: '/skills/mysql.svg',
  sql: '/skills/mysql.svg',
  rust: '/rust.svg',

  // Frameworks & UI
  react: '/react.svg',
  nextjs: '/next.svg',
  nodejs: '/skills/node.svg',
  node: '/skills/node.svg',
  express: '/skills/express.svg',
  tailwind: '/skills/tailwind.svg',
  tailwindcss: '/skills/tailwind.svg',
  html5: '/skills/html5.svg',
  'html5-css3': '/skills/html5.svg',

  // Databases & Storage
  postgresql: '/skills/postgres.svg',
  postgres: '/skills/postgres.svg',
  mongodb: '/skills/mongodb.svg',
  mongoose: '/skills/mongoose.svg',
  sqlite: '/skills/sqlite.svg',
  prisma: '/skills/prisma.svg',
  redis: '/skills/redis.svg',

  // Cloud & Infra
  docker: '/skills/docker.svg',
  nats: '/icons/nats.svg',
  'nats-jetstream': '/icons/nats.svg',
  aws: '/skills/s3.svg',
  s3: '/skills/s3.svg',
  's3-storage': '/skills/s3.svg',
  'amazon-s3': '/skills/s3.svg',

  // Networking & Realtime
  grpc: '/skills/grpc.svg',
  http: '/icons/http.svg',
  'http-protocols': '/icons/http.svg',
  network: '/icons/network.svg',
  'tcp-udp': '/icons/network.svg',
  stream: '/skills/sse.png',
  sse: '/skills/sse.png',
  'server-sent-events': '/skills/sse.png',
  websocket: '/skills/websocket.svg',
  websockets: '/skills/websocket.svg',
  socketio: '/skills/socketio.svg',
  'socket.io': '/skills/socketio.svg',

  // Tools & AI
  git: '/skills/git.svg',
  ai: '/icons/ai.svg',
  'llm-integration': '/icons/ai.svg',
};

/**
 * Optical scale adjustments to ensure visual volume balance across heterogeneous logos.
 * Compact full-bleed solid shapes are softened slightly; slender or horizontal marks are boosted.
 */
export const SKILL_SCALE_MAP: Record<string, string> = {
  javascript: 'scale-[0.88]',
  html5: 'scale-[0.92]',
  'html5-css3': 'scale-[0.92]',
  express: 'scale-[1.12]',
  prisma: 'scale-[1.08]',
  s3: 'scale-[1.08]',
  's3-storage': 'scale-[1.08]',
  'amazon-s3': 'scale-[1.08]',
  tailwind: 'scale-[1.08]',
  tailwindcss: 'scale-[1.08]',
  grpc: 'scale-[1.08]',
  websocket: 'scale-[1.04]',
  websockets: 'scale-[1.04]',
  sse: 'scale-[1.02]',
};

/**
 * Tuned brand tint background colors for the liquid container bubble.
 * Provides subtle ambient color in light mode and sleek atmospheric glow in dark mode.
 */
export const SKILL_COLOR_MAP: Record<string, string> = {
  // Languages
  typescript: 'bg-[#3178c6]/25 dark:bg-[#3178c6]/20',
  javascript: 'bg-[#f7df1e]/25 dark:bg-[#f7df1e]/20',
  python: 'bg-[#3776ab]/25 dark:bg-[#3776ab]/20',
  go: 'bg-[#53d0e0]/25 dark:bg-[#1a3832]/25',
  'net-http': 'bg-[#53d0e0]/30 dark:bg-[#1a3832]/25',
  java: 'bg-[#5382a1]/25 dark:bg-[#5382a1]/20',
  mysql: 'bg-[#00618a]/25 dark:bg-[#00618a]/20',
  sql: 'bg-[#00618a]/25 dark:bg-[#00618a]/20',
  rust: 'bg-[#dea584]/25 dark:bg-[#dea584]/20',

  // Frameworks & UI
  react: 'bg-[#61dafb]/25 dark:bg-[#61dafb]/20',
  nextjs: 'bg-black/10 dark:bg-white/15',
  nodejs: 'bg-[#5fa04e]/25 dark:bg-[#5fa04e]/20',
  node: 'bg-[#5fa04e]/25 dark:bg-[#5fa04e]/20',
  express: 'bg-black/10 dark:bg-white/15',
  tailwind: 'bg-[#38bdf8]/25 dark:bg-[#38bdf8]/20',
  tailwindcss: 'bg-[#38bdf8]/25 dark:bg-[#38bdf8]/20',
  html5: 'bg-[#e34f26]/25 dark:bg-[#e34f26]/20',
  'html5-css3': 'bg-[#e34f26]/25 dark:bg-[#e34f26]/20',

  // Databases & Storage
  postgresql: 'bg-[#336791]/25 dark:bg-[#336791]/20',
  postgres: 'bg-[#336791]/25 dark:bg-[#336791]/20',
  mongodb: 'bg-[#47a248]/25 dark:bg-[#47a248]/20',
  mongoose: 'bg-[#850000]/25 dark:bg-[#850000]/20',
  sqlite: 'bg-[#003b57]/25 dark:bg-[#00a2d9]/20',
  prisma: 'bg-[#5a67d8]/25 dark:bg-[#5a67d8]/20',
  redis: 'bg-[#dc382d]/25 dark:bg-[#dc382d]/20',

  // Cloud & Infra
  docker: 'bg-[#2496ed]/25 dark:bg-[#2496ed]/20',
  nats: 'bg-[#27aae1]/25 dark:bg-[#27aae1]/20',
  'nats-jetstream': 'bg-[#27aae1]/25 dark:bg-[#27aae1]/20',
  aws: 'bg-[#e25444]/25 dark:bg-[#e25444]/20',
  s3: 'bg-[#e25444]/25 dark:bg-[#e25444]/20',
  's3-storage': 'bg-[#e25444]/25 dark:bg-[#e25444]/20',
  'amazon-s3': 'bg-[#e25444]/25 dark:bg-[#e25444]/20',

  // Networking & Realtime
  grpc: 'bg-[#244c5a]/25 dark:bg-[#00e5ff]/20',
  http: 'bg-[#6366f1]/25 dark:bg-[#6366f1]/20',
  'http-protocols': 'bg-[#6366f1]/25 dark:bg-[#6366f1]/20',
  network: 'bg-[#0284c7]/25 dark:bg-[#0284c7]/20',
  'tcp-udp': 'bg-[#0284c7]/25 dark:bg-[#0284c7]/20',
  stream: 'bg-[#5e17eb]/25 dark:bg-[#5e17eb]/20',
  sse: 'bg-[#5e17eb]/25 dark:bg-[#5e17eb]/20',
  'server-sent-events': 'bg-[#5e17eb]/25 dark:bg-[#5e17eb]/20',
  websocket: 'bg-[#231f20]/15 dark:bg-white/15',
  websockets: 'bg-[#231f20]/15 dark:bg-white/15',
  socketio: 'bg-black/10 dark:bg-white/15',
  'socket.io': 'bg-black/10 dark:bg-white/15',

  // Tools & AI
  git: 'bg-[#f05032]/25 dark:bg-[#f05032]/20',
  ai: 'bg-[#8b5cf6]/25 dark:bg-[#8b5cf6]/20',
  'llm-integration': 'bg-[#8b5cf6]/25 dark:bg-[#8b5cf6]/20',

  default: 'bg-foreground/[0.08] dark:bg-[#1a3832]/20',
};

/**
 * Dark-mode inversion list for monochromatic black logos that need brightness on dark themes.
 */
export const DARK_INVERT_SLUGS = new Set([
  'nextjs',
  'express',
  'prisma',
  'socketio',
  'socket.io',
  'websocket',
  'websockets',
  'rust',
]);

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
