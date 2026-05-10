import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SubmitComplaintRequest, UpdateComplaintStatusRequest } from './models/complaint.model';

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private readonly apiUrl = `${environment.apis.default.url}/api/complaint`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getMine(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mine`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  submit(payload: SubmitComplaintRequest): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  updateStatus(id: number, payload: UpdateComplaintStatusRequest): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, payload);
  }
}
