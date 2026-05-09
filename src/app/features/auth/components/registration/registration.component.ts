import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { RegisterModel } from '../../models/register.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm!: FormGroup;
  isLoading$: Observable<boolean>;
  hasError = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;

    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.registrationForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
        phoneNumber: ['', [Validators.required, Validators.maxLength(20)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
        cPassword: ['', [Validators.required]],
        agree: [false, Validators.requiredTrue],
      },
      {
        validators: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  submit(): void {
  if (this.registrationForm.invalid) return;

  this.hasError = false;

  const formValue = this.registrationForm.value;

  const newUser: RegisterModel = {
    firstName: formValue.firstName,
    lastName: formValue.lastName,
    email: formValue.email,
    phoneNumber: formValue.phoneNumber,
    password: formValue.password,
  };

  this.authService
    .registration(newUser)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate(['/']);
        } else {
          this.hasError = true;
        }
      },
      error: () => {
        this.hasError = true;
      },
    });
}


  // Form accessors
  get firstName() {
    return this.registrationForm.get('firstName');
  }

  get lastName() {
    return this.registrationForm.get('lastName');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get phoneNumber() {
    return this.registrationForm.get('phoneNumber');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get cPassword() {
    return this.registrationForm.get('cPassword');
  }

  get agree() {
    return this.registrationForm.get('agree');
  }

  readonly firstNameErrors = [
    { key: 'required', msg: 'First name is required' },
    { key: 'minlength', msg: 'First name must be at least 2 characters' },
    { key: 'maxlength', msg: 'First name must be at most 50 characters' },
  ];

  readonly lastNameErrors = [
    { key: 'required', msg: 'Last name is required' },
    { key: 'minlength', msg: 'Last name must be at least 2 characters' },
    { key: 'maxlength', msg: 'Last name must be at most 50 characters' },
  ];

  readonly emailErrors = [
    { key: 'required', msg: 'Email is required' },
    { key: 'email', msg: 'Email is invalid' },
    { key: 'maxlength', msg: 'Email must be at most 255 characters' },
  ];

  readonly phoneNumberErrors = [
    { key: 'required', msg: 'Phone number is required' },
    { key: 'maxlength', msg: 'Phone number must be at most 20 characters' },
  ];

  readonly passwordErrors = [
    { key: 'required', msg: 'Password is required' },
    { key: 'minlength', msg: 'Password must be at least 6 characters' },
    { key: 'maxlength', msg: 'Password must be at most 20 characters' },
    { key: 'weakPassword', msg: 'Password must include upper/lowercase, number, and special character' },
  ];

  readonly confirmPasswordErrors = [
    { key: 'required', msg: 'Confirm Password is required' },
  ];
}
