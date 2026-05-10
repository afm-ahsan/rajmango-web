import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SubmitFeedbackRequest } from './models/feedback.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly apiUrl = `${environment.apis.default.url}/api/feedback`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getByOrder(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/order/${orderId}`);
  }

  submit(payload: SubmitFeedbackRequest): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
