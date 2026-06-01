import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly apiUrl = `${environment.apis.default.url}/api/notifications`;

  private _unreadCount$ = new BehaviorSubject<number>(0);
  readonly unreadCount$ = this._unreadCount$.asObservable();

  constructor(private http: HttpClient) {}

  getLatest(): Observable<any> {
    return this.http.get(`${this.apiUrl}/latest`);
  }

  getPaged(pageNumber: number, pageSize: number, isRead?: boolean): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);
    if (isRead !== undefined) {
      params = params.set('isRead', isRead);
    }
    return this.http.get(`${this.apiUrl}/paged`, { params });
  }

  getUnreadCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/unread-count`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/mark-as-read`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-all-as-read`, {});
  }

  refreshUnreadCount(): void {
    this.getUnreadCount().subscribe({
      next: (res: any) => this._unreadCount$.next(res?.data ?? 0),
      error: () => this._unreadCount$.next(0),
    });
  }
}
