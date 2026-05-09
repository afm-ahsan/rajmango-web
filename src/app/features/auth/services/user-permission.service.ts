import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  hasAccess(key: UserPermissionKey): boolean {
    return !!this.currentPermission?.[key];
  }

  // When backend sends a structured permissions object, replace `true` with `!!userPermissions.<key>`.
  preparePermissionModel(userPermissions: Partial<UserAccessModel>): UserAccessModel {
    return {
      hasDashboardAccess: true,
      hasHomeAccess: true,
      hasAdminAccess: true,       // TODO: !!userPermissions.hasAdminAccess when backend sends role flag

      hasOrderAccess: true,

      hasCourierAccess: true,
      hasCourierProviderAccess: true,
      hasCourierStationsAccess: true,
      hasAreaMapAccess: true,

      hasMangoTypeAccess: true,
      hasMangoAvailabilityAccess: true,
      hasExpenseTypeAccess: true,
      hasExpensesAccess: true,
      hasUsersAccess: true,
      hasUserRolesAccess: true,
      hasCustomersAccess: true,
      hasPaymentsAccess: true,
      hasReportAccess: true,
    };
  }
}
