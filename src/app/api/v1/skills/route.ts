import { NextRequest } from 'next/server';
import { skillsService } from '@/platform/modules/skills/skills.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category') || undefined;
    const featuredOnly =
      request.nextUrl.searchParams.get('featured') === 'true';

    const skills = await skillsService.getSkills({ category, featuredOnly });
    return handleSuccess(skills);
  } catch (err) {
    return handleError(err);
  }
}
