import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { NotificationDto } from '../models/notification.model';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
})
export class NotificationListComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  isLoading = false;
  isMarkingAll = false;
  notifications: NotificationDto[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 20;
  unreadCount = 0;

  constructor(
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
    this.subs.sink = this.notificationService.unreadCount$.subscribe(c => {
      this.unreadCount = c;
      this.cdRef.detectChanges();
    });
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.notificationService.getPaged(this.pageNumber, this.pageSize)
      .pipe(finalize(() => { this.isLoading = false; this.cdRef.detectChanges(); }))
      .subscribe({
        next: (res: any) => {
          this.notifications = res?.data ?? [];
          this.totalCount = res?.totalCount ?? 0;
        },
        error: () => {
          this.notifications = [];
          this.totalCount = 0;
        },
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

  pageChanged(page: number): void {
    this.pageNumber = page;
    this.load();
  }

  pageSizeChanged(size: number): void {
    this.pageNumber = 1;
    this.pageSize = size;
    this.load();
  }

  typeIcon(type: number): string {
    switch (type) {
      case 1: return 'bi-bag-check';
      case 2: return 'bi-credit-card';
      case 3: return 'bi-truck';
      case 4: return 'bi-calendar-check';
      default: return 'bi-bell';
    }
  }

  typeIconColor(type: number): string {
    switch (type) {
      case 1: return 'text-primary';
      case 2: return 'text-success';
      case 3: return 'text-info';
      case 4: return 'text-warning';
      default: return 'text-muted';
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
