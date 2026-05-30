export class UserAccessModel {
  // ─── Core ──────────────────────────────────────────────────────────
  hasDashboardAccess: boolean;
  hasHomeAccess: boolean;
  hasAdminAccess: boolean;
  hasMangoCatalogAccess: boolean;

  // ─── Operations ────────────────────────────────────────────────────
  hasOrderAccess: boolean;
  hasMangoTypeAccess: boolean;
  hasMangoAvailabilityAccess: boolean;
  hasCustomersAccess: boolean;

  // ─── Finance ───────────────────────────────────────────────────────
  hasPaymentsAccess: boolean;
  hasExpenseTypeAccess: boolean;
  hasExpensesAccess: boolean;

  // ─── Logistics ─────────────────────────────────────────────────────
  hasCourierAccess: boolean;
  hasCourierProviderAccess: boolean;
  hasCourierStationsAccess: boolean;
  hasAreaMapAccess: boolean;
  hasCourierRateConfigAccess: boolean;

  // ─── Customer Relations ────────────────────────────────────────────
  hasFeedbackAccess: boolean;
  hasComplaintsAccess: boolean;

  // ─── Content ───────────────────────────────────────────────────────
  hasPoliciesAccess: boolean;

  // ─── Reports ───────────────────────────────────────────────────────
  hasReportAccess: boolean;

  // ─── Administration ────────────────────────────────────────────────
  hasUsersAccess: boolean;
  hasUserRolesAccess: boolean;
}
