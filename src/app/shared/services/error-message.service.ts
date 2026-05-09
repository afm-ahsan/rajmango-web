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
      this.showClientError(error.error.message);
    } else {
      switch (error.status) {
        case 401:
          this.showUnauthorized();
          break;
        case 403:
          this.showForbidden();
          break;
        case 408:
          this.showTimeout();
          break;
        default:
          this.showUnknownError(error.message);
          break;
      }
    }
  }

  private showClientError(message: string): void {
    Swal.fire('Client Error', message, 'warning');
  }

  private showUnauthorized(): void {
    Swal.fire('Unauthorized', 'Your session has expired. Please log in again.', 'warning');
  }

  private showForbidden(): void {
    Swal.fire('Forbidden', 'You are not authorized to perform this action.', 'warning');
  }

  private showTimeout(): void {
    Swal.fire('Timeout', 'The request timed out. Please try again.', 'warning');
  }

  private showUnknownError(message: string): void {
    Swal.fire('Error', message || 'An unexpected error occurred.', 'error');
  }
}
