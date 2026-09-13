import { db, schema } from '../../db';
import { eq, asc, and, sql } from 'drizzle-orm';
import { NotFoundError } from '../../core/errors';

export interface ProjectDto {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  caseStudyMarkdown: string | null;
  status: string;
  featuredPriority: number | null;
  demoUrl: string | null;
  packageUrl: string | null;
  technologies: string[];
  architecture: string[];
  lessonsLearnedMarkdown: string | null;
  coverImageUrl: string | null;
  galleryId: string | null;
  sortOrder: number;
  github?: {
    repoId: string;
    fullName: string;
    stars: number;
    forks: number;
    openIssues: number;
    primaryLanguage: string | null;
    languages: Record<string, number>;
    latestCommitAt: number | null;
    repoUrl: string;
  } | null;
}

export class ProjectService {
  async getProjects(options: {
    status?: string;
    featuredOnly?: boolean;
    limit?: number;
  } = {}): Promise<ProjectDto[]> {
    const conditions = [];

    if (options.status) {
      conditions.push(eq(schema.project.status, options.status));
    }
    if (options.featuredOnly) {
      conditions.push(sql`${schema.project.featuredPriority} IS NOT NULL`);
    }

    const baseQuery = db
      .select({
        project: schema.project,
        github: schema.githubRepoSnapshot,
      })
      .from(schema.project)
      .leftJoin(
        schema.githubRepoSnapshot,
        eq(schema.project.githubRepoId, schema.githubRepoSnapshot.id)
      );

    const rows = await (conditions.length > 0
      ? baseQuery
          .where(and(...conditions))
          .orderBy(
            sql`CASE WHEN ${schema.project.featuredPriority} IS NULL THEN 1 ELSE 0 END`,
            asc(schema.project.featuredPriority),
            asc(schema.project.sortOrder)
          )
          .limit(options.limit || 50)
      : baseQuery
          .orderBy(
            sql`CASE WHEN ${schema.project.featuredPriority} IS NULL THEN 1 ELSE 0 END`,
            asc(schema.project.featuredPriority),
            asc(schema.project.sortOrder)
          )
          .limit(options.limit || 50));

    return rows.map(({ project, github }) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      tagline: project.tagline,
      description: project.description,
      caseStudyMarkdown: project.caseStudyMarkdown,
      status: project.status,
      featuredPriority: project.featuredPriority,
      demoUrl: project.demoUrl,
      packageUrl: project.packageUrl,
      technologies: project.technologiesJson ? JSON.parse(project.technologiesJson) : [],
      architecture: project.architectureJson ? JSON.parse(project.architectureJson) : [],
      lessonsLearnedMarkdown: project.lessonsLearnedMarkdown,
      coverImageUrl: project.coverImageUrl,
      galleryId: project.galleryId,
      sortOrder: project.sortOrder,
      github: github
        ? {
            repoId: github.id,
            fullName: github.fullName,
            stars: github.stars,
            forks: github.forks,
            openIssues: github.openIssues,
            primaryLanguage: github.primaryLanguage,
            languages: github.languagesJson ? JSON.parse(github.languagesJson) : {},
            latestCommitAt: github.latestCommitAt,
            repoUrl: github.repoUrl,
          }
        : null,
    }));
  }

  async getProjectBySlug(slug: string): Promise<ProjectDto> {
    const rows = await db
      .select({
        project: schema.project,
        github: schema.githubRepoSnapshot,
      })
      .from(schema.project)
      .leftJoin(
        schema.githubRepoSnapshot,
        eq(schema.project.githubRepoId, schema.githubRepoSnapshot.id)
      )
      .where(eq(schema.project.slug, slug))
      .limit(1);

    if (!rows.length) {
      throw new NotFoundError('Project', slug);
    }

    const { project, github } = rows[0];

    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      tagline: project.tagline,
      description: project.description,
      caseStudyMarkdown: project.caseStudyMarkdown,
      status: project.status,
      featuredPriority: project.featuredPriority,
      demoUrl: project.demoUrl,
      packageUrl: project.packageUrl,
      technologies: project.technologiesJson ? JSON.parse(project.technologiesJson) : [],
      architecture: project.architectureJson ? JSON.parse(project.architectureJson) : [],
      lessonsLearnedMarkdown: project.lessonsLearnedMarkdown,
      coverImageUrl: project.coverImageUrl,
      galleryId: project.galleryId,
      sortOrder: project.sortOrder,
      github: github
        ? {
            repoId: github.id,
            fullName: github.fullName,
            stars: github.stars,
            forks: github.forks,
            openIssues: github.openIssues,
            primaryLanguage: github.primaryLanguage,
            languages: github.languagesJson ? JSON.parse(github.languagesJson) : {},
            latestCommitAt: github.latestCommitAt,
            repoUrl: github.repoUrl,
          }
        : null,
    };
  }
}

export const projectService = new ProjectService();
