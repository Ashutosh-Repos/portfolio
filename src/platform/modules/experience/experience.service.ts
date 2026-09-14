import { db, schema } from '../../db';
import { eq, asc, and } from 'drizzle-orm';
import { NotFoundError } from '../../core/errors';

export interface ExperienceDto {
  id: string;
  slug: string;
  company: string;
  role: string;
  employmentType: string;
  location: string | null;
  locationType: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  storyMarkdown: string | null;
  companyUrl: string | null;
  logoUrl: string | null;
  galleryId: string | null;
  sortOrder: number;
}

export class ExperienceService {
  async getExperiences(employmentType?: string): Promise<ExperienceDto[]> {
    const conditions = [];
    if (employmentType) {
      conditions.push(eq(schema.experience.employmentType, employmentType));
    }

    const query = db.select().from(schema.experience);
    const records = await (conditions.length > 0
      ? query
          .where(and(...conditions))
          .orderBy(asc(schema.experience.sortOrder))
      : query.orderBy(asc(schema.experience.sortOrder)));

    return records.map((item) => ({
      id: item.id,
      slug: item.slug,
      company: item.company,
      role: item.role,
      employmentType: item.employmentType,
      location: item.location,
      locationType: item.locationType,
      startDate: item.startDate,
      endDate: item.endDate,
      isCurrent: Boolean(item.isCurrent),
      description: item.description,
      responsibilities: item.responsibilitiesJson
        ? JSON.parse(item.responsibilitiesJson)
        : [],
      achievements: item.achievementsJson
        ? JSON.parse(item.achievementsJson)
        : [],
      technologies: item.technologiesJson
        ? JSON.parse(item.technologiesJson)
        : [],
      storyMarkdown: item.storyMarkdown,
      companyUrl: item.companyUrl,
      logoUrl: item.logoUrl,
      galleryId: item.galleryId,
      sortOrder: item.sortOrder,
    }));
  }

  async getExperienceBySlug(slug: string): Promise<ExperienceDto> {
    const records = await db
      .select()
      .from(schema.experience)
      .where(eq(schema.experience.slug, slug))
      .limit(1);

    if (!records.length) {
      throw new NotFoundError('Experience', slug);
    }

    const item = records[0];
    return {
      id: item.id,
      slug: item.slug,
      company: item.company,
      role: item.role,
      employmentType: item.employmentType,
      location: item.location,
      locationType: item.locationType,
      startDate: item.startDate,
      endDate: item.endDate,
      isCurrent: Boolean(item.isCurrent),
      description: item.description,
      responsibilities: item.responsibilitiesJson
        ? JSON.parse(item.responsibilitiesJson)
        : [],
      achievements: item.achievementsJson
        ? JSON.parse(item.achievementsJson)
        : [],
      technologies: item.technologiesJson
        ? JSON.parse(item.technologiesJson)
        : [],
      storyMarkdown: item.storyMarkdown,
      companyUrl: item.companyUrl,
      logoUrl: item.logoUrl,
      galleryId: item.galleryId,
      sortOrder: item.sortOrder,
    };
  }
}

export const experienceService = new ExperienceService();
