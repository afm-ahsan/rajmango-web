import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class IdleSessionService implements OnDestroy {
  private static readonly IDLE_TIMEOUT_MS = 180 * 60 * 1000;   // 180 minutes
  private static readonly WARNING_DURATION_MS = 3 * 60 * 1000; // 3 minutes
  private static readonly ACTIVITY_EVENTS = ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'];
  private static readonly BROADCAST_CHANNEL = 'rajmango_session';

  private subs = new SubSink();
  private idleSubscription: Subscription | null = null;
  private warningVisible = false;
  private channel: BroadcastChannel | null = null;

  // Exposed so GlobalHttpInterceptor can read it without injecting AuthService (avoids circular DI).
  isHandlingExpiry = false;

  constructor(private authService: AuthService, private router: Router) {
    this.initBroadcastChannel();
    this.subs.sink = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isHandlingExpiry = false;
        this.startWatcher();
      } else {
        this.stopWatcher();
      }
    });
  }

  /**
   * Call this to trigger a single, clean session-expired logout.
   * Safe to call from the HTTP interceptor or internal idle logic.
   */
  handleSessionExpired(message: string = 'Your session has expired due to inactivity. Please login again.'): void {
    if (this.isHandlingExpiry) return;
    this.isHandlingExpiry = true;
    this.stopWatcher();
    this.broadcastExpiry();
    this.authService.logout();
    Swal.close();
    Swal.fire({
      title: 'Session Expired',
      text: message,
      icon: 'warning',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
    });
  }

  private startWatcher(): void {
    this.stopWatcher();
    this.warningVisible = false;

    const activity$ = merge(
      ...IdleSessionService.ACTIVITY_EVENTS.map(e => fromEvent(document, e))
    );

    this.idleSubscription = (activity$ as any).pipe(
      startWith(null),
      switchMap(() => timer(IdleSessionService.IDLE_TIMEOUT_MS))
    ).subscribe(() => {
      if (!this.warningVisible && !this.isHandlingExpiry) {
        this.showWarning();
      }
    });
  }

  private stopWatcher(): void {
    this.idleSubscription?.unsubscribe();
    this.idleSubscription = null;
  }

  private showWarning(): void {
    this.warningVisible = true;
    this.stopWatcher(); // Stop activity listener while warning is shown

    Swal.fire({
      title: 'Session Expiring Soon',
      text: 'Your session is going to end within 3 minutes due to inactivity.',
      icon: 'warning',
      confirmButtonText: 'Okay, Stay',
      timer: IdleSessionService.WARNING_DURATION_MS,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(result => {
      this.warningVisible = false;

      if (result.isConfirmed) {
        // User clicked "Okay, Stay" — restart idle watcher from zero
        if (!this.isHandlingExpiry) {
          this.startWatcher();
        }
      } else if (result.dismiss === Swal.DismissReason.timer) {
        // 2-minute warning countdown expired with no response
        this.handleSessionExpired('Your session has expired due to inactivity. Please login again.');
      }
    });
  }

  private broadcastExpiry(): void {
    try { this.channel?.postMessage('session_expired'); } catch { /* ignore if channel is closed */ }
  }

  private initBroadcastChannel(): void {
    if (typeof BroadcastChannel === 'undefined') return;
    try {
      this.channel = new BroadcastChannel(IdleSessionService.BROADCAST_CHANNEL);
      this.channel.onmessage = (event: MessageEvent) => {
        // Another tab triggered logout — silently follow
        if (event.data === 'session_expired' && !this.isHandlingExpiry) {
          this.isHandlingExpiry = true;
          this.stopWatcher();
          this.authService.logout();
        }
      };
    } catch { /* BroadcastChannel not supported in this environment */ }
  }

  ngOnDestroy(): void {
    this.stopWatcher();
    try { this.channel?.close(); } catch { /* ignore */ }
    this.subs.unsubscribe();
  }
}
