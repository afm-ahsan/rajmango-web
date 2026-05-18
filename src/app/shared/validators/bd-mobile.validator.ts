import { AbstractControl, ValidatorFn } from '@angular/forms';

const BD_MOBILE_REGEX = /^(?:\+880\s?1[3-9]\d{8}|01[3-9]\d{8})$/;

export function bdMobileValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const raw: string = control.value ?? '';
    const trimmed = raw.trim();
    if (!trimmed) return null;
    return BD_MOBILE_REGEX.test(trimmed) ? null : { bdMobile: true };
  };
}
