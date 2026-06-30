import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from 'src/app/services/client-proxy';

// Mirrors the backend's Result<T> envelope (RajMango.Shared.Result<T>) — field names must match
// exactly: `succeeded` (not isSuccess), `messages` (a string array, not a single `message`).
export interface BkashCreateResult {
  succeeded: boolean;
  messages?: string[];
  data?: { bkashUrl: string; gatewayPaymentId?: string; merchantInvoiceNumber?: string } | null;
}

@Injectable()
export class BkashPaymentService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    this.baseUrl = baseUrl ?? '';
  }

  initiate(orderId: number): Observable<BkashCreateResult> {
    return this.http.post<BkashCreateResult>(
      `${this.baseUrl}/api/payments/bkash/create`,
      { orderId }
    );
  }
}
