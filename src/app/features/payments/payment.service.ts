import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { environment } from 'src/environments/environment';
import { OrderPaymentLookupDto } from './models/order-payment-lookup.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly apiUrl = `${environment.apis.default.url}/api`;

  constructor(private http: HttpClient) {}

  getAll(dto: PagedAndSortedDto): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', dto.pageNumber)
      .set('pageSize', dto.pageSize)
      .set('filter', dto.filter ?? '');
    return this.http.get(`${this.apiUrl}/payment/paged`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Fetch a single payment by ID, bypassing the generated proxy so that
   * fields added after the proxy was generated (orderNumber, customerName)
   * are included in the raw JSON response.
   */
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/payment/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Typeahead order search for the Record Payment modal.
   * Searches by partial Order Number; returns up to 10 results including
   * current financials so the modal can auto-populate without a second request.
   * Minimum 3 characters; returns an empty list for shorter terms.
   */
  orderPaymentLookup(search: string): Observable<{ data: OrderPaymentLookupDto[] }> {
    const params = new HttpParams().set('search', search);
    return this.http.get<{ data: OrderPaymentLookupDto[] }>(
      `${this.apiUrl}/admin/orders/payment-lookup`, { params }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Full refund of a completed bKash payment. paymentId is the internal Payment.Id
   * (not the bKash gateway paymentID) — the backend resolves gateway identifiers and
   * refunds the full paid amount; partial refunds are not supported yet.
   */
  refund(paymentId: number, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments/${paymentId}/refund`, { reason }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
