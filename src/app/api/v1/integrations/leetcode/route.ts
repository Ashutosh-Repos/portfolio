import { syncService } from '@/platform/integrations/sync.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET() {
  try {
    const snapshot = await syncService.getSnapshot('leetcode_overview');
    return handleSuccess(snapshot.data, {
      count: 1,
      hasMore: false,
    });
  } catch (err) {
    return handleError(err);
  }
}
