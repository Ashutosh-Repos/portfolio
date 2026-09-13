import { db, schema } from '../../db';
import { eq, asc } from 'drizzle-orm';
import { NotFoundError } from '../../core/errors';

export interface EducationMediaDto {
  id: string;
  publicUrl: string;
  altText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
}

export interface EducationGalleryDto {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  items: EducationMediaDto[];
}

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
  gallery?: EducationGalleryDto | null;
  sortOrder: number;
}

export class EducationService {
  async getEducationList(): Promise<EducationDto[]> {
    const records = await db
      .select()
      .from(schema.education)
      .orderBy(asc(schema.education.sortOrder));

    const galleryMap = new Map<string, EducationGalleryDto>();
    const galleryIds = records.map((r) => r.galleryId).filter(Boolean) as string[];

    if (galleryIds.length > 0) {
      const galleries = await db.select().from(schema.gallery);
      for (const g of galleries) {
        const items = await db
          .select({
            id: schema.mediaItem.id,
            publicUrl: schema.mediaItem.publicUrl,
            altText: schema.mediaItem.altText,
            caption: schema.mediaItem.caption,
            width: schema.mediaItem.width,
            height: schema.mediaItem.height,
          })
          .from(schema.galleryItem)
          .innerJoin(schema.mediaItem, eq(schema.galleryItem.mediaId, schema.mediaItem.id))
          .where(eq(schema.galleryItem.galleryId, g.id))
          .orderBy(asc(schema.galleryItem.sortOrder));

        galleryMap.set(g.id, {
          id: g.id,
          slug: g.slug,
          title: g.title,
          description: g.description,
          items,
        });
      }
    }

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
      gallery: item.galleryId ? galleryMap.get(item.galleryId) || null : null,
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
