# Web Authorization Refactor Prompt

You are a senior solution architect and enterprise frontend engineer.

Your task is to refactor the current frontend authorization system into a production-grade permission-based UI authorization architecture.

## Core Principle

- Frontend uses permissions ONLY for UI visibility.
- Backend remains the final security authority.
- Remove ALL role-based UI logic.
- Keep implementation reusable across all applications.

---

# Permission Naming Convention

Use:

module.resource.action

Examples:

- order.view
- order.create
- order.update
- payment.receive
- inventory.adjust
- report.sales.view

Never hardcode permission strings repeatedly.

---

# Refactor Requirements

## Step 1 — Analyze Existing Frontend

Find and refactor all:

- role === 'Admin'
- hasRole(...)
- role-based menu rendering
- role-based guards
- hardcoded role checks

Analyze:
- Existing auth flow
- Existing menu/sidebar rendering
- Existing route guards
- Existing caching/session handling

---

# Implement Permission-Based UI

Create or refactor:

- PermissionService
- AuthFacade
- PermissionGuard
- Permission directive/helper
- Permission-aware sidebar/menu rendering

Example:

```ts
can(permission: string): boolean
```

Usage:

```html
<button *ngIf="permissionService.can('order.create')">
  Create Order
</button>
```

Menu example:

```ts
{
  label: 'Orders',
  route: '/orders',
  permission: 'order.view'
}
```

---

# Frontend Security Rule

Frontend permission checks are ONLY for UX visibility.

Backend authorization is the final authority.

Never trust frontend permissions alone.

---

# Login & Permission Loading

After login/profile load:

- fetch user permissions
- cache safely
- initialize permission state
- initialize menu visibility

Avoid scattered permission loading logic.

Centralize permission handling.

---

# Route Guard Requirements

Protect routes using permission guards.

Example:

```ts
{
  path: 'orders/create',
  canActivate: [PermissionGuard],
  data: {
    permission: 'order.create'
  }
}
```

Unauthorized users should:
- see friendly error handling
- redirect properly
- never see protected pages

---

# Sidebar/Menu Requirements

Sidebar/menu must be permission-driven.

Avoid:

```ts
if(role === 'Admin')
```

Use:

```ts
permissionService.can('order.view')
```

Menu visibility should dynamically adapt.

---

# Strong Typing Requirements

Use:
- strongly typed DTOs
- reusable models
- centralized permission constants if project supports it
- facade/service pattern where applicable

Avoid:
- duplicated permission strings
- scattered authorization logic

---

# Caching Requirements

Handle:
- session refresh
- logout cleanup
- permission reload after login
- cache invalidation after role updates if applicable

Do not keep stale permissions.

---

# UI/UX Requirements

Requirements:

- proper loading indicators
- graceful unauthorized handling
- responsive permission-aware UI
- clean menu rendering
- avoid flickering unauthorized content

---

# Testing Requirements

Frontend tests should include:

- route guard tests
- menu visibility tests
- button/action visibility tests
- unauthorized navigation tests

---

# Production Readiness

Requirements:

- reusable architecture
- strongly typed implementation
- minimal duplication
- clean code
- SOLID principles
- scalable permission handling
- no hardcoded role checks

---

# Deliverables

Provide:

1. Frontend permission refactor
2. PermissionService/AuthFacade updates
3. Permission guards
4. Menu/sidebar refactor
5. Tests
6. Summary of changed files
7. Verification checklist

---

# Execution Rule

Proceed incrementally.

After every major step:
- build frontend
- run tests
- verify application still works

Keep the application usable throughout the refactor process.
