import { educationService } from '@/platform/modules/education/education.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const item = await educationService.getEducationBySlug(slug);
    return handleSuccess(item);
  } catch (err) {
    return handleError(err);
  }
}
