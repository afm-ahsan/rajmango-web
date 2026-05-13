import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserPermissionService } from 'src/app/features/auth/services/user-permission.service';
import { UserPermissionKey } from '../constants/user-permission-keys.enum';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(
    private permissionService: UserPermissionService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //const requiredPermission: keyof UserAccessModel = next.data['requiredPermission'];
    const requiredPermission = next.data['requiredPermission'] as UserPermissionKey;


    if (requiredPermission && this.permissionService.hasAccess(requiredPermission)) {
      return true;
    }

    return this.router.createUrlTree(['/error/403']);
  }
}
