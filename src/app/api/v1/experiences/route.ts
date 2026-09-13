import { NextRequest } from 'next/server';
import { experienceService } from '@/platform/modules/experience/experience.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') || undefined;
    const experiences = await experienceService.getExperiences(type);
    return handleSuccess(experiences);
  } catch (err) {
    return handleError(err);
  }
}
