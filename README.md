# RajMango Web

Frontend repository for RajMango, a seasonal mango business automation platform.

## Purpose

This repository supports the web UI for:

- Customer registration/login
- Customer profile
- Mango catalog and availability
- Order placement
- Crate-based ordering
- Payment status tracking
- Courier station selection
- Customer dashboard
- Admin dashboard
- Basic reports

## Active Stack

```text
Angular 13
TypeScript
RxJS
Reactive Forms
Metronic Theme v8
```

## Documentation Map

```text
CLAUDE.md
docs/conventions/frontend-angular.md
docs/conventions/clean-code.md
.claude/rules/frontend.md
.claude/commands/analyze-frontend.md
.claude/commands/api-sync.md
```

## Launch Scope

Focus first on:

```text
Customer registration/login
Customer profile
Mango catalog
Mango availability/pricing
Order placement
10 kg / 20 kg crate support
Minimum 10 kg order rule
Manual payment tracking UI
Courier information UI
Customer dashboard
Admin dashboard
Basic reports
API client sync
```

## Frontend Rules

- Use Angular 13 patterns.
- Use NgModules and lazy-loaded feature modules.
- Use Reactive Forms.
- Use RxJS responsibly.
- Reuse Metronic v8 layout and UI styles.
- Do not introduce Angular standalone/signals/new control-flow syntax.
- Do not introduce React into this active app.

## Local Development

```bash
npm install
npm start
```

Adjust commands according to actual `package.json` scripts.

## API Sync

`rajmango-api` is the source of truth.

Recommended flow:

```text
rajmango-api Swagger/OpenAPI
        ↓
Generated Angular TypeScript client
        ↓
rajmango-web
```

Generated API files must not be manually edited.

## Claude Code Usage

Claude must read `CLAUDE.md` before modifying code.

For frontend work, Claude must follow:

```text
docs/conventions/frontend-angular.md
docs/conventions/clean-code.md
.claude/rules/frontend.md
```
