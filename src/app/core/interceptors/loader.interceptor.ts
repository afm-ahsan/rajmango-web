import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private activeRequests = 0;
  private readonly debounceDelay = 200; // ms
  private showLoader = false;

  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Bypass loader if custom header is present
    const skipLoader = req.headers.get('X-Skip-Loader') === 'true';

    if (skipLoader) {
      return next.handle(req);
    }

    this.activeRequests++;
    if (this.activeRequests === 1) {
      // Delay showing loader to prevent flicker
      this.showLoader = true;
      timer(this.debounceDelay).subscribe(() => {
        if (this.showLoader && this.activeRequests > 0) {
          this.loaderService.show();
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.showLoader = false;
          this.loaderService.hide();
        }
      })
    );
  }
}
