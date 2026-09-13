import { educationService } from '@/platform/modules/education/education.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET() {
  try {
    const list = await educationService.getEducationList();
    return handleSuccess(list);
  } catch (err) {
    return handleError(err);
  }
}
