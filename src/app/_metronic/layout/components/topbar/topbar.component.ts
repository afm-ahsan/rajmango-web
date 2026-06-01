import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { environment } from 'src/environments/environment';
import { AuthService, UserType } from 'src/app/features/auth';
import { LayoutService } from '../../core/layout.service';
import { NotificationService } from 'src/app/features/notifications/notification.service';
import { SignalRService } from 'src/app/shared/services/signalr.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';

  currentUser: UserType;
  unreadCount = 0;

  constructor(
    private layout: LayoutService,
    private auth: AuthService,
    private notificationService: NotificationService,
    private signalR: SignalRService
  ) {}

  ngOnInit(): void {
    this.headerLeft = this.layout.getProp('header.left') as string;
    this.subs.sink = this.auth.currentUser$.subscribe(u => {
      this.currentUser = u;
      if (u) {
        this.notificationService.refreshUnreadCount();
      }
    });
    this.subs.sink = this.notificationService.unreadCount$.subscribe(c => {
      this.unreadCount = c;
    });
    this.subs.sink = this.signalR.orderStatusUpdated$.subscribe(() => {
      this.notificationService.refreshUnreadCount();
    });
  }

  headerAvatarUrl(): string {
    const path = this.currentUser?.imagePath;
    if (!path) return 'assets/media/avatars/blank.png';
    const clean = path.startsWith('/') ? path.slice(1) : path;
    return `${environment.apis.default.url}/${clean}`;
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = 'assets/media/avatars/blank.png';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
