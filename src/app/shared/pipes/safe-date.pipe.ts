import { Pipe, PipeTransform } from '@angular/core';

/**
 * Safely converts any date representation to a JS Date for use with Angular's date pipe.
 *
 * Handles:
 *   - NgbDate / moment / any object with a .toDate() method
 *   - JavaScript Date instances
 *   - ISO strings and YYYY-MM-DD strings
 *   - Plain { year, month, day } objects (month is 1-based)
 *   - null / undefined  → returns null (date pipe renders as empty string)
 *
 * Usage:  {{ value | safeDate | date:'dd MMM yyyy' }}
 */
@Pipe({ name: 'safeDate' })
export class SafeDatePipe implements PipeTransform {
  transform(value: any): Date | null {
    if (value == null) return null;

    // NgbDate, moment, or any object that already exposes .toDate()
    if (typeof value.toDate === 'function') {
      const d = value.toDate() as Date;
      return isNaN(d.getTime()) ? null : d;
    }

    // Already a native Date
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    // ISO 8601 string, YYYY-MM-DD, or any parseable date string
    if (typeof value === 'string') {
      if (!value.trim()) return null;
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }

    // Plain { year, month, day } shape (month 1-based, as NgbDate uses)
    if (
      typeof value === 'object' &&
      value.year != null &&
      value.month != null &&
      value.day != null
    ) {
      return new Date(value.year, value.month - 1, value.day);
    }

    return null;
  }
}
