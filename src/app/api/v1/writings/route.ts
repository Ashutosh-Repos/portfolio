import { NextRequest } from 'next/server';
import { writingService } from '@/platform/modules/writing/writing.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const status = searchParams.get('status') || undefined;
    const cursor = searchParams.get('cursor') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

    const result = await writingService.getWritings({ type, tag, status, limit, cursor });
    return handleSuccess(result.items, result.meta);
  } catch (err) {
    return handleError(err);
  }
}
