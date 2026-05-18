import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface TurnstileConfig {
  enabled: boolean;
  siteKey: string;
}

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  turnstileEnabled = false;
  turnstileSiteKey = '';

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return new Promise((resolve) => {
      this.http
        .get<TurnstileConfig>(`${environment.apis.default.url}/api/auth/config`)
        .subscribe({
          next: (cfg) => {
            this.turnstileEnabled = cfg?.enabled ?? false;
            this.turnstileSiteKey = cfg?.siteKey ?? '';
            resolve();
          },
          error: () => resolve(),
        });
    });
  }
}
