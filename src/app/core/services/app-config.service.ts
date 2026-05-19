import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface TurnstileConfig {
  enabled: boolean;
  siteKey: string;
}

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  turnstileEnabled = false;
  turnstileSiteKey = '';
  configLoadFailed = false;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return new Promise((resolve) => {
      this.http
        .get<TurnstileConfig>(`${environment.apis.default.url}/api/auth/config`)
        .pipe(timeout(10000))
        .subscribe({
          next: (cfg) => {
            const backendEnabled = cfg?.enabled ?? false;
            const backendSiteKey = backendEnabled ? (cfg?.siteKey ?? '') : '';

            if (backendEnabled && backendSiteKey) {
              // Backend is authoritative — use its config
              this.turnstileEnabled = true;
              this.turnstileSiteKey = backendSiteKey;
            } else if ((environment as any).turnstile?.siteKey) {
              // Backend returned disabled/empty — fall back to environment file siteKey
              this.turnstileEnabled = true;
              this.turnstileSiteKey = (environment as any).turnstile.siteKey;
              console.info('[AppConfig] Env fallback: using environment.ts Turnstile siteKey.');
            } else {
              this.turnstileEnabled = false;
              this.turnstileSiteKey = '';
            }
            resolve();
          },
          error: (err) => {
            console.error('[AppConfig] Failed to load config from', `${environment.apis.default.url}/api/auth/config`, err);
            if ((environment as any).turnstile?.siteKey) {
              // Backend unreachable — still show Turnstile using environment file key
              this.turnstileEnabled = true;
              this.turnstileSiteKey = (environment as any).turnstile.siteKey;
              console.info('[AppConfig] Env fallback (error path): using environment.ts Turnstile siteKey.');
            } else {
              this.configLoadFailed = true;
            }
            resolve();
          },
        });
    });
  }
}
