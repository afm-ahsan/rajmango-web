import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthFacade } from '../../auth.facade';
import { TurnstileComponent } from '../turnstile/turnstile.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('turnstile') turnstileRef?: TurnstileComponent;

  loginForm!: FormGroup;
  hasError = false;
  isSubmitting = false;
  returnUrl = '/home';

  turnstileToken: string | null = null;
  turnstileLoadFailed = false;
  readonly turnstileSiteKey = environment.turnstile.siteKey;

  private readonly _destroy$ = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _authFacade: AuthFacade,
    private _route: ActivatedRoute,
    private _router: Router,
    private _cdRef: ChangeDetectorRef,
  ) {
    if (this._authFacade.currentUserValue) {
      this._router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this._initForm();
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/home';
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onTurnstileResolved(token: string): void {
    this.turnstileToken = token;
    this._cdRef.detectChanges();
  }

  onTurnstileError(): void {
    this.turnstileToken = null;
    this._cdRef.detectChanges();
  }

  onTurnstileLoadFailed(): void {
    this.turnstileLoadFailed = true;
    this._cdRef.detectChanges();
  }

  private _initForm(): void {
    this.loginForm = this._fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(255),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  get email()    { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  submit(): void {
    if (this.loginForm.invalid || this.isSubmitting || !this.turnstileToken) return;

    this.hasError = false;
    this.isSubmitting = true;

    this._authFacade
      .login(this.email?.value, this.password?.value, this.turnstileToken)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (user) => {
          if (user) {
            this._router.navigate([this.returnUrl]);
          } else {
            this.hasError = true;
            this.isSubmitting = false;
            this.turnstileToken = null;
            this.turnstileRef?.reset();
          }
        },
        error: () => {
          this.hasError = true;
          this.isSubmitting = false;
          this.turnstileToken = null;
          this.turnstileRef?.reset();
        },
      });
  }

  readonly emailErrors    = LoginComponentValidation.email;
  readonly passwordErrors = LoginComponentValidation.password;
}

export const LoginComponentValidation = {
  email: [
    { key: 'required', msg: 'Email is required' },
    { key: 'email',    msg: 'Email is invalid' },
    { key: 'minlength', msg: 'Email should have at least 3 symbols' },
    { key: 'maxlength', msg: 'Email should have maximum 360 symbols' },
  ],
  password: [
    { key: 'required',  msg: 'Password is required' },
    { key: 'minlength', msg: 'Password should have at least 3 symbols' },
    { key: 'maxlength', msg: 'Password should have maximum 100 symbols' },
  ],
};
