import { db, schema } from '../../db';
import { eq, asc, and } from 'drizzle-orm';

export interface SkillDto {
  id: string;
  slug: string;
  name: string;
  category: string;
  proficiencyTier: string;
  yearsOfExperience: number | null;
  iconSlug: string | null;
  isFeatured: boolean;
  sortOrder: number;
}

export interface AchievementDto {
  id: string;
  slug: string;
  title: string;
  issuer: string;
  category: string;
  dateAwarded: string;
  credentialUrl: string | null;
  description: string | null;
}

export class SkillsService {
  async getSkills(
    options: { category?: string; featuredOnly?: boolean } = {},
  ): Promise<SkillDto[]> {
    const conditions = [];
    if (options.category) {
      conditions.push(eq(schema.skill.category, options.category));
    }
    if (options.featuredOnly) {
      conditions.push(eq(schema.skill.isFeatured, true));
    }

    const query = db.select().from(schema.skill);
    const records = await (conditions.length > 0
      ? query.where(and(...conditions)).orderBy(asc(schema.skill.sortOrder))
      : query.orderBy(asc(schema.skill.sortOrder)));

    return records.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      category: item.category,
      proficiencyTier: item.proficiencyTier,
      yearsOfExperience: item.yearsOfExperience,
      iconSlug: item.iconSlug,
      isFeatured: Boolean(item.isFeatured),
      sortOrder: item.sortOrder,
    }));
  }

  async getAchievements(category?: string): Promise<AchievementDto[]> {
    const query = db.select().from(schema.achievement);
    const records = await (category
      ? query
          .where(eq(schema.achievement.category, category))
          .orderBy(asc(schema.achievement.sortOrder))
      : query.orderBy(asc(schema.achievement.sortOrder)));

    return records.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      issuer: item.issuer,
      category: item.category,
      dateAwarded: item.dateAwarded,
      credentialUrl: item.credentialUrl,
      description: item.description,
    }));
  }
}

export const skillsService = new SkillsService();
