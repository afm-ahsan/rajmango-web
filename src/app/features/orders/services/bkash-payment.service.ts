import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from 'src/app/services/client-proxy';

export interface BkashCreateResult {
  isSuccess: boolean;
  message: string;
  data?: { bkashUrl: string };
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
