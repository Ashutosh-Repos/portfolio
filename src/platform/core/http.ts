import { NextResponse } from 'next/server';
import { DomainError } from './errors';
import {
  createSuccessResponse,
  createErrorResponse,
  type ApiPaginationMeta,
} from './pagination';

export interface RouteHandlerOptions {
  cacheSeconds?: number;
  staleWhileRevalidateSeconds?: number;
  isPrivate?: boolean;
}

export function handleSuccess<T>(
  data: T,
  meta?: ApiPaginationMeta,
  options: RouteHandlerOptions = {},
): NextResponse {
  const response = NextResponse.json(createSuccessResponse(data, meta));

  if (!options.isPrivate) {
    const sMaxAge = options.cacheSeconds ?? 3600;
    const swr = options.staleWhileRevalidateSeconds ?? 86400;
    response.headers.set(
      'Cache-Control',
      `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`,
    );
  } else {
    response.headers.set(
      'Cache-Control',
      'private, no-cache, no-store, must-revalidate',
    );
  }

  return response;
}

export function handleError(error: unknown): NextResponse {
  if (error instanceof DomainError) {
    return NextResponse.json(
      createErrorResponse(
        error.message,
        error.code,
        error.statusCode,
        error.details,
      ),
      { status: error.statusCode },
    );
  }

  const message =
    error instanceof Error
      ? error.message
      : 'An unexpected server error occurred.';
  return NextResponse.json(
    createErrorResponse(message, 'INTERNAL_SERVER_ERROR', 500),
    { status: 500 },
  );
}
