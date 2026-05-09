# Frontend Rule — RajMango Web

You are working in `rajmango-web` only.

## Must Follow

Read before frontend work:

```text
CLAUDE.md
README.md
docs/conventions/frontend-angular.md
docs/conventions/clean-code.md
.claude/rules/frontend.md
```

## Guardrails

- Do not modify backend code.
- Do not upgrade Angular 13.
- Do not introduce React.
- Do not replace Metronic v8.
- Do not use Angular signals/new control-flow syntax.
- Do not manually edit generated API clients.
- Do not duplicate backend DTOs if generated models exist.
- Do not expose admin UI to customer users.

## Frontend Priorities

Focus on:

```text
Authentication/profile UI
Mango catalog/availability UI
Order placement UI
Crate validation UI
Payment tracking UI
Courier selection UI
Customer dashboard
Admin dashboard
Basic reports
API client sync
```

## Required Behavior

Before coding:

1. Inspect current Angular structure.
2. Identify existing patterns.
3. Propose a short plan.
4. Make small changes only.
5. Summarize changed files and validation steps.

## API Contract

The frontend consumes the backend OpenAPI contract.

When API client changes are needed, explicitly state:

```text
Requires backend Swagger JSON: Yes/No
Generated client updated: Yes/No
Manual model duplication removed: Yes/No
Affected screens:
```
