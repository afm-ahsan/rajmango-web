import { Component, OnInit } from '@angular/core';
import { UserPermissionKey } from 'src/app/core/constants/user-permission-keys.enum';
import { UserPermissionService } from 'src/app/features/auth/services/user-permission.service';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {

  constructor(public permissionService: UserPermissionService) {}

  ngOnInit(): void {}

  // ─── Core ──────────────────────────────────────────────────────────
  get canViewAdminSection(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasAdminAccess);
  }
  get canViewMangoCatalog(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasMangoCatalogAccess);
  }
  get canViewOrders(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasOrderAccess);
  }
  get canViewComplaints(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasComplaintsAccess);
  }
  get canViewPolicies(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasPoliciesAccess);
  }

  // ─── Admin — Operations ────────────────────────────────────────────
  get canViewMangoTypes(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasMangoTypeAccess);
  }
  get canViewMangoAvailability(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasMangoAvailabilityAccess);
  }
  get canViewCustomers(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasCustomersAccess);
  }

  // ─── Admin — Finance ───────────────────────────────────────────────
  get canViewPayments(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasPaymentsAccess);
  }
  get canViewExpenseTypes(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasExpenseTypeAccess);
  }
  get canViewExpenses(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasExpensesAccess);
  }

  // ─── Admin — Logistics ─────────────────────────────────────────────
  get canViewCourier(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasCourierAccess);
  }
  get canViewCourierProviders(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasCourierProviderAccess);
  }
  get canViewCourierStations(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasCourierStationsAccess);
  }
  get canViewAreaMap(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasAreaMapAccess);
  }

  // ─── Admin — Customer Relations / Reports / Admin ──────────────────
  get canViewFeedback(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasFeedbackAccess);
  }
  get canViewReports(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasReportAccess);
  }
  get canViewUsers(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasUsersAccess);
  }
  get canViewRoles(): boolean {
    return this.permissionService.hasAccess(UserPermissionKey.HasUserRolesAccess);
  }
}
