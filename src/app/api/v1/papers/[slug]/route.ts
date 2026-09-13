import { NextRequest } from 'next/server';
import { writingService } from '@/platform/modules/writing/writing.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const writing = await writingService.getWritingBySlug(slug, 'research_paper').catch(() =>
      writingService.getWritingBySlug(slug)
    );
    return handleSuccess(writing);
  } catch (err) {
    return handleError(err);
  }
}
