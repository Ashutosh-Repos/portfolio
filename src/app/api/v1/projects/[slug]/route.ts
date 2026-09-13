import { projectService } from '@/platform/modules/project/project.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const project = await projectService.getProjectBySlug(slug);
    return handleSuccess(project);
  } catch (err) {
    return handleError(err);
  }
}
