import React from 'react';
import Link from 'next/link';
import LinkPreview from '../ui/link-preview';
import { projectService } from '@/platform/modules/project/project.service';
import { getPublicProjects } from '@/lib/github-projects';

export const Projects = async () => {
  let projectList: Array<{
    name: string;
    url: string;
    stars: number;
    description: string;
  }> = [];

  try {
    const dbProjects = await projectService.getProjects({ limit: 7 });
    if (dbProjects && dbProjects.length > 0) {
      projectList = dbProjects.map((p) => ({
        name: p.title,
        url: p.demoUrl || p.github?.repoUrl || `https://github.com/Ashutosh-Repos/${p.slug}`,
        stars: p.github?.stars ?? 0,
        description: p.description,
      }));
    }
  } catch {
    // fallback
  }

  if (projectList.length === 0) {
    const fallbackProjects = await getPublicProjects(7);
    projectList = fallbackProjects.map((p) => ({
      name: p.name,
      url: p.url,
      stars: p.stars,
      description: p.description,
    }));
  }

  return (
    <div className="py-1 px-0.5 flow-root">
      {/* Header with All Projects link */}
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-foreground">
          <span className="font-light text-md md:text-lg">Open</span>{' '}
          <span className="text-foreground/50 text-sm">source</span>{' '}
          <span className="italic text-base font-light">projects</span>
        </h2>
        <Link
          href="/myworks"
          className="text-xs font-mono text-foreground/50 hover:text-foreground transition-colors inline-flex items-center gap-1 shrink-0 group"
        >
          <span>All projects</span>
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            &rarr;
          </span>
        </Link>
      </div>

      {/* Subtitle matching writing/paperself/blogs */}
      <p className="pt-3 text-sm text-foreground/90 leading-relaxed">
        Here are some of the open-source projects I&apos;ve built and maintained.
      </p>

      {/* Projects List inspired by Arpit Bhayani with GitHub stars */}
      <ul className="pt-4 flex flex-col gap-2.5">
        {projectList.map((project) => (
          <li
            key={project.name}
            className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 min-w-0"
          >
            {/* Stars and Project Title */}
            <div className="flex items-baseline gap-2.5 shrink-0">
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
                className="text-sm font-medium text-foreground hover:text-foreground transition-colors shrink-0"
              >
                {project.name}
              </LinkPreview>
            </div>

            {/* Description */}
            {project.description ? (
              <span
                className="text-xs text-foreground/60 truncate min-w-0 pl-13 sm:pl-0 font-normal"
                title={project.description}
              >
                {project.description}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
