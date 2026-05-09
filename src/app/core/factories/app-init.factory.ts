// src/app/core/factories/app-init.factory.ts
import { Router } from '@angular/router';
import { catchError, firstValueFrom, retry, throwError, timeout } from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { AuthService } from '../../features/auth/services/auth.service';

export function appInitFactory(
  authService: AuthService,
  loaderService: LoaderService,
  router: Router
) {
  return async (): Promise<void> => {
    loaderService.show(); // ⏳ Show loader during initialization

    try {
      await firstValueFrom(
        authService.getUserByToken().pipe(
          retry(2),                         // 🔁 Retry twice
          timeout(10000),                   // ⏰ Timeout after 10s
          catchError(err => {
            console.error('Auth init failed:', err);
            return throwError(() => err);
          })
        )
      );
    } catch (error) {
      router.navigateByUrl('/auth/login');
    } finally {
      loaderService.hide();
    }
  };
}
