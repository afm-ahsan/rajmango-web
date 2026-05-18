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
import { environment } from 'src/environments/environment';
import { ErrorLoggerService } from 'src/app/shared/services/error-logger.service';
import { ErrorMessageService } from 'src/app/shared/services/error-message.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalHttpInterceptor implements HttpInterceptor {
  private readonly tokenKey = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(
    private router: Router,
    private errorLogger: ErrorLoggerService,
    private errorMessageService: ErrorMessageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authReq = this.addAuthHeader(req);
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorLogger.logHttpError(error);
        this.errorMessageService.handleHttpError(error);

        const onAuthPage = this.router.url.startsWith('/auth');
        const onErrorPage = this.router.url.startsWith('/error');
        if ((error.status === 401 || error.status === 408) && !onAuthPage && !onErrorPage) {
          this.router.navigateByUrl('/auth/login');
        }

        return throwError(() => error);
      })
    );
  }

  private addAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
    try {
      const raw = localStorage.getItem(this.tokenKey);
      if (!raw) return req;
      const auth = JSON.parse(raw);
      const token: string | undefined = auth?.authToken;
      if (!token) return req;
      return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    } catch {
      return req;
    }
  }
}
