import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpsertPolicyRequest } from './models/policy.model';

@Injectable({ providedIn: 'root' })
export class PolicyService {
  private readonly apiUrl = `${environment.apis.default.url}/api/policy`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getByType(policyType: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${policyType}`);
  }

  upsert(payload: UpsertPolicyRequest): Observable<any> {
    return this.http.put(this.apiUrl, payload);
  }
}
