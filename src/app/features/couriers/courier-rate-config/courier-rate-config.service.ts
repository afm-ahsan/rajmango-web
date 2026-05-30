import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CreateCourierRateConfigDto } from './models/create-courier-rate-config-dto';

export interface CourierRateConfigPagedDto {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  filter: string;
  locationType?: number | null;
  courierProviderId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class CourierRateConfigService {
  private readonly apiUrl = `${environment.apis.default.url}/api`;
  private readonly endpoint = 'courier-rate-config';

  constructor(private http: HttpClient) {}

  getAll(dto: CourierRateConfigPagedDto): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', dto.pageNumber)
      .set('pageSize', dto.pageSize)
      .set('sortBy', dto.sortBy)
      .set('sortOrder', dto.sortOrder)
      .set('filter', dto.filter);
    if (dto.locationType != null) params = params.set('locationType', dto.locationType);
    if (dto.courierProviderId != null) params = params.set('courierProviderId', dto.courierProviderId);
    return this.http.get(`${this.apiUrl}/${this.endpoint}/paged`, { params }).pipe(catchError(this.handleError));
  }

  getCount(filter: string, locationType?: number | null, courierProviderId?: number | null): Observable<any> {
    let params = new HttpParams().set('filter', filter);
    if (locationType != null) params = params.set('locationType', locationType);
    if (courierProviderId != null) params = params.set('courierProviderId', courierProviderId);
    return this.http.get(`${this.apiUrl}/${this.endpoint}/count`, { params }).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.endpoint}/${id}`).pipe(catchError(this.handleError));
  }

  create(dto: CreateCourierRateConfigDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.endpoint}`, dto).pipe(catchError(this.handleError));
  }

  update(id: number, dto: CreateCourierRateConfigDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${this.endpoint}/${id}`, dto).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${this.endpoint}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Something went wrong; please try again later.');
  }
}
