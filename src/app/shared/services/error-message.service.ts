import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageService {
  constructor() {}

  public handleHttpError(error: HttpErrorResponse): void {
    if (error.error instanceof ErrorEvent) {
      // Network-level client error (e.g. CORS, DNS failure before a response arrives)
      Swal.fire('Connection Error', 'Unable to connect to the server. Please check your internet connection and try again.', 'warning');
      return;
    }

    switch (error.status) {
      case 0:
        Swal.fire('Connection Error', 'Unable to connect to the server. Please check your internet connection and try again.', 'warning');
        break;
      case 400:
        Swal.fire('Invalid Request', 'Some information looks incorrect. Please review and try again.', 'warning');
        break;
      case 401:
        Swal.fire('Session Expired', 'Your session has expired. Please sign in again.', 'warning');
        break;
      case 403:
        Swal.fire('Access Denied', 'You do not have permission to perform this action. Please contact support if this seems incorrect.', 'warning');
        break;
      case 404:
        Swal.fire('Not Found', 'The requested information could not be found.', 'warning');
        break;
      case 408:
        Swal.fire('Request Timeout', 'The request took too long. Please try again.', 'warning');
        break;
      case 409:
        Swal.fire('Conflict', 'This record may already exist or was changed recently. Please refresh and try again.', 'warning');
        break;
      case 500:
        Swal.fire('Server Error', 'Something went wrong on our side. Please try again shortly.', 'error');
        break;
      default:
        Swal.fire('Unexpected Error', 'Something went wrong. Please try again.', 'error');
        break;
    }
  }
}
