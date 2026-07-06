import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface BkashPaymentResultDto {
  orderNumber: string | null;
  amount: number;
  transactionId: string | null;
  paymentDate: string | null;
  paymentStatus: number;
  failureReason: string | null;
}

/**
 * Backs the public /orders/bkash-success|failed|cancelled result pages. These pages must render
 * even if the customer's session lapsed while they were on bKash's hosted checkout page, so this
 * calls a public (unauthenticated) endpoint keyed only by bKash's own paymentID.
 */
@Injectable({ providedIn: 'root' })
export class BkashResultService {
  private readonly apiUrl = `${environment.apis.default.url}/api`;

  constructor(private http: HttpClient) {}

  getResult(paymentId: string): Observable<{ succeeded: boolean; messages?: string[]; data?: BkashPaymentResultDto | null }> {
    const params = new HttpParams().set('paymentId', paymentId);
    return this.http.get<{ succeeded: boolean; messages?: string[]; data?: BkashPaymentResultDto | null }>(
      `${this.apiUrl}/payments/bkash/result`, { params }
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
