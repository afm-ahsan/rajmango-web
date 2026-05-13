export enum UserPermissionKey {
  // ─── Core ──────────────────────────────────────────────────────────
  HasDashboardAccess    = 'hasDashboardAccess',
  HasHomeAccess         = 'hasHomeAccess',
  HasAdminAccess        = 'hasAdminAccess',
  HasMangoCatalogAccess = 'hasMangoCatalogAccess',

  // ─── Operations ────────────────────────────────────────────────────
  HasOrderAccess             = 'hasOrderAccess',
  HasMangoTypeAccess         = 'hasMangoTypeAccess',
  HasMangoAvailabilityAccess = 'hasMangoAvailabilityAccess',
  HasCustomersAccess         = 'hasCustomersAccess',

  // ─── Finance ───────────────────────────────────────────────────────
  HasPaymentsAccess    = 'hasPaymentsAccess',
  HasExpenseTypeAccess = 'hasExpenseTypeAccess',
  HasExpensesAccess    = 'hasExpensesAccess',

  // ─── Logistics ─────────────────────────────────────────────────────
  HasCourierAccess         = 'hasCourierAccess',
  HasCourierProviderAccess = 'hasCourierProviderAccess',
  HasCourierStationsAccess = 'hasCourierStationsAccess',
  HasAreaMapAccess         = 'hasAreaMapAccess',

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
