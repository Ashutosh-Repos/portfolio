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

    const movies = await hobbiesService.getMediaEntries({
      type: 'movie',
      tier,
      watchStatus,
      search,
    });
    return handleSuccess(movies);
  } catch (err) {
    return handleError(err);
  }
}
