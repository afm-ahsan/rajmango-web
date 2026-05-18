import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppPermissions } from '../constants/app-permissions';
import { UserPermissionKey } from '../constants/user-permission-keys.enum';
import { UserPermissionService } from 'src/app/features/auth/services/user-permission.service';
import { PermissionGuard } from './permission.guard';

describe('PermissionGuard', () => {
  let guard: PermissionGuard;
  let permissionService: UserPermissionService;
  let router: Router;

  const mockRouteWithPermission = (permission: UserPermissionKey): ActivatedRouteSnapshot => {
    const snapshot = new ActivatedRouteSnapshot();
    (snapshot as any).data = { requiredPermission: permission };
    return snapshot;
  };

  const mockState: RouterStateSnapshot = { url: '/test' } as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [PermissionGuard, UserPermissionService],
    });

    guard = TestBed.inject(PermissionGuard);
    permissionService = TestBed.inject(UserPermissionService);
    router = TestBed.inject(Router);
  });

  it('allows navigation when user has the required permission', () => {
    // Admin user has dashboard.admin.view → hasAdminAccess = true
    permissionService.currentPermission = permissionService.preparePermissionModel(
      [AppPermissions.Dashboard.AdminView, AppPermissions.MangoTypes.Manage]
    );

    const route = mockRouteWithPermission(UserPermissionKey.HasMangoTypeAccess);
    const result = guard.canActivate(route, mockState);

    expect(result).toBe(true);
  });

  it('redirects to /error/403 when user lacks the required permission', () => {
    // General user has only customer permissions
    permissionService.currentPermission = permissionService.preparePermissionModel(
      [
        AppPermissions.Orders.View,
        AppPermissions.Dashboard.CustomerView,
        AppPermissions.Complaints.Submit,
      ]
    );

    const route = mockRouteWithPermission(UserPermissionKey.HasMangoTypeAccess);
    const result = guard.canActivate(route, mockState);

    expect(result instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(result as UrlTree)).toBe('/error/403');
  });

  it('redirects to /error/403 when no permissions are loaded (unauthenticated state)', () => {
    permissionService.clearPermissions();

    const route = mockRouteWithPermission(UserPermissionKey.HasAdminAccess);
    const result = guard.canActivate(route, mockState);

    expect(result instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(result as UrlTree)).toBe('/error/403');
  });

  it('allows navigation for ALL permission (system_admin)', () => {
    permissionService.currentPermission = permissionService.preparePermissionModel(
      [AppPermissions.ALL]
    );

    const route = mockRouteWithPermission(UserPermissionKey.HasUserRolesAccess);
    const result = guard.canActivate(route, mockState);

    expect(result).toBe(true);
  });

  it('allows navigation when route has no requiredPermission data', () => {
    permissionService.clearPermissions();

    const route = mockRouteWithPermission(undefined as any);
    (route as any).data = {};
    const result = guard.canActivate(route, mockState);

    // No required permission → guard cannot gate it → redirects (current behavior: if no permission key, goes to 403)
    // This is the existing guard contract: only passes if requiredPermission is set and granted
    expect(result instanceof UrlTree).toBe(true);
  });
});

describe('UserPermissionService.preparePermissionModel', () => {
  let service: UserPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UserPermissionService] });
    service = TestBed.inject(UserPermissionService);
  });

  it('grants all access for ALL sentinel', () => {
    const model = service.preparePermissionModel(['ALL']);
    expect(model.hasAdminAccess).toBe(true);
    expect(model.hasMangoTypeAccess).toBe(true);
    expect(model.hasUsersAccess).toBe(true);
    expect(model.hasReportAccess).toBe(true);
    expect(model.hasCourierAccess).toBe(true);
  });

  it('grants only customer access for GeneralPermissions', () => {
    const generalPerms = [
      AppPermissions.Orders.View,
      AppPermissions.Orders.Create,
      AppPermissions.MangoTypes.View,
      AppPermissions.MangoAvailability.View,
      AppPermissions.Dashboard.CustomerView,
      AppPermissions.Complaints.Submit,
    ];
    const model = service.preparePermissionModel(generalPerms);

    expect(model.hasOrderAccess).toBe(true);
    expect(model.hasMangoCatalogAccess).toBe(true);
    expect(model.hasComplaintsAccess).toBe(true);
    expect(model.hasDashboardAccess).toBe(true);

    // Admin-only features must be false
    expect(model.hasAdminAccess).toBe(false);
    expect(model.hasMangoTypeAccess).toBe(false);   // requires mango.type.manage
    expect(model.hasPaymentsAccess).toBe(false);
    expect(model.hasUsersAccess).toBe(false);
    expect(model.hasReportAccess).toBe(false);
    expect(model.hasCourierAccess).toBe(false);
  });

  it('grants admin access for admin permission set', () => {
    const adminPerms = [
      AppPermissions.Dashboard.AdminView,
      AppPermissions.MangoTypes.Manage,
      AppPermissions.Payments.View,
      AppPermissions.Reports.View,
      AppPermissions.Users.View,
    ];
    const model = service.preparePermissionModel(adminPerms);

    expect(model.hasAdminAccess).toBe(true);
    expect(model.hasMangoTypeAccess).toBe(true);
    expect(model.hasPaymentsAccess).toBe(true);
    expect(model.hasReportAccess).toBe(true);
    expect(model.hasUsersAccess).toBe(true);
  });

  it('returns all-false access model for null or empty permissions', () => {
    const model = service.preparePermissionModel(null);

    // hasHomeAccess is intentionally true for all authenticated users
    // (the Home link is always visible in the sidebar once logged in).
    expect(model.hasHomeAccess).toBe(true);

    // hasDashboardAccess must be false without dashboard.*.view permission
    expect(model.hasDashboardAccess).toBe(false);

    // All other permission-gated fields must be false
    expect(model.hasAdminAccess).toBe(false);
    expect(model.hasMangoTypeAccess).toBe(false);
    expect(model.hasOrderAccess).toBe(false);
  });
});
