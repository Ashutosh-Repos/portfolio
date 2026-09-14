import { NextRequest } from 'next/server';
import { blogService } from '@/platform/modules/blogs/blog.service';
import { handleSuccess, handleError } from '@/platform/core/http';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const blog = await blogService.getBlogBySlug(slug);
    return handleSuccess(blog);
  } catch (err) {
    return handleError(err);
  }
}
