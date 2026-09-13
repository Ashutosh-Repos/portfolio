import { db, schema } from '../../db';
import { NotFoundError } from '../../core/errors';

export interface ProfileDto {
  id: string;
  name: string;
  headline: string;
  bio: string;
  currentFocus: string | null;
  location: string | null;
  availabilityStatus: string | null;
  socialLinks: Array<{
    platform: string;
    url: string;
    username: string;
    icon?: string;
  }>;
  updatedAt: number;
}

export class ProfileService {
  async getProfile(): Promise<ProfileDto> {
    const records = await db.select().from(schema.profile).limit(1);
    if (!records.length) {
      throw new NotFoundError('Profile');
    }
    const item = records[0];
    return {
      id: item.id,
      name: item.name,
      headline: item.headline,
      bio: item.bio,
      currentFocus: item.currentFocus,
      location: item.location,
      availabilityStatus: item.availabilityStatus,
      socialLinks: item.socialLinksJson ? JSON.parse(item.socialLinksJson) : [],
      updatedAt: item.updatedAt,
    };
  }
}

export const profileService = new ProfileService();
