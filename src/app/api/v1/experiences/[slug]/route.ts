import { experienceService } from '@/platform/modules/experience/experience.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const item = await experienceService.getExperienceBySlug(slug);
    return handleSuccess(item);
  } catch (err) {
    return handleError(err);
  }
}
