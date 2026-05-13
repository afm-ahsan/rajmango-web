import { Routes } from '@angular/router';
import { PermissionGuard } from '../core/guards/permission.guard';
import { UserPermissionKey } from '../core/constants/user-permission-keys.enum';

const Routing: Routes = [
  // ─── Customer-facing (all authenticated users) ───────────────────────
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../features/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('../features/orders/order.module').then((m) => m.OrderModule),
  },
  {
    path: 'mango-catalog',
    loadChildren: () =>
      import('../features/mango-catalog/mango-catalog.module').then((m) => m.MangoCatalogModule),
  },
  {
    path: 'customer-profile',
    loadChildren: () =>
      import('../features/customer-profile/customer-profile.module').then((m) => m.CustomerProfileModule),
  },
  {
    path: 'complaints',
    loadChildren: () =>
      import('../features/complaints/complaint.module').then((m) => m.ComplaintModule),
  },
  {
    path: 'policies',
    loadChildren: () =>
      import('../features/policies/policy.module').then((m) => m.PolicyModule),
  },

  // ─── Legacy Metronic profile redirects ───────────────────────────────
  { path: 'crafted/pages/profile', children: [{ path: '**', redirectTo: '/customer-profile/profile' }] },
  { path: 'crafted/account', children: [{ path: '**', redirectTo: '/customer-profile/profile' }] },

  // ─── Admin — Operations ───────────────────────────────────────────────
  {
    path: 'mango-types',
    canActivate: [PermissionGuard],
    data: { requiredPermission: UserPermissionKey.HasMangoTypeAccess },
    loadChildren: () =>
      import('../features/mango-types/mango-type.module').then((m) => m.MangoTypeModule),
  },
  {
    path: 'mango-availability',
    canActivate: [PermissionGuard],
    data: { requiredPermission: UserPermissionKey.HasMangoAvailabilityAccess },
    loadChildren: () =>
      import('../features/mango-availability/mango-availability.module').then((m) => m.MangoAvailabilityModule),
  },
  {
    path: 'customers',
    canActivate: [PermissionGuard],
    data: { requiredPermission: UserPermissionKey.HasCustomersAccess },
    loadChildren: () =>
      import('../features/customers/customer.module').then((m) => m.CustomerModule),
  },

  // ─── Admin — Finance ─────────────────────────────────────────────────
  {
    path: 'payments',
    canActivate: [PermissionGuard],
    data: { requiredPermission: UserPermissionKey.HasPaymentsAccess },
    loadChildren: () =>
      import('../features/payments/payment.module').then((m) => m.PaymentModule),
  },
  {
    path: 'expenses',
    canActivate: [PermissionGuard],
    data: { requiredPermission: UserPermissionKey.HasExpensesAccess },
    loadChildren: () =>
      import('../features/expenses/expense/expense.module').then((m) => m.ExpenseModule),
  },
  {
    path: 'expense-types',
    canActivate: [PermissionGuard],
    data: { requiredPermission: UserPermissionKey.HasExpenseTypeAccess },
    loadChildren: () =>
      import('../features/expenses/expense-type/expense-type.module').then((m) => m.ExpenseTypeModule),
  },
  {
    path: 'payment-methods',
    canActivate: [PermissionGuard],
    data: { requiredPermission: UserPermissionKey.HasExpenseTypeAccess },
    loadChildren: () =>
      import('../features/expenses/payment-type/payment-type.module').then((m) => m.PaymentTypeModule),
  },

  // ─── Admin — Logistics ────────────────────────────────────────────────
  {
    path: 'couriers',
    canActivate: [PermissionGuard],
    data: { requiredPermission: UserPermissionKey.HasCourierAccess },
    loadChildren: () =>
      import('../features/couriers/courier.module').then((m) => m.CourierModule),
  },

  // ─── Admin — Customer Relations / Reports ────────────────────────────
  {
    path: 'feedback',
    canActivate: [PermissionGuard],
    data: { requiredPermission: UserPermissionKey.HasFeedbackAccess },
    loadChildren: () =>
      import('../features/feedback/feedback.module').then((m) => m.FeedbackModule),
  },
  {
    path: 'reports',
    canActivate: [PermissionGuard],
    data: { requiredPermission: UserPermissionKey.HasReportAccess },
    loadChildren: () =>
      import('../features/reports/report.module').then((m) => m.ReportModule),
  },

  // ─── Admin — Administration ───────────────────────────────────────────
  {
    path: 'users',
    canActivate: [PermissionGuard],
    data: { requiredPermission: UserPermissionKey.HasUsersAccess },
    loadChildren: () =>
      import('../features/users/user.module').then((m) => m.UserModule),
  },
  {
    path: 'roles',
    canActivate: [PermissionGuard],
    data: { requiredPermission: UserPermissionKey.HasUserRolesAccess },
    loadChildren: () =>
      import('../features/roles/role.module').then((m) => m.RoleModule),
  },

  // ─── Fallback ────────────────────────────────────────────────────────
  {
    path: '',
    redirectTo: '/dashboard/customer',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };

