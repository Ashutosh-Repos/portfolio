/**
 * Standard API Response and Pagination utilities.
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: ApiPaginationMeta;
  error?: {
    code: string;
    message: string;
    statusCode: number;
    details?: unknown;
  };
}

export interface ApiPaginationMeta {
  count: number;
  total?: number;
  hasMore: boolean;
  nextCursor?: string | null;
  page?: number;
  limit?: number;
}

export interface PaginationParams {
  limit?: number;
  cursor?: string;
  page?: number;
}

export function parsePaginationParams(
  searchParams: URLSearchParams,
): PaginationParams {
  const limitParam = searchParams.get('limit');
  const cursor = searchParams.get('cursor') || undefined;
  const pageParam = searchParams.get('page');

  const limit = limitParam
    ? Math.min(Math.max(parseInt(limitParam, 10) || 20, 1), 100)
    : 20;
  const page = pageParam
    ? Math.max(parseInt(pageParam, 10) || 1, 1)
    : undefined;

  return { limit, cursor, page };
}

export function encodeCursor(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function decodeCursor<T = Record<string, unknown>>(
  cursor: string,
): T | null {
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function createSuccessResponse<T>(
  data: T,
  meta?: ApiPaginationMeta,
): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };
}

export function createErrorResponse(
  message: string,
  code = 'INTERNAL_ERROR',
  statusCode = 500,
  details?: unknown,
): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      statusCode,
      ...(details !== undefined ? { details } : {}),
    },
  };
}
