import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LogLevel } from '../enums/log-level.enum';
import { ErrorLoggerService } from './error-logger.service';

// Minimum ms between auto-reloads to prevent infinite reload loops
const CHUNK_RELOAD_TS_KEY = 'chunk_reload_ts';
const CHUNK_RELOAD_MIN_INTERVAL_MS = 10_000;

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private errorLogger: ErrorLoggerService
  ) {}

  handleError(error: Error | HttpErrorResponse): void {
    this.errorLogger.log(error, LogLevel.Error);

    if (error instanceof HttpErrorResponse) {
      return; // Already handled by GlobalHttpInterceptor
    }

    if (this.isChunkLoadError(error)) {
      this.handleChunkLoadError();
      return;
    }

    this.ngZone.run(() => {
      Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: error?.message || 'Something went wrong.',
        confirmButtonText: 'OK'
      });
    });

    this.router.navigateByUrl('/error/500');
  }

  private isChunkLoadError(error: any): boolean {
    return (
      error?.name === 'ChunkLoadError' ||
      (typeof error?.message === 'string' && error.message.includes('Loading chunk'))
    );
  }

  private handleChunkLoadError(): void {
    const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_TS_KEY) || '0');
    const canAutoReload = Date.now() - lastReload > CHUNK_RELOAD_MIN_INTERVAL_MS;

    this.ngZone.run(() => {
      if (canAutoReload) {
        sessionStorage.setItem(CHUNK_RELOAD_TS_KEY, String(Date.now()));
        Swal.fire({
          icon: 'info',
          title: 'New Version Available',
          text: 'A new version of the app is available. Reloading...',
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
        }).then(() => window.location.reload());
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'New Version Available',
          text: 'A new version is available. Please reload the page to continue.',
          confirmButtonText: 'Reload Now',
          allowOutsideClick: false,
        }).then(() => window.location.reload());
      }
    });
  }
}
