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
            this.turnstileEnabled = cfg?.enabled ?? false;
            this.turnstileSiteKey = cfg?.enabled ? (cfg?.siteKey ?? '') : '';
            if (this.turnstileEnabled && !this.turnstileSiteKey) {
              console.warn('[AppConfig] Turnstile is enabled but siteKey is empty.');
            }
            resolve();
          },
          error: (err) => {
            console.error('[AppConfig] Failed to load config from', `${environment.apis.default.url}/api/auth/config`, err);
            this.configLoadFailed = true;
            resolve();
          },
        });
    });
  }
}
