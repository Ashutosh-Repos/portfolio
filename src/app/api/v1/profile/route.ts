import { profileService } from '@/platform/modules/profile/profile.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET() {
  try {
    const profile = await profileService.getProfile();
    return handleSuccess(profile);
  } catch (err) {
    return handleError(err);
  }
}
