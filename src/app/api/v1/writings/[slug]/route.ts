import { writingService } from '@/platform/modules/writing/writing.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const writing = await writingService.getWritingBySlug(slug);
    return handleSuccess(writing);
  } catch (err) {
    return handleError(err);
  }
}
