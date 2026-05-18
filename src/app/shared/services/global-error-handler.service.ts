import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LogLevel } from '../enums/log-level.enum';
import { ErrorLoggerService } from './error-logger.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(
    private router: Router,
    private ngZone: NgZone, // Ensures navigation or UI updates work properly
    private errorLogger: ErrorLoggerService
  ) {}

  handleError(error: Error | HttpErrorResponse): void {
    // Log the error to console or external logging server
    this.errorLogger.log(error, LogLevel.Error); // ✅ shared logger

    // Avoid displaying multiple alerts if already handled by interceptors
    if (error instanceof HttpErrorResponse) {
      return; // Already handled by GlobalHttpInterceptor
    }

    // Handle client-side or unexpected global errors
    this.ngZone.run(() => {
      Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: error?.message || 'Something went wrong.',
        confirmButtonText: 'OK'
      });
    });

    // Redirect to 500 page on fatal unhandled app errors
    this.router.navigateByUrl('/error/500');
  }
}
