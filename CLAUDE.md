# CLAUDE.md — RajMango Web

You are working inside the **RajMango frontend repository** only.

## Repository Scope

```text
rajmango-web
```

This repo owns:

- Angular 13 frontend application
- Metronic v8 UI integration
- Customer/admin screens
- Frontend routing and guards
- API client usage
- UI validation and user experience
- Frontend tests where available

Do **not** modify backend code from this repo.

---

## Current Active Stack

```text
Angular 13
TypeScript
RxJS
Reactive Forms
Metronic theme v8
Generated API clients from backend Swagger/OpenAPI where practical
```

Do not introduce React, Angular standalone-only architecture, Angular signals, Angular new control-flow syntax, or Metronic v9 into this active Angular 13 application unless explicitly requested.

---

## Read First

Before making frontend changes, read:

```text
README.md
docs/conventions/frontend-angular.md
docs/conventions/clean-code.md
.claude/rules/frontend.md
```

If a BRD exists in this repo, read it before planning business screens.

---

## Launch-First Frontend Priorities

Focus only on launch-critical RajMango screens:

1. Customer registration/login/profile
2. Mango catalog and availability
3. Order placement
4. Crate selection: 10 kg and 20 kg, minimum order 10 kg
5. Manual payment tracking UI
6. Courier provider/station selection
7. Customer dashboard
8. Admin dashboard
9. Basic reports
10. API sync with backend-generated clients

Defer unless already implemented:

```text
Full bKash gateway
Advanced Google Maps distance calculation
Chatbot/FAQ
Marketplace/vendor comparison
Mobile app
Advanced AI analytics
```

---

## Frontend Working Rules

Always:

- Inspect existing Angular structure before adding files.
- Preserve Angular 13 and Metronic v8 patterns.
- Keep UI changes small and launch-focused.
- Use Reactive Forms for create/edit flows.
- Show clear validation messages.
- Show loading and error states.
- Use route guards for protected screens.
- Use API clients generated from Swagger/OpenAPI where practical.
- Keep customer-facing screens mobile-friendly.

Never:

- Upgrade Angular.
- Introduce React into this repo.
- Replace Metronic v8.
- Manually duplicate backend DTOs if generated models exist.
- Manually edit generated API client files.
- Hardcode API URLs if environment configuration exists.
- Expose admin screens to customer users.

---

## API Sync Rule

`rajmango-api` is the source of truth.

Frontend must:

- Consume generated Angular TypeScript API clients where practical.
- Keep generated API files separate from hand-written code.
- Wrap generated clients in feature facades where useful.
- Avoid duplicate request/response models.
- Regenerate clients when backend contracts change.

---

## Required Response Format

After each task, respond with:

```text
Completed:
Changed files:
Validation:
Risks:
Next:
```
