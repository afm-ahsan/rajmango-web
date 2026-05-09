# Command — API Sync

Use this command when frontend API contracts need alignment with backend.

## Goal

Keep `rajmango-web` aligned with `rajmango-api` through Swagger/OpenAPI-generated clients.

## Rules

- `rajmango-api` is the source of truth.
- Generated API files must not be manually edited.
- Feature code should call generated clients through a clean facade/service.
- Avoid hand-written duplicate DTOs when generated models exist.

## Frontend Steps

1. Locate current API integration approach.
2. Locate generated client folder if it exists.
3. Check whether models are duplicated manually.
4. Check whether base URL is environment-driven.
5. Check whether HTTP interceptors handle auth/errors.
6. Identify required backend Swagger/OpenAPI input.
7. Propose or run generation only if configured.

## Output Format

```text
Swagger source:
Generated client location:
Manual DTO duplication found:
Affected feature modules:
Recommended sync command:
Risks:
Next:
```

Do not modify backend code from this frontend repo unless explicitly allowed.
