import { NextRequest } from 'next/server';
import { projectService } from '@/platform/modules/project/project.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status') || undefined;
    const featuredOnly = request.nextUrl.searchParams.get('featured') === 'true';
    const limit = request.nextUrl.searchParams.get('limit')
      ? parseInt(request.nextUrl.searchParams.get('limit')!, 10)
      : undefined;

    const projects = await projectService.getProjects({ status, featuredOnly, limit });
    return handleSuccess(projects);
  } catch (err) {
    return handleError(err);
  }
}
