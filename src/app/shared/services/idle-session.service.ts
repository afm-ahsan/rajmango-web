import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class IdleSessionService implements OnDestroy {
  private static readonly IDLE_TIMEOUT_MS    = 60 * 60 * 1000; // 60 minutes
  private static readonly WARNING_DURATION_MS = 3 * 60 * 1000; // 3 minutes
  private static readonly ACTIVITY_EVENTS = ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'];
  private static readonly BROADCAST_CHANNEL = 'rajmango_session';

  private subs = new SubSink();
  private idleSubscription: Subscription | null = null;
  private warningVisible = false;
  private channel: BroadcastChannel | null = null;

  // Exposed so GlobalHttpInterceptor can read it without injecting AuthService (avoids circular DI).
  isHandlingExpiry = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
  ) {
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
   *
   * Ordering is deliberate:
   *  1. Auth state is cleared immediately (tokens, permissions, currentUser$) so
   *     no further authenticated requests can go out.
   *  2. Swal is shown, and router.navigate is deferred to the .then() callback so
   *     that routing only starts AFTER Swal has fully closed and removed its backdrop.
   *     Keeping routing and Swal open concurrently causes two compounding bugs:
   *       a) body overflow/backdrop gets stuck → all clicks intercepted
   *       b) this method may be invoked from outside Angular's zone (RxJS timer or
   *          BroadcastChannel), so everything runs inside ngZone.run().
   */
  handleSessionExpired(message: string = 'Your session has expired due to inactivity. Please login again.'): void {
    if (this.isHandlingExpiry) return;
    this.isHandlingExpiry = true;

    this.stopWatcher();
    this.broadcastExpiry();

    // Close any still-animating warning Swal before showing the expiry dialog.
    Swal.close();

    // All work runs inside ngZone.run() because this method can be reached from
    // a RxJS timer or BroadcastChannel callback that runs outside Angular's zone.
    this.ngZone.run(() => {
      // Clear auth state immediately (security) but skip router navigation for now.
      // Navigation happens in .then() after Swal is fully closed.
      this.authService.logout(false);

      Swal.fire({
        title: 'Session Expired',
        text: message,
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        // Swal is now fully closed: its backdrop and body classes have been removed.
        // Defensively scrub any residual Swal body state before routing — prevents
        // stuck overflow or backdrop from carrying over into the next session.
        document.body.classList.remove('swal2-shown', 'swal2-height-auto');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');

        this.router.navigate(['/auth/login']);
      });
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

    const totalSeconds = Math.floor(IdleSessionService.WARNING_DURATION_MS / 1000);
    let remaining = totalSeconds;
    let countdownInterval: number | null = null;

    const formatTime = (secs: number): string => {
      const m = Math.floor(secs / 60).toString().padStart(2, '0');
      const s = (secs % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };

    Swal.fire({
      title: 'Session Expiring Soon',
      html: `
        <p style="margin-bottom:12px;">Your session will expire due to inactivity.</p>
        <p style="margin-bottom:4px;font-size:0.9rem;color:#7e8299;">Time Remaining</p>
        <div id="swal-countdown"
             style="font-size:2rem;font-weight:700;letter-spacing:0.05em;color:#f1416c;">
          ${formatTime(totalSeconds)}
        </div>
      `,
      icon: 'warning',
      confirmButtonText: 'Okay, Stay',
      timer: IdleSessionService.WARNING_DURATION_MS,
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        countdownInterval = window.setInterval(() => {
          remaining = Math.max(0, remaining - 1);
          const el = document.getElementById('swal-countdown');
          if (el) el.textContent = formatTime(remaining);
          if (remaining === 0 && countdownInterval !== null) {
            clearInterval(countdownInterval);
            countdownInterval = null;
          }
        }, 1000);
      },
      willClose: () => {
        if (countdownInterval !== null) {
          clearInterval(countdownInterval);
          countdownInterval = null;
        }
      },
    }).then(result => {
      this.warningVisible = false;

      if (result.isConfirmed) {
        // User clicked "Okay, Stay" — restart idle watcher from zero
        if (!this.isHandlingExpiry) {
          this.startWatcher();
        }
      } else if (result.dismiss === Swal.DismissReason.timer) {
        // Warning countdown expired with no response — expire the session
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
        // Another tab triggered logout — silently follow without showing a Swal.
        // BroadcastChannel callbacks run outside Angular's zone, so wrap with ngZone.run
        // to ensure router.navigate() inside logout() is change-detection safe.
        if (event.data === 'session_expired' && !this.isHandlingExpiry) {
          this.isHandlingExpiry = true;
          this.stopWatcher();
          this.ngZone.run(() => this.authService.logout());
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
