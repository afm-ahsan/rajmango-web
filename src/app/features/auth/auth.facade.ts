import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, UserType } from './services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  constructor(private authService: AuthService) {}

  get isLoading$(): Observable<boolean> {
    return this.authService.isLoading$;
  }

  get currentUserValue() {
    return this.authService.currentUserValue;
  }

  login(email: string, password: string, turnstileToken?: string): Observable<{ user: UserType; messages: string[] }> {
    return this.authService.login(email, password, turnstileToken);
  }
}
