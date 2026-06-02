import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { SubSink } from 'subsink';
import { AuthService } from 'src/app/features/auth';
import { UserPermissionService } from 'src/app/features/auth/services/user-permission.service';
import { UserPermissionKey } from 'src/app/core/constants/user-permission-keys.enum';
import { NotificationService } from 'src/app/features/notifications/notification.service';
import { AdminOrderFilterModel } from 'src/app/features/orders/models/admin-order-list-dto.model';
import { OrderService } from 'src/app/features/orders/order.service';
import { MenuComponent } from 'src/app/_metronic/kt/components';

@Component({
  selector: 'app-quick-links-inner',
  templateUrl: './quick-links-inner.component.html',
  styleUrls: ['./quick-links-inner.component.scss'],
})
export class QuickLinksInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column w-300px w-lg-375px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  isAdmin = false;
  unreadCount = 0;
  pendingOrderCount = 0;

  private subs = new SubSink();

  constructor(
    private auth: AuthService,
    private permissionService: UserPermissionService,
    private notificationService: NotificationService,
    private orderService: OrderService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.auth.currentUser$
      .pipe(filter(u => !!u))
      .subscribe(() => {
        this.isAdmin = this.permissionService.hasAccess(UserPermissionKey.HasAdminAccess);
        if (this.isAdmin) this.loadPendingOrderCount();
        this.cdRef.detectChanges();
      });

    this.subs.sink = this.notificationService.unreadCount$.subscribe(c => {
      this.unreadCount = c;
      this.cdRef.detectChanges();
    });
  }

  private loadPendingOrderCount(): void {
    const adminFilter: AdminOrderFilterModel = {
      pageNumber: 1,
      pageSize: 1,
      sortBy: 'orderDate',
      sortOrder: 'desc',
      orderStatus: 0,
    };
    this.subs.sink = this.orderService.getAdminPaged(adminFilter).subscribe({
      next: (res: any) => {
        this.pendingOrderCount = res?.totalCount ?? 0;
        this.cdRef.detectChanges();
      },
    });
  }

  orderMangoes(): void {
    MenuComponent.hideDropdowns(undefined);
    this.router.navigate(['/orders/order-list'], { queryParams: { new: '1' } });
  }

  go(path: string): void {
    MenuComponent.hideDropdowns(undefined);
    this.router.navigate([path]);
  }

  openTrackOrder(): void {
    MenuComponent.hideDropdowns(undefined);
    window.open('/track-order', '_blank', 'noopener');
  }

  openContactUs(): void {
    MenuComponent.hideDropdowns(undefined);
    window.open('/contact-us', '_blank', 'noopener');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
