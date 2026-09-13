import { db, schema } from '../../db';
import { eq, asc } from 'drizzle-orm';
import { NotFoundError } from '../../core/errors';

export interface EducationDto {
  id: string;
  slug: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  gradeOrCgpa: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  highlights: string[];
  links: Array<{ title: string; url: string; type?: string }>;
  logoUrl?: string | null;
  galleryId?: string | null;
  sortOrder: number;
}

export class EducationService {
  async getEducationList(): Promise<EducationDto[]> {
    const records = await db
      .select()
      .from(schema.education)
      .orderBy(asc(schema.education.sortOrder));

    return records.map((item) => ({
      id: item.id,
      slug: item.slug,
      institution: item.institution,
      degree: item.degree,
      fieldOfStudy: item.fieldOfStudy,
      gradeOrCgpa: item.gradeOrCgpa,
      location: item.location,
      startDate: item.startDate,
      endDate: item.endDate,
      isCurrent: Boolean(item.isCurrent),
      description: item.description,
      highlights: item.highlightsJson ? JSON.parse(item.highlightsJson) : [],
      links: item.linksJson ? JSON.parse(item.linksJson) : [],
      galleryId: item.galleryId,
      sortOrder: item.sortOrder,
    }));
  }

  async getEducationBySlug(slug: string): Promise<EducationDto> {
    const records = await db
      .select()
      .from(schema.education)
      .where(eq(schema.education.slug, slug))
      .limit(1);

    if (!records.length) {
      throw new NotFoundError('Education entry', slug);
    }

    const item = records[0];
    return {
      id: item.id,
      slug: item.slug,
      institution: item.institution,
      degree: item.degree,
      fieldOfStudy: item.fieldOfStudy,
      gradeOrCgpa: item.gradeOrCgpa,
      location: item.location,
      startDate: item.startDate,
      endDate: item.endDate,
      isCurrent: Boolean(item.isCurrent),
      description: item.description,
      highlights: item.highlightsJson ? JSON.parse(item.highlightsJson) : [],
      links: item.linksJson ? JSON.parse(item.linksJson) : [],
      galleryId: item.galleryId,
      sortOrder: item.sortOrder,
    };
  }
}

export const educationService = new EducationService();
