# Frontend Convention — Angular 13 + Metronic v8 for RajMango Web

## Scope

This convention applies to the active `rajmango-web` Angular application.

```text
Angular 13
TypeScript
RxJS
Reactive Forms
Metronic theme v8
```

Do not introduce Angular 17/18/20/21 patterns, standalone-only architecture, signals, zoneless change detection, or new `@if/@for` syntax unless a separate upgrade is approved.

---

## Architecture Direction

Use practical feature-based Angular architecture.

Recommended structure:

```text
src/app/
├── core/
│   ├── auth/
│   ├── guards/
│   ├── interceptors/
│   ├── services/
│   ├── api/
│   └── models/
├── shared/
│   ├── components/
│   ├── directives/
│   ├── pipes/
│   ├── validators/
│   └── utilities/
├── modules/
│   ├── dashboard/
│   ├── customers/
│   ├── mango-types/
│   ├── orders/
│   ├── payments/
│   ├── couriers/
│   ├── reports/
│   └── settings/
└── layout/
```

If the existing project differs but works, preserve it and improve incrementally.

---

## Angular 13 Rules

Use:

- NgModules.
- Lazy-loaded feature modules.
- Reactive Forms.
- RxJS with managed subscriptions.
- Route guards.
- HTTP interceptors.
- Existing Metronic v8 layout conventions.

Avoid:

- Standalone components as the default architecture.
- Angular signals.
- New Angular control-flow syntax.
- Large UI rewrites before launch.
- Mixing another UI framework into Metronic screens.

---

## Feature Module Structure

Recommended shape:

```text
modules/orders/
├── orders.module.ts
├── orders-routing.module.ts
├── pages/
│   ├── order-list/
│   ├── order-create/
│   └── order-detail/
├── components/
│   ├── order-form/
│   └── order-status-badge/
├── services/
│   └── order.facade.ts
├── models/
│   └── order-view.model.ts
└── validators/
```

Rules:

- Pages handle routing and orchestration.
- Components handle reusable UI.
- Facades coordinate API calls, loading state, and UI workflow.
- Shared components must not depend on feature modules.
- Avoid god services.

---

## Naming

Feature folders:

```text
orders
mango-types
couriers
customer-profile
admin-dashboard
```

Class names:

```text
OrdersModule
OrderListComponent
CreateOrderComponent
OrderService
OrderDto
```

File names:

```text
order-list.component.ts
order-list.component.html
order-list.component.scss
order.service.ts
order.model.ts
orders-routing.module.ts
orders.module.ts
```

---

## Forms

Use Reactive Forms for create/edit screens.

Rules:

- Show validation messages near fields.
- Show error summary on failed submit.
- Disable save while saving.
- Show loader/spinner during save.
- Validate client-side for usability.
- Trust backend as final authority for totals and rules.

Launch-critical validation:

```text
Customer name required
Phone number required
Mango type required
Crate type required
Quantity minimum 10 kg
Delivery address required
Receiver phone required when receiver is provided
Payment transaction ID required when applicable
```

---

## API Integration

Recommended generated client folder:

```text
src/app/core/api/
├── rajmango-api.generated.ts
├── api-base-url.token.ts
└── api.module.ts
```

Rules:

- Prefer generated API clients from Swagger/OpenAPI.
- Do not manually edit generated clients.
- Use feature facades to wrap API client usage.
- Avoid duplicate request/response models.
- Handle API errors through a central interceptor.

---

## RxJS Rules

- Prefer `async` pipe where practical.
- Manage manual subscriptions using existing project pattern.
- Avoid nested subscriptions.
- Use mapping operators intentionally.
- Use `finalize()` to stop loaders.
- Avoid memory leaks in long-lived screens.

---

## Metronic v8 Rules

- Reuse existing layout, cards, buttons, modals, tables, and forms.
- Keep admin screens visually consistent.
- Use responsive Metronic grid classes.
- Avoid unnecessary custom CSS.
- Do not introduce another UI library before launch.

---

## Launch Screens

Customer:

```text
Register/Login
Profile
Saved Addresses
Saved Receivers
Mango Catalog
Create Order
My Orders
Order Details
Payment Status
```

Admin:

```text
Dashboard
Mango Type Management
Mango Availability/Pricing
Order Management
Payment Management
Courier Provider/Station Management
Basic Reports
```

---

## Error Handling

Use central HTTP error handling.

```text
400 show validation errors
401 redirect to login
403 show access denied
404 show not found
409 show conflict message
500 show generic error
```

Never show raw stack traces to users.

---

## Security

- Protect admin routes.
- Hide admin UI from customers.
- Backend must still enforce authorization.
- Do not expose another customer’s order/payment data.
- Sanitize user-entered display content.
- Avoid unsafe token storage changes without approval.

---

## Claude Rules

Claude must:

- Inspect existing Angular 13 structure first.
- Follow current Metronic v8 patterns.
- Avoid Angular upgrades.
- Keep launch changes small.
- Prefer working user flows over refactoring.
- Report changed files clearly.
