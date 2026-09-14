import { NextRequest } from 'next/server';
import { syncService } from '@/platform/integrations/sync.service';
import { handleSuccess, handleError } from '@/platform/core/http';
import { UnauthorizedError } from '@/platform/core/errors';

export async function POST(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');

    // In production, enforce secret validation
    if (process.env.NODE_ENV === 'production' && cronSecret) {
      if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
        throw new UnauthorizedError(
          'Invalid or missing synchronization authorization token.',
        );
      }
    }

    const provider = request.nextUrl.searchParams.get('provider');

    if (provider === 'github') {
      const result = await syncService.syncGitHub();
      return handleSuccess(result, undefined, { isPrivate: true });
    } else if (provider === 'leetcode') {
      const result = await syncService.syncLeetCode();
      return handleSuccess(result, undefined, { isPrivate: true });
    }

    const results = await syncService.syncAll();
    return handleSuccess(results, undefined, { isPrivate: true });
  } catch (err) {
    return handleError(err);
  }
}

export async function GET(request: NextRequest) {
  // Support GET for Vercel Cron
  return POST(request);
}
