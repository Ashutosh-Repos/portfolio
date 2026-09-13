/**
 * Core domain and API error hierarchy.
 * Framework-agnostic error classes that map cleanly to HTTP status codes.
 */

export class DomainError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, code = 'INTERNAL_ERROR', statusCode = 500, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, identifier?: string) {
    super(
      identifier ? `${resource} with identifier '${identifier}' was not found.` : `${resource} not found.`,
      'RESOURCE_NOT_FOUND',
      404
    );
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_FAILED', 400, details);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = 'Authentication required to access this resource.') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class ExternalProviderError extends DomainError {
  constructor(provider: string, message: string, details?: unknown) {
    super(`External provider '${provider}' failed: ${message}`, 'PROVIDER_ERROR', 502, details);
  }
}
