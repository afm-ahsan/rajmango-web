import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorLoggerService } from 'src/app/shared/services/error-logger.service';
import { ErrorMessageService } from 'src/app/shared/services/error-message.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalHttpInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private errorLogger: ErrorLoggerService,
    private errorMessageService: ErrorMessageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorLogger.logHttpError(error); // ✅ log here
        this.errorMessageService.handleHttpError(error);

        if (error.status === 401 || error.status === 408) {
          this.router.navigateByUrl('/auth/login');
        }

        return throwError(() => error);
      })
    );
  }
}
