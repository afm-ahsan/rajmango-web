/**
 * Frontend permission string constants.
 * Mirror of RajMango.Shared.Permissions in the backend.
 * Convention: module.resource.action
 *
 * DO NOT rename these strings without updating the backend simultaneously.
 */
export const AppPermissions = {

  Users: {
    View:   'user.view',
    Create: 'user.create',
    Update: 'user.update',
    Delete: 'user.delete',
  },

  Roles: {
    View:   'role.view',
    Create: 'role.create',
    Update: 'role.update',
    Delete: 'role.delete',
  },

  Orders: {
    View:   'order.view',
    Create: 'order.create',
    Update: 'order.update',
    Delete: 'order.delete',
  },

  Payments: {
    View:   'payment.view',
    Create: 'payment.create',
    Update: 'payment.update',
    Delete: 'payment.delete',
  },

  Expenses: {
    View:   'expense.view',
    Create: 'expense.create',
    Update: 'expense.update',
    Delete: 'expense.delete',
  },

  ExpenseTypes: {
    View:   'expense.type.view',
    Create: 'expense.type.create',
    Update: 'expense.type.update',
    Delete: 'expense.type.delete',
  },

  Couriers: {
    View:   'courier.view',
    Create: 'courier.create',
    Update: 'courier.update',
    Delete: 'courier.delete',
  },

  Customers: {
    View:   'customer.view',
    Create: 'customer.create',
    Update: 'customer.update',
    Delete: 'customer.delete',
  },

  MangoTypes: {
    View:   'mango.type.view',
    Manage: 'mango.type.manage',
  },

  MangoAvailability: {
    View:   'mango.availability.view',
    Manage: 'mango.availability.manage',
  },

  Reports: {
    View: 'report.view',
  },

  Dashboard: {
    AdminView:    'dashboard.admin.view',
    CustomerView: 'dashboard.customer.view',
  },

  Complaints: {
    Submit:      'complaint.submit',
    AdminView:   'complaint.admin.view',
    AdminManage: 'complaint.admin.manage',
  },

  Faq: {
    Manage: 'faq.manage',
  },

  Policies: {
    View:   'policy.view',
    Manage: 'policy.manage',
  },

  Feedback: {
    AdminView: 'feedback.admin.view',
  },

  UserPermissions: {
    View:   'user.permission.view',
    Grant:  'user.permission.grant',
    Revoke: 'user.permission.revoke',
  },

  /** Sentinel used by system_admin role — grants all permissions. */
  ALL: 'ALL',

} as const;
