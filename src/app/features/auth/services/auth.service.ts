import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { AppUserModel } from '../models/app-user.model';
import { RegisterModel } from '../models/register.model';
import { AuthHttpService } from './auth-http/auth-http.service';
import { UserPermissionService } from './user-permission.service';

export type UserType = AppUserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private subs = new SubSink();
  private readonly tokenKey = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  private readonly userIdKey = `${environment.appVersion}-${environment.USERID_KEY}`;

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<UserType>(undefined);

  isLoading$ = this.isLoadingSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private router: Router,
    private authHttpService: AuthHttpService,
    private permissionService: UserPermissionService
  ) {
    this.subs.sink = this.getUserByToken().subscribe({
      error: (err) => console.error('Failed to restore session on init:', err)
    });
  }

  login(email: string, password: string, turnstileToken?: string): Observable<UserType> {
    if (!email || !password) return of(undefined);

    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password, turnstileToken).pipe(
      map((auth: any) => this.setAuthToLocalStorage(auth.data)),
      switchMap(() => this.getUserByToken()),
      catchError(err => {
        console.error('Login error:', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    this.permissionService.clearPermissions();
    this.currentUserSubject.next(undefined);
    this.router.navigate(['/auth/login']);
  }

  registration(user: RegisterModel): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.registerUser(user).pipe(
      map(() => true),
      catchError(err => {
        console.error('Registration error:', err);
        return of(false);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth?.authToken) return of(undefined);

    this.isLoadingSubject.next(true);

    return this.authHttpService.getUserByToken(auth.authToken).pipe(
      map((response: any) => {
        if (response?.messages?.[0]?.includes('Valid Token')) {
          // Permissions are sourced from the login response stored in localStorage.
          // They reflect the role assignment at login time.
          this.permissionService.currentPermission = this.permissionService.preparePermissionModel(auth.permissions);
          this.currentUserSubject.next(auth);
        } else {
          this.logout();
        }
        return auth;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  /**
   * Patches specific fields on the stored auth object, persists the change to
   * localStorage, and emits the updated user via currentUser$.
   * Use this wherever profile data changes (e.g. after photo upload/remove).
   */
  patchStoredUser(patch: Partial<AppUserModel>): void {
    const auth = this.getAuthFromLocalStorage();
    if (!auth) return;
    const updated = { ...auth, ...patch };
    this.setAuthToLocalStorage(updated);
    this.currentUserSubject.next(updated);
  }

  getLoggedUserId(): number {
    const userId = localStorage.getItem(this.userIdKey);
    const parsedId = userId ? parseInt(userId, 10) : 0;
    if (!parsedId) this.logout();
    return parsedId;
  }

  private setAuthToLocalStorage(auth: any): boolean {
    if (auth?.authToken) {
      localStorage.setItem(this.tokenKey, JSON.stringify(auth));
      localStorage.setItem(this.userIdKey, auth.userId);
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): any | undefined {
    try {
      const token = localStorage.getItem(this.tokenKey);
      return token ? JSON.parse(token) : undefined;
    } catch (error) {
      console.error('Auth retrieval error:', error);
      return undefined;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
