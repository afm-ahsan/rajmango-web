import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppPermissions } from 'src/app/core/constants/app-permissions';
import { UserPermissionKey } from 'src/app/core/constants/user-permission-keys.enum';
import { UserAccessModel } from '../models/user-access.model';

@Injectable({ providedIn: 'root' })
export class UserPermissionService {
  private currentPermissionSubject = new BehaviorSubject<UserAccessModel | null>(null);
  readonly currentPermission$: Observable<UserAccessModel | null> = this.currentPermissionSubject.asObservable();

  get currentPermission(): UserAccessModel | null {
    return this.currentPermissionSubject.value;
  }

  set currentPermission(permission: UserAccessModel | null) {
    this.currentPermissionSubject.next(permission);
  }

  setCurrentPermission(permission: UserAccessModel): void {
    this.currentPermissionSubject.next(permission);
  }

  clearPermissions(): void {
    this.currentPermissionSubject.next(null);
  }

  hasAccess(key: UserPermissionKey): boolean {
    return !!this.currentPermission?.[key];
  }

  /**
   * Builds the frontend UserAccessModel from the backend login response.
   *
   * Source: GetAuthUserDto.permissions — a flat string array of permission strings
   * matching RajMango.Shared.Permissions.
   * e.g. ["user.view", "order.view", "mango.type.manage"]
   *
   * Special case: ["ALL"] is used by system_admin → every flag is true.
   *
   * @param permissions  Flat string array of permission strings from GetAuthUserDto.permissions
   */
  preparePermissionModel(permissions: string[] | null | undefined): UserAccessModel {
    const grants = new Set(permissions ?? []);
    const isAll  = grants.has(AppPermissions.ALL);
    const can    = (p: string): boolean => isAll || grants.has(p);

    return {
      // ─── Visible to all authenticated users ─────────────────────
      hasHomeAccess:    true,
      hasDashboardAccess: can(AppPermissions.Dashboard.AdminView) || can(AppPermissions.Dashboard.CustomerView),
      hasMangoCatalogAccess: can(AppPermissions.MangoTypes.View),
      hasOrderAccess:       can(AppPermissions.Orders.View),
      hasAdminOrdersAccess: can(AppPermissions.Orders.AdminView),
      hasComplaintsAccess: can(AppPermissions.Complaints.Submit) || can(AppPermissions.Complaints.AdminView),
      hasPoliciesAccess: can(AppPermissions.Policies.View),

      // ─── Admin section gate (shows admin accordion in sidebar) ───
      hasAdminAccess: can(AppPermissions.Dashboard.AdminView),

      // ─── Admin — Operations ──────────────────────────────────────
      hasMangoTypeAccess:         can(AppPermissions.MangoTypes.Manage),
      hasMangoAvailabilityAccess: can(AppPermissions.MangoAvailability.Manage),
      hasCustomersAccess:         can(AppPermissions.Customers.View),

      // ─── Admin — Finance ─────────────────────────────────────────
      hasPaymentsAccess:    can(AppPermissions.Payments.View),
      hasExpenseTypeAccess: can(AppPermissions.ExpenseTypes.View),
      hasExpensesAccess:    can(AppPermissions.Expenses.View),

      // ─── Logistics ───────────────────────────────────────────────
      hasCourierProviderAccess:   can(AppPermissions.CourierProviders.View)   || can(AppPermissions.Couriers.View),
      hasCourierStationsAccess:   can(AppPermissions.CourierStations.View)    || can(AppPermissions.Couriers.View),
      hasAreaMapAccess:           can(AppPermissions.CourierAreaMaps.View)    || can(AppPermissions.Couriers.View),
      hasCourierRateConfigAccess: can(AppPermissions.CourierRateConfigs.View) || can(AppPermissions.Couriers.View),
      hasCourierAccess:
        can(AppPermissions.CourierProviders.View)   ||
        can(AppPermissions.CourierStations.View)    ||
        can(AppPermissions.CourierAreaMaps.View)    ||
        can(AppPermissions.CourierRateConfigs.View) ||
        can(AppPermissions.Couriers.View),

      // ─── Customer Relations ──────────────────────────────────────
      hasFeedbackAccess: can(AppPermissions.Feedback.AdminView),

      // ─── Reports / Users ─────────────────────────────────────────
      hasReportAccess:    can(AppPermissions.Reports.View),
      hasUsersAccess:     can(AppPermissions.Users.View),
      hasUserRolesAccess: can(AppPermissions.Roles.View),
    };
  }
}
