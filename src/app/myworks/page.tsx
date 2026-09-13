import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/liquid/Container';
import LinkPreview from '@/components/ui/link-preview';
import { projectService } from '@/platform/modules/project/project.service';
import { getPublicProjects } from '@/lib/github-projects';
import { GLASS_OPTICS } from '@/lib/glass-config';

export const metadata: Metadata = {
  title: 'My Works — Ashutosh Kumar',
  description:
    'Open-source projects, systems, libraries, and tools built and maintained by Ashutosh Kumar.',
};

export default async function MyWorksPage() {
  let projectList: Array<{
    name: string;
    url: string;
    stars: number;
    description: string;
    language?: string;
    technologies: string[];
    isFeatured: boolean;
  }> = [];

  try {
    const dbProjects = await projectService.getProjects({ limit: 50 });
    if (dbProjects && dbProjects.length > 0) {
      projectList = dbProjects.map((p) => ({
        name: p.title,
        url: p.demoUrl || p.github?.repoUrl || `https://github.com/Ashutosh-Repos/${p.slug}`,
        stars: p.github?.stars ?? 0,
        description: p.description,
        language: p.github?.primaryLanguage || p.technologies[0] || 'TypeScript',
        technologies: p.technologies,
        isFeatured: p.featuredPriority !== null,
      }));
    }
  } catch {
    // fallback
  }

  if (projectList.length === 0) {
    const fallbackProjects = await getPublicProjects(50);
    projectList = fallbackProjects.map((p) => ({
      name: p.name,
      url: p.url,
      stars: p.stars,
      description: p.description,
      language: p.language,
      technologies: p.language ? [p.language] : [],
      isFeatured: Boolean(p.isPinned),
    }));
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4 pb-16">
      <Link
        href="/"
        className="text-sm font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-2"
      >
        &larr; Back to Home
      </Link>

      <Container
        className="p-6 sm:p-7 rounded-[32px] bg-[#d5ede6]/20 dark:bg-[#1a3832]/20 transition-all duration-300 w-full"
        radius={36}
        optics={GLASS_OPTICS}
      >
        <div className="py-1 px-0.5 flow-root">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-foreground">
              <span className="font-light text-xl md:text-2xl">All</span>{' '}
              <span className="text-foreground/50 text-base">public</span>{' '}
              <span className="italic text-xl font-light">projects</span>
            </h1>
            <LinkPreview
              url="https://github.com/Ashutosh-Repos"
              dotGap={6}
              dotSize={2}
              dotOffset={-1}
              className="text-xs font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-1 shrink-0"
            >
              GitHub profile &rarr;
            </LinkPreview>
          </div>

          <p className="pt-3 text-sm text-foreground/80 leading-relaxed">
            Open-source systems, libraries, distributed engines, and developer tools built and maintained in the open.
          </p>

          <ul className="pt-6 flex flex-col gap-4">
            {projectList.map((project) => (
              <li
                key={project.name}
                className="flex flex-col gap-2 min-w-0 pb-4 border-b border-black/[0.04] dark:border-white/[0.04] last:border-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4">
                  <div className="flex items-baseline gap-3 shrink-0 flex-wrap">
                    <span className="font-mono text-xs text-foreground/50 shrink-0 w-11 text-right tabular-nums flex items-center justify-end gap-1 select-none">
                      <span className="text-foreground/40 text-[10px]">★</span>
                      <span>{project.stars.toLocaleString()}</span>
                    </span>

                    <LinkPreview
                      url={project.url}
                      multiline={false}
                      dotGap={6}
                      dotSize={2}
                      dotOffset={-1}
                      className="text-base font-medium text-foreground hover:text-foreground transition-colors shrink-0"
                    >
                      {project.name}
                    </LinkPreview>

                    {project.language && (
                      <span className="text-[11px] font-mono text-foreground/50 px-1.5 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.04]">
                        {project.language}
                      </span>
                    )}

                    {project.isFeatured && (
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        featured
                      </span>
                    )}
                  </div>
                </div>

                {project.description && (
                  <p className="text-xs sm:text-sm text-foreground/75 pl-[56px] leading-relaxed font-normal">
                    {project.description}
                  </p>
                )}

                {project.technologies.length > 1 && (
                  <div className="flex flex-wrap gap-1.5 pl-[56px] pt-1">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono text-foreground/45 px-1.5 py-0.5 rounded bg-black/[0.02] dark:bg-white/[0.03]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
