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

  preparePermissionModel(userPermissions: Partial<UserAccessModel>): UserAccessModel {
    return {
      hasDashboardAccess: true,// !!userPermissions.hasDashboardAccess,
      hasHomeAccess: true,//!!userPermissions.hasHomeAccess,
      hasOrderAccess: true,//!!userPermissions.hasOrderAccess,

      hasCourierAccess: true,//!!userPermissions.hasCourierAccess,
      hasCourierProviderAccess: true,//!!userPermissions.hasCourierProviderAccess,
      hasCourierStationsAccess: true,//!!userPermissions.hasCourierStationsAccess,
      hasAreaMapAccess: true,//!!userPermissions.hasAreaMapAccess,
    };
  }
}
