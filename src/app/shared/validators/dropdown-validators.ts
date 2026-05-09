import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Validates that the value is not 0, null or undefined.
 * Useful for required dropdowns with 0 as "Select an option".
 */
export function dropdownRequiredValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const invalid = control.value === 0 || control.value === '0' || control.value == null;
    return invalid ? { dropdownRequired: true } : null;
  };
}
