import { HttpErrorResponse } from '@angular/common/http';

const UNSAFE_FIELDS = new Set([
  'stackTrace', 'exception', 'innerException', 'source', 'traceId', 'exceptionDetails'
]);

export function extractApiErrorMessage(
  error: HttpErrorResponse | any,
  fallback = 'An unexpected error occurred. Please try again.'
): string {
  if (!error) return fallback;

  if (error.status === 0) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  const body = error.error;
  if (!body) return fallback;

  // Plain string body
  if (typeof body === 'string' && body.trim()) {
    const text = body.trim();
    if (!looksLikeTechnicalError(text)) {
      return text;
    }
    return fallback;
  }

  const messages: string[] = [];

  // string[] body
  if (Array.isArray(body)) {
    for (const item of body) {
      if (typeof item === 'string' && item.trim()) {
        messages.push(item.trim());
      }
    }
  } else if (typeof body === 'object') {
    // { succeeded: false, messages: string[] }
    if (Array.isArray(body.messages)) {
      for (const m of body.messages) {
        if (typeof m === 'string' && m.trim()) messages.push(m.trim());
      }
    }

    // { message: string }
    if (!messages.length && typeof body.message === 'string' && body.message.trim()) {
      messages.push(body.message.trim());
    }

    // { errors: string[] }
    if (!messages.length && Array.isArray(body.errors)) {
      for (const e of body.errors) {
        if (typeof e === 'string' && e.trim()) messages.push(e.trim());
      }
    }

    // ASP.NET ProblemDetails: { errors: { fieldName: string[] } }
    if (!messages.length && body.errors && typeof body.errors === 'object' && !Array.isArray(body.errors)) {
      for (const key of Object.keys(body.errors)) {
        if (UNSAFE_FIELDS.has(key)) continue;
        const val = (body.errors as Record<string, any>)[key];
        if (Array.isArray(val)) {
          for (const v of val) {
            if (typeof v === 'string' && v.trim()) messages.push(v.trim());
          }
        }
      }
    }

    // ASP.NET ProblemDetails: { title } fallback
    if (!messages.length && typeof body.title === 'string' && body.title.trim()
        && !looksLikeTechnicalError(body.title)) {
      messages.push(body.title.trim());
    }
  }

  if (messages.length) {
    return [...new Set(messages)].join(' ');
  }

  return fallback;
}

function looksLikeTechnicalError(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes('stack trace') ||
    lower.includes('at system.') ||
    lower.includes('at microsoft.') ||
    lower.includes('exception:') ||
    lower.includes('innerexception') ||
    lower.includes('unhandled exception')
  );
}
