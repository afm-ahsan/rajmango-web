# Clean Code Convention — RajMango

## Scope

Applies to RajMango backend, frontend, database, API contracts, testing, documentation, and Claude Code work.

---

## Universal Principles

Prefer:

- Simple over clever.
- Explicit over magical.
- Small changes over risky rewrites.
- Working launch-critical flow over perfect abstraction.
- Domain-specific names over generic names.
- Tests around business rules.
- Consistent structure over personal preference.

Avoid:

- Empty placeholder files.
- Dead code.
- Commented-out code.
- Large mixed-purpose changes.
- Duplicated business logic.
- Hardcoded secrets.
- Silent exception swallowing.

---

## Naming

Good examples:

```text
CreateOrderCommand
CalculateOrderTotal
MangoAvailability
CourierStation
PaymentStatus
CustomerAddress
```

Bad examples:

```text
DoStuff
DataManager
Helper
Info
ProcessData
TempService
```

Rules:

- Classes/components: PascalCase.
- Methods/functions: verb-first.
- Booleans: `is`, `has`, `can`, `should`.
- Avoid unclear abbreviations.
- Use names that match RajMango business language.

---

## Backend Rules

- Controllers must be thin.
- Business logic belongs in application/domain services.
- Use DTOs at API boundaries.
- Do not expose EF entities directly.
- Use async/await properly.
- Pass `CancellationToken` where practical.
- Use structured logging.
- Do not log sensitive data.
- Validate important rules server-side.
- Keep error responses consistent.
- Use role-based authorization.

---

## CQRS Rules

- Commands change state.
- Queries read state.
- Handlers orchestrate; they should not become god classes.
- Validators validate command/query inputs.
- Commands and queries return DTOs.
- Do not put HTTP-specific types inside handlers.
- Do not put EF query logic inside controllers.

---

## Database Rules

- Use migrations for schema changes.
- Use descriptive migration names.
- Use decimal/numeric types for money.
- Add indexes for real query paths.
- Avoid destructive changes without review.
- Keep audit columns for sensitive business entities.
- Enforce important constraints where practical.
- Do not mix SQL Server and PostgreSQL syntax.

---

## API Rules

- Backend contract is the source of truth.
- Swagger/OpenAPI must be kept accurate.
- Frontend clients should be generated from OpenAPI where practical.
- Generated API files must not be manually edited.
- Return consistent errors.
- Version breaking API changes carefully.

---

## Security Rules

- Default to deny.
- Authorize sensitive operations.
- Customers must only see their own data.
- Admin/finance/operations/support roles must have clear boundaries.
- Never commit secrets.
- Never log passwords, tokens, or sensitive payment data.
- Validate all external input.
- Use HTTPS in production.
- Maintain audit logs for sensitive changes.

---

## Testing Rules

Prioritize testing:

- Minimum order quantity.
- Crate calculation.
- Mango availability.
- Order total calculation.
- Authorization boundaries.
- Payment status changes.
- Order status transitions.
- API contract behavior.

Test naming:

```text
MethodName_Scenario_ExpectedResult
```

Examples:

```text
CalculateTotal_WhenTwoCrates_ReturnsExpectedAmount
CreateOrder_WhenMangoUnavailable_ReturnsValidationError
UpdatePayment_WhenAmountPaidFully_SetsStatusPaid
```

---

## Documentation Rules

Update documentation when:

- API routes change.
- DTO contracts change.
- Database schema changes.
- Business rules change.
- Setup/deployment steps change.
- Claude session work needs continuation.

Keep documentation concise and maintainable.

---

## Claude Working Rules

Claude must:

1. Read `CLAUDE.md`.
2. Inspect current files before generating new ones.
3. Follow `docs/conventions/`.
4. Make small, safe changes.
5. Avoid framework upgrades unless explicitly requested.
6. Avoid deleting code without explaining why.
7. Summarize changed files and next steps.

Required response format:

```text
Completed:
Changed files:
Validation:
Risks:
Next:
```
