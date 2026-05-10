import { Routes } from '@angular/router';

const Routing: Routes = [
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
    path: 'couriers',
    loadChildren: () =>
      import('../features/couriers/courier.module').then(
        (m) => m.CourierModule
      ),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('../features/orders/order.module').then(
        (m) => m.OrderModule
      ),
  },
  { path: 'crafted/pages/profile', children: [{ path: '**', redirectTo: '/customer-profile/profile' }] },
  { path: 'crafted/account', children: [{ path: '**', redirectTo: '/customer-profile/profile' }] },
  {
    path: 'mango-types',
    loadChildren: () =>
      import('../features/mango-types/mango-type.module').then(
        (m) => m.MangoTypeModule
      ),
  },
  {
    path: 'expenses',
    loadChildren: () =>
      import('../features/expenses/expense/expense.module').then(
        (m) => m.ExpenseModule
      ),
  },
  {
    path: 'expense-types',
    loadChildren: () =>
      import('../features/expenses/expense-type/expense-type.module').then(
        (m) => m.ExpenseTypeModule
      ),
  },
  {
    path: 'payment-methods',
    loadChildren: () =>
      import('../features/expenses/payment-type/payment-type.module').then(
        (m) => m.PaymentTypeModule
      ),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../features/users/user.module').then((m) => m.UserModule),
  },
  {
    path: 'roles',
    loadChildren: () =>
      import('../features/roles/role.module').then((m) => m.RoleModule),
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('../features/customers/customer.module').then(
        (m) => m.CustomerModule
      ),
  },
  {
    path: 'payments',
    loadChildren: () =>
      import('../features/payments/payment.module').then((m) => m.PaymentModule),
  },
  {
    path: 'customer-profile',
    loadChildren: () =>
      import('../features/customer-profile/customer-profile.module').then(
        (m) => m.CustomerProfileModule
      ),
  },
  {
    path: 'mango-availability',
    loadChildren: () =>
      import('../features/mango-availability/mango-availability.module').then(
        (m) => m.MangoAvailabilityModule
      ),
  },
  {
    path: 'mango-catalog',
    loadChildren: () =>
      import('../features/mango-catalog/mango-catalog.module').then(
        (m) => m.MangoCatalogModule
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('../features/reports/report.module').then((m) => m.ReportModule),
  },
  {
    path: 'feedback',
    loadChildren: () =>
      import('../features/feedback/feedback.module').then((m) => m.FeedbackModule),
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

