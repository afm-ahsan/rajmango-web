import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ConfirmPasswordValidator {
  /**
   * Validator to check if password and confirm password match.
   * Returns `{ mismatch: true }` if they don't match.
   */
  static MatchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('cPassword')?.value;

    if (password !== confirmPassword) {
      control.get('cPassword')?.setErrors({ ...control.get('cPassword')?.errors, mismatch: true });
      return { mismatch: true };
    }

    // Clear previous error if now matched
    if (control.get('cPassword')?.hasError('mismatch')) {
      const errors = { ...control.get('cPassword')?.errors };
      delete errors['mismatch'];
      const updatedErrors = Object.keys(errors).length ? errors : null;
      control.get('cPassword')?.setErrors(updatedErrors);
    }

    return null;
  }
}
