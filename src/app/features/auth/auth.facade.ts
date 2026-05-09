import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  constructor(private authService: AuthService) {}

  get isLoading$(): Observable<boolean> {
    return this.authService.isLoading$;
  }

  get currentUserValue() {
    return this.authService.currentUserValue;
  }

  login(email: string, password: string) {
    return this.authService.login(email, password);
  }
}
