import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { extractApiErrorMessage } from '../utils/api-error.utils';

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageService {
  public handleHttpError(error: HttpErrorResponse): void {
    if (error.error instanceof ErrorEvent || error.status === 0) {
      Swal.fire(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection and try again.',
        'warning'
      );
      return;
    }

    switch (error.status) {
      case 400:
      case 422:
        // Business/validation errors — let the component show the actual message inline or in its own Swal.
        break;

      case 401:
        Swal.fire('Session Expired', 'Your session has expired. Please sign in again.', 'warning');
        break;

      case 403:
        Swal.fire(
          'Access Denied',
          'You do not have permission to perform this action. Please contact support if this seems incorrect.',
          'warning'
        );
        break;

      case 404: {
        const msg = extractApiErrorMessage(error, 'The requested information could not be found.');
        Swal.fire('Not Found', msg, 'warning');
        break;
      }

      case 408:
        Swal.fire('Request Timeout', 'The request took too long. Please try again.', 'warning');
        break;

      case 409: {
        const msg = extractApiErrorMessage(
          error,
          'This record may already exist or was changed recently. Please refresh and try again.'
        );
        Swal.fire('Conflict', msg, 'warning');
        break;
      }

      case 500: {
        const msg = extractApiErrorMessage(
          error,
          'Something went wrong on our side. Please try again shortly.'
        );
        Swal.fire('Server Error', msg, 'error');
        break;
      }

      default: {
        const msg = extractApiErrorMessage(error, 'Something went wrong. Please try again.');
        Swal.fire('Unexpected Error', msg, 'error');
        break;
      }
    }
  }
}
