import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { NotificationDto } from 'src/app/features/notifications/models/notification.model';
import { NotificationService } from 'src/app/features/notifications/notification.service';

@Component({
  selector: 'app-notifications-inner',
  templateUrl: './notifications-inner.component.html',
})
export class NotificationsInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class') readonly class =
    'menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px';
  @HostBinding('attr.data-kt-menu') readonly dataKtMenu = 'true';

  isLoading = false;
  notifications: NotificationDto[] = [];
  isMarkingAll = false;

  private subs = new SubSink();

  constructor(
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.notificationService.getLatest()
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      }))
      .subscribe({
        next: (res: any) => {
          this.notifications = res?.data ?? [];
          this.notificationService.refreshUnreadCount();
        },
        error: () => { this.notifications = []; },
      });
  }

  markAsRead(n: NotificationDto): void {
    if (n.isRead) return;
    this.notificationService.markAsRead(n.id).subscribe({
      next: () => {
        n.isRead = true;
        this.notificationService.refreshUnreadCount();
        this.cdRef.detectChanges();
      },
    });
  }

  markAllAsRead(): void {
    if (this.isMarkingAll) return;
    this.isMarkingAll = true;
    this.notificationService.markAllAsRead()
      .pipe(finalize(() => { this.isMarkingAll = false; this.cdRef.detectChanges(); }))
      .subscribe({
        next: () => {
          this.notifications.forEach(n => (n.isRead = true));
          this.notificationService.refreshUnreadCount();
          this.cdRef.detectChanges();
        },
      });
  }

  viewAll(): void {
    this.router.navigate(['/notifications']);
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  timeAgo(dateStr: string): string {
    const now = new Date();
    const d = new Date(dateStr);
    const diffMs = now.getTime() - d.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
