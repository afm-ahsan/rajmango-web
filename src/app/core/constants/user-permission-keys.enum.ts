export enum UserPermissionKey {
  // ─── Core ──────────────────────────────────────────────────────────
  HasDashboardAccess    = 'hasDashboardAccess',
  HasHomeAccess         = 'hasHomeAccess',
  HasAdminAccess        = 'hasAdminAccess',
  HasMangoCatalogAccess = 'hasMangoCatalogAccess',

  // ─── Operations ────────────────────────────────────────────────────
  HasOrderAccess                 = 'hasOrderAccess',
  HasAdminOrdersAccess           = 'hasAdminOrdersAccess',
  HasAdminOrdersManageAccess     = 'hasAdminOrdersManageAccess',
  HasMangoTypeAccess         = 'hasMangoTypeAccess',
  HasMangoAvailabilityAccess = 'hasMangoAvailabilityAccess',
  HasCustomersAccess         = 'hasCustomersAccess',

  // ─── Finance ───────────────────────────────────────────────────────
  HasPaymentsAccess    = 'hasPaymentsAccess',
  HasExpenseTypeAccess = 'hasExpenseTypeAccess',
  HasExpensesAccess    = 'hasExpensesAccess',

  // ─── Logistics ─────────────────────────────────────────────────────
  HasCourierAccess             = 'hasCourierAccess',
  HasCourierProviderAccess     = 'hasCourierProviderAccess',
  HasCourierStationsAccess     = 'hasCourierStationsAccess',
  HasAreaMapAccess             = 'hasAreaMapAccess',
  HasCourierRateConfigAccess   = 'hasCourierRateConfigAccess',

  // ─── Customer Relations ────────────────────────────────────────────
  HasFeedbackAccess   = 'hasFeedbackAccess',
  HasComplaintsAccess = 'hasComplaintsAccess',

  // ─── Content ───────────────────────────────────────────────────────
  HasPoliciesAccess = 'hasPoliciesAccess',

  // ─── Reports ───────────────────────────────────────────────────────
  HasReportAccess = 'hasReportAccess',

  // ─── Administration ────────────────────────────────────────────────
  HasUsersAccess     = 'hasUsersAccess',
  HasUserRolesAccess = 'hasUserRolesAccess',
}
