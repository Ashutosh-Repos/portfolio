import { NextRequest } from 'next/server';
import { hobbiesService } from '@/platform/modules/hobbies/hobbies.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET(request: NextRequest) {
  try {
    const tier = request.nextUrl.searchParams.get('tier') || undefined;
    const watchStatus = request.nextUrl.searchParams.get('status') || undefined;
    const search =
      request.nextUrl.searchParams.get('search') ||
      request.nextUrl.searchParams.get('q') ||
      undefined;

    const series = await hobbiesService.getMediaEntries({
      type: 'tv_series',
      tier,
      watchStatus,
      search,
    });
    return handleSuccess(series);
  } catch (err) {
    return handleError(err);
  }
}
